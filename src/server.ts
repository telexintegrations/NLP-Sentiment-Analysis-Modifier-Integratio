import express, { Request, Response, Router } from "express";
import cors from "cors";
import { analyzeSentiment } from "./analyzeSentiment";

const app = express();
const router = Router();

app.use(cors());
app.use(express.json());

interface SentimentRequest {
  message: string;
}

interface SentimentResponse {
  score: number;
}

router.post(
  "/analyze-sentiment",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ score: 0 });
      }
      const sentimentScore = await analyzeSentiment(message);
      return res.json({ score: sentimentScore });
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return res.status(500).json({ score: 0 });
    }
  }
);

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
