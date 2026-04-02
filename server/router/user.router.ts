import { Router } from 'express';
import { getAllUsers, insertUser, getUserById, updateUserById, updatePassword, deleteUserById, getUserByEmailAndLogin, createToken, refreshToken, getUserByIdPublic, insertBanner, insertProfileImg, createEmailCode, verifyEmailCode, googleLogin, logout } from '../controller/user.controller.js';
import {verifyJWT} from '../middleware/auth.middleware.js'

const userRoute = Router();

// userRoute.get("/", getAllUsers); // public
userRoute.post("/insert", insertUser); // public
userRoute.get("/getIdPublic", getUserByIdPublic); // public
userRoute.get("/getId", verifyJWT,getUserById); // private
userRoute.put("/updateById", verifyJWT, updateUserById); // private
// userRoute.delete("/deleteId", deleteUserById); // private, not used for now
userRoute.post("/getEmail&createToken", getUserByEmailAndLogin); // public
// userRoute.post("/createToken", createToken); // public
userRoute.post("/refreshToken", refreshToken); // not necessary to include verifyJWT
userRoute.post("/banner", verifyJWT, insertBanner); 
userRoute.post("/profileImg", verifyJWT, insertProfileImg);
userRoute.post("/createEmailCode", createEmailCode); 
userRoute.post("/verifyEmailCode", verifyEmailCode);
userRoute.patch("/newPassword", updatePassword);     
userRoute.post("/googleLogin", googleLogin);
userRoute.post("/logOff", verifyJWT, logout);  

export default userRoute;