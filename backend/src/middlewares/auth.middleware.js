import { verifyToken } from '../utils/token.js';

export const AUTH_COOKIE = 'tc_session';

export function readCookie(req, name) {
    const header = req.headers.cookie;
    if (!header) return null;
    for (const part of header.split(';')) {
        const i = part.indexOf('=');
        if (i === -1 || part.slice(0, i).trim() !== name) continue;
        try {
            return decodeURIComponent(part.slice(i + 1).trim());
        } catch {
            return null;
        }
    }
    return null;
}

// À mettre sur toute route qui demande d'être connecté : ajoute req.user
export function requireAuth(req, res, next) {
    const payload = verifyToken(readCookie(req, AUTH_COOKIE));
    if (!payload) return res.status(401).json({ error: 'Non connecté.' });
    req.user = { id: payload.sub, username: payload.username };
    next();
}
