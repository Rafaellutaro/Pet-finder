import type { Response } from "express";
import prisma from '../../backEnd/client/PrismaClient.ts'
import type { AuthRequest } from "../middleware/auth.middleware.ts";

export const getUniquePetById = async (req: AuthRequest, res: Response) => {
    const {petId} = req.query

    try {
        const getUnique = await prisma.pet.findUnique({
            where: {
                id: Number(petId)
            },
            include:{
                imgs: true
            },
        })
        res.status(200).json({data: getUnique})
    } catch (e) {
        console.log(e)
    }
} 

// get all pets

export const getAllPets = async (req: AuthRequest, res: Response) => {
    const { uf, city, breed, age, type, page = 1, limit = 10, orderBy = 'name', orderDirection = 'asc' } = req.query;

    const filters: any = {};

    const filterMap: { [key: string]: string | number | undefined } = {
        state: typeof uf == 'string' && uf != 'undefined' ? uf : undefined,
        city: typeof city == 'string' && city != 'undefined' ? city : undefined,
        breed: typeof breed == 'string' && breed != 'undefined' ? breed : undefined,
        age: typeof age == 'string' && age != 'undefined' ? age : undefined,
        type: typeof type == 'string' && type != 'undefined' ? type : undefined,
    };

    Object.keys(filterMap).forEach((key) => {
        if (filterMap[key]) {
            if (key === 'state' || key === 'city') {
                filters.address = { ...filters.address, [key]: filterMap[key] };
            } else {
                filters[key] = filterMap[key];
            }
        }
    });

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    console.log("skip,", skip,"page", page)

    const orderByKey = typeof orderBy == 'string' ? orderBy : 'name';
    const order = {
        [orderByKey]: orderDirection === 'desc' ? 'desc' : 'asc',  
    };

    try {
        const allPets = await prisma.pet.findMany({
            where: filters,
            skip,
            take,
            orderBy: order,
            include: {
                address: true,
                imgs: true
            },
        });

        const totalPets = await prisma.pet.count({
            where: filters,
        });
    
        const totalPages = Math.ceil(totalPets / Number(limit));

         res.status(200).json({
            data: allPets,
            pagination: {
                page: Number(page),
                totalPages,
                totalItems: totalPets,
                itemsPerPage: limit,
            },
        });

    } catch (e) {
        console.log(e);
    }

}

//getAllPetsById

export const getAllPetsById = async (req: AuthRequest, res: Response) => {
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
export const insertPet = async (req: AuthRequest, res: Response) => {
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