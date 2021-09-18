import express from "express";
import mongoose from "mongoose";

import routers from "./routers";
import { generateFakeData } from "./faker2";

const PORT = 3000;

async function bootstrap() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    mongoose.set("debug", true);
    console.log("Connected to MongoDB");
    const app = express();

    app.use(express.json());

    app.use("/", routers);

    app.listen(PORT, async () => {
      // for (let i = 0; i < 20; i++) {
      // await generateFakeData(10, 5, 15);
      // }
      console.log(`Server is Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
