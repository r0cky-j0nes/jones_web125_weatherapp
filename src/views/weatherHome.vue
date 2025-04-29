<template>
  <div :class="bgClass">
    <main>
      <!-- If no city yet, prompt -->
      <p v-if="!city" class="prompt">
        Use the search bar above to lookup a city.
      </p>

      <!-- Current weather display -->
      <div class="weather-wrap" v-else-if="weather.main">
        <div class="location-box">
          <div class="location">
            {{ weather.name }}, {{ weather.sys.country }}
          </div>
          <button @click="saveLocation" class="save-btn">
            Save This Location
          </button>
          <div class="date">{{ dateBuilder() }}</div>
        </div>

        <div class="temp-range">
          High: {{ Math.round(weather.main.temp_max) }}°F /
          Low:  {{ Math.round(weather.main.temp_min) }}°F
        </div>

        <div class="weather-box">
          <div class="temp">{{ Math.round(weather.main.temp) }}°F</div>
          <div class="weather-icon">
            <img
              :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`"
              :alt="weather.weather[0].description"
            />
          </div>
          <div class="weather">{{ weather.weather[0].main }}</div>
        </div>

        <!-- Toggle inline forecasts -->
        <div class="toggle-btns">
          <button @click="mode='hourly'">Show Hourly</button>
          <button @click="mode='5day'">Show 5-Day</button>
          <button @click="mode=''">Hide Forecast</button>
        </div>

        <HourlyForecast
          v-if="mode==='hourly'"
          :city="city"
          class="forecast-panel"
        />
        <FiveDayForecast
          v-if="mode==='5day'"
          :city="city"
          class="forecast-panel"
        />
      </div>

      <!-- Loading or error -->
      <p v-else-if="error" class="error">{{ error }}</p>
      <p v-else>Loading current weather…</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import HourlyForecast  from '@/views/HourlyForecast.vue'
import FiveDayForecast from '@/views/FiveDayForecast.vue'

const route   = useRoute()
const city    = ref(route.query.city || '')
const weather = ref({})
const error   = ref('')
const mode    = ref('')
const apiKey  = '2f6532bf0e107efc40b25b23913398f7'

function dateBuilder() {
  const d = new Date()
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric'
  })
}

function bgClass() {
  if (!weather.value.main) return ''
  const t = weather.value.main.temp
  return t < 50 ? 'cold' : t > 80 ? 'hot' : 'mild'
}

async function fetchCurrent() {
  if (!city.value) return
  try {
    const res  = await fetch(
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city.value)}` +
      `&units=imperial&appid=${apiKey}`
    )
    const data = await res.json()
    if (data.cod !== 200) {
      error.value = data.message
      return
    }
    weather.value = data
  } catch {
    error.value = 'Failed to fetch current weather.'
  }
}

watch(() => route.query.city, (val) => {
  city.value = val || ''
  if (city.value) {
    error.value = ''
    fetchCurrent()
  }
})

onMounted(() => {
  if (city.value) fetchCurrent()
})

function saveLocation() {
  const arr = JSON.parse(localStorage.getItem('saved') || '[]')
  if (city.value && !arr.includes(city.value)) {
    arr.push(city.value)
    localStorage.setItem('saved', JSON.stringify(arr))
    // <-- fire event so SearchBar picks it up immediately
    window.dispatchEvent(new Event('saved-updated'))
  }
}
</script>

<style scoped>
main {
  min-height: 100vh;
  padding: 1rem;
  text-align: center;
}
.prompt {
  margin-top: 2rem;
  font-size: 1.2rem;
}
.error {
  color: #c00;
  margin-top: 1rem;
}
.location-box .location {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.save-btn {
  margin: 0.5rem auto;
  padding: 0.5rem 1rem;
  background: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.date {
  margin-bottom: 1rem;
  font-size: 1rem;
}
.temp-range {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
.weather-box .temp {
  font-size: 3rem;
}
.weather-icon img {
  width: 80px;
}
.weather-box .weather {
  font-size: 1.2rem;
  margin-top: 0.5rem;
}
.toggle-btns {
  margin: 1rem 0;
}
.toggle-btns button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
}
.forecast-panel {
  margin-top: 2rem;
}
</style>
