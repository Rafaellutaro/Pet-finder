import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { io } from "../index.ts";
import { maskEmail, maskPhone } from "../helper.ts";

export const getDataFromId = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const final = await prisma.$transaction(async (f) => {
            const getInfo = await f.adoptionProcess.findUnique({
                where: {
                    id: Number(id)
                },
                select: {
                    id: true,
                    adopterId: true,
                    ownerId: true,
                    petId: true,
                    step: true,
                },
            })

            if (getInfo?.adopterId != userId && getInfo?.ownerId != userId) return res.status(403).json({ message: "You dont belong here" })

            const getAdopterData = await f.user.findUnique({
                where: {id: getInfo?.adopterId},
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    addresses: {
                        select: {state: true, city: true}
                    }
                }
            })

            const getOwnerData = await f.user.findUnique({
                where: {id: getInfo?.ownerId},
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    addresses: {
                        select: {state: true, city: true}
                    }
                }
            })

            let maskedAdopterInfo = getAdopterData
            let maskedOwnerInfo = getOwnerData

            if (Number(userId) == Number(getInfo?.ownerId)){
                maskedAdopterInfo = {
                    id: Number(getAdopterData?.id) || Number(),
                    name: getAdopterData?.name || "",
                    lastName: getAdopterData?.lastName || "",
                    email: maskEmail(String(getAdopterData?.email)),
                    phone: maskPhone(String(getAdopterData?.phone)),
                    addresses: getAdopterData?.addresses || []
                }
            }

            if (Number(userId) == Number(getInfo?.adopterId)){
                maskedOwnerInfo = {
                    id: Number(getAdopterData?.id) || Number(),
                    name: getOwnerData?.name || "",
                    lastName: getOwnerData?.lastName || "",
                    email: maskEmail(String(getOwnerData?.email)),
                    phone: maskPhone(String(getOwnerData?.phone)),
                    addresses: getOwnerData?.addresses || []
                }
            }

            const getPetInfo = await f.pet.findUnique({
                where: {id: getInfo?.petId},
                select: {
                    name: true,
                    breed: true,
                    age: true,
                    imgs: {
                        select: {url: true}
                    }
                }
            })

            return {getInfo, maskedAdopterInfo, maskedOwnerInfo, getPetInfo}
        })

        return res.status(200).json({ data: final })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to get info from adoptionProcess id" })
    }
}