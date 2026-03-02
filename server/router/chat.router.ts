import { Router } from 'express';
import { ConversationCreate, getAllDataFromRoomId, getMessages, sendMessage, progressToConfirmation , getAllChatsFromUser } from '../controller/chat.controller.js';
import {verifyJWT} from '../middleware/auth.middleware.js'

const chatRoute = Router();

chatRoute.post("/conversationCreate", verifyJWT, ConversationCreate); // private
chatRoute.get("/conversation/:id", verifyJWT, getAllDataFromRoomId)
chatRoute.get("/conversation/:id/messages", verifyJWT, getMessages)
chatRoute.post("/conversation/:id/messages", verifyJWT, sendMessage)
chatRoute.patch("/conversation/:id/adoption", verifyJWT, progressToConfirmation )
chatRoute.get("/allConversation", verifyJWT, getAllChatsFromUser)


export default chatRoute;