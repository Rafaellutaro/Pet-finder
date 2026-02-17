import { Router } from 'express';
import { } from '../controller/chat.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'
import { getDataFromId, confirmAdoption, meetingProposalInitial } from '../controller/adoption.controller.ts';

const adoptionRouter = Router();

adoptionRouter.get("/getInfoFromId/:id", verifyJWT, getDataFromId); // private
adoptionRouter.patch("/confirmation/:id", verifyJWT, confirmAdoption); // private
adoptionRouter.post("/propose/:id/initial", verifyJWT, meetingProposalInitial); // private
adoptionRouter.get("/propose/getInitial", verifyJWT, meetingProposalInitial); // private



export default adoptionRouter;