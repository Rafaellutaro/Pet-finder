import prisma from '../../backEnd/client/PrismaClient.ts'

// get all pets

export const getAllPets = async (req: any, res: any) => {

    try {
        const allPets = await prisma.pet.findMany({

            include: {
                address: true,
                imgs: true
            },
        });

        res.status(200).json({ data: allPets });

    } catch (e) {
        console.log(e);
    }

}

//getAllPetsById

export const getAllPetsById = async (req: any, res: any) => {
    try {
        const user = req.user;

        const getAllPetsById = await prisma.pet.findMany({
            where: {
                userId: user.userId
            },
            include:{
                imgs: true
            },
        })

        res.status(200).json({data: getAllPetsById})
    } catch (e) {
        console.log(e)
    }
} 

//insert
export const insertPet = async (req: any, res: any) => {
    try {
        const payload = req.body;

        console.log('all pet data', payload)

        const petData = payload.petData
        const petAddress = payload.address

        const createPet = await prisma.pet.create({
            data: {
                name: petData.name,
                type: petData.type,
                breed: petData.breed,
                age: petData.age,
                details: petData.details,
                userId: payload.userId
            }
        })

        const createImg = await prisma.petImg.create({
            data: {
                petId: createPet.id,
                url: payload.imageUrl
            }
        })

        const createpetAddress = await prisma.petAddress.create({
            data: {
                petId: createPet.id,
                cep: petAddress.cep,
                street:petAddress.street,
                neighborhood: petAddress.neighborhood,
                city: petAddress.city,
                state: petAddress.state
            }
        })

        res.status(201).json({data: {
            createPet,
            createImg,
            createpetAddress
        }})
    } catch (e) {
        console.log(e)
    }
}