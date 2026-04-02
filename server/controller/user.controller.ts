import prisma from '../client/PrismaClient.js'
import jwt from 'jsonwebtoken'
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { createJwtCookie, generateVerificationCode, htmlGenerate, maskEmail, maskPhone, sendEmail } from '../helper.js';
import argon2 from "argon2";
import { Resend } from 'resend';
import googleClient from '../client/GoogleClient.js';

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
                addresses: {
                    distinct: ["cep"],
                    orderBy: { createdAt: "desc" }
                },
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

    const accessToken = createJwtCookie(data.id, res)
    return res.status(200).json({data: accessToken, status: 200})
}

//get user by email

export const getUserByEmailAndLogin = async (req: any, res: any) => {

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

        if (!UserById) return res.status(400).json({ message: "Usuario não existe" })

        const valid = await argon2.verify(String(UserById.password), String(userLogin.password));

        if (!valid) {
            return res.status(400).json({ message: "Senha Invalida" });
        }

        const accessToken = createJwtCookie(UserById.id, res)

        console.log("ACCESStOKEN AND USER DATA", accessToken, UserById)

        if (!accessToken) return res.status(400).json({ message: "Invalid User" });

        return res.status(200).json({ data: UserById, accessToken: accessToken });
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
                    userId: response.createUser.id,
                    type: "MAIN"
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

    let updatePersonalData = { ...personalData };
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

    if (Object.keys(updatePersonalData).length == 0 && Object.keys(updateNewAddressData).length == 0) return res.status(400).json({ message: "No data to update" });

    try {
        const response: any = {};

        if (Object.keys(updatePersonalData).length > 0) {
            if (updatePersonalData.password) {
                const verifyPassword = await userClient.user.findUnique({
                    where: { id: userId },
                    select: {
                        password: true
                    }
                })

                const valid = await argon2.verify(String(verifyPassword?.password), String(updatePersonalData.currentPassword));

                if (!valid) return res.status(400).json({ message: "password do not match" })

                const hashedPassword = await argon2.hash(updatePersonalData?.password)

                updatePersonalData = {
                    ...updatePersonalData,
                    password: hashedPassword,
                };

                delete updatePersonalData.currentPassword
            }

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
            data: banner.bannerImg
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
            data: profileImg.profileImg
        })

    } catch (e) {
        console.log(e)
    }
}

export const createEmailCode = async (req: AuthRequest, res: Response) => {
    const email = req.body.email
    const now = new Date()
    try {
        await prisma.emailVerificationCode.deleteMany({
            where: {
                email,
                expiresAt: { lt: now },
            },
        });

        const code = generateVerificationCode();

        if (!code) return

        const hashedCode = await argon2.hash(code);

        const createCode = await prisma.emailVerificationCode.create({
            data: {
                email: email,
                codeHash: hashedCode,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            }
        })

        if (!createCode) return res.status(400).json({ message: "unable to store code" })

        // const html = htmlGenerate(code)
        // await sendEmail(email, "Seu Código de Verificação", html)

        return res.status(200).json({ data: createCode, code })
    } catch (e) {
        return res.status(500).json({ message: "unable to create code" })
    }
}

export const verifyEmailCode = async (req: AuthRequest, res: Response) => {
    const { email, code } = req.body
    const now = new Date()

    try {
        const getCodeData = await prisma.emailVerificationCode.findFirst({
            where: { email, expiresAt: { gt: now } },
            orderBy: { createdAt: "desc" },
            select: {
                codeHash: true,
                attempts: true,
                id: true
            }
        });

        if (!getCodeData) {
            await prisma.emailVerificationCode.deleteMany({
                where: { email },
            });

            return res.status(410).json({ message: "code expired, request a new one" });
        }

        const verifyCode = await argon2.verify(String(getCodeData?.codeHash), String(code));

        if (!verifyCode) {
            const updatedAttemp = await prisma.emailVerificationCode.update({
                where: { id: getCodeData.id },
                data: { attempts: { increment: 1 } },
            });

            if (updatedAttemp.attempts >= 5) {
                await prisma.emailVerificationCode.delete({
                    where: { id: getCodeData.id },
                });
            }

            return res.status(403).json({ message: "invalid code" });
        }

        await prisma.emailVerificationCode.deleteMany({
            where: { email: email },
        })

        return res.status(200).json({ data: verifyCode })
    } catch (e) {
        return res.status(500).json({ message: "unable to create code" })
    }
}

export const updatePassword = async (req: AuthRequest, res: Response) => {
    const { pass, email } = req.body

    try {
        const hashedPassword = await argon2.hash(pass);

        const newPassword = await prisma.user.update({
            where: {
                email: email
            },
            data: {
                password: hashedPassword
            }
        })


        if (!newPassword) return res.status(400).json({ message: "somethign went wrong", status: 400 })


        res.status(200).json({ data: true, status: 200 });
    } catch (e) {
        return res.status(500).json({ message: "unable to update password", status: 500 })
    }
}

export const googleLogin = async (req: AuthRequest, res: Response) => {
    const credential = String(req.body.credential)

    try {
        if (!credential) {
            return res.status(400).json({ message: "Google credential not provided", status: 400 });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID as string,
        });

        const payload = ticket.getPayload();

        console.log("PAYLOAD", payload)

        if (!payload || !payload.sub || !payload.email) {
            return res.status(401).json({ message: "Invalid Google token", status: 401 });
        }

        const findGoogleUser = await prisma.user.findUnique({
            where: { googleId: payload.sub },
            select: {
                id: true
            }
        })

        console.log("FINDUSER", findGoogleUser)

        if (findGoogleUser) {
            const accessToken = createJwtCookie(findGoogleUser.id, res)
            return res.status(200).json({data: accessToken, status: 200})
        } else if (!findGoogleUser) {
            const findGoogleUserEmail = await prisma.user.findUnique({
                where: { email: payload.email },
                select: {
                    id: true
                }
            })

            console.log("FINDUSEREMAIL", findGoogleUserEmail)

            if (findGoogleUserEmail) {
                const updatedGoogleUser = await prisma.user.update({
                    where: { email: payload.email },
                    data: {
                        googleId: payload.sub,
                        profileImg: payload.picture
                    }
                })

                const accessToken = createJwtCookie(updatedGoogleUser.id, res)
                return res.status(200).json({data: accessToken, status: 200})
            }else if (!findGoogleUserEmail){
                const createGoogleUser = await prisma.user.create({
                    data: {
                        name: String(payload.given_name),
                        lastName: String(payload.family_name ? payload.family_name : null),
                        email: payload.email,
                        profileImg: payload.picture,
                        googleId: payload.sub
                    }
                })

                console.log("CREATEGOOGLEUSER", createGoogleUser)

                const accessToken = createJwtCookie(createGoogleUser.id, res)
                return res.status(200).json({data: accessToken, status: 200})
            }
        }
    } catch (e) {
        console.log(e)
    }
}

export const logout = (req: AuthRequest, res: Response) => {

const isProd = process.env.NODE_ENV == "PRODUCTION"

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  return res.status(200).json({data: "Logout successful", status: 200});
};