import express from "express";
import userRoute from "./router/user.router.ts"
import cookieParser from 'cookie-parser'
import cors from 'cors';
import petRoute from "../backEnd/router/pet.router.ts";
import * as dotenv from 'dotenv';
import chatRoute from "../backEnd/router/chat.router.ts";
import notificationRoute from "../backEnd/router/notification.router.ts";
import { Server } from "socket.io";
import { createServer } from 'node:http';
import { verifySocketJWT } from "./middleware/auth.middleware.ts";
import type { AuthSocket } from "./middleware/auth.middleware.ts";
import Prisma from "./client/PrismaClient.ts";
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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
io.use(verifySocketJWT)

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
})

io.on("connection", (socket: AuthSocket) => {
  console.log("a user connected", socket.id);
  const userId = socket.user.userId

  socket.join(`user:${userId}`);

  socket.on("conversation:join", async ({ conversationId }) => {
    console.log("join request", conversationId);

    const verify = await Prisma.conversation.findUnique({
      where: {
        id: Number(conversationId)
      },
      select: {
        ownerId: true,
        adopterId: true,
      }
    })

    if (!verify) return

    const allowed = verify.adopterId == userId || verify.ownerId == userId

    if (!allowed) return

    // later: verify user is in conversation
    socket.join(`conversation:${conversationId}`);
  });

  socket.on("conversation:leave", ({ conversationId }) => {
    console.log("leaving conversation ", conversationId)
    socket.leave(`conversation:${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

export { io };