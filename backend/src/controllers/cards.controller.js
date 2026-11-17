/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   cards.controller.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   17.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import * as cardsService from '../services/cards.service.js';

/**
 * Recherche des artistes, albums ou titres.
 */
export async function searchCards(req, res, next) {
    try {
        const { type, q, limit } = req.query;

        const result = await cardsService.searchCards(
            type,
            q,
            limit
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * Récupère une carte par son ID Deezer.
 */
export async function getCardById(req, res, next) {
    try {
        const { type, id } = req.params;

        const result = await cardsService.getCardById(type, id);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * Récupère les albums d'un artiste.
 */
export async function getArtistAlbums(req, res, next) {
    try {
        const { id } = req.params;
        const { limit } = req.query;

        const result = await cardsService.getArtistAlbums(id, limit);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

/**
 * Récupère les titres d'un album.
 */
export async function getAlbumTracks(req, res, next) {
    try {
        const { id } = req.params;
        const { limit } = req.query;

        const result = await cardsService.getAlbumTracks(id, limit);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}
