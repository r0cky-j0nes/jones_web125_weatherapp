<template>
  <div id="app" :class="typeof weather.main != 'undefined' && weather.main.temp < 63 ?
  'cold' : ''">
    <main>
      <div class="search-box">
        <input 
        type="text" 
        class="search-bar" 
        placeholder="Enter City..."
        v-model="query"
        @keypress="fetchWeather"
        >
      </div>

      <div class="saved-locations" v-if="savedLocations.length">
        <h3>Saved Locations:</h3>
        <ul>
          <li v-for="(city, index) in savedLocations" :key="index">
            <button @click="selectSavedLocation(city)">{{ city }}</button>
            <button @click="deleteLocation(index)" class="delete-btn">✖</button>
          </li>
        </ul>
      </div>

      <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
        <div class="location-box">
          <div class="location">{{ weatherLocation }}</div>
          <button @click="saveLocation" class="save-btn">Save This Location</button>
          <div class="date">{{ dateBulider() }}</div>
          
        </div>

        <div class="temp-range">
          High: {{ Math.round(weather.main.temp_max) }}°F / 
          Low: {{ Math.round(weather.main.temp_min) }}°F
        </div>

        <div class="weather-box">
          <div class="temp"> {{ Math.round(weather.main.temp) }}°F </div>
          <div class="weather-icon"> 
            <img :src="`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`" 
            :alt="weather.weather[0].description" /></div>
          <div class="weather"> {{  weather.weather[0].main }} </div>
          
        </div>

      </div>



    </main>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      api_key: '2f6532bf0e107efc40b25b23913398f7',
      url_base: 'https://api.openweathermap.org/data/2.5/',
      query: '',
      weather: {},
      savedLocations: []
      
    }
  },
  methods:{
    fetchWeather(e) {
  if (e.key === "Enter") {
    fetch(`${this.url_base}weather?q=${this.query}&units=imperial&APPID=${this.api_key}`)
      .then((res) => res.json())
      .then((data) => {
        this.weather = data;
        this.query = '';
        if (data.sys) {
          this.weatherLocation = `${data.name}, ${data.sys.state}, ${data.sys.country}`;
        } else {
          this.weatherLocation = `${data.name}, ${data.sys.country}`;
        }
      });
  }
},

    getWeather(city) {
    fetch(`${this.url_base}weather?q=${city}&units=imperial&APPID=${this.api_key}`)
      .then(res => res.json())
      .then(this.setResults);
    },
    setResults (results){
      this.weather = results;
      this.query = '';
      if (results.weather && results.weather.length > 0) {
        this.weatherType = results.weather[0].main;
      }
    },
    saveLocation() {
      const city = this.weather.name;
      if (city && !this.savedLocations.includes(city)) {
        this.savedLocations.push(city);
      }
    },
    selectSavedLocation(city) {
      this.getWeather(city);
    },
    deleteLocation(index) {
      this.savedLocations.splice(index, 1);
    },

    dateBulider (){
      let d = new Date();
      let days = ["Sunday", "Monday", "Tuesday", 
                  "Wednesday", "Thursday", "Friday", 
                  "Saturday"];
      let months = ["January", "February", "March", 
                    "April", "May", "June", 
                    "July", "August", "September", 
                    "October", "November", "December"];
      
      let day = days[d.getDay()];
      let date = d.getDate();
      let month = months[d.getMonth()];
      let year = d.getFullYear();
      return `${day} ${month} ${date}, ${year}`;
    }



  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Delius+Unicase:wght@400;700&display=swap');

.delius-unicase-regular {
  font-family: "Delius Unicase", cursive;
  font-weight: 400;
  font-style: normal;
}

.delius-unicase-bold {
  font-family: "Delius Unicase", cursive, bold;
  font-weight: 700;
  font-style: normal;
}


*{
  margin:0;
  padding: 0;
  box-sixing: border-box;
}

body{ 
  font-family:'montserrat', sans-serif;
}

#app{
  background-image: url('@/assets/index.jpg');
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
}

#app.hot{
  background-image: url('@/assets/hot-bg.jpg');
}

#app.cold{
  background-image: url('@/assets/cold-bg.jpg');
}

main{
  min-height: 100vh;
  padding: 25px;
  background-image: linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.75));
}

.search-box{
  width: 100%;
  margin-bottom: 30px;
}

.search-box .search-bar{
  display: block;
  width: 100%;
  padding: 15px;

  color: #000000;
  font-size: 20px;
  font-family: "Delius Unicase", cursive;

  appearance: none;
  border: none;
  outline: none;
  background: none;

  box-shadow: 0px 0pc 8px rgba(0,0,0,0.25);
  background-color: rgba(255, 255, 255, 0.50 );
  border-radius: 0px 16px 0px 16px;
  transition: 0.4s;


}

.search-box .search-bar:focus{
  box-shadow: 0px 0pc 16px rgba(0,0,0,0.25);
  background-color: rgba(255, 255, 255, 0.75);
}

.location-box .location{
  color: #FFF;
  font-size:43px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  font-family: "Delius Unicase", cursive, bold;
}

.location-box .date{
  color: #FFF;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  font-family: "Delius Unicase", cursive;
  padding: 5px;
}

.temp-range{
  color: #FFF;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  font-family: "Delius Unicase", cursive;
  padding: 5px;
}

.weather-box{
  text-align: center;
}

.weather-box .temp{
  color: #FFF;
  font-size: 85px;
  font-weight: 700;
  display: inline-block;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  font-family: "Delius Unicase", cursive;
  padding: 10px 25px;
  text-shadow: 3px 6px rgba(0,0,0,0.25);
  background-color: rgba(255,255,255,0.25);
  border-radius: 16px;
  margin: 15px 0px;
  box-shadow: 3px 6px rgba(0,0,0,0.25);
}

.weather-box .weather{
  color: #FFF;
  font-size: 25px;
  font-weight: 700;
  font-style: italic;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  font-family: "Delius Unicase", cursive;
  padding: 5px;
}

.weather-icon{
  ccolor: #FFF;
  font-size: 25px;
  font-weight: 700;
  fony-style: italic;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  font-family: "Delius Unicase", cursive;
  padding: 5px;
  
}

.saved-locations {
  background-color: rgba(255,255,255,0.2);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  font-family: "Delius Unicase", cursive;
}

.saved-locations h3 {
  margin-bottom: 10px;
}

.saved-locations ul {
  list-style: none;
  padding: 0;
}

.saved-locations li {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.saved-locations button {
  background: rgba(255,255,255,0.5);
  border: none;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Delius Unicase", cursive;
}

.delete-btn {
  background-color: rgba(255, 0, 0, 0.5);
  color: white;
}

.save-btn {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  background-color: rgba(255,255,255,0.5);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Delius Unicase", cursive;
}

</style>
