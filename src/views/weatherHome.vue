<template>
  <div :class="bgClass">
    <main>
      <div class="search-box">
        <input
          v-model="query"
          @keyup.enter="fetchWeather"
          placeholder="Enter City or ZIP"
          class="search-bar"
        />
      </div>

      <div class="saved-locations" v-if="savedLocations.length">
        <h3>Saved Locations:</h3>
        <ul>
          <li v-for="(loc, i) in savedLocations" :key="i">
            <button @click="selectSavedLocation(loc)">{{ loc }}</button>
            <button @click="deleteLocation(i)" class="delete-btn">✖</button>
          </li>
        </ul>
      </div>

      <div class="weather-wrap" v-if="weather.main">
        <div class="location-box">
          <div class="location">
            {{ weather.name }}, {{ weather.sys.country }}
          </div>
          <!-- use computed property here -->
          <div class="date">{{ formattedDate }}</div>
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

        <nav class="forecast-links">
          <router-link
            :to="{ name: 'HourlyForecast', query: { city: weather.name } }"
          >Hourly</router-link>
          |
          <router-link
            :to="{ name: 'FiveDayForecast', query: { city: weather.name } }"
          >5-Day Forecast</router-link>
        </nav>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'weatherHome',
  data() {
    return {
      apiKey: '2f6532bf0e107efc40b25b23913398f7',
      query: '',
      weather: {},
      savedLocations: JSON.parse(localStorage.getItem('saved') || '[]')
    };
  },
  computed: {
    formattedDate() {
      const d = new Date();
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month:   'long',
        day:     'numeric',
        year:    'numeric'
      });
    },
    bgClass() {
      if (!this.weather.main) return '';
      const t = this.weather.main.temp;
      return t < 50 ? 'cold' : t > 80 ? 'hot' : 'mild';
    }
  },
  methods: {
    async fetchWeather() {
      if (!this.query.trim()) return;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(this.query)}&units=imperial&appid=${this.apiKey}`
        );
        const data = await res.json();
        if (data.cod !== 200) {
          alert(data.message);
          return;
        }
        this.weather = data;

        if (!this.savedLocations.includes(data.name)) {
          this.savedLocations.push(data.name);
          localStorage.setItem('saved', JSON.stringify(this.savedLocations));
        }

        this.query = '';
      } catch {
        alert('Error fetching weather');
      }
    },
    selectSavedLocation(city) {
      this.query = city;
      this.fetchWeather();
    },
    deleteLocation(i) {
      this.savedLocations.splice(i,1);
      localStorage.setItem('saved', JSON.stringify(this.savedLocations));
    }
  }
};
</script>

<style scoped>
/* your existing CSS */
</style>


