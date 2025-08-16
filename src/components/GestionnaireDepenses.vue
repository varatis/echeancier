<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- En-tête -->
    <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-md mx-auto px-4 py-4">
        <h1 class="text-xl font-bold text-gray-900 text-center">💰 Comptes Partagés</h1>
      </div>
    </div>

    <div class="max-w-md mx-auto px-4">
      <!-- Carte du solde -->
      <CartesoldeEquilibre :solde="solde" />

      <!-- Statistiques des utilisateurs -->
      <StatistiquesUtilisateurs :utilisateurs="utilisateurs" :depenses="depenses" />

      <!-- Formulaire d'ajout de dépense -->
      <FormulaireDepense
        v-show="afficherFormulaire"
        :utilisateurs="utilisateurs"
        @ajouter-depense="ajouterDepense"
        @annuler="afficherFormulaire = false"
      />

      <!-- Liste des dépenses -->
      <ListeDepenses
        :depenses="depenses"
        :utilisateurs="utilisateurs"
        @supprimer-depense="supprimerDepense"
      />
    </div>

    <!-- Bouton d'action flottant -->
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
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import CartesoldeEquilibre from './CartesoldeEquilibre.vue'
import StatistiquesUtilisateurs from './StatistiquesUtilisateurs.vue'
import FormulaireDepense from './FormulaireDepense.vue'
import ListeDepenses from './ListeDepenses.vue'

export default {
  name: 'GestionnaireDepenses',
  components: {
    CartesoldeEquilibre,
    StatistiquesUtilisateurs,
    FormulaireDepense,
    ListeDepenses,
    Plus,
  },
  setup() {
    // État réactif
    const utilisateurs = ref([
      { id: 1, nom: 'Yoann L', couleur: 'bg-blue-500' },
      { id: 2, nom: 'Elodie P', couleur: 'bg-pink-500' },
    ])

    const depenses = ref([])
    const afficherFormulaire = ref(false)

    // Calcul du solde
    const solde = computed(() => {
      let totalYoann = 0
      let totalElodie = 0

      depenses.value.forEach((depense) => {
        const montant = parseFloat(depense.montant)
        if (depense.utilisateurId === 1) {
          // Yoann
          totalElodie += montant
        } else {
          // Elodie
          totalYoann += montant
        }
      })

      // Solde = ce que Yoann doit à Elodie (positif) ou ce que Elodie doit à Yoann (négatif)
      return (totalYoann - totalElodie) / 2
    })

    // Méthodes
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

    // Persistance des données
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

    // Cycle de vie
    onMounted(() => {
      chargerDepuisStorage()
    })

    // Observateurs
    watch(depenses, sauvegarderDansStorage, { deep: true })

    return {
      utilisateurs,
      depenses,
      afficherFormulaire,
      solde,
      ajouterDepense,
      supprimerDepense,
      basculerFormulaire,
    }
  },
}
</script>

<style scoped>
/* Animation pour le bouton flottant */
.rotate-45 {
  transform: rotate(45deg);
}

/* Styles pour améliorer l'UX mobile */
@media (hover: none) and (pointer: coarse) {
  button:hover {
    transform: none !important;
  }
}
</style>
