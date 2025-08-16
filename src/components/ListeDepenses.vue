<template>
  <div class="mt-6 mb-6">
    <div class="flex items-center mb-4">
      <Historique class="w-5 h-5 text-gray-600 mr-2" />
      <h3 class="text-lg font-semibold text-gray-800">Historique</h3>
      <span class="ml-auto text-sm text-gray-500">
        {{ depenses.length }} dépense{{ depenses.length > 1 ? 's' : '' }}
      </span>
    </div>

    <!-- État vide -->
    <div
      v-if="depenses.length === 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
    >
      <Euro class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">Aucune dépense enregistrée</p>
      <p class="text-sm text-gray-400 mt-1">Ajoutez votre première dépense !</p>
    </div>

    <!-- Liste des dépenses -->
    <div v-else class="space-y-3">
      <transition-group name="liste-depenses" tag="div">
        <div
          v-for="depense in depenses"
          :key="depense.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-1">
                <div
                  :class="[
                    'w-3 h-3 rounded-full mr-2',
                    obtenirCouleurUtilisateur(depense.utilisateurId),
                  ]"
                ></div>
                <span class="font-medium text-gray-900">{{
                  obtenirNomUtilisateur(depense.utilisateurId)
                }}</span>
                <span class="ml-2 text-xs text-gray-400">
                  {{ formaterDate(depense.date) }}
                </span>
              </div>
              <h4 class="font-semibold text-gray-800 mb-1">{{ depense.description }}</h4>
              <p class="text-xs text-gray-500">
                {{ formaterDateHeure(depense.horodatage) }}
              </p>
            </div>
            <div class="text-right ml-4">
              <div class="text-lg font-bold text-gray-900 mb-1">
                {{ formaterMontant(depense.montant) }}
              </div>
              <button
                @click="confirmerSuppression(depense)"
                class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-all duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Boîte de dialogue de confirmation de suppression -->
    <div
      v-if="depenseASupprimer"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="annulerSuppression"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-1">Êtes-vous sûr de vouloir supprimer cette dépense ?</p>
        <p class="text-sm text-gray-500 mb-4">
          <strong>{{ depenseASupprimer.description }}</strong> -
          {{ formaterMontant(depenseASupprimer.montant) }}
        </p>
        <div class="flex gap-3">
          <button
            @click="annulerSuppression"
            class="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            @click="gererSuppression"
            class="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { History as Historique, Euro } from 'lucide-vue-next'

export default {
  name: 'ListeDepenses',
  components: {
    Historique,
    Euro,
  },
  props: {
    depenses: {
      type: Array,
      required: true,
    },
    utilisateurs: {
      type: Array,
      required: true,
    },
  },
  emits: ['supprimer-depense'],
  setup(props, { emit }) {
    const depenseASupprimer = ref(null)

    const formaterMontant = (montant) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(montant)
    }

    const formaterDate = (chaineDate) => {
      const date = new Date(chaineDate)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      })
    }

    const formaterDateHeure = (horodatage) => {
      const date = new Date(horodatage)
      return (
        date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }) +
        ' à ' +
        date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }

    const obtenirNomUtilisateur = (utilisateurId) => {
      return props.utilisateurs.find((utilisateur) => utilisateur.id === utilisateurId)?.nom || ''
    }

    const obtenirCouleurUtilisateur = (utilisateurId) => {
      return (
        props.utilisateurs.find((utilisateur) => utilisateur.id === utilisateurId)?.couleur ||
        'bg-gray-500'
      )
    }

    const confirmerSuppression = (depense) => {
      depenseASupprimer.value = depense
    }

    const annulerSuppression = () => {
      depenseASupprimer.value = null
    }

    const gererSuppression = () => {
      if (depenseASupprimer.value) {
        emit('supprimer-depense', depenseASupprimer.value.id)
        depenseASupprimer.value = null
      }
    }

    return {
      depenseASupprimer,
      formaterMontant,
      formaterDate,
      formaterDateHeure,
      obtenirNomUtilisateur,
      obtenirCouleurUtilisateur,
      confirmerSuppression,
      annulerSuppression,
      gererSuppression,
    }
  },
}
</script>

<style scoped>
/* Animation pour les éléments de la liste */
.liste-depenses-enter-active,
.liste-depenses-leave-active {
  transition: all 0.3s ease;
}

.liste-depenses-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.liste-depenses-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.liste-depenses-move {
  transition: transform 0.3s ease;
}

/* Amélioration de l'UX sur mobile */
@media (hover: none) and (pointer: coarse) {
  button:hover {
    transform: none !important;
  }
}

/* Animation pour la boîte de dialogue */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
