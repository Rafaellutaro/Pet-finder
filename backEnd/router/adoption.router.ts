import { Router } from 'express';
import { } from '../controller/chat.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'
import { getDataFromId } from '../controller/adoption.controller.ts';

const adoptionRouter = Router();

adoptionRouter.get("/getInfoFromId/:id", verifyJWT, getDataFromId); // private



export default adoptionRouter;