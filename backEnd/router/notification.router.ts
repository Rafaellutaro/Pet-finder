import { Router } from 'express';
import { getUnread, getAllNotifications, setIsRead } from '../controller/notification.controller.ts';
import {verifyJWT} from '../middleware/auth.middleware.ts'

const notificationRoute = Router();

notificationRoute.get("/unread", verifyJWT, getUnread)
notificationRoute.get("/all", verifyJWT, getAllNotifications)
notificationRoute.put("/:id/setAsRead", verifyJWT, setIsRead)


export default notificationRoute;