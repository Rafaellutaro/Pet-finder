import express from "express";
import userRoute from "./router/user.router.js"
import cookieParser from 'cookie-parser'
import cors from 'cors';
import petRoute from "./router/pet.router.js";
import * as dotenv from 'dotenv';
import chatRoute from "./router/chat.router.js";
import notificationRoute from "./router/notification.router.js";
import { Server } from "socket.io";
import { createServer } from 'node:http';
import { verifySocketJWT } from "./middleware/auth.middleware.js";
import type { AuthSocket } from "./middleware/auth.middleware.js";
import Prisma from "./client/PrismaClient.js";
import adoptionRouter from "./router/adoption.router.js";
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (origin == "http://localhost:5173" || origin == process.env.CLIENT_URL || origin.endsWith(".vercel.app")) return callback(null, true);

      callback(new Error("Not allowed by CORS"))
    },
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (origin == "http://localhost:5173" || origin == process.env.CLIENT_URL || origin.endsWith(".vercel.app")) return callback(null, true);

      callback(new Error("Not allowed by CORS"))
    },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options("*", cors());

app.get("/bob", (req, res) => {
  res.json({ message: "bob sponja" }).status(200);
})

app.use("/users", userRoute)
app.use("/pets", petRoute)
app.use("/chat", chatRoute)
app.use("/notifications", notificationRoute)
app.use("/adoption", adoptionRouter)
io.use(verifySocketJWT)

server.listen(process.env.PORT ? Number(process.env.PORT) : 3000)

export const conversationPresence = new Map<number, Set<number>>();

export function isUserInConversation(conversationId: number, userId: number) {
  return conversationPresence.get(conversationId)?.has(userId) ?? false;
}

io.on("connection", (socket: AuthSocket) => {
  console.log("a user connected", socket.id);
  const userId = socket.user.userId

  socket.join(`user:${userId}`);

  socket.on("conversation:join", async ({ conversationId }) => {
    console.log("join request", conversationId);
    const convId = Number(conversationId)

    const verify = await Prisma.conversation.findUnique({
      where: {
        id: convId
      },
      select: {
        ownerId: true,
        adopterId: true,
      }
    })

    if (!verify) return

    const allowed = verify.adopterId == userId || verify.ownerId == userId

    if (!allowed) return

    socket.join(`conversation:${conversationId}`);

    let users = conversationPresence.get(convId);
    if (!users) {
      users = new Set<number>();
      conversationPresence.set(convId, users);
    }
    users.add(userId);
    console.log("join", "users", users, "presence", conversationPresence)
  });

  socket.on("conversation:leave", ({ conversationId }) => {
    const convId = Number(conversationId)
    console.log("leaving conversation ", convId)
    socket.leave(`conversation:${convId}`);

    const users = conversationPresence.get(convId);
    users?.delete(userId);
    if (users?.size == 0) conversationPresence.delete(convId);
    console.log("leave", "users", users, "presence", conversationPresence)
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

    for (const [convId, users] of conversationPresence) {
      console.log("disconnect", "users", users, "presence", conversationPresence)
      users.delete(userId);
      if (users.size == 0) conversationPresence.delete(convId);
    }
  });
});

export { io };