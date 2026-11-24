
/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   cards.service.js
author              :   Joel Cunha Faria
creation date       :   17.11.2026
modification date   :   24.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import * as deezerService from './deezer.service.js';
import * as cardsRepository from '../repositories/cards.repository.js';


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
 * Recherche des cartes sur Deezer et les enregistre.
 */
export async function searchCards(type, query, limit) {
    const result = await deezerService.search(type, query, limit);

    // Transformation des résultats en cartes
    const cards = result.data.map(item => formatCard(item, type));

    // Enregistrement des cartes dans le fichier JSON
    await Promise.all(
        cards.map(card => cardsRepository.save(card))
    );

    return {
        type: result.type,
        query: result.query,
        total: result.total,
        cards
    };
}


/**
 * Récupère une carte précise avec son identifiant Deezer.
 */
export async function getCardById(type, id) {

    // Recherche de la carte dans le fichier JSON
    const cachedCard = await cardsRepository.getByDeezerId(id, type);

    // Durée de validité du cache : 24 heures en millisecondes
    const cacheDuration = 24 * 60 * 60 * 1000;

    if (cachedCard) {

        // Calcul du temps écoulé depuis la dernière actualisation
        const lastUpdate = new Date(cachedCard.updatedAt).getTime();
        const now = Date.now();

        // Vérification si les données ont moins de 24 heures
        const isCacheValid = now - lastUpdate < cacheDuration;

        if (isCacheValid) {
            // Les données sont encore valides : on utilise le cache
            return cachedCard;
        }
    }

    // Carte absente ou cache expiré : récupération depuis Deezer
    const item = await deezerService.getById(type, id);

    // Conversion des données Deezer au format de notre application
    const card = formatCard(item, type);

    // Enregistrement ou actualisation de la carte
    return cardsRepository.save(card);
}


/**
 * Récupère les albums d'un artiste.
 */
export async function getArtistAlbums(id, limit) {
    const [artist, result] = await Promise.all([
        deezerService.getById('artist', id),
        deezerService.getArtistAlbums(id, limit)
    ]);

    // Création de la carte de l'artiste
    const artistCard = formatCard(artist, 'artist');

    // Création des cartes des albums
    const cards = (result.data ?? []).map(item =>
        formatCard(item, 'album', {
            artist: artist.name
        })
    );

    // Sauvegarde de l'artiste et de ses albums
    await Promise.all([
        cardsRepository.save(artistCard),
        ...cards.map(card => cardsRepository.save(card))
    ]);

    return {
        artistId: Number(id),
        total: result.total ?? result.data?.length ?? 0,
        cards
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

    // Création de la carte de l'album
    const albumCard = formatCard(album, 'album');

    // Création des cartes des titres
    const cards = (result.data ?? []).map(item =>
        formatCard(item, 'track', {
            artist: album.artist?.name ?? null,
            image: album.cover_xl ?? album.cover_big ?? null,
            releaseDate: album.release_date ?? null
        })
    );

    // Sauvegarde de l'album et de ses titres
    await Promise.all([
        cardsRepository.save(albumCard),
        ...cards.map(card => cardsRepository.save(card))
    ]);

    return {
        albumId: Number(id),
        total: result.total ?? result.data?.length ?? 0,
        cards
    };
}
