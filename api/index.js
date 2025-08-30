import app from '../src/app.js';

// Vercel expects a function(req, res)
export default function handler(req, res) {
  return app(req, res);
}
