/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   deezer.service.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   17.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

const deezerConfig = require('../config/deezer.config');

// Types de ressources autorisés
const ALLOWED_TYPES = ['artist', 'album', 'track'];

/**
 * Erreur spécifique aux appels à Deezer.
 */
class DeezerApiError extends Error {
    constructor(message, statusCode = 502, code = 'DEEZER_ERROR') {
        super(message);
        this.name = 'DeezerApiError';
        this.statusCode = statusCode;
        this.code = code;
    }
}

/**
 * Vérifie le type de ressource.
 */
function validateType(type) {
    if (!ALLOWED_TYPES.includes(type)) {
        throw new DeezerApiError(
            'Type de ressource Deezer invalide.',
            400,
            'INVALID_TYPE'
        );
    }
}

/**
 * Vérifie un identifiant Deezer.
 */
function validateId(id) {
    if (!/^\d+$/.test(String(id))) {
        throw new DeezerApiError(
            'Identifiant Deezer invalide.',
            400,
            'INVALID_ID'
        );
    }
}

function validateLimit(limit) {
    const parsedLimit = Number(limit);

    if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > deezerConfig.maxLimit
    ) {
        throw new DeezerApiError(
            'Limite de résultats invalide.',
            400,
            'INVALID_LIMIT'
        );
    }

    return parsedLimit;
}

/**
 * Effectue une requête HTTP vers Deezer.
 */
async function request(path, params = {}) {
    const url = new URL(path, deezerConfig.baseUrl);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
        }
    });

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(deezerConfig.timeout)
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            throw new DeezerApiError(
                result.error?.message || 'Erreur retournée par Deezer.',
                502,
                result.error?.type || 'DEEZER_API_ERROR'
            );
        }

        return result;

    } catch (error) {
        if (error instanceof DeezerApiError) {
            throw error;
        }

        if (error.name === 'TimeoutError' ||
            error.name === 'AbortError') {
            throw new DeezerApiError(
                'Le délai de réponse de Deezer est dépassé.',
                504,
                'DEEZER_TIMEOUT'
            );
        }

        throw new DeezerApiError(
            'Impossible de contacter l’API Deezer.',
            502,
            'DEEZER_UNAVAILABLE'
        );
    }
}

/**
 * Recherche un artiste, un album ou un titre.
 */
async function search(type, query, limit = deezerConfig.defaultLimit) {
    validateType(type);

    if (typeof query !== 'string' || !query.trim()) {
        throw new DeezerApiError(
            'Le terme de recherche est obligatoire.',
            400,
            'INVALID_QUERY'
        );
    }

    const parsedLimit = validateLimit(limit);

    if (!Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > deezerConfig.maxLimit) {
        throw new DeezerApiError(
            `La limite doit être comprise entre 1 et ${deezerConfig.maxLimit}.`,
            400,
            'INVALID_LIMIT'
        );
    }

    const result = await request(`/search/${type}`, {
        q: query.trim(),
        limit: parsedLimit
    });

    return {
        type,
        query: query.trim(),
        total: result.total ?? result.data?.length ?? 0,
        data: result.data ?? []
    };
}

/**
 * Récupère les détails d'un artiste, album ou titre par son ID.
 */
async function getById(type, id) {
    validateType(type);
    validateId(id);

    return request(`/${type}/${id}`);
}

/**
 * Récupère les albums d'un artiste.
 */
async function getArtistAlbums(id, limit = deezerConfig.defaultLimit) {
    validateId(id);

    return request(`/artist/${id}/albums`, {
        limit: validateLimit(limit)
    });
}

/**
 * Récupère les titres d'un album.
 */
async function getAlbumTracks(id, limit = deezerConfig.defaultLimit) {
    validateId(id);

    return request(`/album/${id}/tracks`, {
        limit: validateLimit(limit)
    });
}

module.exports = {
    search,
    getById,
    getArtistAlbums,
    getAlbumTracks,
    DeezerApiError
};

