<template>
  <div id="app">
      
    <SearchBar />
    <router-view/>
    
    
  </div>
</template>

<script>
import SearchBar from '@/views/SearchBar.vue'

export default {
  name: 'App',
  components: { SearchBar }
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
  box-sizing: border-box;
}

body{ 
  font-family:'montserrat', sans-serif;
}

#app{
  background-image: url(assets/index.jpg);
  background-size: cover;
  background-position: bottom;
  transition: 0.4s;
}

#app.hot{
  background-image: url(assets/hot-bg.jpg);
}

#app.cold{
  background-image: url('assets/cold-bg.jpg');
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
  color: #FFF;
  font-size: 25px;
  font-weight: 700;
  font-style: italic;
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

nav{
  text-align:center;
}

nav li{
  display: inline-block;
  align-items: center;
  text-align:center;
  gap: 15px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  color: #FFF;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
  font-family: "Delius Unicase", cursive;
  padding: 15px;
  margin: 10px;
}


nav a {
  text-decoration: none;
  font-weight: bold;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  text-align: center;
  transition: background 0.3s ease-in-out;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}


</style>
