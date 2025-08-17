<template>
  <div class="mt-4">
    <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">S'inscrire</h2>
    <form @submit.prevent="gererInscription">
      <div class="mb-4">
        <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
        <input
          id="nom"
          type="text"
          v-model="credentials.nomUtilisateur"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      <div class="mb-4">
        <label for="email-inscription" class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          id="email-inscription"
          type="email"
          v-model="credentials.email"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      <div class="mb-6">
        <label for="motDePasse-inscription" class="block text-sm font-medium text-gray-700 mb-1"
          >Mot de passe</label
        >
        <input
          id="motDePasse-inscription"
          type="password"
          v-model="credentials.motDePasse"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        S'inscrire
      </button>
    </form>
    <p
      v-if="message"
      class="text-center mt-4 text-sm font-medium"
      :class="message.includes('succès') ? 'text-green-500' : 'text-red-500'"
    >
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const credentials = ref({
  nomUtilisateur: '',
  email: '',
  motDePasse: '',
})

const message = ref('')

const gererInscription = async () => {
  try {
    const reponse = await api.post('/utilisateurs/inscription', credentials.value)
    message.value = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
    credentials.value.nomUtilisateur = ''
    credentials.value.email = ''
    credentials.value.motDePasse = ''
  } catch (erreur) {
    if (erreur.response) {
      if (erreur.response.status === 409) {
        message.value = "L'email est déjà utilisé. Veuillez en choisir un autre."
      } else {
        message.value =
          'Erreur du serveur : ' +
          (erreur.response.data.message || "Problème lors de l'inscription.")
      }
    } else if (erreur.request) {
      message.value = 'Problème de réseau. Vérifiez que le backend est bien démarré.'
    } else {
      message.value = 'Erreur de configuration de la requête.'
    }
    console.error("Erreur lors de l'inscription", erreur)
  }
}
</script>
