import { PrismaClient } from "../../src/generated/prisma/client.ts";

const userClient = new PrismaClient();

//get

export const getAllUsers = async (req: any, res: any) => {

    try {
        const allAuthors = await userClient.user.findMany({

            include: {
                addresses: true,
            },
        });

        res.status(200).json({ data: allAuthors });

    } catch (e) {
        console.log(e);
    }

}

//insert
export const insertUser = async (req: any, res: any) => {
    try {
        const { userData, addressData } = req.body;

        const createUser = await userClient.user.create({
            data: {
                name: userData.name,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone
            }
        })

        const createUserAddres = await userClient.address.create({
            data: {
                cep: addressData.cep,
                street: addressData.street,
                neighborhood: addressData.neighborhood,
                city: addressData.city,
                state: addressData.region,
                userId: createUser.id
            }
        })

        res.status(201).json({data: {
            createUser,
            createUserAddres
        }})
    } catch (e) {
        console.log(e)
    }
}