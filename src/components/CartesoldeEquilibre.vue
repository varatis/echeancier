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
          solde > 0 ? 'text-red-600' : solde < 0 ? 'text-green-600' : 'text-gray-600',
        ]"
      >
        {{ formaterMontant(Math.abs(solde)) }}
      </div>

      <p class="text-sm text-gray-600">
        <span v-if="solde > 0"> Yoann doit {{ formaterMontant(solde) }} à Elodie </span>
        <span v-else-if="solde < 0">
          Elodie doit {{ formaterMontant(Math.abs(solde)) }} à Yoann
        </span>
        <span v-else class="text-green-600 font-medium"> Vous êtes à égalité ! 🎉 </span>
      </p>
    </div>
  </div>
</template>

<script>
import { Calculator as Calculatrice } from 'lucide-vue-next'

export default {
  name: 'CartesoldeEquilibre',
  components: {
    Calculatrice,
  },
  props: {
    solde: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const formaterMontant = (montant) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(montant)
    }

    return {
      formaterMontant,
    }
  },
}
</script>
