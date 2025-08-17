<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center"
    @click.self="$emit('fermer')"
  >
    <div class="relative bg-white rounded-lg shadow-xl p-8 max-w-lg w-full mx-4 my-20" @click.stop>
      <button
        @click="$emit('fermer')"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <AuthentificationView />
    </div>
  </div>
</template>

<script setup>
import AuthentificationView from './AuthentificationView.vue'
</script>
