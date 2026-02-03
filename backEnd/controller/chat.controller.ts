import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";

export const ConversationCreate = async (req: AuthRequest, res: Response) => {
    const adopterId = req.user.userId
    const {petId} = req.body

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
                userId: true
            }
        })

        const createConversation = await prisma.conversation.create({
            data: {
                adopterId: Number(adopterId),
                ownerId: Number(getOwnerId?.userId),
                petId: Number(petId),
            }
        })

        return res.status(201).json({ data: createConversation.id })
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "unable to create conversation"})
    }
}

export const getAllDataFromRoomId = async (req: AuthRequest, res: Response) => {
    const {id} = req.params
    
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
                    select:{
                        id: true,
                        name: true,
                        lastName: true,
                        profileImg: true
                    }
                }
            }
        })

        res.status(200).json({data: roomIdData})
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "unable to find a conversation"})
    }
}