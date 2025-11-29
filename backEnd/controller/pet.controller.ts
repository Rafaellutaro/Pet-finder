import prisma from '../../backEnd/client/PrismaClient.ts'

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