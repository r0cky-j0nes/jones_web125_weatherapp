<template>
  <div class="forecast-container">
    <h2>5-Day Forecast for {{ city }}</h2>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Cards layout -->
    <div v-else-if="dailyData.length" class="cards">
      <div class="day-card" v-for="day in dailyData" :key="day.date">
        <!-- Weather icon -->
        <img
          v-if="day.icon"
          :src="`https://openweathermap.org/img/wn/${day.icon}@2x.png`"
          :alt="day.main"
          class="card-icon"/>
          
          <div class="card-date">
          {{ new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month:   'short',
            day:     'numeric'
          }) }}
        </div>
        <!--Condition -->
        <div class="card-cond">{{ day.main }}</div>
        <!--Temp -->
        <div class="card-temps">
          <span>High: {{ Math.round(day.max) }}°F</span>
          <span>Low:  {{ Math.round(day.min) }}°F</span>
        </div>

      </div>
    </div>

    <p v-else>Loading 5-day forecast…</p>

  </div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue'
import { useRoute }              from 'vue-router'

const route     = useRoute()
const city      = ref(route.query.city || '')
const API_KEY   = '2f6532bf0e107efc40b25b23913398f7'

const dailyData = ref([])
const error     = ref('')

async function fetchForecast() {
  if (!city.value) {
    error.value = 'No city specified—search first.'
    return
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast` +
                `?q=${encodeURIComponent(city.value)}` +
                `&units=imperial&appid=${API_KEY}`

    const res  = await fetch(url)
    const data = await res.json()

    if (data.cod !== '200' || !Array.isArray(data.list)) {
      throw new Error(data.message || 'Invalid forecast data.')
    }

    //Group entries by date
    const grouped = data.list.reduce((acc, item) => {
      const dateKey = item.dt_txt.split(' ')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: new Date(dateKey).getTime(),
          max:  item.main.temp_max,
          min:  item.main.temp_min,
          condCount: { [item.weather[0].main]: 1 }
        }
      } else {
        acc[dateKey].max = Math.max(acc[dateKey].max, item.main.temp_max)
        acc[dateKey].min = Math.min(acc[dateKey].min, item.main.temp_min)
        const m = item.weather[0].main
        acc[dateKey].condCount[m] = (acc[dateKey].condCount[m] || 0) + 1
      }
      return acc
    }, {})

    //Build array, pick most frequent condition and its icon
    const arr = Object.entries(grouped).map(([dateKey, day]) => {
      const main = Object.keys(day.condCount)
        .reduce((a, b) => day.condCount[a] > day.condCount[b] ? a : b)

      const match = data.list.find(item =>
        item.dt_txt.startsWith(dateKey) &&
        item.weather[0].main === main
      )
      const icon = match ? match.weather[0].icon : ''

      return {
        date: day.date,
        max:  day.max,
        min:  day.min,
        main,
        icon
      }
    })

    //Sort & take first 5
    arr.sort((a, b) => a.date - b.date)
    dailyData.value = arr.slice(0, 5)

  } catch (e) {
    console.error(e)
    error.value = e.message
  }
}

//initial fetch on mount
onMounted(fetchForecast)

//Refetch whenever ?city changes
watch(
  () => route.query.city,
  newCity => {
    city.value      = newCity || ''
    dailyData.value = []
    error.value     = ''
    if (city.value) fetchForecast()
  }
)
</script>



<style scoped>
.forecast-container {
  width: 90%;
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
}

.error {
  color: #ff6b6b;
  margin-bottom: 1rem;
}

/* Card bg */
.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* 5 day card */
.day-card {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-radius: 12px;
  width: 120px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  color: #fff;
  font-family: "Delius Unicase", cursive;
}

/* Date */
.card-date {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

/*condition */
.card-cond {
  font-size: 1rem;
  font-style: italic;
  margin-bottom: 0.5rem;
}

/* High / Low temperatures */
.card-temps {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  gap: 0.3rem;
}
</style>
