<script setup>
import { useRouter } from 'vue-router';
import AppLogo from './AppLogo.vue';
import { useAuth } from '../composables/useAuth.js';

const router = useRouter();
const { user, logout } = useAuth();

async function onLogout() {
  await logout();
  router.push('/login');
}
</script>

<template>
  <header class="header">
    <RouterLink to="/"><AppLogo /></RouterLink>
    <nav>
      <RouterLink to="/" exact-active-class="active">Accueil</RouterLink>
      <a href="#">Ma collection</a>
      <a href="#">Marché</a>
      <a href="#">Échanges</a>
      <a href="#">Joueurs</a>
    </nav>
    <div class="actions">
      <template v-if="user">
        <span class="username">{{ user.username }}</span>
        <button class="btn" @click="onLogout">Déconnexion</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="btn">Connexion</RouterLink>
        <RouterLink to="/register" class="btn primary">S'inscrire</RouterLink>
      </template>
    </div>
  </header>
</template>

<style scoped>
.header { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 12px 28px; background: var(--bg-header); border-bottom: 1px solid var(--border); }
nav { display: flex; gap: 6px; }
nav a { padding: 6px 14px; border-radius: 999px; font-size: .8rem; font-weight: 500; color: var(--muted); }
nav a.active { background: #2b3850; color: var(--text); }
.actions { display: flex; gap: 10px; align-items: center; justify-self: end; }
.username { font-size: .8rem; font-weight: 700; }
.btn { padding: 8px 18px; border-radius: 999px; border: 1px solid var(--border); background: var(--panel); color: var(--text); font: inherit; font-size: .75rem; font-weight: 700; cursor: pointer; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #12203b; }
</style>
