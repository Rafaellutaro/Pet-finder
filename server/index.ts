import express from "express";
import userRoute from "./router/user.router.ts"
import cookieParser from 'cookie-parser'
import cors from 'cors';
import petRoute from "./router/pet.router.ts";
import * as dotenv from 'dotenv';
import chatRoute from "./router/chat.router.ts";
import notificationRoute from "./router/notification.router.ts";
import { Server } from "socket.io";
import { createServer } from 'node:http';
import { verifySocketJWT } from "./middleware/auth.middleware.ts";
import type { AuthSocket } from "./middleware/auth.middleware.ts";
import Prisma from "./client/PrismaClient.ts";
import adoptionRouter from "./router/adoption.router.ts";
dotenv.config();

const app = express();
const server = createServer(app);
const port = 3000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.get("/bob", (req, res) => {
  res.json({ message: "bob sponja" }).status(200);
})

app.use("/users", userRoute)
app.use("/pets", petRoute)
app.use("/chat", chatRoute)
app.use("/notifications", notificationRoute)
app.use("/adoption", adoptionRouter)
io.use(verifySocketJWT)

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
})

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