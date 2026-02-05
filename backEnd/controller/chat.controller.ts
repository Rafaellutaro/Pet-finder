import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { createNotification } from "../helper.ts"
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
    const { id } = req.params

    try {
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
    const { id } = req.params

    try {
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
            io.to(`user:${receiverId}`).emit("notification:new", {notification: notification});
        }

        io.to(`conversation:${conversationId}`).emit("message:new", { message: send });
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to send message" })
    }
}