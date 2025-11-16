import { Router } from 'express';
import { getAllUsers, insertUser } from '../controller/user.controller.ts';

const userRoute = Router();

userRoute.get("/", getAllUsers);
userRoute.post("/", insertUser);

export default userRoute;