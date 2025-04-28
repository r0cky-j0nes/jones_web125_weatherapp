import { createRouter, createWebHistory } from 'vue-router';
import HourlyForecast from '../views/HourlyForecast.vue';
import FiveDayForecast from '../views/FiveDayForecast.vue';
import weatherHome from '../views/weatherHome.vue'

const routes = [
  { path: '/hourly', name: 'HourlyForecast', component: HourlyForecast },
  { path: '/5day', name: 'FiveDayForecast', component: FiveDayForecast },
  { path: '/', name: 'weatherHome', component: weatherHome}
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
