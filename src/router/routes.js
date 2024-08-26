export const routes = [
  {
    path: '/',
    name: 'Auth',
    component: () => import('@/pages/Auth.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/index.vue'),
    meta: { requiresAuth: true }
  },
];
