import { Router } from 'express';
import { getAllUsers, insertUser, getUserById, updateUserById, deleteUserById } from '../controller/user.controller.ts';

const userRoute = Router();

userRoute.get("/", getAllUsers);
userRoute.post("/", insertUser);
userRoute.post("/", getUserById);
userRoute.post("/", updateUserById);
userRoute.post("/", deleteUserById);

export default userRoute;