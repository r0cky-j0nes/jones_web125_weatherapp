<template>
  <div class="forecast-container">
    <h2>5-Day Forecast</h2>
    <table v-if="forecastData.length">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weather</th>
          <th>High (°F)</th>
          <th>Low (°F)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="day in forecastData" :key="day.dt">
          <td>{{ new Date(day.dt * 1000).toLocaleDateString() }}</td>
          <td>{{ day.weather[0].main }}</td>
          <td>{{ Math.round(day.temp.max) }}</td>
          <td>{{ Math.round(day.temp.min) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Loading forecast...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const apiKey = '2f6532bf0e107efc40b25b23913398f7';
const forecastData = ref([]);

async function fetchForecast() {
  const city = localStorage.getItem('lastCity') || 'New York'; // fallback if no city
  const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
  const geoData = await geoRes.json();
  if (geoData.length) {
    const { lat, lon } = geoData[0];
    const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${apiKey}`);
    const data = await res.json();
    forecastData.value = data.daily.slice(0, 5);
  }
}

onMounted(() => {
  fetchForecast();
});
</script>

<style scoped>
.forecast-container {
  width: 90%;
  margin: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}
</style>
