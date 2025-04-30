<template>
  <div :class="bgClass()">
    <main>
      <!-- Prompt when nothing yet -->
      <p v-if="!city" class="prompt">
        Use the search bar above or allow location access.
      </p>

      <!-- Current weather wrapped in card -->
      <div class="weather-wrap" v-else-if="weather.main">
        <div class="weather-card">
          <div class="location-box">
            <div class="location">
              {{ weather.name }}
              <span v-if="weather.state">, {{ weather.state }}</span>,
              {{ weather.country }}
            </div>
            <button @click="saveLocation()" class="save-btn">
              Save This Location
            </button>
            <div class="datetime">
              <div class="date">{{ dateBuilder() }}</div>
              <div class="time">{{ currentTime }}</div>
            </div>
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

          <div class="toggle-btns">
            <button @click="mode = 'hourly'">Show Hourly</button>
            <button @click="mode = '5day'">Show 5-Day</button>
            <button @click="mode = ''">Hide Forecast</button>
          </div>
        </div>

        <HourlyForecast
          v-if="mode === 'hourly'"
          :city="city"
          class="forecast-panel"
        />
        <FiveDayForecast
          v-if="mode === '5day'"
          :city="city"
          class="forecast-panel"
        />
      </div>

      <!-- Error or loading states -->
      <p v-else-if="error" class="error">{{ error }}</p>
      <p v-else>Loading current weather…</p>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HourlyForecast   from '@/views/HourlyForecast.vue'
import FiveDayForecast  from '@/views/FiveDayForecast.vue'

const route  = useRoute()
const router = useRouter()
const apiKey = '2f6532bf0e107efc40b25b23913398f7'

const city    = ref(route.query.city || '')
const weather = ref({})
const error   = ref('')
const mode    = ref('')
const currentTime = computed(() => {
  if (!weather.value.timezone) return ''
  // right now:
  const nowUtc = Date.now()
  // shift by city timezone
  const cityMs = nowUtc + weather.value.timezone * 1000
  // create hours/minutes
  const d = new Date(cityMs)
  const hrs = d.getUTCHours()
  const mins = d.getUTCMinutes()
  const suffix = hrs >= 12 ? 'PM' : 'AM'
  const h12 = ((hrs + 11) % 12 + 1)  // 0→12, 13→1, etc.
  const m2  = String(mins).padStart(2, '0')
  return `${h12}:${m2} ${suffix}`
})

// Build date 
function dateBuilder() {
  const d = new Date()
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric'
  })
}

// Pick background based on temperature
function bgClass() {
  if (!weather.value.main) return ''
  const t = weather.value.main.temp
  return t < 50 ? 'cold' : t > 80 ? 'hot' : 'mild'
}

// Fetch by city name, including state+country via Direct Geocoding
async function fetchByCity(name) {
  try {
    // Geocode to get coords + state/country
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct` +
      `?q=${encodeURIComponent(name)}` +
      `&limit=1&appid=${apiKey}`
    )
    const geoData = await geoRes.json()
    if (!Array.isArray(geoData) || !geoData.length) {
      throw new Error('Location not found')
    }
    const { lat, lon, state, country, name: geoName } = geoData[0]

    //fetch weather at those coords
    await fetchByCoords(lat, lon, geoName, state, country)
  } catch (e) {
    error.value = e.message
  }
}

//Fetch by coordinates + optional reverse-geocode info
//Accept extra params geoName, state, country for Direct Geocode case, or perform reverse geocode if not provided.
async function fetchByCoords(latitude, longitude, geoName = '', geoState = '', geoCountry = '') {
  try {
    //Weather data
    const wRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${latitude}&lon=${longitude}` +
      `&units=imperial&appid=${apiKey}`
    )
    const wData = await wRes.json()
    if (wData.cod !== 200) {
      throw new Error(wData.message || 'Weather fetch failed')
    }

    //If no geoName provided, reverse-geocode
    let name = geoName
    let state = geoState
    let country = geoCountry
    if (!name) {
      const revRes  = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse` +
        `?lat=${latitude}&lon=${longitude}` +
        `&limit=1&appid=${apiKey}`
      )
      const revData = await revRes.json()
      if (Array.isArray(revData) && revData.length) {
        name    = revData[0].name
        state   = revData[0].state || ''
        country = revData[0].country || wData.sys.country
      } else {
        name    = wData.name
        state   = ''
        country = wData.sys.country
      }
    }

    //Merge and update reactive state
    weather.value = {
      ...wData,
      name,
      state,
      country
    }

    // Update city 
    city.value = name
    router.replace({ name: route.name, query: { city: name } })
  } catch (e) {
    error.value = e.message
  }
}

//On mount: decide which fetch to run
onMounted(() => {
  if (city.value) {
    // If URL has ?city=
    fetchByCity(city.value)
  } else if (navigator.geolocation) {
    // Else try browser geolocation
    navigator.geolocation.getCurrentPosition(
      pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        // Denied or failed: leave prompt in place
      }
    )
  }
})

// 4) React if user navigates to a new ?city=
watch(
  () => route.query.city,
  newCity => {
    if (newCity) {
      city.value = newCity
      fetchByCity(newCity)
    }
  }
)

// 5) Save button handler
function saveLocation() {
  console.log('[saveLocation] clicked, city =', city.value)
  const list = JSON.parse(localStorage.getItem('saved')||'[]')
  if (city.value && !list.includes(city.value)) {
    list.push(city.value)
    localStorage.setItem('saved', JSON.stringify(list))
     // tell everyone the saved list just changed
      window.dispatchEvent(new Event('saved-updated'))
    // notify the SearchBar to reload
    window.dispatchEvent(new Event('saved-updated'))
    console.log('[saveLocation] new list =', list)
  } else {
    console.log('[saveLocation] nothing to save or already saved')
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
/* Card container */
.weather-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* The semi-transparent card */
.weather-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 480px;
  width: 90%;
  margin: 1rem auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #fff;
  font-family: "Delius Unicase", cursive;
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
.datetime {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #fff;
  font-family: "Delius Unicase", cursive;
}
.time {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
