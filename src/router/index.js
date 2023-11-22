import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import login from '../views/login.vue'
import users from '../views/users.vue'
import inventory from '../views/inventory.vue'
import departments from '../views/departments.vue'
import reports from '../views/reports.vue'
import valesResguardo from '../views/valesResguardo.vue'
import Swal from "sweetalert2";
import { getAuth, signOut } from "firebase/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/users',
    name: 'users',
    component: users,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: inventory,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/departments',
    name: 'departments',
    component: departments,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/reports',
    name: 'reports',
    component: reports,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/valesResguardo',
    name: 'valesResguardo',
    component: valesResguardo,
    meta: {
      requiresAuth: false
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Middleware para verificar la autenticación y cerrar la sesión
router.beforeEach(async (to, from, next) => {
  const auth = getAuth();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // La ruta requiere autenticación
    if (!auth.currentUser) {
      // El usuario no está autenticado
      alertaToast("warning", "Debes iniciar sesión.");
      next({ name: 'login' });
    } else {
      // El usuario está autenticado
      next();
    }
  } else if (to.name === 'login' && from.name !== 'login') {
    // El usuario está yendo a la vista de inicio de sesión desde otra vista
    // Cerrar la sesión
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar la sesión:", error);
    }
    next();
  } else {
    next();
  }
});

const alertaToast = (icono, titulo) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: icono,
    title: titulo
  });
};

export default router;