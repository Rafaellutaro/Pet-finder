import { Router } from 'express';
import { insertPet } from '../controller/pet.controller.ts';

const userRoute = Router();

userRoute.post("/insert", insertPet);


export default userRoute;