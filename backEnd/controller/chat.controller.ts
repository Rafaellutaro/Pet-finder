import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { createNotification, verifyUserInConversation } from "../helper.ts"
import { io, isUserInConversation } from "../index.ts";

export const ConversationCreate = async (req: AuthRequest, res: Response) => {
    const adopterId = req.user.userId
    const { petId } = req.body

    try {
        const getConversation = await prisma.conversation.findUnique({
            where: {
                petId_adopterId: {
                    petId: Number(petId),
                    adopterId: Number(adopterId)
                }
            },
            select: {
                id: true
            }
        })

        if (getConversation) {
            return res.status(200).json({ data: getConversation.id })
        }

        const getOwnerId = await prisma.pet.findFirst({
            where: {
                id: petId
            },
            select: {
                userId: true,
                name: true
            }
        })

        if (adopterId == getOwnerId?.userId) return res.status(409).json({ message: "You cant adopt your own pet" })

        const createConversation = await prisma.conversation.create({
            data: {
                adopterId: Number(adopterId),
                ownerId: Number(getOwnerId?.userId),
                petId: Number(petId),
            }
        })

        const getAdopterName = await prisma.user.findFirst({
            where: {
                id: adopterId,
            },
            select: {
                name: true,
            }
        })

        const body = `${getAdopterName?.name} quer adotar ${getOwnerId?.name}`
        const link = `/Chat/${createConversation.id}`

        const notification = await createNotification({ userId: Number(getOwnerId?.userId), type: "chat_created", title: "Novo pedido de adoção", body: body, link: link }, prisma)

        io.to(`user:${getOwnerId?.userId}`).emit("notification:new", { notification: notification })

        return res.status(201).json({ data: createConversation.id })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to create conversation" })
    }
}

export const getAllDataFromRoomId = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const usersInConversation = await verifyUserInConversation(Number(id), prisma)
        if (userId !== usersInConversation?.ownerId && userId !== usersInConversation?.adopterId) return res.status(404).json({ message: "conversation can't be found" })

        const roomIdData = await prisma.conversation.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                pet: {
                    select: {
                        id: true,
                        name: true,
                        breed: true,
                        age: true,
                        imgs: true,
                        address: {
                            select: {
                                city: true,
                                state: true
                            }
                        }
                    }
                },
                userOwner: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                        profileImg: true
                    }
                },
                userAdopter: {
                    select: {
                        profileImg: true
                    }
                }
            }
        })

        return res.status(200).json({ data: roomIdData })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to find a conversation" })
    }
}

export const getMessages = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const usersInConversation = await verifyUserInConversation(Number(id), prisma)
        if (userId !== usersInConversation?.ownerId && userId !== usersInConversation?.adopterId) return res.status(404).json({ message: "Messages can't be found" })

        const messages = await prisma.message.findMany({
            where: {
                conversationId: Number(id)
            },
            orderBy: {
                createdAt: "asc"
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return res.status(200).json({ data: messages })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to get messages" })
    }
}

export const sendMessage = async (req: AuthRequest, res: Response) => {
    const senderId = req.user.userId
    const { id } = req.params
    const message = req.body.message
    let receiverId: Number | undefined

    try {
        const usersInConversation = await verifyUserInConversation(Number(id), prisma)
        if (senderId !== usersInConversation?.ownerId && senderId !== usersInConversation?.adopterId) return res.status(404).json({ message: "conversation can't be found" })

        const verifyConversationState = await prisma.conversation.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                conversationStatus: true
            }
        })

        if (verifyConversationState?.conversationStatus == "DECLINED") return res.status(403).json({ message: "You are not allowed to send messages here" })

        const send = await prisma.message.create({
            data: {
                conversationId: Number(id),
                senderId: Number(senderId),
                content: message
            }
        })
        res.status(200).json({ data: send })

        const getSenderName = await prisma.user.findFirst({
            where: {
                id: Number(senderId)
            },
            select: {
                name: true
            }
        })

        const getReceiver = await prisma.conversation.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                ownerId: true,
                adopterId: true
            }
        })

        const ownerId = getReceiver?.ownerId
        const adopterId = getReceiver?.adopterId

        { senderId == adopterId ? receiverId = ownerId : receiverId = adopterId }

        const conversationId = Number(id);

        const link = `/Chat/${conversationId}`

        const notification = await createNotification({ userId: Number(receiverId), type: "message_created", title: `Nova mensagem de ${getSenderName?.name}`, body: send.content, link: link }, prisma)

        if (!isUserInConversation(conversationId, Number(receiverId))) {
            io.to(`user:${receiverId}`).emit("notification:new", { notification: notification });
        }

        io.to(`conversation:${conversationId}`).emit("message:new", { message: send });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to send message" })
    }
}

export const changeConversationStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params
    const status = req.body.status

    console.log("status here", status)

    /* This transaction from prisma is the best, i didn't know it existed, i could have done so many apis before this way, what a pain :( */

    try {
        const result = await prisma.$transaction(async (ts) => {
            const getPetId = await ts.conversation.findUnique({
                where: { id: Number(id) },
                select: { petId: true, conversationStatus: true, adopterId: true }
            })

            if (!getPetId) return res.status(404).json({ message: "Conversation not Found" });

            if (getPetId.conversationStatus !== "PENDING") return res.status(403).json({ message: "Conversation Status already set" })

            const updateConversation = await ts.conversation.update({
                where: { id: Number(id) },
                data: { conversationStatus: status }
            })

            let updatePet = null
            if (status == "ACCEPTED") {
                updatePet = await ts.pet.update({
                    where: { id: getPetId?.petId },
                    data: { petStatus: "PENDING" }
                })
            }

            if (status == "DECLINED") {
                io.to(`user:${getPetId?.adopterId}`).emit("conversation:status", {
                    conversationId: Number(id),
                    status: "DECLINED",
                });
            }

            return { updateConversation, updatePet };
        })

        return res.status(200).json({ data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to change conversation Status" })
    }
}

export const getAllChatsFromUser = async (req: AuthRequest, res: Response) => {
    const userId = Number(req.user.userId)

    try {
        const chats = await prisma.conversation.findMany({
            where: {
                OR: [{ ownerId: userId }, { adopterId: userId }],
            },
            include: {
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        senderId: true,
                    },
                },
                userOwner: { select: { id: true, name: true, lastName: true, profileImg: true } },
                userAdopter: { select: { id: true, name: true, lastName: true, profileImg: true } },
                pet: { select: { id: true, name: true, imgs: true } }
            },
            orderBy: { updatedAt: "desc" },
        })

        const formatted = chats.map(({ messages, ...chat }) => ({
            ...chat,
            lastMessage: messages[0] ?? null,
        }))

        return res.status(200).json({ data: formatted })
    } catch (e) {
        return res.status(500).json({ message: "unable to get chats" })
    }
}