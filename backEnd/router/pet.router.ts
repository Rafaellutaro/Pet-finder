import { Router } from 'express';
import { insertPet, getAllPetsById, getAllPets } from '../controller/pet.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const userRoute = Router();

userRoute.get("/getAllPets", getAllPets);
userRoute.post("/insert", insertPet);
userRoute.get("/getAllPetsById",verifyJWT, getAllPetsById); // private api


export default userRoute;