import { Router } from 'express';
import { insertPet, getAllPetsById, getAllPets } from '../controller/pet.controller.ts';

const userRoute = Router();

userRoute.get("/getAllPets", getAllPets);
userRoute.post("/insert", insertPet);
userRoute.post("/getAllPetsById", getAllPetsById);


export default userRoute;