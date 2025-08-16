<script>
import ExpenseTracker from './components/ExpenseTracker.vue'

export default {
  name: 'App',
  components: {
    ExpenseTracker
  }
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <ExpenseTracker />
  </div>
</template>



<style>
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Styles pour mobile */
@media (max-width: 768px) {
  input, select {
    font-size: 16px; /* Évite le zoom automatique sur iOS */
  }
}

/* Animation pour les transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
