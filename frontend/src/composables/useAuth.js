import { ref, readonly } from 'vue';
import * as authService from '../services/auth.service.js';

// Utilisateur connecté, partagé par tous les composants (null = pas connecté)
const user = ref(null);
let loading = null; // promesse du chargement, pour ne demander /me qu'une fois

// Demande au serveur qui est connecté (appelé par le routeur avant chaque page)
export function loadUser() {
  if (!loading) {
    loading = authService.fetchMe()
      .then((res) => {
        user.value = res.ok ? res.data : null;
        return user.value;
      })
      .catch(() => {
        loading = null; // serveur injoignable : on réessaiera à la prochaine page
        user.value = null;
        return null;
      });
  }
  return loading;
}

export function useAuth() {
  // Renvoie { ok, status, data } comme request() ; lève une erreur si le serveur est injoignable
  async function login(username, password) {
    const res = await authService.login(username, password);
    if (res.ok) {
      user.value = res.data;
      loading = Promise.resolve(res.data);
    }
    return res;
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      user.value = null;
      loading = Promise.resolve(null);
    }
  }

  return { user: readonly(user), login, logout, loadUser };
}
