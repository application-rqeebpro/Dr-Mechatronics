import type { IncomingMessage, ServerResponse } from 'http';
import app from '../server';

export default function handler(req: IncomingMessage & { url?: string }, res: ServerResponse) {
  // Ensure the URL matches Express route paths (/api/...)
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  return (app as any)(req, res);
}
