import express from "express";
import mongoose from "mongoose";

import routers from "./routers";
import { generateFakeData } from "./faker";

const PORT = 3000;

async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    mongoose.set("debug", true);
    console.log("Connected to MongoDB");
    // generateFakeData(10, 5, 1);
    const app = express();

    app.use(express.json());

    app.use("/", routers);

    app.listen(PORT, () => {
      console.log(`Server is Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
