import { createRouter, createWebHashHistory } from "vue-router";

const Login = () => import("views/login/Login")
const Home = () => import("views/home/Home")

const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
