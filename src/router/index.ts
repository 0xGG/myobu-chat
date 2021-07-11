import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Myōbu | Chat" },
  },
  /*
  {
    path: "/:walletAddress",
    name: "Dashboard",
    component: Dashboard,
    meta: { title: "Myōbu | Chat" },
  },
  */
  {
    path: "*",
    name: "catchAll",
    component: Home,
    meta: { title: "Myōbu | Chat" },
  },
];

console.log("BASE_URL", process.env.BASE_URL);

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) document.title = to.meta.title;
  next();
});

export default router;
