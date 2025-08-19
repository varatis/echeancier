<template>
  <div class="mt-4">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Se connecter</h2>
    <form @submit.prevent="gererConnexion">
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          v-model="credentials.email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      <div class="mb-6">
        <label for="motDePasse" class="block text-sm font-medium text-gray-700 mb-1"
          >Mot de passe</label
        >
        <input
          id="motDePasse"
          type="password"
          v-model="credentials.motDePasse"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      <button
        type="submit"
        :disabled="chargement"
        class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
      >
        <span v-if="chargement">Connexion en cours...</span>
        <span v-else>Se connecter</span>
      </button>
    </form>
    <p
      v-if="message"
      class="text-center mt-4 text-sm font-medium"
      :class="message.includes('succès') ? 'text-green-500' : 'text-red-500'"
    >
      {{ message }}
    </p>

    <!-- Indicateur d'environnement -->
    <div class="mt-4 text-center text-xs text-gray-400">
      Environnement: {{ API_CONFIG.APP_ENV }} | API: {{ API_CONFIG.BASE_URL }}
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { API_CONFIG, apiService } from '../api'

// Define the events that will be emitted
const emit = defineEmits(['connexion-reussie'])

const credentials = reactive({
  email: '',
  motDePasse: '',
})

const message = ref('')
const chargement = ref(false)

const gererConnexion = async () => {
  chargement.value = true
  message.value = ''
  try {
    const response = await apiService.auth.login(credentials)
    const token = response.data.token
    const user = response.data.user

    // Stocker les données dans localStorage
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(user))

    message.value = 'Connexion réussie !'

    // Emet l'événement de connexion réussie avec les données de l'utilisateur
    emit('connexion-reussie', { token, user })
  } catch (erreur) {
    message.value =
      'Erreur de connexion : ' +
      (erreur.response?.data?.message || 'Email ou mot de passe incorrect.')
  } finally {
    chargement.value = false
  }
}
</script>

<style scoped>
/* Utiliser le même style que FormulaireInscription.vue pour les classes .conteneur-inscription, .groupe-champ, etc. */
/* Renommer les classes spécifiques pour éviter les conflits si nécessaire */
</style>
