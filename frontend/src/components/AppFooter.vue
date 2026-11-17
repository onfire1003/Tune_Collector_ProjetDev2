<template>
  <footer class="footer">
    <span>© 2026 Tune Collector</span>
    <nav>
      <a href="#">Comment ça marche ?</a>
      <a href="#">Mentions légales</a>
      <a href="#">Conditions d'utilisation</a>
      <a href="#">Confidentialité</a>
    </nav>
  </footer>
</template>

<style scoped>
.footer { display: flex; justify-content: space-between; padding: 18px 64px; border-top: 1px solid var(--border); font-size: .72rem; color: var(--muted); }
nav { display: flex; gap: 24px; }
a:hover { color: var(--text); }
</style>
