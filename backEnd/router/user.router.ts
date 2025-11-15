import { Router } from 'express';
import { getAllUsers } from '../controller/user.controller.ts';

const userRoute = Router();

userRoute.get("/", getAllUsers);

export default userRoute;