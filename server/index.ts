import express, { Express, Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import eventRouter from "./routes/eventRoutes.ts";

const app: Express = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", eventRouter);

const uri: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your-app";
const PORT: string | number = process.env.PORT || 3000;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
})();

app.get("/health", (_req: Request, res: Response) => {
  try {
    res.status(200).send("Server is running");
  } catch (error) {
    console.error(error);
  }
});
