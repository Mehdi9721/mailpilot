import express from 'express';
import cors from 'cors';

import emailRoutes from './api/routes/email.routes';
import googleRoutes from './api/routes/google.routes';
import gmailRoutes from './api/routes/gmail.routes';
import categoryRuleRoutes from './api/routes/category-rule.routes';
import logRoutes from './api/routes/log.routes';
import { startEmailScheduler } from './workers/email-scheduler.worker';

const app = express();
startEmailScheduler();
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(
  cors({
    origin: 'http://localhost:5173', // Vite frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());

app.use('/auth/google', googleRoutes);
app.use('/api/category-rules', categoryRuleRoutes);
app.use('/api/logs', logRoutes);
app.use(express.json());
app.use('/api/gmail', gmailRoutes);
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true
  });
});

app.use('/api/emails', emailRoutes);

export default app;