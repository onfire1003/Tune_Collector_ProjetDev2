import { createRouter, createWebHistory } from 'vue-router';
import { loadUser } from '../composables/useAuth.js';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
    // Pour protéger une page : meta: { requiresAuth: true }
  ],
});

router.beforeEach(async (to) => {
  const user = await loadUser();
  if (to.meta.requiresAuth && !user) return { name: 'login', query: { redirect: to.fullPath } };
  if (to.meta.guestOnly && user) return { name: 'home' };
});

export default router;
