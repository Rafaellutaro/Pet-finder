import { Router } from 'express';
import { getAllUsers, insertUser, getUserById, updateUserById, deleteUserById, getUserByEmail } from '../controller/user.controller.ts';

const userRoute = Router();

userRoute.get("/", getAllUsers);
userRoute.post("/insert", insertUser);
userRoute.get("/getId", getUserById);
userRoute.put("/updateId", updateUserById);
userRoute.delete("/deleteId", deleteUserById);
userRoute.post("/getEmail", getUserByEmail);

export default userRoute;