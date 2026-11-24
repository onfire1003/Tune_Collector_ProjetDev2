<script setup>
import { useAuth } from '../composables/useAuth.js';

const { user } = useAuth();
</script>

<!-- Page d'accueil provisoire : à remplacer par la vraie page -->
<template>
  <section class="home">
    <h1 v-if="user">Salut {{ user.username }} !</h1>
    <h1 v-else>Bienvenue sur Tune Collector</h1>
  </section>
</template>

<style scoped>
.home { text-align: center; }
</style>
