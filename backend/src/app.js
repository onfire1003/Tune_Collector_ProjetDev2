import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

export function createApp() {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(express.json({ limit: '10kb' }));
    app.use('/api/auth', authRoutes);
    return app;
}
