<template>
  <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="text-center">
      <div class="flex items-center justify-center mb-2">
        <Calculatrice class="w-6 h-6 text-gray-600 mr-2" />
        <h2 class="text-lg font-semibold text-gray-800">Solde</h2>
      </div>

      <div
        :class="[
          'text-3xl font-bold mb-2 transition-colors duration-300',
          solde > 0 ? 'text-green-600' : solde < 0 ? 'text-red-600' : 'text-gray-600',
        ]"
      >
        {{ formaterMontant(Math.abs(solde)) }}
      </div>

      <p class="text-sm text-gray-600">
        <span v-if="solde > 0 && utilisateurConnecte && autreUtilisateur">
          {{ autreUtilisateur.nom || autreUtilisateur.nomUtilisateur }} doit
          {{ formaterMontant(solde) }} à
          {{ utilisateurConnecte.nom || utilisateurConnecte.nomUtilisateur }}
        </span>
        <span v-else-if="solde < 0 && utilisateurConnecte && autreUtilisateur">
          {{ utilisateurConnecte.nom || utilisateurConnecte.nomUtilisateur }} doit
          {{ formaterMontant(Math.abs(solde)) }} à
          {{ autreUtilisateur.nom || autreUtilisateur.nomUtilisateur }}
        </span>
        <span v-else-if="solde === 0" class="text-green-600 font-medium">
          Vous êtes à égalité ! 🎉
        </span>
        <span v-else class="text-gray-500">
          <!-- Affichage par défaut si pas assez d'utilisateurs -->
          Solde global du groupe
        </span>
      </p>

      <!-- Informations supplémentaires si plus de 2 utilisateurs -->
      <div v-if="utilisateurs.length > 2" class="mt-3 pt-3 border-t border-gray-100">
        <p class="text-xs text-gray-500">Groupe de {{ utilisateurs.length }} personnes</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { Calculator as Calculatrice } from 'lucide-vue-next'

export default {
  name: 'CarteSoldeEquilibre',
  components: {
    Calculatrice,
  },
  props: {
    solde: {
      type: Number,
      required: true,
    },
    utilisateurConnecte: {
      type: Object,
      default: null,
    },
    utilisateurs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const formaterMontant = (montant) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(montant)
    }

    // Calcul de l'autre utilisateur (utile pour les groupes de 2 personnes)
    const autreUtilisateur = computed(() => {
      if (!props.utilisateurConnecte || props.utilisateurs.length !== 2) {
        return null
      }
      return props.utilisateurs.find((u) => u.id !== props.utilisateurConnecte.id)
    })

    return {
      formaterMontant,
      autreUtilisateur,
    }
  },
}
</script>
