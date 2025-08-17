<template>
  <transition name="fade">
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex justify-center items-center"
      @click.self="fermerModal"
    >
      <transition name="pop">
        <div class="relative bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-sm" @click.stop>
          <button
            @click="fermerModal"
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
          <AuthentificationView @connexion-reussie="gererConnexionReussie" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { defineEmits, onMounted, onUnmounted, ref } from 'vue'
import AuthentificationView from './AuthentificationView.vue'

const emit = defineEmits(['fermer', 'connexion-reussie'])
let intervalId = null
const isConnected = ref(false)

const fermerModal = () => {
  emit('fermer')
}

const gererConnexionReussie = (donneesUtilisateur) => {
  console.log('🔄 Modal: Émission de connexion-reussie vers le parent')
  // Pass the user data up to the parent component (GestionnaireDepenses)
  emit('connexion-reussie', donneesUtilisateur)
}

const verifierAuthentification = () => {
  try {
    const userData = localStorage.getItem('userData')
    if (userData && userData !== 'undefined') {
      const userParsed = JSON.parse(userData)
      gererConnexionReussie(userParsed)
      return true
    }
  } catch (error) {
    console.error('🔄 Modal: Erreur parsing userData:', error)
  }
  return false
}

onMounted(() => {
  console.log('🔄 Modal: Démarrage de la surveillance')
  if (verifierAuthentification()) {
    return
  }
  intervalId = setInterval(() => {
    if (verifierAuthentification()) {
      clearInterval(intervalId)
    }
  }, 1000)
  const handleStorageChange = (e) => {
    if (e.key === 'authToken' && e.newValue) {
      console.log('📱 Modal: Token détecté via storage event')
      setTimeout(() => {
        if (verifierAuthentification()) {
          clearInterval(intervalId)
        }
      }, 100)
    }
  }
  window.addEventListener('storage', handleStorageChange)
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
    if (intervalId) {
      clearInterval(intervalId)
    }
    console.log('🔄 Modal: Nettoyage terminé')
  })
})
</script>

<style scoped>
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
  transition: all 0.3s ease-out;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
