export interface adoptionInterface {
    getInfo: {
        adopterId: number,
        id: number,
        ownerId: number,
        petId: number,
        step: string
    },
    getPetInfo: {
        age: string,
        breed: string,
        imgs: any[],
        name: string
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
        phone: string
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
        phone: string
    },

}