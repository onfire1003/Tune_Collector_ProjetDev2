<script setup>
import AppLogo from './AppLogo.vue';
</script>

<template>
  <header class="header">
    <a href="#"><AppLogo /></a>
    <nav>
      <a href="#" class="active">Accueil</a>
      <a href="#">Ma collection</a>
      <a href="#">Marché</a>
      <a href="#">Échanges</a>
      <a href="#">Joueurs</a>
    </nav>
    <div class="actions">
      <a href="#" class="btn">Connexion</a>
      <a href="#" class="btn primary">S'inscrire</a>
    </div>
  </header>
</template>

<style scoped>
.header { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 12px 28px; background: var(--bg-header); border-bottom: 1px solid var(--border); }
nav { display: flex; gap: 6px; }
nav a { padding: 6px 14px; border-radius: 999px; font-size: .8rem; font-weight: 500; color: var(--muted); }
nav a.active { background: #2b3850; color: var(--text); }
.actions { display: flex; gap: 10px; justify-self: end; }
.btn { padding: 8px 18px; border-radius: 999px; border: 1px solid var(--border); background: var(--panel); font-size: .75rem; font-weight: 700; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #12203b; }
</style>
