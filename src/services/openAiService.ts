import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "your_openai_key";
const OPENAI_API_URL = "https://bothub.chat/api/v2/openai/v1";

interface OpenAIRequest {
  model: string;
  messages: { role: string; content: string }[];
  max_tokens?: number;
  stream?: boolean;
}

export const generateText = async (request: OpenAIRequest) => {
  try {
    const response = await axios.post(
      `${OPENAI_API_URL}/chat/completions`,
      request,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: request.stream ? "stream" : "json"
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
        console.error("Error with OpenAI API:", error.response?.data || error.message);
    } else if (error instanceof Error) {
        console.error("Unexpected error:", error.message);
    } else {
        console.error("An unknown error occurred:", error);
    }
  
    throw new Error("Failed to generate text");
  }
};
