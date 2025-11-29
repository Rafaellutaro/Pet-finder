import prisma from '../../backEnd/client/PrismaClient.ts'
import jwt from 'jsonwebtoken'

const userClient = prisma

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

    const userId = req.body.id;

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

//refresh the token
export const refreshToken = async (req: any, res: any) => {
     const refreshToken = req.cookies.refreshToken;

     console.log(refreshToken)

    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        console.log(decoded)

        const id = decoded.userId;

        const accessToken = jwt.sign(
            { userId: id },  
            process.env.ACCESS_TOKEN_SECRET as string,  
            { expiresIn: '15m' }  
        );

    res.json({ accessToken, id});
})}

// create a token
export const createToken = async (req: any, res: any) => {
    const data = req.body;

    console.log('userid',data.id)

    const accessToken = jwt.sign(
        { userId: data.id }, 
        process.env.ACCESS_TOKEN_SECRET as string,  
        { expiresIn: '15m' }  
    );

    const refreshToken = jwt.sign(
        { userId: data.id },  
        process.env.REFRESH_TOKEN_SECRET as string,  
        { expiresIn: '7d' }  
    );

    console.log(refreshToken)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',  
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
}

//get user by email

export const getUserByEmail = async (req: any, res: any) => {

    const userLogin = req.body;

    try {
        const UserById = await userClient.user.findUnique({
            where: {
                email: userLogin.email,
                password: userLogin.password
                
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
                phone: userData.phone,
                password: userData.password
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