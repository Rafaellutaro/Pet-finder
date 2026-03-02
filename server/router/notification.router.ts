import { Router } from 'express';
import { getUnread, getAllNotifications, setIsRead, setAllIsRead } from '../controller/notification.controller.js';
import {verifyJWT} from '../middleware/auth.middleware.js'

const notificationRoute = Router();

notificationRoute.get("/unread", verifyJWT, getUnread)
notificationRoute.get("/all", verifyJWT, getAllNotifications)
notificationRoute.put("/:id/setAsRead", verifyJWT, setIsRead)
notificationRoute.put("/setAllAsRead", verifyJWT, setAllIsRead)


export default notificationRoute;