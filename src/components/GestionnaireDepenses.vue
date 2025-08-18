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

      <!-- Contenu principal -->
      <div class="max-w-md mx-auto px-4 py-8">
        <!-- Carte du solde -->
        <CarteSoldeEquilibre
          :solde="solde"
          :utilisateur-connecte="utilisateurConnecte"
          :utilisateurs="utilisateurs"
        />

        <!-- Bouton pour ajouter une dépense -->
        <div class="flex items-center justify-between mt-6">
          <h2 class="text-xl font-bold text-gray-900">Vos Dépenses</h2>
          <button
            v-if="!afficherFormulaire"
            @click="basculerFormulaire"
            aria-label="Ajouter une nouvelle dépense"
            class="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        <!-- Formulaire d'ajout de dépense -->
        <FormulaireDepense
          v-show="afficherFormulaire"
          :utilisateurs="utilisateurs"
          @ajouter-depense="ajouterDepense"
          @annuler="basculerFormulaire"
        />

        <!-- Statistiques par utilisateur -->
        <StatistiquesUtilisateurs :utilisateurs="utilisateurs" :depenses="depenses" />

        <!-- Liste des dépenses -->
        <ListeDepenses
          :utilisateurs="utilisateurs"
          :depenses="depenses"
          @supprimer-depense="supprimerDepense"
        />
      </div>
    </div>

    <!-- Modale d'authentification -->
    <ModalAuthentification
      :afficher="afficherModalAuth"
      @fermer="afficherModalAuth = false"
      @connexion-reussie="gererConnexionReussie"
    />
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
    const utilisateurs = ref([])
    const depenses = ref([])
    const afficherFormulaire = ref(false)
    const afficherModalAuth = ref(false)
    const chargement = ref(true)
    const utilisateurConnecte = ref(null)

    // Propriétés calculées
    const solde = computed(() => {
      if (!utilisateurConnecte.value || utilisateurs.value.length === 0) {
        return 0
      }

      // Calcul du total des dépenses par utilisateur
      const depensesParUtilisateur = {}

      // Initialiser les soldes à 0
      utilisateurs.value.forEach((user) => {
        depensesParUtilisateur[user.id] = 0
      })

      // Additionner les dépenses de chaque utilisateur
      depenses.value.forEach((depense) => {
        if (depensesParUtilisateur.hasOwnProperty(depense.utilisateurId)) {
          depensesParUtilisateur[depense.utilisateurId] += parseFloat(depense.montant)
        }
      })

      // Calcul de la moyenne des dépenses
      const totalDepenses = Object.values(depensesParUtilisateur).reduce(
        (sum, montant) => sum + montant,
        0,
      )
      const moyenneParPersonne = totalDepenses / utilisateurs.value.length

      // Pour un groupe de 2 : retourner la différence entre utilisateur connecté et moyenne
      if (utilisateurs.value.length === 2) {
        const depensesUtilisateurConnecte =
          depensesParUtilisateur[utilisateurConnecte.value.id] || 0
        return depensesUtilisateurConnecte - moyenneParPersonne
      }

      // Pour plus de 2 utilisateurs : retourner le solde de l'utilisateur connecté par rapport à la moyenne
      const depensesUtilisateurConnecte = depensesParUtilisateur[utilisateurConnecte.value.id] || 0
      return depensesUtilisateurConnecte - moyenneParPersonne
    })

    const API_URL = 'http://localhost:8080/api'

    // Méthodes
    const ajouterDepense = async (nouvelleDepense) => {
      try {
        // Validation côté client

        if (!nouvelleDepense.dateDepense) {
          throw new Error('La date est obligatoire')
        }

        // Préparation des données pour l'API
        const donneesAPI = {
          montant: parseFloat(nouvelleDepense.montant),
          description: nouvelleDepense.description.trim(),
          dateDepense: nouvelleDepense.dateDepense,
        }

        const url = `${API_URL}/depenses/utilisateur/${nouvelleDepense.utilisateurId}`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(donneesAPI),
        })

        if (!response.ok) {
          const errorText = await response.text()

          try {
            const errorJson = JSON.parse(errorText)
            throw new Error(errorJson.erreur || `Erreur HTTP: ${response.status}`)
          } catch (parseError) {
            throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`)
          }
        }

        const data = await response.json()

        // Rafraîchir la liste des dépenses
        await chargerDepenses()
        afficherFormulaire.value = false
      } catch (error) {
        // Afficher l'erreur à l'utilisateur
        // (ajustez selon votre système de notification)
        alert(`Erreur lors de l'ajout de la dépense: ${error.message}`)
      }
    }

    const supprimerDepense = async (id) => {
      if (
        !utilisateurConnecte.value ||
        !utilisateurConnecte.value.id ||
        !localStorage.getItem('authToken')
      ) {
        return
      }

      const authToken = localStorage.getItem('authToken')

      try {
        const response = await fetch(`http://localhost:8080/api/depenses/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        // Actualiser la liste des dépenses après la suppression
        await chargerDepenses()
      } catch (error) {}
    }

    const basculerFormulaire = () => {
      afficherFormulaire.value = !afficherFormulaire.value
    }

    const gererConnexionReussie = async (donneesUtilisateur) => {
      if (donneesUtilisateur && donneesUtilisateur.id) {
        utilisateurConnecte.value = donneesUtilisateur
        afficherModalAuth.value = false
        await chargerUtilisateurs()
        await chargerDepenses()
      }
    }

    const seDeconnecter = () => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      utilisateurConnecte.value = null
      depenses.value = []
    }

    // Fonctions de persistance
    // Remplacez la fonction chargerDepenses par cette version :

    const chargerDepenses = async () => {
      if (!utilisateurConnecte.value || !localStorage.getItem('authToken')) {
        depenses.value = []
        return
      }

      const authToken = localStorage.getItem('authToken')

      try {
        // CHANGEMENT : Appel à l'endpoint pour toutes les dépenses au lieu d'un utilisateur spécifique
        const response = await fetch(
          `http://localhost:8080/api/depenses`, // Suppression de /utilisateur/${utilisateurId}
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        depenses.value = data
      } catch (erreur) {
        depenses.value = []
      }
    }

    const chargerUtilisateurs = async () => {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) {
        return
      }
      try {
        const response = await fetch('http://localhost:8080/api/utilisateurs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()
        utilisateurs.value = data.map((user) => ({
          id: user.id,
          nom: user.nomUtilisateur,
          email: user.email,
          couleur: 'bg-gray-500', // Couleur par défaut
        }))
      } catch (error) {}
    }

    // Initialisation
    onMounted(async () => {
      await chargerUtilisateurs()
      try {
        const userData = localStorage.getItem('userData')
        if (userData && userData !== 'undefined') {
          const parsedUser = JSON.parse(userData)
          if (parsedUser && parsedUser.id) {
            utilisateurConnecte.value = parsedUser
            await chargerDepenses()
          } else {
            seDeconnecter()
          }
        }
      } catch (error) {
        seDeconnecter()
      } finally {
        chargement.value = false
      }
    })

    // Surveillance des changements de l'utilisateur pour sauvegarder/charger les dépenses
    watch(utilisateurConnecte, (nouveau, ancien) => {
      if (nouveau && !ancien && nouveau.id) {
        chargerDepenses()
      } else if (!nouveau && ancien) {
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

@media (hover: hover) and (pointer: fine) {
  .hover\:shadow-md:hover {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
