import express from "express";
import cors from "cors";
import bfhlRoutes from "./routes/bfhlRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/bfhl", bfhlRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
