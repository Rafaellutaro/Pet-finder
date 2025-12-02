import { Router } from 'express';
import { insertPet, getAllPetsById } from '../controller/pet.controller.ts';

const userRoute = Router();

userRoute.post("/insert", insertPet);
userRoute.post("/getAllPetsById", getAllPetsById);


export default userRoute;