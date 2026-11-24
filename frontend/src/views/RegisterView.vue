<script setup>
import { reactive, ref } from 'vue';
import AppLogo from '../components/AppLogo.vue';

const form = reactive({ username: '', password: '', confirmPassword: '' });
const errors = reactive({ username: '', password: '', confirmPassword: '' });
const globalError = ref('');
const success = ref('');
const loading = ref(false);

const USERNAME_RE = /^[\p{L}\p{N}_.-]{3,20}$/u;

function validate() {
  errors.username = '';
  errors.password = '';
  errors.confirmPassword = '';

  const username = form.username.trim();
  if (!username) errors.username = 'Le pseudo est requis.';
  else if (!USERNAME_RE.test(username))
    errors.username = '3 à 20 caractères : lettres, chiffres, _ - ou .';

  if (!form.password) errors.password = 'Le mot de passe est requis.';
  else if (form.password.length < 8) errors.password = 'Au moins 8 caractères.';

  if (!errors.password && form.password !== form.confirmPassword)
    errors.confirmPassword = 'Les mots de passe ne correspondent pas.';

  return !errors.username && !errors.password && !errors.confirmPassword;
}

async function submit() {
  globalError.value = '';
  success.value = '';
  if (!validate()) return;

  loading.value = true;
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: form.username.trim(), password: form.password }),
    });
    const data = await res.json();

    if (res.status === 409) {
      errors.username = data.error;
    } else if (res.status === 400 && data.fields) {
      Object.assign(errors, data.fields);
    } else if (!res.ok) {
      globalError.value = data.error || 'Une erreur est survenue.';
    } else {
      success.value = `Compte créé : bienvenue ${data.username} !`;
      form.username = '';
      form.password = '';
      form.confirmPassword = '';
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
    <h1>Crée ton compte</h1>
    <p class="subtitle">Reçois 10 paquets gratuits pour commencer</p>

    <form novalidate @submit.prevent="submit">
      <label>Pseudo
        <input v-model="form.username" placeholder="MC_Collector" autocomplete="username"
               :aria-invalid="!!errors.username" />
        <small v-if="errors.username" class="error">{{ errors.username }}</small>
      </label>

      <label>Mot de passe
        <input v-model="form.password" type="password" placeholder="••••••••" autocomplete="new-password"
               :aria-invalid="!!errors.password" />
        <small v-if="errors.password" class="error">{{ errors.password }}</small>
      </label>

      <label>Confirmer le mot de passe
        <input v-model="form.confirmPassword" type="password" placeholder="••••••••" autocomplete="new-password"
               :aria-invalid="!!errors.confirmPassword" />
        <small v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</small>
      </label>

      <p v-if="globalError" class="error">{{ globalError }}</p>
      <p v-if="success" class="success">{{ success }}</p>

      <button :disabled="loading">{{ loading ? 'Création…' : 'Créer mon compte' }}</button>
    </form>

    <p class="switch">Déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink></p>
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
button { padding: 12px; border: 0; border-radius: 999px; background: var(--accent); color: #12203b; font: inherit; font-size: .85rem; font-weight: 700; cursor: pointer; }
button:disabled { opacity: .6; cursor: wait; }
.error { color: #ff7b7b; font-size: .75rem; margin: 0; font-weight: 400; }
.success { color: #7be0a0; font-size: .8rem; margin: 0; }
.switch { margin: 18px 0 0; font-size: .75rem; color: var(--muted); }
.switch a { color: var(--accent); font-weight: 500; }
</style>