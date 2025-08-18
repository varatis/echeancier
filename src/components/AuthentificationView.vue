<template>
  <div>
    <div class="w-full">
      <div class="flex rounded-full bg-gray-100 p-1 mb-6">
        <button
          @click="mode = 'connexion'"
          :class="[
            'w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-200',
            mode === 'connexion'
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-900',
          ]"
        >
          Se connecter
        </button>
        <button
          @click="mode = 'inscription'"
          :class="[
            'w-1/2 py-2 text-sm font-semibold rounded-full transition-colors duration-200',
            mode === 'inscription'
              ? 'bg-white shadow text-gray-900'
              : 'text-gray-500 hover:text-gray-900',
          ]"
        >
          S'inscrire
        </button>
      </div>

      <div v-if="mode === 'inscription'">
        <FormulaireInscription @inscription-reussie="gererInscriptionReussie" />
      </div>

      <div v-if="mode === 'connexion'">
        <FormulaireConnexion @connexion-reussie="gererConnexionReussie" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import FormulaireInscription from './FormulaireInscription.vue'
import FormulaireConnexion from './FormulaireConnexion.vue'

// Define the events that will be emitted
const emit = defineEmits(['connexion-reussie'])

// Reactive state to toggle between forms
const mode = ref('connexion') // 'connexion' or 'inscription'

// Handles successful login after the child component emits the event
const gererConnexionReussie = (donneesUtilisateur) => {
  // Store user data in localStorage
  localStorage.setItem('userData', JSON.stringify(donneesUtilisateur))

  // Emit the event to the parent component (ModalAuthentification)
  emit('connexion-reussie', donneesUtilisateur)
}

// Handles successful registration
const gererInscriptionReussie = () => {
  mode.value = 'connexion' // After registration, switch to the login screen
}
</script>

<style scoped>
/* Your existing styles */
</style>
