import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";

export const ConversationCreate = async (req: AuthRequest, res: Response) => {
    const adopterId = req.user.userId
    const {petId, ownerId} = req.body

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
            return res.status(200).json({ data: getConversation })
        }

        const createConversation = await prisma.conversation.create({
            data: {
                adopterId: Number(adopterId),
                ownerId: Number(ownerId),
                petId: Number(petId),
            }
        })

        return res.status(201).json({ data: createConversation.id })
    } catch (e) {
        console.log(e)
        return res.status(500).json({message: "unable to create conversation"})
    }
}