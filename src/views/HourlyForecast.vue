<template>
  <div class="chart-container">
    <h2>Hourly Forecast</h2>
    <Line v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <p v-else>Loading hourly data...</p>
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import { ref, onMounted } from 'vue';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const apiKey = '2f6532bf0e107efc40b25b23913398f7';
const chartData = ref({
  labels: [],
  datasets: [
    { label: 'Temperature (°F)', data: [], borderColor: 'rgba(75, 192, 192, 1)', tension: 0.4 },
    { label: 'Rain (mm)', data: [], borderColor: 'rgba(54, 162, 235, 0.6)', backgroundColor: 'rgba(54, 162, 235, 0.2)', tension: 0.4 }
  ]
});
const chartOptions = { responsive: true, maintainAspectRatio: false };

async function fetchHourlyForecast() {
  const city = localStorage.getItem('lastCity') || 'New York';
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`);
  const data = await res.json();
  if (data.list) {
    const today = data.list.slice(0, 8); // Next 8 time blocks (~24h)

    chartData.value.labels = today.map(item => item.dt_txt.split(' ')[1].slice(0, 5)); // HH:MM
    chartData.value.datasets[0].data = today.map(item => item.main.temp);
    chartData.value.datasets[1].data = today.map(item => item.rain ? item.rain['3h'] || 0 : 0);
  }
}

onMounted(() => {
  fetchHourlyForecast();
});
</script>

<style scoped>
.chart-container {
  width: 90%;
  height: 500px;
  margin: auto;
}
</style>
