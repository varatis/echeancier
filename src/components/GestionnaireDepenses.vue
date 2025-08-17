<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900">💰 Comptes Partagés</h1>

        <button
          @click="afficherModalAuth = true"
          class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full text-sm hover:bg-blue-700 transition duration-300"
        >
          Connexion / Inscription
        </button>
      </div>
    </div>

    <div class="max-w-md mx-auto px-4">
      <CartesoldeEquilibre :solde="solde" />
      <StatistiquesUtilisateurs :utilisateurs="utilisateurs" :depenses="depenses" />
      <FormulaireDepense
        v-show="afficherFormulaire"
        :utilisateurs="utilisateurs"
        @ajouter-depense="ajouterDepense"
        @annuler="afficherFormulaire = false"
      />
      <ListeDepenses
        :depenses="depenses"
        :utilisateurs="utilisateurs"
        @supprimer-depense="supprimerDepense"
      />
    </div>

    <button
      @click="basculerFormulaire"
      :class="[
        'fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-20',
        afficherFormulaire
          ? 'bg-red-500 hover:bg-red-600 rotate-45'
          : 'bg-blue-600 hover:bg-blue-700',
      ]"
    >
      <Plus class="w-6 h-6" />
    </button>
  </div>

  <ModalAuthentification v-if="afficherModalAuth" @fermer="afficherModalAuth = false" />
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import CartesoldeEquilibre from './CartesoldeEquilibre.vue'
import StatistiquesUtilisateurs from './StatistiquesUtilisateurs.vue'
import FormulaireDepense from './FormulaireDepense.vue'
import ListeDepenses from './ListeDepenses.vue'
import ModalAuthentification from './ModalAuthentification.vue' // Importez la nouvelle modale

export default {
  name: 'GestionnaireDepenses',
  components: {
    ModalAuthentification, // Ajoutez la modale aux composants
    CartesoldeEquilibre,
    StatistiquesUtilisateurs,
    FormulaireDepense,
    ListeDepenses,
    Plus,
  },
  setup() {
    const utilisateurs = ref([
      { id: 1, nom: 'Yoann L', couleur: 'bg-blue-500' },
      { id: 2, nom: 'Elodie P', couleur: 'bg-pink-500' },
    ])

    const depenses = ref([])
    const afficherFormulaire = ref(false)
    const afficherModalAuth = ref(false) // Nouvel état pour la modale d'authentification

    // ... le reste de votre code
    const solde = computed(() => {
      let totalYoann = 0
      let totalElodie = 0

      depenses.value.forEach((depense) => {
        const montant = parseFloat(depense.montant)
        if (depense.utilisateurId === 1) {
          totalElodie += montant
        } else {
          totalYoann += montant
        }
      })
      return (totalYoann - totalElodie) / 2
    })

    const ajouterDepense = (donneesDepense) => {
      const depense = {
        id: Date.now(),
        ...donneesDepense,
        montant: parseFloat(donneesDepense.montant),
        horodatage: new Date().toISOString(),
      }
      depenses.value.unshift(depense)
      afficherFormulaire.value = false
      sauvegarderDansStorage()
    }

    const supprimerDepense = (id) => {
      depenses.value = depenses.value.filter((depense) => depense.id !== id)
      sauvegarderDansStorage()
    }

    const basculerFormulaire = () => {
      afficherFormulaire.value = !afficherFormulaire.value
    }

    const sauvegarderDansStorage = () => {
      try {
        localStorage.setItem('depenses', JSON.stringify(depenses.value))
      } catch (erreur) {
        console.warn('Impossible de sauvegarder les données:', erreur)
      }
    }

    const chargerDepuisStorage = () => {
      try {
        const depensesSauvegardees = localStorage.getItem('depenses')
        if (depensesSauvegardees) {
          depenses.value = JSON.parse(depensesSauvegardees)
        }
      } catch (erreur) {
        console.warn('Impossible de charger les données:', erreur)
      }
    }

    onMounted(() => {
      chargerDepuisStorage()
    })

    watch(depenses, sauvegarderDansStorage, { deep: true })

    return {
      utilisateurs,
      depenses,
      afficherFormulaire,
      afficherModalAuth,
      solde,
      ajouterDepense,
      supprimerDepense,
      basculerFormulaire,
    }
  },
}
</script>

<style scoped>
/* Votre style existant */
.rotate-45 {
  transform: rotate(45deg);
}

@media (hover: none) and (pointer: coarse) {
  button:hover {
    transform: none !important;
  }
}
</style>
