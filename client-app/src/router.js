import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import wallet from "./components/FormWallet.vue";
import user from "./components/FormUser";
import search from "./views/Search.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [{
        path: "wallet",
        component: wallet
      },{
        path: "user",
        component: user
      },{
        path: "query",
        component: search
      }]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
