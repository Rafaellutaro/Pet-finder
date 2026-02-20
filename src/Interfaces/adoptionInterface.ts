export interface adoptionInterface {
    getInfo: {
        adopterId: number,
        id: number,
        ownerId: number,
        petId: number,
        step: "CONFIRMATION" | "MEETING" | "MEETING_CONFIRMED" | "FINALIZE" | "COMPLETED" | "DECLINED"
        adopterConfirmedAt: string,
        ownerConfirmedAt: string
    },
    getPetInfo: {
        age: string,
        breed: string,
        imgs: any[],
        name: string
        date: string
    },
    maskedAdopterInfo: {
        addresses: {
            state: string,
            city: string
        },
        id: number,
        email: string,
        name: string,
        lastName: string,
        phone: string,
        profileImg: string
    },
    maskedOwnerInfo: {
        addresses: {
            state: string,
            city: string
        },
        id: number,
        email: string,
        name: string,
        lastName: string,
        phone: string,
        profileImg: string
    },
}

export interface allProposesInterface {
    id: number,
    addressId: number,
    adoptionProcessId: number,
    round: number,
    createdById: number,
    createdAt: string,
    meetingAt: string,
    respondedAt: string,
    respondedById: number,
    status: string,
    type: string,
    address: {
        id: number,
        cep: string,
        city: string,
        neighborhood: string,
        state: string,
        street: string,
        userId: number
    }
}

export interface adoptionAddress {
    id: number,
    userId: number,
    cep: string,
    street: string,
    city: string,
    state: string,
    neighborhood: string,
    date: string
}

export interface confirmations {
    id: number,
    adoptionProcessId: number,
    adopterConfirmedAt: string,
    createdAt: string,
    finalizedAt: string,
    ownerConfirmedAt: string,
    updatedAt: string
}