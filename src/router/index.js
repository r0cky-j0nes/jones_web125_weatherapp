import { createRouter, createWebHistory } from 'vue-router';
import weatherHome from '../views/weatherHome.vue';
import hourlyWeather from '../views/hourlyWeather.vue';
import weatherForecast from '../views/weatherForecast.vue';

const routes = [
    { path: '/', name: 'Home', component: weatherHome },
    { path: '/hourly', name: 'WeatherHourly', component: hourlyWeather },
    { path: '/forecast', name: 'WeatherForecast', component: weatherForecast }
  ];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
