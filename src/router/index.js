// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RestaurantDetailsView from '../views/RestaurantDetailsView.vue'

const routes = [
  { path: '/', component: HomeView },
   { path: '/restaurant_details', component: RestaurantDetailsView },
  // Add more routes as needed
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
