import crypto from 'node:crypto';
import { Router } from 'express';
import { readUsers, saveUsers } from '../repositories/users.repository.js';
import { hashPassword, verifyPassword, DUMMY_HASH } from '../utils/password.js';
import { signToken, TOKEN_TTL_SECONDS } from '../utils/token.js';
import { createLoginLimiter } from '../utils/login-limiter.js';
import { AUTH_COOKIE, requireAuth } from '../middlewares/auth.middleware.js';
import { env } from '../config/env.js';

const router = Router();
const loginLimiter = createLoginLimiter();

const USERNAME_RE = /^[\p{L}\p{N}_.-]{3,20}$/u;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

// Cookie httpOnly : le JavaScript de la page ne peut pas lire le token (protège contre le XSS).
// SameSite=Strict : le cookie n'est pas envoyé depuis un autre site (protège contre le CSRF).
const cookieBase = { httpOnly: true, sameSite: 'strict', secure: env.isProd, path: '/api' };

router.post('/register', async (req, res) => {
    const { username, password } = req.body ?? {};

    const fields = {};
    if (typeof username !== 'string' || !USERNAME_RE.test(username.trim()))
        fields.username = '3 à 20 caractères : lettres, chiffres, _ - ou .';
    if (typeof password !== 'string' || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX)
        fields.password = `Entre ${PASSWORD_MIN} et ${PASSWORD_MAX} caractères.`;
    if (Object.keys(fields).length) return res.status(400).json({ error: 'Données invalides.', fields });

    const name = username.trim();
    const users = await readUsers();

    const taken = users.some((u) => u.username.toLowerCase() === name.toLowerCase());
    if (taken) return res.status(409).json({ error: 'Ce pseudo est déjà pris.' });

    const now = new Date().toISOString();
    const user = {
        id: crypto.randomUUID(),
        username: name,
        passwordHash: await hashPassword(password),
        credits: 0,
        packs: 10,
        lastPackAt: now,
        createdAt: now,
    };
    users.push(user);
    await saveUsers(users);

    res.status(201).json({ id: user.id, username: user.username });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || typeof password !== 'string'
        || !username.trim() || !password
        || username.length > 50 || password.length > PASSWORD_MAX) {
        return res.status(400).json({ error: 'Pseudo et mot de passe requis.' });
    }

    const name = username.trim().toLowerCase();
    if (loginLimiter.isBlocked(req.ip, name)) {
        return res.status(429).json({ error: 'Trop de tentatives. Réessaie dans 15 minutes.' });
    }

    const users = await readUsers();
    const user = users.find((u) => u.username.toLowerCase() === name);
    const valid = await verifyPassword(password, user ? user.passwordHash : await DUMMY_HASH);

    if (!user || !valid) {
        loginLimiter.fail(req.ip, name);
        // Même message dans les deux cas : on ne dit pas si le pseudo existe
        return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });
    }

    loginLimiter.succeed(req.ip, name);
    res.cookie(AUTH_COOKIE, signToken(user), { ...cookieBase, maxAge: TOKEN_TTL_SECONDS * 1000 });
    res.json({ id: user.id, username: user.username });
});

router.post('/logout', (req, res) => {
    res.clearCookie(AUTH_COOKIE, cookieBase);
    res.status(204).end();
});

router.get('/me', requireAuth, (req, res) => {
    res.json(req.user);
});

export default router;
