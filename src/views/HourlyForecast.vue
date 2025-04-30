<template>
  <div class="chart-container">
    <h2>Hourly Forecast for {{ city }}</h2>
    <p v-if="error" class="err">{{ error }}</p>
    <Line
      v-else-if="chartData.labels.length"
      :data="chartData"
      :options="chartOptions"
    />
    <p v-else>Loading hourly data…</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Line }          from 'vue-chartjs'
import {
  Chart as C,
  Title, Tooltip, Legend,
  LineElement, PointElement,
  CategoryScale, LinearScale
} from 'chart.js'

C.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

import { useRoute } from 'vue-router'
const route      = useRoute()
const city       = route.query.city || ''
const apiKey     = '2f6532bf0e107efc40b25b23913398f7'

const chartData    = ref({ labels: [], datasets: [] })
const chartOptions = { responsive: true, maintainAspectRatio: false }
const error        = ref('')

onMounted(async () => {
  if (!city) {
    error.value = 'No city specified.'
    return
  }
  try {
    const url  = `https://api.openweathermap.org/data/2.5/forecast` +
                 `?q=${encodeURIComponent(city)}` +
                 `&units=imperial&appid=${apiKey}`
    const res  = await fetch(url)
    const data = await res.json()
    if (data.cod !== '200' || !Array.isArray(data.list)) {
      throw new Error(data.message || 'Invalid forecast data.')
    }

    const slice8 = data.list.slice(0, 8)
    chartData.value = {
      labels: slice8.map(item =>
        new Date(item.dt_txt).toLocaleTimeString('en-US',{
          hour:'numeric', minute:'2-digit', hour12:true
        })
      ),
      datasets: [
        {
          label: 'Temperature (°F)',
          data: slice8.map(i => i.main.temp),
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.4
        },
        {
          label: 'Rain (mm)',
          data: slice8.map(i => i.rain?.['3h'] || 0),
          backgroundColor: 'rgba(54,162,235,0.2)',
          borderColor: 'rgba(54,162,235,0.6)',
          tension: 0.4
        }
      ]
    }
  } catch (e) {
    error.value = e.message
  }
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1200px; 
  padding: 80px; 
  height: 400px;
  justify-content: center;
  margin: 20px; 
  text-align: center;
  background-color: rgb(255, 255, 255);
}
.err { color: red; margin-bottom:1rem; }
</style>
