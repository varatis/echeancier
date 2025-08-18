<template>
  <transition name="glissement-bas">
    <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Nouvelle dépense</h3>

      <form @submit.prevent="gererSoumission" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Qui a payé ? </label>
          <select
            v-model="formulaire.utilisateurId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option
              v-for="utilisateur in utilisateurs"
              :key="utilisateur.id"
              :value="utilisateur.id"
            >
              {{ utilisateur.nom }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Montant (€) </label>
          <input
            v-model.number="formulaire.montant"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Catégorie </label>
          <input
            v-model="formulaire.categorie"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Nourriture, Transport, etc."
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Description </label>
          <input
            v-model="formulaire.description"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Détails de la dépense"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Date </label>
          <input
            v-model="formulaire.dateDepense"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="!formulaireValide"
            class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter la dépense
          </button>
        </div>
      </form>

      <!-- Debug : Affichage des valeurs du formulaire -->
      <div class="mt-4 p-4 bg-gray-100 rounded text-sm">
        <h4>Debug - Valeurs du formulaire :</h4>
        <pre>{{ JSON.stringify(formulaire, null, 2) }}</pre>
        <p><strong>Formulaire valide :</strong> {{ formulaireValide }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'FormulaireDepense',
  props: {
    utilisateurs: {
      type: Array,
      required: true,
    },
  },
  emits: ['ajouter-depense', 'annuler'],
  setup(props, { emit }) {
    // Initialisez les valeurs du formulaire
    const formulaire = ref({
      utilisateurId: props.utilisateurs.length > 0 ? props.utilisateurs[0].id : null,
      montant: '',
      description: '',
      dateDepense: new Date().toISOString().split('T')[0],
      categorie: '',
    })

    // Watcher pour débugger les changements
    watch(
      formulaire,
      (newVal) => {
        console.log('Formulaire modifié:', newVal)
      },
      { deep: true },
    )

    const formulaireValide = computed(() => {
      const valide =
        formulaire.value.montant &&
        formulaire.value.description &&
        formulaire.value.dateDepense &&
        formulaire.value.categorie &&
        parseFloat(formulaire.value.montant) > 0 &&
        formulaire.value.utilisateurId
      console.log('Formulaire valide:', valide)
      return valide
    })

    const reinitialiserFormulaire = () => {
      formulaire.value = {
        utilisateurId: props.utilisateurs.length > 0 ? props.utilisateurs[0].id : null,
        montant: '',
        description: '',
        dateDepense: new Date().toISOString().split('T')[0],
        categorie: '',
      }
    }

    const gererSoumission = () => {
      console.log('=== SOUMISSION DU FORMULAIRE ===')
      console.log('Données du formulaire avant validation:', formulaire.value)

      if (!formulaireValide.value) {
        console.error('Formulaire non valide')
        return
      }

      const donneesAEnvoyer = {
        utilisateurId: formulaire.value.utilisateurId,
        montant: parseFloat(formulaire.value.montant),
        description: formulaire.value.description.trim(),
        dateDepense: formulaire.value.dateDepense,
        categorie: formulaire.value.categorie.trim(),
      }

      console.log('Données à envoyer:', donneesAEnvoyer)
      console.log('Types des données:', {
        utilisateurId: typeof donneesAEnvoyer.utilisateurId,
        montant: typeof donneesAEnvoyer.montant,
        description: typeof donneesAEnvoyer.description,
        dateDepense: typeof donneesAEnvoyer.dateDepense,
        categorie: typeof donneesAEnvoyer.categorie,
      })

      emit('ajouter-depense', donneesAEnvoyer)
      reinitialiserFormulaire()
    }

    return {
      formulaire,
      formulaireValide,
      gererSoumission,
    }
  },
}
</script>

<style scoped>
.glissement-bas-enter-active,
.glissement-bas-leave-active {
  transition: all 0.5s ease;
}
.glissement-bas-enter-from,
.glissement-bas-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
