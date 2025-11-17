import { PrismaClient } from "../../src/generated/prisma/client.ts";

const userClient = new PrismaClient();

//get

export const getAllUsers = async (req: any, res: any) => {

    try {
        const allUsers = await userClient.user.findMany({

            include: {
                addresses: true,
            },
        });

        res.status(200).json({ data: allUsers });

    } catch (e) {
        console.log(e);
    }

}

//get user by id

export const getUserById = async (req: any, res: any) => {

    const userId = req.body;

    try {
        const UserById = await userClient.user.findUnique({
            where: {
                id: userId
            },
            include: {
                addresses: true
            }
        });

        res.status(200).json({ data: UserById });

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

//update

export const updateUserById = async (req: any, res: any) => {

    const { allUserData } = req.body;

    try {
        const UserUpdate = await userClient.user.update({
            where: {
                id: allUserData.id
            },
            data: allUserData
        });

        res.status(200).json({ data: UserUpdate });

    } catch (e) {
        console.log(e);
    }

}

//delete

export const deleteUserById = async (req: any, res: any) => {

    const userId = req.body;

    try {
        const UserDelete = await userClient.user.delete({
            where: {
                id: userId
            }
        });

        const UserDeleteAllAdress = await userClient.address.deleteMany({
            where: {
                userId: userId
            }
        });

        res.status(200).json({ data: {
            UserDelete,
            UserDeleteAllAdress
        } });

    } catch (e) {
        console.log(e);
    }

}