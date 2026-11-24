import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const hash = await scrypt(password, salt, KEY_LENGTH);
    return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

// Compare en temps constant pour ne rien révéler via le temps de réponse
export async function verifyPassword(password, stored) {
    const [algo, saltB64, hashB64] = String(stored).split('$');
    if (algo !== 'scrypt' || !saltB64 || !hashB64) return false;

    const expected = Buffer.from(hashB64, 'base64');
    if (expected.length !== KEY_LENGTH) return false;

    const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), KEY_LENGTH);
    return crypto.timingSafeEqual(actual, expected);
}

// Hash factice : quand le pseudo n'existe pas, on vérifie quand même un mot de passe
// pour que la réponse prenne le même temps (sinon on peut deviner les pseudos existants)
export const DUMMY_HASH = hashPassword(crypto.randomUUID());
