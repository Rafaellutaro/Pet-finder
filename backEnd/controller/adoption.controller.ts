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
                    profileImg: true,
                    addresses: {
                        select: { state: true, city: true }
                    },
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
                    profileImg: true,
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
                    profileImg: getAdopterData?.profileImg || "",
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
                    profileImg: getOwnerData?.profileImg || "",
                    addresses: getOwnerData?.addresses || []
                }
            }

            const petAdoptionDate = await f.petsAdopted.findFirst({
                where: {
                    adopterId: getAdopterData?.id
                },
                select: { adoptedAt: true }
            })

            const petInfo = await f.pet.findUnique({
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

            const getPetInfo = {
                ...petInfo,
                date: petAdoptionDate?.adoptedAt
            }

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

            const isOwner = userId == confirmProcess?.ownerId;
            const isAdopter = userId == confirmProcess?.adopterId;

            if (isAdopter) {
                setAsConfirmed = await f.adoptionProcess.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        adopterConfirmedAt: new Date()
                    }
                })

                io.to(`user:${confirmProcess.ownerId}`).emit("step1:Confirmation", { confirmation: setAsConfirmed })
            }

            if (isOwner) {
                setAsConfirmed = await f.adoptionProcess.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        ownerConfirmedAt: new Date()
                    }
                })

                io.to(`user:${confirmProcess.adopterId}`).emit("step1:Confirmation", { confirmation: setAsConfirmed })
            }

            if (setAsConfirmed?.adopterConfirmedAt && setAsConfirmed.ownerConfirmedAt) {
                setAdoptionStatus = await f.adoptionProcess.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        step: "MEETING"
                    }
                })

                {
                    isAdopter ? io.to(`user:${confirmProcess.ownerId}`).emit("step1:nextStep", { nextStep: setAdoptionStatus.step }) :
                        io.to(`user:${confirmProcess.adopterId}`).emit("step1:nextStep", { nextStep: setAdoptionStatus.step })
                }
            }

            return { setAsConfirmed, setAdoptionStatus }
        })

        res.status(200).json({ data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to confirm adoption process" })
    }
}

export const meetingProposalInitial = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const adoptionProcessId = Number(req.params.id)
    const payload = req.body

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(403).json({ message: "you' not allowed here" })

        let address = Number(payload.address)
        const date = parseBRDateTime(payload.meetDate, payload.meetTime)

        if (!date) {
            return res.status(400).json({ message: "Invalid meeting date or time" })
        }

        if (!address) {
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

        if (!address) return res.status(400).json({ message: "Invalid Address" })

        const getAdoptionProcess = await prisma.adoptionProcess.findFirst({
            where: {
                id: adoptionProcessId
            },
            select: {
                meetingRound: true,
                step: true,
                ownerId: true,
                adopterId: true
            }
        })

        const isAdopter = userId == getAdoptionProcess?.adopterId;

        if (getAdoptionProcess?.step == "MEETING") {
            const initialPropose = await prisma.meetingProposal.create({
                data: {
                    adoptionProcessId: adoptionProcessId,
                    createdById: Number(userId),
                    addressId: address,
                    meetingAt: date,
                }
            })

            const getAddress = await prisma.address.findFirst({
                where: {
                    id: Number(initialPropose.addressId)
                }
            })

            const result = {
                ...initialPropose,
                address: getAddress
            }

            {
                isAdopter ? io.to(`user:${getAdoptionProcess.ownerId}`).emit("step2:newPropose", { propose: result }) :
                    io.to(`user:${getAdoptionProcess.adopterId}`).emit("step2:newPropose", { propose: result })
            }

            return res.status(200).json({ data: result })
        }

        if (getAdoptionProcess?.step == "MEETING_CONFIRMED") {
            const currentRound = getAdoptionProcess.meetingRound

            const propose = await prisma.meetingProposal.create({
                data: {
                    adoptionProcessId: adoptionProcessId,
                    createdById: Number(userId),
                    addressId: address,
                    meetingAt: date,
                    type: "RESCHEDULE",
                    round: currentRound
                }
            })

            if (!propose) return res.status(404).json({ message: "adoption process couldn't be found" })

            const getAddress = await prisma.address.findFirst({
                where: {
                    id: Number(propose.addressId)
                }
            })

            const result = {
                ...propose,
                address: getAddress
            }

            return res.status(200).json({ data: result })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to send your initial proposal" })
    }
}

export const getAllProposesInitial = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const adoptionProcessId = Number(req.params.id)

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(403).json({ message: "you' not allowed here" })

        const getAdoptionProcess = await prisma.adoptionProcess.findFirst({
            where: {
                id: adoptionProcessId
            },
            select: {
                meetingRound: true,
                step: true
            }
        })

        if (getAdoptionProcess?.step == "MEETING") {
            const getAllProposesInitial = await prisma.meetingProposal.findMany({
                where: {
                    adoptionProcessId: adoptionProcessId,
                    type: "INITIAL",
                    round: 1,
                },
                orderBy: { createdAt: "desc" },
                include: { address: true }
            })

            return res.status(200).json({ data: getAllProposesInitial })
        }

        if (getAdoptionProcess?.step == "MEETING_CONFIRMED") {
            const getCurrentRound = getAdoptionProcess.meetingRound

            const getAllProposes = await prisma.meetingProposal.findMany({
                where: {
                    adoptionProcessId: adoptionProcessId,
                    type: "RESCHEDULE",
                    round: getCurrentRound,
                    OR: [{ status: "REJECTED" }, { status: "PENDING" }]
                },
                orderBy: { createdAt: "desc" },
                include: { address: true }

            })

            return res.status(200).json({ data: getAllProposes })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to get all proposes intial" })
    }
}

export const setProposeToReject = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const proposeId = Number(req.params.id)

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(403).json({ message: "you' not allowed here" })

        const getMeetingProposal = await prisma.meetingProposal.findUnique({
            where: { id: proposeId },
            select: { adoptionProcessId: true }
        })

        const getAdoptionProcess = await prisma.adoptionProcess.findFirst({
            where: {
                id: getMeetingProposal?.adoptionProcessId
            },
            select: {
                meetingRound: true,
                step: true,
                adopterId: true,
                ownerId: true
            }
        })

        const isAdopter = userId == getAdoptionProcess?.adopterId

        if (getAdoptionProcess?.step == "MEETING") {
            const setAsRejected = await prisma.meetingProposal.update({
                where: {
                    id: proposeId,
                    type: "INITIAL",
                    round: 1
                },
                data: {
                    status: "REJECTED"
                }
            })

            {
                isAdopter ? io.to(`user:${getAdoptionProcess.ownerId}`).emit("step2:reject", { reject: setAsRejected }) :
                    io.to(`user:${getAdoptionProcess.adopterId}`).emit("step2:reject", { reject: setAsRejected })
            }

            if (!setAsRejected) return res.status(404).json({ message: "couldn't find the propose" })

            return res.status(200).json({ data: setAsRejected })
        }

        if (getAdoptionProcess?.step == "MEETING_CONFIRMED") {
            const getCurrentRound = getAdoptionProcess.meetingRound

            const setAsRejected = await prisma.meetingProposal.update({
                where: {
                    id: proposeId,
                    type: "RESCHEDULE",
                    round: getCurrentRound
                },
                data: {
                    status: "REJECTED"
                }
            })

            if (!setAsRejected) return res.status(404).json({ message: "couldn't find the propose" })

            return res.status(200).json({ data: setAsRejected })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to set propose as rejected" })
    }
}

export const setProposeToAccepted = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const proposeId = Number(req.params.id)

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(403).json({ message: "you' not allowed here" })

        const result = await prisma.$transaction(async (p) => {
            const getMeetingProposal = await prisma.meetingProposal.findUnique({
                where: { id: proposeId },
                select: { adoptionProcessId: true }
            })

            const getAdoptionProcess = await p.adoptionProcess.findFirst({
                where: {
                    id: getMeetingProposal?.adoptionProcessId
                },
                select: {
                    meetingRound: true,
                    step: true,
                    adopterId: true,
                    ownerId: true
                }
            })

            const isAdopter = userId == getAdoptionProcess?.adopterId;

            if (getAdoptionProcess?.step == "MEETING") {
                const getPropose = await p.meetingProposal.findUnique({
                    where: {
                        id: proposeId,
                        type: "INITIAL"
                    }
                })

                if (!getPropose) return res.status(404).json({ message: "couldn't find the propose" })

                const setAsAccepted = await p.meetingProposal.update({
                    where: {
                        id: proposeId,
                        type: "INITIAL"
                    },
                    data: {
                        status: "ACCEPTED",
                        respondedById: Number(userId),
                        respondedAt: new Date()
                    }
                })

                if (!setAsAccepted) return res.status(404).json({ message: "couldn't set the propose" })

                const nextStep = await p.adoptionProcess.update({
                    where: {
                        id: getPropose.adoptionProcessId
                    },
                    data: {
                        step: "MEETING_CONFIRMED"
                    }
                })

                if (!nextStep) return res.status(404).json({ message: "couldn't set the nextStep" })

                {
                    isAdopter ? io.to(`user:${getAdoptionProcess.ownerId}`).emit("step2:nextStep", { nextStep: nextStep.step }) :
                        io.to(`user:${getAdoptionProcess.adopterId}`).emit("step2:nextStep", { nextStep: nextStep.step })
                }

                return { setAsAccepted, nextStep }
            }

            if (getAdoptionProcess?.step == "MEETING_CONFIRMED") {
                const currentRound = getAdoptionProcess.meetingRound
                const nextRound = getAdoptionProcess.meetingRound + 1

                const getPropose = await p.meetingProposal.findUnique({
                    where: {
                        id: proposeId,
                        type: "RESCHEDULE",
                        round: currentRound
                    }
                })

                if (!getPropose) return res.status(404).json({ message: "couldn't find the propose" })

                const setAsAccepted = await p.meetingProposal.update({
                    where: {
                        id: proposeId,
                        type: "RESCHEDULE",
                        round: currentRound
                    },
                    data: {
                        status: "ACCEPTED",
                        respondedById: Number(userId),
                        respondedAt: new Date(),
                        round: nextRound,

                    }
                })

                if (!setAsAccepted) return res.status(404).json({ message: "couldn't set the propose" })

                const nextStep = await p.adoptionProcess.update({
                    where: {
                        id: getPropose.adoptionProcessId
                    },
                    data: {
                        meetingRound: nextRound
                    }
                })

                if (!nextStep) return res.status(404).json({ message: "couldn't set the nextStep" })

                const getAddress = await prisma.address.findFirst({
                    where: {
                        id: Number(setAsAccepted.addressId)
                    }
                })

                const addressAndDate = {
                    ...getAddress,
                    date: setAsAccepted.meetingAt
                }

                return { setAsAccepted, nextStep, addressAndDate }
            }
        })

        res.status(200).json({ data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to set propose as rejected" })
    }
}

export const getSucessAddressInitial = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const adoptionProcessId = Number(req.params.id)

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(404).json({ message: "you' not allowed here" })

        const getAdoptionProcess = await prisma.adoptionProcess.findFirst({
            where: {
                id: adoptionProcessId
            },
            select: {
                meetingRound: true,
                step: true
            }
        })

        if (getAdoptionProcess?.meetingRound! <= 2) {
            const getSucess = await prisma.meetingProposal.findFirst({
                where: { adoptionProcessId: adoptionProcessId, type: "INITIAL", status: "ACCEPTED", round: 1 },

            })

            if (!getSucess) return res.status(404).json({ message: "unable to find propose" })

            const getSucessAddress = await prisma.address.findFirst({
                where: { id: Number(getSucess.addressId) },

            })

            if (!getSucessAddress) return res.status(404).json({ message: "unable to find sucess address" })

            const result = {
                ...getSucessAddress,
                date: getSucess.meetingAt
            }

            return res.status(200).json({ data: result })
        }

        if (getAdoptionProcess?.meetingRound! > 2) {
            const currentRound = getAdoptionProcess?.meetingRound

            const getSucess = await prisma.meetingProposal.findFirst({
                where: { adoptionProcessId: adoptionProcessId, type: "RESCHEDULE", status: "ACCEPTED", round: currentRound },
                select: { addressId: true, meetingAt: true }

            })

            if (!getSucess) return res.status(404).json({ message: "unable to find propose" })

            const getSucessAddress = await prisma.address.findFirst({
                where: { id: Number(getSucess.addressId) },

            })

            if (!getSucessAddress) return res.status(404).json({ message: "unable to find sucess address" })

            const result = {
                ...getSucessAddress,
                date: getSucess.meetingAt
            }

            return res.status(200).json({ data: result })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to get initial sucess address" })
    }
}

export const setAsConfirmed = async (req: AuthRequest, res: Response) => {
    const userId = Number(req.user.userId);
    const adoptionProcessId = Number(req.params.id);

    try {
        const result = await prisma.$transaction(async (p) => {
            const ap = await p.adoptionProcess.findUnique({
                where: { id: adoptionProcessId },
                select: { adopterId: true, ownerId: true },
            });

            if (!ap) return res.status(404).json({ message: "you dont belong here" })

            const isAdopter = userId == ap.adopterId;
            const isOwner = userId == ap.ownerId;

            if (!isAdopter && !isOwner) return res.status(404).json({ message: "you dont belong here" })

            const existing = await p.meetingConfirmation.findUnique({
                where: { adoptionProcessId },
            });

            let row;

            if (!existing) {
                row = await p.meetingConfirmation.create({
                    data: {
                        adoptionProcessId,
                        adopterConfirmedAt: isAdopter ? new Date() : undefined,
                        ownerConfirmedAt: isOwner ? new Date() : undefined,
                    },
                });
            } else {
                row = await p.meetingConfirmation.update({
                    where: { adoptionProcessId },
                    data: {
                        adopterConfirmedAt: isAdopter ? new Date() : undefined,
                        ownerConfirmedAt: isOwner ? new Date() : undefined,
                    },
                });
            }

            let createAdoption = null

            if (row.adopterConfirmedAt && row.ownerConfirmedAt) {
                row = await p.meetingConfirmation.update({
                    where: { adoptionProcessId },
                    data: { finalizedAt: new Date() },
                });

                row = await p.adoptionProcess.update({
                    where: { id: adoptionProcessId },
                    data: {
                        step: "FINALIZE"
                    }
                })

                createAdoption = await p.petsAdopted.create({
                    data: {
                        petId: row?.petId,
                        adopterId: row?.adopterId
                    }
                })
            }

            const final = {
                ...row,
                createAdoption
            }

            return final;
        });

        return res.status(200).json({ data: result });
    } catch (e: any) {
        console.log(e);
        return res.status(500).json({ message: "unable to set as confirmed" });
    }
};

export const getConfirmations = async (req: AuthRequest, res: Response) => {
    const userId = req.user.userId
    const adoptionProcessId = Number(req.params.id);

    try {
        if (!isUserAllowedInAdoptionProcess(Number(userId), prisma)) return res.status(403).json({ message: "you' not allowed here" })

        const confirmations = await prisma.meetingConfirmation.findUnique({
            where: { adoptionProcessId: adoptionProcessId }
        })

        if (!confirmations) return res.status(404).json({ message: "confirmations coudn't be found" })

        res.status(200).json({ data: confirmations })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "unable to get confirmations" });
    }
}
