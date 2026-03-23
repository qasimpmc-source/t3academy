export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, systemPrompt } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt || `You are Ollie the Owl, a friendly, encouraging AI tutor on T3 Academy. 
You help students prepare for the 11+ exam (GL Assessment) covering English, Maths, Verbal Reasoning and Non-Verbal Reasoning.
You also help medical professionals prepare for MRCP, SCE, MRCS, PLAB and MSRA exams.
Keep responses concise, warm and age-appropriate for the audience.
For 11+ students (ages 9-11): use simple language, encouragement, fun analogies and emojis.
For medical professionals: be clinical, precise and exam-focused.
Never give away answers directly — guide the student to understand the concept.
Always end with encouragement.`,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    return res.status(200).json({
      reply: data.content[0].text
    });

  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
