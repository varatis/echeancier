<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Écran de chargement -->
    <div v-if="chargement" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Chargement...</p>
      </div>
    </div>

    <!-- Application principale -->
    <div v-else>
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-900">💰 Comptes Partagés</h1>

          <div v-if="utilisateurConnecte" class="flex items-center gap-2">
            <span class="text-sm text-gray-600">{{
              utilisateurConnecte.email || utilisateurConnecte.nom
            }}</span>
            <button
              @click="seDeconnecter"
              aria-label="Déconnexion"
              class="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
          <div v-else>
            <button
              @click="afficherModalAuth = true"
              aria-label="Connexion/Inscription"
              class="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-md mx-auto px-4">
        <CarteSoldeEquilibre :solde="solde" />
        <StatistiquesUtilisateurs :utilisateurs="utilisateurs" :depenses="depenses" />
        <FormulaireDepense
          v-show="afficherFormulaire"
          :utilisateurs="utilisateurs"
          @ajouter-depense="ajouterDepense"
          @annuler="basculerFormulaire"
        />
        <ListeDepenses
          :depenses="depenses"
          :utilisateurs="utilisateurs"
          @supprimer-depense="supprimerDepense"
        />
      </div>

      <!-- Bouton flottant pour ajouter une dépense -->
      <button
        v-if="utilisateurConnecte"
        @click="basculerFormulaire"
        class="fixed bottom-6 right-6 md:right-[calc(50vw-220px)] w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :class="{ 'rotate-45': afficherFormulaire }"
        aria-label="Ajouter une dépense"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <!-- Modal d'authentification -->
      <ModalAuthentification
        v-if="afficherModalAuth"
        @fermer="afficherModalAuth = false"
        @connexion-reussie="gererConnexionReussie"
      />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import ListeDepenses from './ListeDepenses.vue'
import CarteSoldeEquilibre from './CarteSoldeEquilibre.vue'
import FormulaireDepense from './FormulaireDepense.vue'
import StatistiquesUtilisateurs from './StatistiquesUtilisateurs.vue'
import ModalAuthentification from './ModalAuthentification.vue'

export default {
  name: 'GestionnaireDepenses',
  components: {
    ListeDepenses,
    CarteSoldeEquilibre,
    FormulaireDepense,
    StatistiquesUtilisateurs,
    ModalAuthentification,
  },
  setup() {
    // État réactif
    const utilisateurs = ref([
      { id: 1, nom: 'Alice' },
      { id: 2, nom: 'Bob' },
    ])
    const depenses = ref([])
    const afficherFormulaire = ref(false)
    const afficherModalAuth = ref(false)
    const chargement = ref(true)
    const utilisateurConnecte = ref(null)

    // Propriétés calculées
    const solde = computed(() => {
      const totalDepenses = depenses.value.reduce(
        (total, depense) => total + parseFloat(depense.montant),
        0,
      )
      return totalDepenses / utilisateurs.value.length
    })

    // Méthodes
    const ajouterDepense = (nouvelleDepense) => {
      nouvelleDepense.id = Date.now()
      nouvelleDepense.payePar = nouvelleDepense.utilisateurId
      depenses.value.unshift(nouvelleDepense)
      afficherFormulaire.value = false
      sauvegarderDepenses()
    }

    const supprimerDepense = (id) => {
      depenses.value = depenses.value.filter((depense) => depense.id !== id)
      sauvegarderDepenses()
    }

    const basculerFormulaire = () => {
      afficherFormulaire.value = !afficherFormulaire.value
    }

    const gererConnexionReussie = (donneesUtilisateur) => {
      console.log('✅ GestionnaireDepenses: Connexion réussie, réception des données utilisateur')
      // S'assurer que les données utilisateur sont bien définies
      if (donneesUtilisateur) {
        utilisateurConnecte.value = donneesUtilisateur
        afficherModalAuth.value = false
        chargerDepenses()
      } else {
        console.error('Données utilisateur manquantes ou invalides.')
      }
    }

    const seDeconnecter = () => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      utilisateurConnecte.value = null
      depenses.value = []
      console.log('🚪 Déconnexion réussie')
    }

    // Fonctions de persistance
    const sauvegarderDepenses = () => {
      if (!utilisateurConnecte.value) return
      try {
        const cle = `depenses_${utilisateurConnecte.value.email}`
        localStorage.setItem(cle, JSON.stringify(depenses.value))
        console.log('💾 Dépenses sauvegardées pour:', cle)
      } catch (erreur) {
        console.warn('Impossible de sauvegarder les dépenses:', erreur)
      }
    }

    const chargerDepenses = () => {
      if (!utilisateurConnecte.value) return
      try {
        const cle = `depenses_${utilisateurConnecte.value.email}`
        const depensesSauvegardees = localStorage.getItem(cle)
        if (depensesSauvegardees) {
          depenses.value = JSON.parse(depensesSauvegardees)
          console.log('📂 Dépenses chargées pour:', cle, depenses.value.length, 'dépenses')
        }
      } catch (erreur) {
        console.warn('Impossible de charger les dépenses:', erreur)
      }
    }

    const verifierAuthentification = () => {
      try {
        const userData = localStorage.getItem('userData')
        // S'assurer que userData n'est ni null, ni undefined, ni la chaîne "undefined"
        if (userData && userData !== 'undefined') {
          const parsedUser = JSON.parse(userData)
          utilisateurConnecte.value = parsedUser
          console.log('👤 Utilisateur déjà connecté:', utilisateurConnecte.value.email)
          chargerDepenses()
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error)
        seDeconnecter()
      } finally {
        chargement.value = false
      }
    }

    // Initialisation
    onMounted(() => {
      verifierAuthentification()
    })

    // Surveillance des changements de l'utilisateur pour sauvegarder/charger les dépenses
    watch(utilisateurConnecte, (nouveau, ancien) => {
      if (nouveau && !ancien) {
        // L'utilisateur vient de se connecter
        chargerDepenses()
      } else if (!nouveau && ancien) {
        // L'utilisateur vient de se déconnecter
        depenses.value = []
      }
    })

    return {
      utilisateurs,
      depenses,
      afficherFormulaire,
      afficherModalAuth,
      utilisateurConnecte,
      chargement,
      solde,
      ajouterDepense,
      supprimerDepense,
      basculerFormulaire,
      gererConnexionReussie,
      seDeconnecter,
    }
  },
}
</script>

<style scoped>
.rotate-45 {
  transform: rotate(45deg);
}

@media (hover: none) and (pointer: coarse) {
  button:focus {
    outline: none !important;
  }
}
</style>
