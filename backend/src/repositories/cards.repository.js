/*
-----------------------------------------------------------------------------------------------------------------------
file name           :   cards.repository.js
author              :   Joel Cunha Faria
creation date       :   24.11.2026
modification date   :   24.11.2026
-----------------------------------------------------------------------------------------------------------------------
*/

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Récupération du chemin du dossier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier cards.json
const cardsFilePath = path.resolve(__dirname, '../../data/cards.json');
// File d'attente pour éviter les écritures simultanées
let writeQueue = Promise.resolve();

/**
 * Lit les cartes enregistrées dans le fichier JSON.
 */
export async function getAll() {
    try {
        const data = await fs.readFile(cardsFilePath, 'utf-8');
        return JSON.parse(data);

    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(cardsFilePath, '[]', 'utf-8');
            return [];
        }

        throw error;
    }
}


/**
 * Enregistre une carte ou actualise une carte existante.
 * Les écritures sont exécutées les unes après les autres.
 */
export async function save(card) {

    // Création d'une opération dans la file d'attente
    const operation = writeQueue.then(async () => {

        // Ajout de la date de dernière actualisation
        const cardToSave = {
            ...card,
            updatedAt: new Date().toISOString()
        };

        const cards = await getAll();

        const existingIndex = cards.findIndex(
            existing =>
                existing.deezerId === cardToSave.deezerId &&
                existing.type === cardToSave.type
        );

        if (existingIndex !== -1) {

            // La carte existe déjà : on actualise ses données
            cards[existingIndex] = {
                ...cards[existingIndex],
                ...cardToSave
            };

        } else {

            // La carte n'existe pas : on l'ajoute
            cards.push(cardToSave);
        }

        // Écriture des données dans le fichier JSON
        await fs.writeFile(
            cardsFilePath,
            JSON.stringify(cards, null, 4),
            'utf-8'
        );

        return cards.find(
            existing =>
                existing.deezerId === cardToSave.deezerId &&
                existing.type === cardToSave.type
        );
    });

    // Permet de continuer la file même si une écriture échoue
    writeQueue = operation.catch(() => {});

    return operation;
}


/**
 * Recherche une carte avec son identifiant Deezer et son type.
 */
export async function getByDeezerId(deezerId, type) {
    const cards = await getAll();

    return cards.find(
        card =>
            card.deezerId === Number(deezerId) &&
            card.type === type
    ) ?? null;
}