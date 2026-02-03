import { Router } from 'express';
import { ConversationCreate, getAllDataFromRoomId, getMessages, sendMessage } from '../controller/chat.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const chatRoute = Router();

chatRoute.post("/conversationCreate", verifyJWT, ConversationCreate); // private
chatRoute.get("/conversation/:id", verifyJWT, getAllDataFromRoomId)
chatRoute.get("/conversation/:id/messages", verifyJWT, getMessages)
chatRoute.post("/conversation/:id/messages", verifyJWT, sendMessage)


export default chatRoute;