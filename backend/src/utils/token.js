import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const TOKEN_TTL_SECONDS = 2 * 60 * 60; // 2 h

export function signToken(user) {
    return jwt.sign({ sub: user.id, username: user.username }, env.tokenSecret, {
        algorithm: 'HS256',
        expiresIn: TOKEN_TTL_SECONDS,
    });
}

// Renvoie le contenu du token, ou null s'il est absent, falsifié ou expiré
export function verifyToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, env.tokenSecret, { algorithms: ['HS256'] });
    } catch {
        return null;
    }
}
