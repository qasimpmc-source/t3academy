export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, systemPrompt } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ reply: '🦉 Ollie is not set up yet — the API key is missing from Vercel settings.' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: systemPrompt || `You are Ollie the Owl, a warm friendly AI tutor helping children aged 9-11 prepare for the 11+ GL Assessment exam. Be encouraging, use simple language, never give away answers directly — guide understanding instead. Keep responses to 3-4 sentences max.`,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic error:', JSON.stringify(data));
      return res.status(200).json({ reply: '🦉 I had a little hiccup! Try asking me again.' });
    }

    return res.status(200).json({ reply: data.content[0].text });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(200).json({ reply: '🦉 Oops, something went wrong. Try again in a moment!' });
  }
}
