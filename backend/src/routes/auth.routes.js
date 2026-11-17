import crypto from 'node:crypto';
import { Router } from 'express';
import { readUsers, saveUsers } from '../repositories/users.repository.js';
import { hashPassword } from '../utils/password.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const users = await readUsers();

    const taken = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
    if (taken) return res.status(409).json({ error: 'Ce pseudo est déjà pris.' });

    const now = new Date().toISOString();
    const user = {
        id: crypto.randomUUID(),
        username,
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

export default router;