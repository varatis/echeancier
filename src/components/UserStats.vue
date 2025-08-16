<template>
  <div class="mt-6 grid grid-cols-2 gap-4">
    <div
      v-for="user in users"
      :key="user.id"
      class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div class="flex items-center mb-2">
        <div :class="['w-3 h-3 rounded-full mr-2', user.color]"></div>
        <h3 class="font-semibold text-gray-800 text-sm">{{ user.name }}</h3>
      </div>
      <div class="text-lg font-bold text-gray-900">
        {{ formatAmount(getTotalByUser(user.id)) }}
      </div>
      <div class="text-xs text-gray-500">
        {{ getExpenseCountByUser(user.id) }} dépense{{ getExpenseCountByUser(user.id) > 1 ? 's' : '' }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserStats',
  props: {
    users: {
      type: Array,
      required: true
    },
    expenses: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const formatAmount = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    const getTotalByUser = (userId) => {
      return props.expenses
        .filter(expense => expense.userId === userId)
        .reduce((total, expense) => total + expense.amount, 0)
    }

    const getExpenseCountByUser = (userId) => {
      return props.expenses.filter(expense => expense.userId === userId).length
    }

    return {
      formatAmount,
      getTotalByUser,
      getExpenseCountByUser
    }
  }
}
</script>
