import { Router } from 'express';
import { insertPet, getAllPetsById, getAllPets, getUniquePetById, getPetTraits, insertHeart, insertViews, updatePetStatus} from '../controller/pet.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const userRoute = Router();

userRoute.get("/getAllPets", getAllPets); // public
userRoute.get("/getUniquePet", getUniquePetById); // public
userRoute.post("/insert", verifyJWT , insertPet); // private
userRoute.get("/getAllPetsById",verifyJWT, getAllPetsById); // private api
userRoute.get("/getPetTraits", getPetTraits); // public
userRoute.post("/:petId/view", verifyJWT, insertViews);   // private
userRoute.post("/:petId/heart", verifyJWT, insertHeart);   // private
userRoute.patch("/:petId/updateStatus", verifyJWT, updatePetStatus);   // private


export default userRoute;