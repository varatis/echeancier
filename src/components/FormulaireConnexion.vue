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
        class="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Se connecter
      </button>
    </form>
    <p v-if="message" class="text-center mt-4 text-sm font-medium text-red-500">{{ message }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '../services/api'

const credentials = reactive({
  email: '',
  motDePasse: '',
})

const message = ref('')

const gererConnexion = async () => {
  try {
    const reponse = await api.post('/utilisateurs/connexion', credentials)
    const token = reponse.data.token
    localStorage.setItem('authToken', token)
    message.value = 'Connexion réussie ! Token stocké.'
    console.log('Connexion réussie ! Token stocké.', token)

    // Gérer la redirection vers une page sécurisée
    // window.location.href = '/dashboard';
  } catch (erreur) {
    message.value =
      'Erreur de connexion : ' +
      (erreur.response?.data?.message || 'Email ou mot de passe incorrect.')
    console.error('Erreur lors de la connexion', erreur)
  }
}
</script>

<style scoped>
/* Utiliser le même style que FormulaireInscription.vue pour les classes .conteneur-inscription, .groupe-champ, etc. */
/* Renommer les classes spécifiques pour éviter les conflits si nécessaire */
.conteneur-connexion {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.bouton-connexion {
  width: 100%;
  padding: 0.8rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.bouton-connexion:hover {
  background-color: #218838;
}

.message {
  text-align: center;
  margin-top: 1rem;
  color: red;
}
</style>
