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
        <FormulaireInscription />
      </div>

      <div v-if="mode === 'connexion'">
        <FormulaireConnexion />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormulaireInscription from './FormulaireInscription.vue'
import FormulaireConnexion from './FormulaireConnexion.vue'

const mode = ref('connexion') // 'connexion' ou 'inscription'
</script>
