import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import getSummary from "./utils/getSummary.js";

interface Obj {
  data: {
    body: string;
  };
}

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/:threadId", async (req: Request, res: Response) => {
  try {
    const { threadId } = req.params;

    console.log("in get route");
    
    const auth = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "redinsight/1.0.0", // Add your app name here
      },
      body: "grant_type=client_credentials",
    });
    
    const { access_token } = await auth.json();
    
    const response = await fetch(
      `https://oauth.reddit.com/comments/${threadId}`, // Use oauth.reddit.com for authenticated requests
      {
        headers: { 
          Authorization: `Bearer ${access_token}`,
          "User-Agent": "redinsight/1.0.0", // Must match the one above
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const title = data[0].data.children[0].data.title;
    const comments = data[1].data.children.map((obj: Obj) => obj.data.body);
    const summary = await getSummary(title, comments);
    
    res.status(200).json({ summary: summary });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to fetch Reddit data" });
  }
});

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
