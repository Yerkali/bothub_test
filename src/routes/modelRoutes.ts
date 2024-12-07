import express, { Request, Response } from "express";

import { authenticateToken } from "../middlewares/authMiddleware";
import { deductTokens } from "../services/billingService";
import { generateText } from "../services/openAiService";
import { calculateTokenCost } from "../services/tokenService";

const router = express.Router();

router.post("/generate", authenticateToken, async (req: Request, res: Response): Promise<void> =>  {
  const { model, messages, max_tokens } = req.body;
  const userId = req.user!.id;

  if (!model || !messages) {
    res.status(400).json({ error: "Model and messages are required" });
    return;
  }

  const tokenCost = calculateTokenCost(model, max_tokens);

  try {
    await deductTokens(userId, tokenCost);
    const result = await generateText({ model, messages, max_tokens });
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message });
    } else {
        res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

router.post("/stream", authenticateToken, async (req: Request, res: Response): Promise<void>  => {
  const { model, messages, max_tokens } = req.body;
  const userId = req.user!.id;

  if (!model || !messages) {
    res.status(400).json({ error: "Model and messages are required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const tokenCost = calculateTokenCost(model, max_tokens);

  try {
    await deductTokens(userId, tokenCost);
    const stream = await generateText({ model, messages, max_tokens, stream: true });

    stream.on("data", (chunk: Buffer) => {
      res.write(`data: ${chunk.toString()}\n\n`);
    });

    stream.on("end", () => {
      res.end();
    });

    stream.on("error", (error: any) => {
      console.error("Stream error:", error);
      res.end("data: {\"error\":\"Stream failed\"}\n\n");
    });
  } catch (error) {
    console.error("Error while processing stream:", error);
    res.status(500).json({ error: "Failed to process stream" });
  }
});


export default router;
