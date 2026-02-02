import { Router } from 'express';
import { ConversationCreate } from '../controller/chat.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const chatRoute = Router();

chatRoute.post("/conversationCreate", verifyJWT, ConversationCreate); // private


export default chatRoute;