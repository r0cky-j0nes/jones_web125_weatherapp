<template>
    <div class="search-container">
      <!-- Search input -->
      <div class="search-box">
        <input
          v-model="query"
          @keyup.enter="onSearch"
          placeholder="Enter City or ZIP"
          class="search-bar"
        />
      </div>
  
      <!-- Saved locations -->
      <div class="saved-locations" v-if="saved.length">
        <h3>Saved Locations:</h3>
        <ul>
          <li v-for="(city, i) in saved" :key="i">
            <button @click="goToCity(city)">{{ city }}</button>
            <button @click="remove(i)" class="delete-btn">✖</button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  
  // reactive state
  const query = ref('')
  const saved = ref(JSON.parse(localStorage.getItem('saved') || '[]'))
  
  const router = useRouter()
  const route  = useRoute()
  
  // 1) When user presses Enter
  function onSearch() {
    if (!query.value.trim()) return
    // Navigate to the current route with new ?city=
    router.push({
      name: route.name,
      query: { city: query.value.trim() }
    })
    // Optionally add to saved?
    // saved.value.push(query.value.trim())
    // localStorage.setItem('saved', JSON.stringify(saved.value))
  
    query.value = ''
  }
  
  // 2) Click on a saved location
  function goToCity(city) {
    router.push({ name: route.name, query: { city } })
  }
  
  // 3) Manually remove a saved location
  function remove(i) {
    saved.value.splice(i, 1)
    localStorage.setItem('saved', JSON.stringify(saved.value))
  }
  </script>
  
  <style scoped>
  .search-container {
    background: #f9f9f900;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }
  
  .search-box {
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .search-bar {
    width: 70%;
    max-width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
  }
  
  .saved-locations {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .saved-locations ul {
    list-style: none;
    padding: 0;
  }
  
  .saved-locations li {
    display: inline-block;
    align-items: center;
    gap: 0.5rem;
    margin: 0.3rem 0;
  }
  
  .saved-locations button {
    padding: 0.3rem 0.6rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .delete-btn {
    background: #c00;
    color: #fff;
  }
  </style>
  