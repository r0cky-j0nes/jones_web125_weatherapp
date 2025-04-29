<template>
  <div class="forecast-container">
    <h2>5-Day Forecast for {{ city }}</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <table v-else-if="dailyData.length">
      <thead>
        <tr><th>Date</th><th>Cond</th><th>High</th><th>Low</th></tr>
      </thead>
      <tbody>
        <tr v-for="day in dailyData" :key="day.date">
          <td>{{ new Date(day.date).toLocaleDateString() }}</td>
          <td>{{ day.main }}</td>
          <td>{{ Math.round(day.max) }}°F</td>
          <td>{{ Math.round(day.min) }}°F</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Loading 5-day forecast…</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute }      from 'vue-router'

const route     = useRoute()
const city      = route.query.city || ''
const apiKey    = '2f6532bf0e107efc40b25b23913398f7'

const dailyData = ref([])
const error     = ref('')

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

    const grouped = data.list.reduce((acc, item) => {
      const d = item.dt_txt.split(' ')[0]
      if (!acc[d]) {
        acc[d] = {
          date: new Date(d).getTime(),
          max:  item.main.temp_max,
          min:  item.main.temp_min,
          condCount: { [item.weather[0].main]: 1 }
        }
      } else {
        acc[d].max = Math.max(acc[d].max, item.main.temp_max)
        acc[d].min = Math.min(acc[d].min, item.main.temp_min)
        const m = item.weather[0].main
        acc[d].condCount[m] = (acc[d].condCount[m]||0) + 1
      }
      return acc
    }, {})

    const arr = Object.values(grouped).map(day => {
      const main = Object.keys(day.condCount)
        .reduce((a,b) => day.condCount[a] > day.condCount[b] ? a : b)
      return { date: day.date, max: day.max, min: day.min, main }
    })

    arr.sort((a,b) => a.date - b.date)
    dailyData.value = arr.slice(0, 5)
  } catch (e) {
    error.value = e.message
  }
})
</script>

<style scoped>
.forecast-container {
  width: 90%; max-width: 700px;
  margin: 2rem auto; text-align: center;
}
.error { color: #c00; margin-bottom:1rem; }
table {
  width: 100%; border-collapse: collapse;
  margin-top:1rem;
}
th, td {
  padding:8px; border:1px solid #ddd;
}
</style>
