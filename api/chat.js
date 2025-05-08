import { OpenAI } from 'openai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI assistant. Respond in a friendly and professional manner."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7
        });
        
        return res.status(200).json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return res.status(500).json({ error: error.message });
    }
}

export const config = {
    runtime: 'edge', // Optional: can use 'nodejs' if preferred
};
