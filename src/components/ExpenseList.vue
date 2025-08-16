<template>
  <div class="mt-6 mb-6">
    <div class="flex items-center mb-4">
      <History class="w-5 h-5 text-gray-600 mr-2" />
      <h3 class="text-lg font-semibold text-gray-800">Historique</h3>
      <span class="ml-auto text-sm text-gray-500">
        {{ expenses.length }} dépense{{ expenses.length > 1 ? 's' : '' }}
      </span>
    </div>

    <!-- État vide -->
    <div v-if="expenses.length === 0" class="bg-white rounded-xl shadow-sm border p-8 text-center">
      <Euro class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">Aucune dépense enregistrée</p>
      <p class="text-sm text-gray-400 mt-1">
        Ajoutez votre première dépense !
      </p>
    </div>

    <!-- Liste des dépenses -->
    <div v-else class="space-y-3">
      <transition-group name="expense-list" tag="div">
        <div
          v-for="expense in expenses"
          :key="expense.id"
          class="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-1">
                <div :class="['w-3 h-3 rounded-full mr-2', getUserColor(expense.userId)]"></div>
                <span class="font-medium text-gray-900">{{ getUserName(expense.userId) }}</span>
                <span class="ml-2 text-xs text-gray-400">
                  {{ formatDate(expense.date) }}
                </span>
              </div>
              <h4 class="font-semibold text-gray-800 mb-1">{{ expense.description }}</h4>
              <p class="text-xs text-gray-500">
                {{ formatDateTime(expense.timestamp) }}
              </p>
            </div>
            <div class="text-right ml-4">
              <div class="text-lg font-bold text-gray-900 mb-1">
                {{ formatAmount(expense.amount) }}
              </div>
              <button
                @click="confirmDelete(expense)"
                class="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-all duration-200"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div
      v-if="expenseToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-1">
          Êtes-vous sûr de vouloir supprimer cette dépense ?
        </p>
        <p class="text-sm text-gray-500 mb-4">
          <strong>{{ expenseToDelete.description }}</strong> - {{ formatAmount(expenseToDelete.amount) }}
        </p>
        <div class="flex gap-3">
          <button
            @click="cancelDelete"
            class="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            @click="handleDelete"
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
import { History, Euro } from 'lucide-vue-next'

export default {
  name: 'ExpenseList',
  components: {
    History,
    Euro
  },
  props: {
    expenses: {
      type: Array,
      required: true
    },
    users: {
      type: Array,
      required: true
    }
  },
  emits: ['delete-expense'],
  setup(props, { emit }) {
    const expenseToDelete = ref(null)

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      })
    }

    const formatDateTime = (timestamp) => {
      const date = new Date(timestamp)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) + ' à ' + date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getUserName = (userId) => {
      return props.users.find(user => user.id === userId)?.name || ''
    }

    const getUserColor = (userId) => {
      return props.users.find(user => user.id === userId)?.color || 'bg-gray-500'
    }

    const confirmDelete = (expense) => {
      expenseToDelete.value = expense
    }

    const cancelDelete = () => {
      expenseToDelete.value = null
    }

    const handleDelete = () => {
      if (expenseToDelete.value) {
        emit('delete-expense', expenseToDelete.value.id)
        expenseToDelete.value = null
      }
    }

    return {
      expenseToDelete,
      formatAmount,
      formatDate,
      formatDateTime,
      getUserName,
      getUserColor,
      confirmDelete,
      cancelDelete,
      handleDelete
    }
  }
}
</script>

<style scoped>
/* Animation pour les éléments de la liste */
.expense-list-enter-active,
.expense-list-leave-active {
  transition: all 0.3s ease;
}

.expense-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.expense-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.expense-list-move {
  transition: transform 0.3s ease;
}

/* Amélioration de l'UX sur mobile */
@media (hover: none) and (pointer: coarse) {
  button:hover {
    transform: none !important;
  }
}

/* Animation pour le modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
