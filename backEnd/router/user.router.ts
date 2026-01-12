import { Router } from 'express';
import { getAllUsers, insertUser, getUserById, updateUserById, deleteUserById, getUserByEmail, createToken, refreshToken, getUserByIdPublic } from '../controller/user.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const userRoute = Router();

userRoute.get("/", getAllUsers); // public
userRoute.post("/insert", insertUser); // public
userRoute.get("/getIdPublic", getUserByIdPublic); // public
userRoute.get("/getId", verifyJWT,getUserById); // private
userRoute.put("/updateById", verifyJWT, updateUserById); // private
userRoute.delete("/deleteId", deleteUserById); // private, not used for now
userRoute.post("/getEmail", getUserByEmail); // public
userRoute.post("/createToken", createToken); // public
userRoute.post("/refreshToken", refreshToken); // not necessary to include verifyJWT

export default userRoute;