export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const keyExists = !!process.env.ANTHROPIC_API_KEY;
  const keyLength = process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.length : 0;
  const keyStart = process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.substring(0, 10) + '...' : 'NOT FOUND';
  
  return res.status(200).json({
    keyExists,
    keyLength,
    keyStart,
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(k => !k.includes('npm') && !k.includes('PATH')).join(', ')
  });
}
