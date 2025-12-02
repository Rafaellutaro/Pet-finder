import prisma from '../../backEnd/client/PrismaClient.ts'

//getAllPetsById

export const getAllPetsById = async (req: any, res: any) => {
    try {
        const id = req.body.id

        console.log(id)

        const getAllPetsById = await prisma.pet.findMany({
            where: {
                userId: id
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
        const { petData, userId, imageUrl } = req.body;

        console.log('all pet data', petData, userId, imageUrl)

        const createPet = await prisma.pet.create({
            data: {
                name: petData.name,
                type: petData.type,
                breed: petData.breed,
                age: petData.age,
                details: petData.details,
                userId: userId
            }
        })

        const createImg = await prisma.petImg.create({
            data: {
                petId: createPet.id,
                url: imageUrl
            }
        })

        res.status(201).json({data: {
            createPet,
            createImg
        }})
    } catch (e) {
        console.log(e)
    }
}