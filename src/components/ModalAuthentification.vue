<template>
  <transition name="fade">
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center"
      @click.self="$emit('fermer')"
    >
      <transition name="pop">
        <div class="relative bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-sm" @click.stop>
          <button
            @click="$emit('fermer')"
            aria-label="Fermer"
            class="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </transition>
    </div>
  </transition>
</template>

<script setup>
import AuthentificationView from './AuthentificationView.vue'
</script>

<style scoped>
/* Animations pour une apparition plus fluide */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.pop-enter-from,
.pop-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
