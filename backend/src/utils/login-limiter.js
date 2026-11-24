// Limite les connexions ratées (anti-bruteforce). Tout est gardé en mémoire :
// un redémarrage du serveur remet les compteurs à zéro.
// Après MAX_FAILS échecs pour le même pseudo depuis la même IP, la connexion est bloquée pendant BLOCK_MS.
const MAX_FAILS = 5;
const BLOCK_MS = 15 * 60 * 1000; // 15 min

export function createLoginLimiter({ maxFails = MAX_FAILS, blockMs = BLOCK_MS } = {}) {
    const attempts = new Map(); // "ip|pseudo" -> { fails, firstFailAt, blockedUntil }

    // Renvoie l'entrée encore valable, ou null (et la supprime si elle a expiré)
    function get(key, now = Date.now()) {
        const entry = attempts.get(key);
        if (!entry) return null;
        const expired = entry.blockedUntil
            ? entry.blockedUntil <= now
            : now - entry.firstFailAt > blockMs;
        if (expired) {
            attempts.delete(key);
            return null;
        }
        return entry;
    }

    // Nettoyage régulier pour que la Map ne grossisse pas à l'infini
    setInterval(() => {
        const now = Date.now();
        for (const key of attempts.keys()) get(key, now);
    }, blockMs).unref();

    return {
        isBlocked(ip, name) {
            return Boolean(get(`${ip}|${name}`)?.blockedUntil);
        },
        fail(ip, name) {
            const key = `${ip}|${name}`;
            const now = Date.now();
            const entry = get(key, now) ?? { fails: 0, firstFailAt: now, blockedUntil: 0 };
            entry.fails += 1;
            if (entry.fails >= maxFails) entry.blockedUntil = now + blockMs;
            attempts.set(key, entry);
        },
        succeed(ip, name) {
            attempts.delete(`${ip}|${name}`);
        },
    };
}
