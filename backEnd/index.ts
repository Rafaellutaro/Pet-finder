import express from "express";
import userRoute from "./router/user.router.ts"
import cookieParser from 'cookie-parser'
import cors from 'cors';
import petRoute from "../backEnd/router/pet.router.ts";
import * as dotenv from 'dotenv';
import chatRoute from "../backEnd/router/chat.router.ts";

dotenv.config();

const app = express();

const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));

app.get("/bob", (req, res) => {
    res.json({message: "bob sponja"}).status(200);
})

app.use("/users", userRoute)
app.use("/pets", petRoute)
app.use("/chat", chatRoute)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})