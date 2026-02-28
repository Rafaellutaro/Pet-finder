export interface chatInterface {
    adopterId: number,
    conversationStatus: string,
    createdAt: string,
    id: number,
    ownerId: number,
    petId: number,
    updatedAt: string,
    lastMessage: {
        content: string,
        createdAt: string,
        id: number,
        senderId: number
    },
    pet: {
        id: number,
        name: string,
        imgs: any[]
    },
    userAdopter: {
        id: number,
        name: string,
        lastName: string,
        profileImg: string
    },
    userOwner: {
        id: number,
        name: string,
        lastName: string,
        profileImg: string
    },
     adoptionProcess: {
        id: number,
        step: string
     }

}

export interface singleChatInterface {
    adopterId: number,
    conversationStatus: string,
    createdAt: string,
    id: number,
    ownerId: number,
    petId: number,
    updatedAt: string,
    pet: {
        age: number,
        breed: string,
        id: number,
        name: string,
        address: {
            city: string,
            state: string
        }
        imgs: any[]
    },
    userOwner: {
        id: number,
        name: string,
        lastName: string,
        profileImg: string
    },
    userAdopter: {
        profileImg: string,
    }
}