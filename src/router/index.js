import { createRouter, createWebHistory } from "vue-router/auto";
import { routes } from "./routes";
import authService from "@/services/authService";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Ajouter une navigation globale pour vérifier l'authentification
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('authToken');

  if (!token && to.meta.requiresAuth) {
    return next({ name: 'Auth' });
  }
  
  const isTokenValid = await authService.isTokenValid(token);

  if (to.meta.requiresAuth && !isTokenValid) {
    next({ name: 'Auth' });
  } else if (to.meta.requiresGuest && isTokenValid) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

// Gérer les erreurs de chargement dynamique
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
