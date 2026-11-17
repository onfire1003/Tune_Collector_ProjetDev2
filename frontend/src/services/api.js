// Appel à l'API. Le cookie de session (httpOnly) est envoyé automatiquement par le navigateur.
export async function request(url, { body, ...options } = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}
