<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import RegisterView from './views/RegisterView.vue';
</script>

<template>
  <AppHeader />
  <main>
    <RegisterView />
  </main>
  <AppFooter />
</template>

<style scoped>
main { flex: 1; display: grid; place-items: center; padding: 40px 16px; }
</style>