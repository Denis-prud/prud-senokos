export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, history } = req.body;

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'Ты помощник пруда Сенокосовский. Отвечай кратко, по-русски, по делу.' },
                    ...(history || []).map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    { role: 'user', content: message }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ response: data.choices[0].message.content });
    } catch (error) {
        console.error('DeepSeek API error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
