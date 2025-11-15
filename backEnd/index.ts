import express from "express";
import userRoute from "./router/user.router.ts"
// import bookRoute from "../src/routes/book.router";
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

const port = 3000;

app.use(express.json());

app.get("/bob", (req, res) => {
    res.json({message: "bob sponja"}).status(200);
})

app.use("/users", userRoute)
// app.use("/books", bookRoute)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})