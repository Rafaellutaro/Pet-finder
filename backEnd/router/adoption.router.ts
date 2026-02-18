import { Router } from 'express';
import { } from '../controller/chat.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'
import { getDataFromId, confirmAdoption, meetingProposalInitial, getAllProposesInitial, setProposeToAccepted, setProposeToReject } from '../controller/adoption.controller.ts';

const adoptionRouter = Router();

adoptionRouter.get("/getInfoFromId/:id", verifyJWT, getDataFromId); // private
adoptionRouter.patch("/confirmation/:id", verifyJWT, confirmAdoption); // private
adoptionRouter.post("/propose/:id/initial", verifyJWT, meetingProposalInitial); // private
adoptionRouter.get("/propose/:id/getInitial", verifyJWT, getAllProposesInitial); // private
adoptionRouter.patch("/propose/:id/setAcceptInitial", verifyJWT, setProposeToAccepted); // private
adoptionRouter.patch("/propose/:id/setRejectInitial", verifyJWT, setProposeToReject); // private



export default adoptionRouter;