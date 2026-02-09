import prisma from '../../backEnd/client/PrismaClient.ts'
import jwt from 'jsonwebtoken'
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.ts";
import { maskEmail, maskPhone } from '../helper.ts';
import argon2 from "argon2";

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

//get pet onwer

export const getUserByIdPublic = async (req: AuthRequest, res: Response) => {
    const { userId } = req.query

    try {
        const UserByIdPublic = await userClient.user.findUnique({
            where: {
                id: Number(userId)
            },
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                phone: true,
                pets: true
            }
        });

        const maskedUser = {
            ...UserByIdPublic,
            email: maskEmail(String(UserByIdPublic?.email)),
            phone: maskPhone(String(UserByIdPublic?.phone))
        };


        res.status(200).json({ data: maskedUser });

    } catch (e) {
        console.log(e);
    }
}

//get user by id

export const getUserById = async (req: any, res: any) => {
    const user = req.user;
    console.log("user", user)

    try {
        const UserById = await userClient.user.findUnique({
            where: {
                id: user.userId
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

        res.json({ accessToken, id });
    })
}

// create a token
export const createToken = async (req: any, res: any) => {
    const data = req.body;

    console.log('userid', data.id)

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
            },
            include: {
                addresses: true
            }
        });

        if (!UserById) return res.status(400).json({ message: "Invalid Credentials" })

        const valid = await argon2.verify(UserById.password, userLogin.password);

        if (!valid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ data: UserById });

    } catch (e) {
        console.log(e);
    }

}

//insert
export const insertUser = async (req: AuthRequest, res: Response) => {
    const { userData, addressData } = req.body;
    const response: any = {};

    const hasAddressData = Object.values(addressData).some(
        (value) => value !== null && value !== undefined && value !== ""
    );

    try {

        const hashedPassword = await argon2.hash(userData.password);

        if (Object.keys(userData).length > 0) {
            response.createUser = await userClient.user.create({
                data: {
                    name: userData.name,
                    lastName: userData.lastName,
                    email: userData.email,
                    phone: userData.phone,
                    password: hashedPassword
                }
            });
        }

        if (hasAddressData) {
            response.createUserAddres = await userClient.address.create({
                data: {
                    cep: addressData.cep,
                    street: addressData.street,
                    neighborhood: addressData.neighborhood,
                    city: addressData.city,
                    state: addressData.region,
                    userId: response.createUser.id
                }
            });
        }

        res.status(201).json({
            data: {
                response
            }
        })
    } catch (e) {
        console.log(e)
    }
}

//update

export const updateUserById = async (req: any, res: any) => {

    const payload = req.body;
    console.log("payload", payload)

    const personalData = payload.personal
    const newAddress = payload.newAddress
    const userId = req.user.userId

    const updatePersonalData = { ...personalData };
    const updateNewAddressData = { ...newAddress };

    if (updatePersonalData.newPassword) {
        updatePersonalData.password = updatePersonalData.newPassword;
        delete updatePersonalData.newPassword;
    }

    if (updateNewAddressData.region) {
        updateNewAddressData.state = updateNewAddressData.region;
        delete updateNewAddressData.region;
    }

    console.log("data updated", updatePersonalData, updateNewAddressData)

    if (
        Object.keys(updatePersonalData).length === 0 &&
        Object.keys(updateNewAddressData).length === 0
    ) {
        res.status(400).json({ error: "No data to update" });
    }

    try {
        const response: any = {};

        if (Object.keys(updatePersonalData).length > 0) {
            response.personal = await userClient.user.update({
                where: { id: userId },
                data: updatePersonalData
            });
        }

        if (Object.keys(updateNewAddressData).length > 0) {
            response.address = await userClient.address.update({
                where: { id: payload.address.id },
                data: updateNewAddressData
            });
        }

        res.status(200).json({ updated: response });

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal error updating user" });
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

        res.status(200).json({
            data: {
                UserDelete,
                UserDeleteAllAdress
            }
        });

    } catch (e) {
        console.log(e);
    }

}

// insert banner img

export const insertBanner = async (req: AuthRequest, res: Response) => {
    const imgUrl = req.body
    const user = req.user

    console.log(imgUrl, user)

    try {

        const banner = await prisma.user.update({
            where: {
                id: user.userId
            },
            data: {
                bannerImg: imgUrl.url
            }
        })

        res.status(200).json({
            data: banner
        })

    } catch (e) {
        console.log(e)
    }
}

// insert profile img

export const insertProfileImg = async (req: AuthRequest, res: Response) => {
    const imgUrl = req.body
    const user = req.user

    console.log(imgUrl, user)

    try {

        const profileImg = await prisma.user.update({
            where: {
                id: user.userId
            },
            data: {
                profileImg: imgUrl.url
            }
        })

        res.status(200).json({
            data: profileImg
        })

    } catch (e) {
        console.log(e)
    }
}