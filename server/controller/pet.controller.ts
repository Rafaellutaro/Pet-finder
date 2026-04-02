import type { Response } from "express";
import prisma from '../client/PrismaClient.js'
import type { AuthRequest } from "../middleware/auth.middleware.js";

export const getUniquePetById = async (req: AuthRequest, res: Response) => {
    const { petId } = req.query

    try {
        const getUnique = await prisma.pet.findUnique({
            where: {
                id: Number(petId)
            },
            include: {
                imgs: true,
                address: {
                    select: {
                        city: true,
                        state: true
                    }
                }
            },
        })
        res.status(200).json({ data: getUnique })
    } catch (e) {
        console.log(e)
    }
}

// get all pets

export const getAllPets = async (req: AuthRequest, res: Response) => {
    const { uf, city, breed, age, type, page = 1, limit, orderBy = 'name', orderDirection = 'asc' } = req.query;

    const filters: any = {};

    const filterMap: { [key: string]: string | number | undefined } = {
        petStatus: "AVAILABLE",
        state: typeof uf == 'string' && uf != 'undefined' ? uf : undefined,
        city: typeof city == 'string' && city != 'undefined' ? city : undefined,
        breed: typeof breed == 'string' && breed != 'undefined' ? breed : undefined,
        age: typeof age == 'string' && age != 'undefined' ? age : undefined,
        type: typeof type == 'string' && type != 'undefined' ? type : undefined,
    };

    Object.keys(filterMap).forEach((key) => {
        if (filterMap[key]) {
            if (key == 'state' || key == 'city') {
                filters.address = { ...filters.address, [key]: filterMap[key] };
            } else {
                filters[key] = filterMap[key];
            }
        }
    });

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    console.log("skip,", skip, "page", page)

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
            include: {
                imgs: true
            },
            orderBy: {
                id: "desc"
            }
        })

        res.status(200).json({ data: getAllPetsById })
    } catch (e) {
        console.log(e)
    }
}

//get Pet traits

export const getPetTraits = async (req: AuthRequest, res: Response) => {
    try {
        const { petIdQuery } = req.query

        const traits = await prisma.petTrait.findMany({
            where: { petId: Number(petIdQuery) },
            include: {
                Trait: {
                    select: {
                        id: true,
                        key: true,
                        sortOrder: true,
                    },
                },
            },
            orderBy: {
                Trait: { sortOrder: "asc" },
            },
        });

        res.status(200).json({ data: traits })

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

        const petTraitValues: { [key: string]: number } = {
            friendly: petData.friendly,
            energetic: petData.energetic,
            playful: petData.playful,
            smart: petData.smart,
            loyal: petData.loyal,
        };

        const createPet = await prisma.pet.create({
            data: {
                name: petData.name,
                type: petData.type,
                breed: petData.breed,
                age: petData.age,
                details: petData.details,
                userId: payload.userId,
                //new fields
                gender: petData.gender,
                wayOfLyfe: petData.wayOfLife,
                food: petData.food,
                playPlace: petData.playPlace,
                sleepPlace: petData.sleepPlace,
                toy: petData.toy
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
                street: petAddress.street,
                neighborhood: petAddress.neighborhood,
                city: petAddress.city,
                state: petAddress.state,
            }
        })

        const traits = await prisma.trait.findMany({
            where: {
                key: { in: Object.keys(petTraitValues) },
            },
        });

        const petTraitsData = traits.map(trait => ({
            petId: createPet.id,
            traitId: trait.id,
            value: petTraitValues[trait.key],
        }));

        const createPetTrait = await prisma.petTrait.createMany({
            data: petTraitsData
        })

        console.log("im here", petTraitValues, traits, petTraitsData, createPetTrait)


        res.status(201).json({
            data: {
                createPet,
                createImg,
                createpetAddress,
                createPetTrait
            }
        })
    } catch (e) {
        console.log(e)
    }
}

// insert heart

export const insertHeart = async (req: AuthRequest, res: Response) => {
    const id = req.params.petId
    const user = req.user;

    try {
        const heart = await prisma.validadeHeart.create({
            data: {
                petId: Number(id),
                userId: user.userId
            }
        })

        if (!heart) return res.status(409).json({message: "Você já deu um coração há este pet"})

        const incrementHeart = await prisma.pet.update({
            where: {
                id: Number(id),
            },
            data: {
                heartsCount: { increment: 1 }
            }
        })

        res.status(200).json({
            heart,
            incrementHeart
        })
    } catch (e) {
        console.log(e)
    }
}

// insert views

export const insertViews = async (req: AuthRequest, res: Response) => {
    const id = req.params.petId
    const user = req.user;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const views = await prisma.validateView.create({
            data: {
                petId: Number(id),
                userId: user.userId,
                viewDate: today
            }
        })

        const incrementView = await prisma.pet.update({
            where: {
                id: Number(id),
            },
            data: {
                viewsCount: { increment: 1 }
            }
        })

        res.status(200).json({
            views,
            incrementView
        })
    } catch (e) {
        return res.status(409).json({message: "Already Viewed Today"})
    }
}

export const updatePetStatus = async (req: AuthRequest, res: Response) => {
    const petId = req.params.petId
    const status = req.body.status

    console.log("petStatus here", status, petId)

    try {
        const updateStatus = await prisma.pet.update({
            where: {
                id: Number(petId)
            },
            data: {
                petStatus: status
            }
        })

        return res.status(200).json({data: updateStatus})
    } catch (e) {
        return res.status(500).json({message: "unbale to update petStatus"})
    }
}