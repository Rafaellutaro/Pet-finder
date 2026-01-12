import { Router } from 'express';
import { insertPet, getAllPetsById, getAllPets, getUniquePetById } from '../controller/pet.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const userRoute = Router();

userRoute.get("/getAllPets", getAllPets);
userRoute.get("/getUniquePet", getUniquePetById);
userRoute.post("/insert", insertPet);
userRoute.get("/getAllPetsById",verifyJWT, getAllPetsById); // private api


export default userRoute;