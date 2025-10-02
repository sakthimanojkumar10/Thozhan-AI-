import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateStudyContentStream(
  topic: string,
  language: string,
  subject: string,
  contentType: string
) {
  const model = 'gemini-2.5-flash';
  
  let prompt = `
    You are Thozhan AI, an expert educational assistant.
    Your task is to generate content for a student based on the following parameters:

    - Subject: ${subject}
    - Topic: ${topic}
    - Language: ${language}
    - Desired Content Type: ${contentType}

    Please provide a clear, accurate, and engaging response in the specified language.
    Format your response using Markdown for better readability (e.g., use headings, bullet points, bold text).
  `;

  if (contentType === "Practice Questions") {
    prompt += `
      
      Generate exactly 5 multiple-choice questions.
      IMPORTANT: STRICTLY follow this format for EACH question:
      Q[number]: [The question text]
      A) [Option A]
      B) [Option B]
      C) [Option C]
      D) [Option D]
      Answer: [Correct option letter, e.g., A]
      
      Do not add any other text, explanations, or formatting before, between, or after the questions.
    `;
  }


  try {
    const response = await ai.models.generateContentStream({
      model,
      contents: prompt,
    });
    return response;
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw new Error("Failed to get response from AI. Please try again.");
  }
}