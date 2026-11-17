<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLogo from '../components/AppLogo.vue';
import { useAuth } from '../composables/useAuth.js';

const route = useRoute();
const router = useRouter();
const { login } = useAuth();

const form = reactive({ username: '', password: '' });
const errors = reactive({ username: '', password: '' });
const globalError = ref('');
const loading = ref(false);

function validate() {
  errors.username = form.username.trim() ? '' : 'Le pseudo est requis.';
  errors.password = form.password ? '' : 'Le mot de passe est requis.';
  return !errors.username && !errors.password;
}

// N'accepte que les chemins internes ("/collection"), jamais "//site.com" ou "https://..."
function safeRedirect(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

async function submit() {
  globalError.value = '';
  if (loading.value || !validate()) return;

  loading.value = true;
  try {
    const res = await login(form.username.trim(), form.password);
    if (res.ok) {
      form.password = '';
      await router.replace(safeRedirect(route.query.redirect));
    } else {
      globalError.value = res.data?.error || 'Une erreur est survenue.';
      form.password = '';
    }
  } catch {
    globalError.value = 'Serveur injoignable. Réessaie dans un instant.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="card">
    <AppLogo class="logo" />
    <h1>Content de te revoir</h1>
    <p class="subtitle">Connecte-toi pour ouvrir tes paquets</p>

    <form novalidate @submit.prevent="submit">
      <label>Pseudo
        <input v-model="form.username" placeholder="MC_Collector" autocomplete="username"
               maxlength="50" :aria-invalid="!!errors.username" />
        <small v-if="errors.username" class="error">{{ errors.username }}</small>
      </label>

      <label>Mot de passe
        <input v-model="form.password" type="password" placeholder="••••••••" autocomplete="current-password"
               maxlength="128" :aria-invalid="!!errors.password" />
        <small v-if="errors.password" class="error">{{ errors.password }}</small>
      </label>

      <a href="#" class="forgot">Mot de passe oublié ?</a>

      <p v-if="globalError" class="error" role="alert">{{ globalError }}</p>

      <button :disabled="loading">{{ loading ? 'Connexion…' : 'Se connecter' }}</button>
    </form>

    <p class="switch">Pas encore de compte ? <RouterLink to="/register">Créer un compte</RouterLink></p>
  </section>
</template>

<style scoped>
.card { width: 100%; max-width: 400px; padding: 28px 24px; border-radius: 20px; background: var(--panel); border: 1px solid var(--border); text-align: center; box-shadow: 0 20px 50px rgba(0, 0, 0, .25); }
.logo { margin-bottom: 14px; }
h1 { margin: 0 0 6px; font-size: 1.7rem; font-weight: 800; }
.subtitle { margin: 0; color: var(--muted); font-size: .8rem; }
form { display: grid; gap: 14px; text-align: left; margin-top: 20px; }
label { display: grid; gap: 6px; font-size: .75rem; font-weight: 700; }
input { width: 100%; padding: 12px 14px; border: 1px solid transparent; border-radius: 10px; background: var(--panel-input); color: var(--text); font: inherit; font-size: .8rem; font-weight: 400; }
input::placeholder { color: #6f7d95; }
input:focus { outline: none; border-color: var(--accent); }
input[aria-invalid='true'] { border-color: #ff7b7b; }
.forgot { justify-self: end; margin-top: -4px; color: var(--accent); font-size: .72rem; font-weight: 500; }
button { padding: 12px; border: 0; border-radius: 999px; background: var(--accent); color: #12203b; font: inherit; font-size: .85rem; font-weight: 700; cursor: pointer; }
button:disabled { opacity: .6; cursor: wait; }
.error { color: #ff7b7b; font-size: .75rem; margin: 0; font-weight: 400; }
.switch { margin: 18px 0 0; font-size: .75rem; color: var(--muted); }
.switch a { color: var(--accent); font-weight: 500; }
</style>
