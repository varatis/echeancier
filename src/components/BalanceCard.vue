<template>
  <div class="mt-6 bg-white rounded-xl shadow-sm border p-6">
    <div class="text-center">
      <div class="flex items-center justify-center mb-2">
        <Calculator class="w-6 h-6 text-gray-600 mr-2" />
        <h2 class="text-lg font-semibold text-gray-800">Solde</h2>
      </div>

      <div :class="[
        'text-3xl font-bold mb-2 transition-colors duration-300',
        balance > 0 ? 'text-red-600' : balance < 0 ? 'text-green-600' : 'text-gray-600'
      ]">
        {{ formatAmount(Math.abs(balance)) }}
      </div>

      <p class="text-sm text-gray-600">
        <span v-if="balance > 0">
          Yoann doit {{ formatAmount(balance) }} à Elodie
        </span>
        <span v-else-if="balance < 0">
          Elodie doit {{ formatAmount(Math.abs(balance)) }} à Yoann
        </span>
        <span v-else class="text-green-600 font-medium">
          Vous êtes à égalité ! 🎉
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { Calculator } from 'lucide-vue-next'

export default {
  name: 'BalanceCard',
  components: {
    Calculator
  },
  props: {
    balance: {
      type: Number,
      required: true
    }
  },
  setup() {
    const formatAmount = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    return {
      formatAmount
    }
  }
}
</script>
