import { Router } from 'express';
import { ConversationCreate, getAllDataFromRoomId } from '../controller/chat.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const chatRoute = Router();

chatRoute.post("/conversationCreate", verifyJWT, ConversationCreate); // private
chatRoute.get("/conversation/:id", verifyJWT, getAllDataFromRoomId)


export default chatRoute;