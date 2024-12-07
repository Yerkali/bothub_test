import express, { Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import adminRoutes from './routes/adminRoutes'
import authRoutes from "./routes/authRoutes";
import modelRoutes from "./routes/modelRoutes";
import swaggerDocument from "./swagger.json";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/models", modelRoutes);

// Routes placeholder
app.get("/", (req: Request, res: Response) => {
    res.send("API is running!");
});

// Export app
export default app;
