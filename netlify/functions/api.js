import serverless from 'serverless-http';
import app from '../../src/app.js';

// Do NOT set basePath here. Our Express app already mounts routes with /api/*.
export const handler = serverless(app);

