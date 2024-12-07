import express, { Request, Response } from "express";
import { isAdmin } from "../middlewares/authMiddleware";
import { authenticateToken } from '../middlewares/authMiddleware';
import { addTokens } from "../services/billingService";

const router = express.Router();

router.post("/add-balance", authenticateToken, isAdmin, async (req: Request, res: Response) => {
  const { userId, amount } = req.body;

  try {
    const newBalance = await addTokens(userId, amount);
    res.status(200).json({ balance: newBalance });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).json({ error: errMessage });
  }
});

export default router;
