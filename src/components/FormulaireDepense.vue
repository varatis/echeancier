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
            v-model="formulaire.montant"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="0,00"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Description </label>
          <input
            v-model="formulaire.description"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Courses, Restaurant, Essence..."
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"> Date </label>
          <input
            v-model="formulaire.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            @click="$emit('annuler')"
            class="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="!formulaireValide"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200',
              formulaireValide
                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script>
import { ref, computed } from 'vue'

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
    const formulaire = ref({
      utilisateurId: 1,
      montant: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    })

    const formulaireValide = computed(() => {
      return (
        formulaire.value.montant &&
        formulaire.value.description &&
        formulaire.value.date &&
        parseFloat(formulaire.value.montant) > 0
      )
    })

    const reinitialiserFormulaire = () => {
      formulaire.value = {
        utilisateurId: 1,
        montant: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      }
    }

    const gererSoumission = () => {
      if (!formulaireValide.value) {
        return
      }

      emit('ajouter-depense', { ...formulaire.value })
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
  transition: all 0.3s ease;
}

.glissement-bas-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.glissement-bas-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Amélioration de l'UX sur mobile */
input:focus,
select:focus {
  transform: scale(1.02);
}

@media (hover: none) and (pointer: coarse) {
  input:focus,
  select:focus {
    transform: none;
  }

  button:hover {
    transform: none !important;
  }
}
</style>
