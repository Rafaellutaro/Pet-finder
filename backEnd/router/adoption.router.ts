import { Router } from 'express';
import { } from '../controller/chat.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'
import { getDataFromId, confirmAdoption } from '../controller/adoption.controller.ts';

const adoptionRouter = Router();

adoptionRouter.get("/getInfoFromId/:id", verifyJWT, getDataFromId); // private
adoptionRouter.patch("/confirmation/:id", verifyJWT, confirmAdoption); // private



export default adoptionRouter;