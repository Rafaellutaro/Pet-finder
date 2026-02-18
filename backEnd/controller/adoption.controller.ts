import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { io } from "../index.ts";
import { isUserAllowedInAdoptionProcess, maskEmail, maskPhone, parseBRDateTime } from "../helper.ts";

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
                    adopterConfirmedAt: true,
                    ownerConfirmedAt: true
                },
            })

            if (getInfo?.adopterId != userId && getInfo?.ownerId != userId) return res.status(403).json({ message: "You dont belong here" })

            const getAdopterData = await f.user.findUnique({
                where: { id: getInfo?.adopterId },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    addresses: {
                        select: { state: true, city: true }
                    }
                }
            })

            const getOwnerData = await f.user.findUnique({
                where: { id: getInfo?.ownerId },
                select: {
                    id: true,
                    name: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    addresses: {
                        select: { state: true, city: true }
                    }
                }
            })

            let maskedAdopterInfo = getAdopterData
            let maskedOwnerInfo = getOwnerData

            if (Number(userId) == Number(getInfo?.ownerId)) {
                maskedAdopterInfo = {
                    id: Number(getAdopterData?.id) || Number(),
                    name: getAdopterData?.name || "",
                    lastName: getAdopterData?.lastName || "",
                    email: maskEmail(String(getAdopterData?.email)),
                    phone: maskPhone(String(getAdopterData?.phone)),
                    addresses: getAdopterData?.addresses || []
                }
            }

            if (Number(userId) == Number(getInfo?.adopterId)) {
                maskedOwnerInfo = {
                    id: Number(getOwnerData?.id) || Number(),
                    name: getOwnerData?.name || "",
                    lastName: getOwnerData?.lastName || "",
                    email: maskEmail(String(getOwnerData?.email)),
                    phone: maskPhone(String(getOwnerData?.phone)),
                    addresses: getOwnerData?.addresses || []
                }
            }

            const getPetInfo = await f.pet.findUnique({
                where: { id: getInfo?.petId },
                select: {
                    name: true,
                    breed: true,
                    age: true,
                    imgs: {
                        select: { url: true }
                    }
                }
            })

            return { getInfo, maskedAdopterInfo, maskedOwnerInfo, getPetInfo }
        })

        return res.status(200).json({ data: final })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to get info from adoptionProcess id" })
    }
}

export const confirmAdoption = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const { id } = req.params

    try {
        const result = await prisma.$transaction(async (f) => {
            const confirmProcess = await f.adoptionProcess.findUnique({
                where: {
                    id: Number(id)
                },
                select: {
                    adopterId: true,
                    ownerId: true
                }
            })

            if (!confirmProcess) return res.status(404).json({ message: "Adoption couldn't be found" })

            let setAsConfirmed = null
            let setAdoptionStatus = null

            if (userId == confirmProcess?.adopterId) {
                setAsConfirmed = await f.adoptionProcess.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        adopterConfirmedAt: new Date()
                    }
                })
            }

            if (userId == confirmProcess?.ownerId) {
                setAsConfirmed = await f.adoptionProcess.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        ownerConfirmedAt: new Date()
                    }
                })
            }

            if (setAsConfirmed?.adopterConfirmedAt && setAsConfirmed.ownerConfirmedAt){
                setAdoptionStatus = await f.adoptionProcess.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        step: "MEETING"
                    }
                })
            }

            return {setAsConfirmed, setAdoptionStatus}
        })

        res.status(200).json({data: result})
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to confirm adoption process" })
    }
}

export const meetingProposalInitial = async(req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const { id } = req.params
    const payload = req.body

    console.log("payload", payload)

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(403).json({message: "you' not allowed here"})

        let address = Number(payload.address)
        const date = parseBRDateTime(payload.meetDate, payload.meetTime)

        if (!date) {
            return res.status(400).json({ message: "Invalid meeting date or time" })
        }

        if (!address){
            const addressResponse = await prisma.address.create({
                data: {
                    userId: Number(userId),
                    cep: payload.address.cep,
                    street: payload.address.street,
                    city: payload.address.city,
                    state: payload.address.state,
                    neighborhood: payload.address.neighborhood
                }
            })

            address = addressResponse.id
        }

        if (!address) return res.status(400).json({message: "Invalid Address"})

        const initialPropose = await prisma.meetingProposal.create({
            data: {
                adoptionProcessId: Number(id),
                createdById: Number(userId),
                addressId: address,
                meetingAt: date
            }
        })

        const getAddress = await prisma.address.findFirst({
            where:{
                id: Number(initialPropose.addressId)
            }
        })

        const result = {
            ...initialPropose,
            address: getAddress
        }

        return res.status(200).json({data: result})
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to send your initial proposal" })
    }
}

export const getAllProposesInitial = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const {id} = req.params

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(403).json({message: "you' not allowed here"})

        const getAllProposesInitial = await prisma.meetingProposal.findMany({
            where: {
                adoptionProcessId: Number(id)
            },
            include: {address: true}
        })

        return res.status(200).json({data: getAllProposesInitial})
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to get all proposes intial" })
    }
}