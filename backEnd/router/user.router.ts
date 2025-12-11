import { Router } from 'express';
import { getAllUsers, insertUser, getUserById, updateUserById, deleteUserById, getUserByEmail, createToken, refreshToken } from '../controller/user.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const userRoute = Router();

userRoute.get("/", getAllUsers);
userRoute.post("/insert", insertUser);
userRoute.get("/getId", verifyJWT,getUserById);
userRoute.put("/updateById", updateUserById);
userRoute.delete("/deleteId", deleteUserById);
userRoute.post("/getEmail", getUserByEmail);
userRoute.post("/createToken", createToken);
userRoute.post("/refreshToken", refreshToken);

export default userRoute;