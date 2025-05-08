// If you’re on the current OpenAI Node SDK (v4+), use the default import:
import OpenAI from 'openai';            // ← preferred

// If your project is still on an older version that expects a named import,
// keep the original:  import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',           // ← updated model
      messages: [
        {
          role: 'system',
          content:
            'You are Chaitanya GPT, a helpful AI assistant. Respond in a friendly and professional manner. Your replies should be concise yet informative.',
        },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });

    return res
      .status(200)
      .json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  runtime: 'edge',
};
