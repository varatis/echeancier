<template>
  <transition name="slide-down">
    <div class="mt-6 bg-white rounded-xl shadow-sm border p-6">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Nouvelle dépense</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Qui a payé ?
          </label>
          <select
            v-model="form.userId"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Montant (€)
          </label>
          <input
            v-model="form.amount"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            v-model="form.description"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Course, Restaurant, Essence..."
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            v-model="form.date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            @click="$emit('cancel')"
            class="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            :class="[
              'flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200',
              isFormValid
                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
import { ref, computed, watch } from 'vue'

export default {
  name: 'ExpenseForm',
  props: {
    users: {
      type: Array,
      required: true
    }
  },
  emits: ['add-expense', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      userId: 1,
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    })

    const isFormValid = computed(() => {
      return form.value.amount &&
        form.value.description &&
        form.value.date &&
        parseFloat(form.value.amount) > 0
    })

    const resetForm = () => {
      form.value = {
        userId: 1,
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      }
    }

    const handleSubmit = () => {
      if (!isFormValid.value) {
        return
      }

      emit('add-expense', { ...form.value })
      resetForm()
    }

    return {
      form,
      isFormValid,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Amélioration de l'UX sur mobile */
input:focus, select:focus {
  transform: scale(1.02);
}

@media (hover: none) and (pointer: coarse) {
  input:focus, select:focus {
    transform: none;
  }

  button:hover {
    transform: none !important;
  }
}
</style>
