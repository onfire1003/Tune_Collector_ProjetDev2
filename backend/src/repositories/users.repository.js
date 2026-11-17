import fs from 'node:fs/promises';

const FILE = new URL('../../data/users.json', import.meta.url);

export async function readUsers() {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
}

export async function saveUsers(users) {
    await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}
