import { OpenAI } from 'openai';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Invalid message format' });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",  // Using GPT-4 Turbo
            messages: [
                {
                    role: "system",
                    content: "You are Chaitanya GPT, a helpful AI assistant. Respond in a friendly and professional manner."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            temperature: 0.7,
            max_tokens: 1000  // Increased token limit for better responses
        });
        
        return res.status(200).json({ 
            response: completion.choices[0]?.message?.content || "I didn't get a response"
        });
        
    } catch (error) {
        console.error('OpenAI API error:', error);
        return res.status(500).json({ 
            error: error.message || 'Failed to process your request' 
        });
    }
}

export const config = {
    runtime: 'edge',
};
