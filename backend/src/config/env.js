import 'dotenv/config';
import crypto from 'node:crypto';

const isProd = process.env.NODE_ENV === 'production';

let tokenSecret = process.env.TOKEN_SECRET;
if (!tokenSecret) {
    if (isProd) throw new Error('TOKEN_SECRET manquant dans backend/.env');
    // En dev seulement : secret aléatoire, les sessions sont perdues à chaque redémarrage
    tokenSecret = crypto.randomBytes(32).toString('hex');
    console.warn('[env] TOKEN_SECRET absent de backend/.env : secret temporaire généré.');
}

export const env = {
    port: Number(process.env.PORT) || 3000,
    tokenSecret,
    isProd,
};
