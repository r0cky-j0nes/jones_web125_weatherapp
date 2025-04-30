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
      <button @click="remove(city)" class="delete-btn">✖</button>
    </li>
  </ul>
</div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// reactive state
const query   = ref('')
const saved   = ref(JSON.parse(localStorage.getItem('saved') || '[]'))

const router  = useRouter()
const route   = useRoute()

// reload helper
function loadSaved() {
  saved.value = JSON.parse(localStorage.getItem('saved') || '[]')
}

// listen for our custom event
onMounted(() => {
  window.addEventListener('saved-updated', loadSaved)
})
onBeforeUnmount(() => {
  window.removeEventListener('saved-updated', loadSaved)
})

// 1) Search on Enter
function onSearch() {
  if (!query.value.trim()) return
  router.push({
    name:  route.name,
    query: { city: query.value.trim() }
  })
  query.value = ''
}

// 2) Navigate to a saved location
function goToCity(city) {
  router.push({ name: route.name, query: { city } })
}

// 3) Remove by index
function remove(index) {
  saved.value.splice(index, 1)
  localStorage.setItem('saved', JSON.stringify(saved.value))
}

// 4) (elsewhere, in weatherHome.vue) after you write localStorage:
//    window.dispatchEvent(new Event('saved-updated'))
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
  