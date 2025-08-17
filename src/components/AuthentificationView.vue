<template>
  <div class="max-w-md mx-auto p-8 mt-10 bg-white rounded-lg shadow-xl">
    <div class="flex justify-between mb-6">
      <button
        @click="mode = 'connexion'"
        :class="[
          'w-1/2 py-2 text-lg font-bold rounded-l-lg',
          mode === 'connexion' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800',
        ]"
      >
        Se connecter
      </button>
      <button
        @click="mode = 'inscription'"
        :class="[
          'w-1/2 py-2 text-lg font-bold rounded-r-lg',
          mode === 'inscription' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800',
        ]"
      >
        S'inscrire
      </button>
    </div>

    <div v-if="mode === 'inscription'">
      <h2 class="text-2xl font-bold mb-4 text-center">Créer un compte</h2>
      <FormulaireInscription />
    </div>

    <div v-if="mode === 'connexion'">
      <h2 class="text-2xl font-bold mb-4 text-center">Se connecter</h2>
      <FormulaireConnexion />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormulaireInscription from './FormulaireInscription.vue'
import FormulaireConnexion from './FormulaireConnexion.vue'

const mode = ref('connexion') // 'connexion' ou 'inscription'
</script>
