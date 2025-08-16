<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b sticky top-0 z-10">
      <div class="max-w-md mx-auto px-4 py-4">
        <h1 class="text-xl font-bold text-gray-900 text-center">
          💰 Comptes Partagés
        </h1>
      </div>
    </div>

    <div class="max-w-md mx-auto px-4">
      <!-- Balance Card -->
      <BalanceCard :balance="balance" />

      <!-- User Stats -->
      <UserStats :users="users" :expenses="expenses" />

      <!-- Add Expense Form -->
      <ExpenseForm
        v-show="showAddForm"
        :users="users"
        @add-expense="addExpense"
        @cancel="showAddForm = false"
      />

      <!-- Expenses List -->
      <ExpenseList
        :expenses="expenses"
        :users="users"
        @delete-expense="deleteExpense"
      />
    </div>

    <!-- Floating Action Button -->
    <button
      @click="toggleAddForm"
      :class="[
        'fixed bottom-6 right-6 w-14 h-14 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-20',
        showAddForm ? 'bg-red-500 hover:bg-red-600 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
      ]"
    >
      <Plus class="w-6 h-6" />
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import BalanceCard from './BalanceCard.vue'
import UserStats from './UserStats.vue'
import ExpenseForm from './ExpenseForm.vue'
import ExpenseList from './ExpenseList.vue'

export default {
  name: 'ExpenseTracker',
  components: {
    BalanceCard,
    UserStats,
    ExpenseForm,
    ExpenseList,
    Plus
  },
  setup() {
    // État réactif
    const users = ref([
      { id: 1, name: 'Yoann L', color: 'bg-blue-500' },
      { id: 2, name: 'Elodie P', color: 'bg-pink-500' }
    ])

    const expenses = ref([])
    const showAddForm = ref(false)

    // Calcul du solde
    const balance = computed(() => {
      let yoannTotal = 0
      let elodieTotal = 0

      expenses.value.forEach(expense => {
        const amount = parseFloat(expense.amount)
        if (expense.userId === 1) { // Yoann
          yoannTotal += amount
        } else { // Elodie
          elodieTotal += amount
        }
      })

      // Balance = ce que Yoann doit à Elodie (positif) ou ce que Elodie doit à Yoann (négatif)
      return (yoannTotal - elodieTotal) / 2
    })

    // Méthodes
    const addExpense = (expenseData) => {
      const expense = {
        id: Date.now(),
        ...expenseData,
        amount: parseFloat(expenseData.amount),
        timestamp: new Date().toISOString()
      }

      expenses.value.unshift(expense)
      showAddForm.value = false
      saveToLocalStorage()
    }

    const deleteExpense = (id) => {
      expenses.value = expenses.value.filter(expense => expense.id !== id)
      saveToLocalStorage()
    }

    const toggleAddForm = () => {
      showAddForm.value = !showAddForm.value
    }

    // Persistance des données
    const saveToLocalStorage = () => {
      try {
        localStorage.setItem('expenses', JSON.stringify(expenses.value))
      } catch (error) {
        console.warn('Impossible de sauvegarder les données:', error)
      }
    }

    const loadFromLocalStorage = () => {
      try {
        const savedExpenses = localStorage.getItem('expenses')
        if (savedExpenses) {
          expenses.value = JSON.parse(savedExpenses)
        }
      } catch (error) {
        console.warn('Impossible de charger les données:', error)
      }
    }

    // Lifecycle
    onMounted(() => {
      loadFromLocalStorage()
    })

    // Watchers
    watch(expenses, saveToLocalStorage, { deep: true })

    return {
      users,
      expenses,
      showAddForm,
      balance,
      addExpense,
      deleteExpense,
      toggleAddForm
    }
  }
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
