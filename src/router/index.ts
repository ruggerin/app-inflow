import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404.vue')
    },
    MainRoutes,
    AuthRoutes
  ]
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/auth/login1'];
  const authRequired = !publicPages.includes(to.path);
  const auth: any = useAuthStore();
  const isAuthenticated = await auth.checkAuthenticationApi();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (authRequired && !auth.user && !isAuthenticated) {
      auth.returnUrl = to.fullPath;
      return next('/auth/login1');
    } else next();
  } else {
    next();
  }
});
