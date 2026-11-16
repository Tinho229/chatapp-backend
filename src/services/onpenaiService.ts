import OpenAI from "openai";
import { openaiKey } from "../config/IA/config";

const openai = new OpenAI({
    apiKey: openaiKey
});

export const generateDailyQuestion = async (): Promise<string> => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'user',
                    content: "Generate a fun and engaging daily question for a chat conversation."
                }
            ],
            max_tokens: 50
        });
        console.log(response.choices[0]?.message?.content);

        return response.choices[0]?.message.content?.trim() || "Here is a random question : what's your favorite book?";
    } catch (error) {
        console.error('Error generating daily question', error);
        return "Here is a random question : what's your favorite book?";
    }
}