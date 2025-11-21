import express from "express";
import userRoute from "./router/user.router.ts"
import cookieParser from 'cookie-parser'
import cors from 'cors';
// import bookRoute from "../src/routes/book.router";
import * as dotenv from 'dotenv';

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
// app.use("/books", bookRoute)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})