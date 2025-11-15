import { PrismaClient } from "../../src/generated/prisma/client.ts";

const userClient = new PrismaClient().user;

//get

export const getAllUsers = async (req: any, res: any) => {

    try {
        const allAuthors = await userClient.findMany({

            include: {
                addresses: true,
            },
        });

        res.status(200).json({ data: allAuthors });

    } catch (e) {
        console.log(e);
    }

}