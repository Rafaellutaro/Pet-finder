import { Router } from 'express';
import { getAllUsers, insertUser, getUserById, updateUserById, deleteUserById, getUserByEmail, createToken, refreshToken } from '../controller/user.controller.ts';

const userRoute = Router();

userRoute.get("/", getAllUsers);
userRoute.post("/insert", insertUser);
userRoute.post("/getId", getUserById);
userRoute.put("/updateById", updateUserById);
userRoute.delete("/deleteId", deleteUserById);
userRoute.post("/getEmail", getUserByEmail);
userRoute.post("/createToken", createToken);
userRoute.post("/refreshToken", refreshToken);

export default userRoute;