/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   app.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   17.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

const express = require('express');

const cardsRoutes = require('./routes/cards.routes');

const app = express();

// Middlewares
app.use(express.json());

// Routes
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

module.exports = app;

