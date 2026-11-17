/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   cards.routes.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   17.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import express from 'express';
import * as cardsController from '../controllers/cards.controller.js';

const router = express.Router();

// Recherche
router.get('/search', cardsController.searchCards);

// Albums d'un artiste
router.get('/artist/:id/albums', cardsController.getArtistAlbums);

// Titres d'un album
router.get('/album/:id/tracks', cardsController.getAlbumTracks);

// Récupération par identifiant
router.get('/:type/:id', cardsController.getCardById);

export default router;