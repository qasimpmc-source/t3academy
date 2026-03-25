module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET request — show diagnostic info
  if (req.method === 'GET') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    return res.status(200).json({
      status: 'ok',
      keyFound: !!apiKey,
      keyPreview: apiKey ? apiKey.substring(0, 15) + '...' : 'NOT FOUND',
      nodeVersion: process.version,
      env: process.env.NODE_ENV
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      reply: '🦉 API key missing — check Vercel environment variables.'
    });
  }

  try {
    const { messages, systemPrompt } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: systemPrompt || 'You are Ollie the Owl, a friendly AI tutor helping children aged 9-11 prepare for the 11+ exam. Be warm and encouraging. Keep responses to 3-4 sentences.',
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        reply: '🦉 API error: ' + (data.error?.message || JSON.stringify(data))
      });
    }

    return res.status(200).json({ reply: data.content[0].text });

  } catch (error) {
    return res.status(200).json({
      reply: '🦉 Error: ' + error.message
    });
  }
}
