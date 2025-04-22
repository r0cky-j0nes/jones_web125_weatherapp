<template>
    <div class="chart-container">
      <h2>Hourly Forecast</h2>
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { Line } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
  import { ref, onMounted } from 'vue';
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
  
  const chartData = ref({
    labels: [],
    datasets: [
      { label: 'Temperature (°F)', data: [], borderColor: 'rgba(75, 192, 192, 1)', tension: 0.4 },
      { label: 'Rain (mm)', data: [], borderColor: 'rgba(54, 162, 235, 0.6)', backgroundColor: 'rgba(54, 162, 235, 0.2)', tension: 0.4 }
    ]
  });
  
  const chartOptions = { responsive: true, maintainAspectRatio: false };
  
  onMounted(async () => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=New York&units=imperial&appid=2f6532bf0e107efc40b25b23913398f7`);
    const data = await res.json();
    const today = data.list.filter(item => item.dt_txt.includes(new Date().toISOString().split('T')[0]));
  
    chartData.value.labels = today.map(item => item.dt_txt.split(' ')[1].slice(0, 5));
    chartData.value.datasets[0].data = today.map(item => item.main.temp);
    chartData.value.datasets[1].data = today.map(item => item.rain ? item.rain['3h'] || 0 : 0);
  });
  </script>
  
  <style>
  .chart-container { width: 90%; height: 500px; margin: auto; }
  </style>
  