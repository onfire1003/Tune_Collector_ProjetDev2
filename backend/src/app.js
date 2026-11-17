/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   app.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   17.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import cardsRoutes from './routes/cards.routes.js';

export function createApp() {
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/cards', cardsRoutes);

    // Route de vérification
    app.get('/', (req, res) => {
        res.json({
            message: 'Tune Collector API fonctionne !'
        });
    });

    // Gestion des routes inexistantes
    app.use((req, res) => {
        res.status(404).json({
            error: 'Route introuvable.'
        });
    });

    // Gestion globale des erreurs
    app.use((err, req, res, next) => {
        console.error(err);

        res.status(err.statusCode || 500).json({
            error: err.message || 'Erreur interne du serveur.',
            code: err.code || 'INTERNAL_ERROR'
        });
    });

    return app;
}