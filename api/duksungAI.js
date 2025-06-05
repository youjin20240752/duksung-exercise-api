import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export default async function handler(req, res) {
  const allowedOrigin = "https://youjin20240752.github.io"
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if(req.method === "OPTIONS"){
    return res.status(200).end();
  }

  const { age, weight, weather } = req.body;
   if (!age || !weight || !weather) {
     return res.status(400).json({error:"나이(age), 몸무게(weight) 그리고 날씨(weather)가 필요합니다."});
   }
//  const name = "하윤종"
//  const birth = "1983-05-15"

  try {
    const today = new Date().toISOString().slice(0, 10);
    const prompt = `
    나이: ${age}
    몸무게: ${weight}
    오늘 날씨: ${weather}

    이 사람의 나이와 몸무게에 맞는 운동법을 오늘의 날씨와 비교해서 알려줘.
    `;

    const result = await ai.models.generateContent({
      model : "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 50년 경력의 헬스 트레이너입니다. 사람들에게 각자 맞는 운동법을 200자 이내로 소개해주세요. 어렵고 복잡하게 나열하기보다는 읽었을 때 쉽게 따라할 수 있도록 간단하게 설명해야 합니다. 마지막에는 힘내라는 짧은 격언을 덧붙여 주세요.",
      },
    });

    res.status(200).json({answer: result.text});
  } catch(err) {
    console.log(err);
    res.status(500).json({error: "Gemini API 오류 발생"});
  }
}