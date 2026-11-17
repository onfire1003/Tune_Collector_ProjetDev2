/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   cards.service.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   17.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import * as deezerService from './deezer.service.js';


/**
 * Retourne la première image valide.
 */
function getValidImage(...images) {
    return images.find(image => {
        if (typeof image !== 'string' || !image.trim()) {
            return false;
        }

        return !/\/(artist|cover)\/\//.test(image);
    }) ?? null;
}


/**
 * Transforme une ressource Deezer en carte Tune Collector.
 * context permet de compléter les informations manquantes.
 */
export function formatCard(item, type, context = {}) {
    const artistName =
        type === 'artist'
            ? item.name
            : item.artist?.name ?? context.artist ?? null;

    let image = null;

    if (type === 'artist') {
        image = getValidImage(
            item.picture_xl,
            item.picture_big,
            item.picture_medium
        );
    } else {
        image = getValidImage(
            item.cover_xl,
            item.cover_big,
            item.album?.cover_xl,
            item.album?.cover_big,
            context.image,
            item.picture_xl
        );
    }

    let popularity = null;

    if (type === 'artist') {
        popularity = item.nb_fan ?? null;
    } else if (type === 'album') {
        popularity = item.fans ?? null;
    } else if (type === 'track') {
        popularity = item.rank ?? null;
    }

    return {
        deezerId: item.id,
        type,
        title: item.title ?? item.name,
        artist: artistName,
        image,
        releaseDate:
            item.release_date ??
            item.album?.release_date ??
            context.releaseDate ??
            null,
        deezerUrl: item.link ?? null,
        popularity
    };
}


/**
 * Recherche des cartes sur Deezer.
 */
export async function searchCards(type, query, limit) {
    const result = await deezerService.search(type, query, limit);

    return {
        type: result.type,
        query: result.query,
        total: result.total,
        cards: result.data.map(item => formatCard(item, type))
    };
}


/**
 * Récupère une carte précise avec son identifiant Deezer.
 */
export async function getCardById(type, id) {
    const item = await deezerService.getById(type, id);

    return formatCard(item, type);
}


/**
 * Récupère les albums d'un artiste.
 */
export async function getArtistAlbums(id, limit) {
    const [artist, result] = await Promise.all([
        deezerService.getById('artist', id),
        deezerService.getArtistAlbums(id, limit)
    ]);

    return {
        artistId: Number(id),
        total: result.total ?? result.data?.length ?? 0,
        cards: (result.data ?? []).map(item =>
            formatCard(item, 'album', {
                artist: artist.name
            })
        )
    };
}


/**
 * Récupère les titres d'un album.
 */
export async function getAlbumTracks(id, limit) {
    const [album, result] = await Promise.all([
        deezerService.getById('album', id),
        deezerService.getAlbumTracks(id, limit)
    ]);

    return {
        albumId: Number(id),
        total: result.total ?? result.data?.length ?? 0,
        cards: (result.data ?? []).map(item =>
            formatCard(item, 'track', {
                artist: album.artist?.name ?? null,
                image: album.cover_xl ?? album.cover_big ?? null,
                releaseDate: album.release_date ?? null
            })
        )
    };
}
