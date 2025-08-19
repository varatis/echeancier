<template>
  <transition name="fondu-enchaine">
    <div
      v-if="afficher"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="$emit('fermer')"
    >
      <div
        class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 transform transition-all duration-300"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">
            {{ estConnexion ? 'Connexion' : 'Inscription' }}
          </h3>
          <button @click="$emit('fermer')" class="p-2 text-gray-400 hover:text-gray-600">
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
        </div>

        <form @submit.prevent="gererAuthentification" class="space-y-4">
          <div v-if="!estConnexion">
            <label for="nomUtilisateur" class="block text-sm font-medium text-gray-700"
              >Nom d'utilisateur</label
            >
            <input
              v-model="formulaire.nomUtilisateur"
              id="nomUtilisateur"
              type="text"
              class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="formulaire.email"
              id="email"
              type="email"
              class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label for="motDePasse" class="block text-sm font-medium text-gray-700"
              >Mot de passe</label
            >
            <input
              v-model="formulaire.motDePasse"
              id="motDePasse"
              type="password"
              class="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <p v-if="erreur" class="text-sm text-red-500">{{ erreur }}</p>

          <button
            type="submit"
            :disabled="chargementAuth"
            class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
          >
            <span v-if="!chargementAuth">{{ estConnexion ? 'Se connecter' : "S'inscrire" }}</span>
            <span v-else>
              <svg
                class="animate-spin h-5 w-5 text-white inline-block mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Chargement...
            </span>
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-500">
          <button @click="basculerVue" class="text-blue-600 hover:text-blue-700">
            {{
              estConnexion ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'
            }}
          </button>
        </p>

        <!-- Indicateur d'environnement en bas de la modale -->
        <div class="mt-4 text-center text-xs text-gray-400">
          Environnement: {{ API_CONFIG.APP_ENV }} | API: {{ isLocalMode() ? 'Local' : 'Distant' }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue'
import { API_CONFIG, apiService, isLocalMode } from '../api'

export default {
  name: 'ModalAuthentification',
  props: {
    afficher: Boolean,
  },
  emits: ['fermer', 'connexion-reussie'],
  setup(props, { emit }) {
    const estConnexion = ref(true)
    const formulaire = ref({
      nomUtilisateur: '',
      email: '',
      motDePasse: '',
    })
    const chargementAuth = ref(false)
    const erreur = ref('')

    const basculerVue = () => {
      estConnexion.value = !estConnexion.value
      erreur.value = ''
    }

    const gererAuthentification = async () => {
      chargementAuth.value = true
      erreur.value = ''

      try {
        let response

        if (estConnexion.value) {
          // Connexion
          response = await apiService.auth.login({
            email: formulaire.value.email,
            motDePasse: formulaire.value.motDePasse,
          })
        } else {
          // Inscription
          response = await apiService.auth.register({
            nomUtilisateur: formulaire.value.nomUtilisateur,
            email: formulaire.value.email,
            motDePasse: formulaire.value.motDePasse,
          })
        }

        const data = response.data

        if (data && data.user && data.token) {
          const utilisateurConnecte = {
            id: data.user.id,
            nom: data.user.nomUtilisateur,
            email: data.user.email,
            token: data.token,
          }

          localStorage.setItem('userData', JSON.stringify(utilisateurConnecte))
          localStorage.setItem('authToken', data.token)

          // Émettre l'événement de succès
          emit('connexion-reussie', utilisateurConnecte)

          // Réinitialiser le formulaire
          formulaire.value = {
            nomUtilisateur: '',
            email: '',
            motDePasse: '',
          }
        } else {
          throw new Error('Réponse invalide du serveur')
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error)
        erreur.value =
          error.response?.data?.message || error.message || "Échec de l'authentification"
      } finally {
        chargementAuth.value = false
      }
    }

    return {
      estConnexion,
      formulaire,
      chargementAuth,
      erreur,
      basculerVue,
      gererAuthentification,
      API_CONFIG,
      isLocalMode,
    }
  },
}
</script>

<style scoped>
.fondu-enchaine-enter-active,
.fondu-enchaine-leave-active {
  transition: opacity 0.3s ease;
}

.fondu-enchaine-enter-from,
.fondu-enchaine-leave-to {
  opacity: 0;
}
</style>
