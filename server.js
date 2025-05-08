require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your frontend files

// Initialize OpenAI with your API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
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
        
        res.json({ response: completion.choices[0].message.content });
    } catch (error) {
        console.error('OpenAI API error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
