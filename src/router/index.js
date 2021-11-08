import { createRouter, createWebHashHistory } from "vue-router";

const Login = () => import("components/login/Login");
const Home = () => import("components/home/Home");
const Users = () => import("views/users/Users");
const Roles = () => import("views/roles/Roles");
const Rights = () => import("views/rights/Rights");
const Goods = () => import("views/goods/Goods");
const Params = () => import("views/params/Params");
const Categories = () => import("views/categories/Categories");
const Orders = () => import("views/orders/Orders");
const Reports = () => import("views/reports/Reports");

const routes = [
  {
    path: "",
    redirect: "/login",
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/home",
    component: Home,
    children: [
      {path: '', redirect: '/users'},
      {path: '/users', component: Users},
      {path: '/roles', component: Roles},
      {path: '/rights', component: Rights},
      {path: '/goods', component: Goods},
      {path: '/params', component: Params},
      {path: '/categories', component: Categories},
      {path: '/orders', component: Orders},
      {path: '/reports', component: Reports}
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});
export default router;
