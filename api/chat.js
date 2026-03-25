module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY || 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;

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
        model: 'claude-sonnet-4-5',
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
      reply: '🦉 Exact error: ' + error.message + ' | type: ' + error.constructor.name
    });
  }
}
