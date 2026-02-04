import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";

// get all notifications unread

export const getUnread = async (req: AuthRequest, res: Response) => {
    const id = req.user.userId

    try {
        const unread = await prisma.notification.findMany({
            where: {
                userId: Number(id),
                isRead: false
            },
            orderBy:{
                createdAt: "desc"
            }
        })

        res.status(200).json({data: unread})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "unable to get unread notifications"})
    }
}

// get all notifications

export const getAllNotifications = async (req: AuthRequest, res: Response) => {
    const id = req.user.userId

    try {
        const allNotifications = await prisma.notification.findMany({
            where: {
                userId: Number(id)
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.status(200).json({data: allNotifications})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "unable to get unread notifications"})
    }
}


// set isRead as true

export const setIsRead = async (req: AuthRequest, res: Response) => {
    const id = req.params.id

    try {
        const alreadyRead = await prisma.notification.update({
            where: {
                id: Number(id)
            },
            data: {
                isRead: true
            }
        })

        res.status(200).json({data: alreadyRead})
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "unable to get unread notifications"})
    }
}