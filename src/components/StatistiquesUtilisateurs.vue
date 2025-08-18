<template>
  <div class="mt-6 grid grid-cols-2 gap-4">
    <div
      v-for="utilisateur in utilisateurs"
      :key="utilisateur.id"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div class="flex items-center mb-2">
        <div :class="['w-3 h-3 rounded-full mr-2', utilisateur.couleur]"></div>
        <h3 class="font-semibold text-gray-800 text-sm">{{ utilisateur.nom }}</h3>
      </div>
      <div class="text-lg font-bold text-gray-900">
        {{ formaterMontant(obtenirTotalParUtilisateur(utilisateur.id)) }}
      </div>
      <div class="text-xs text-gray-500">
        {{ obtenirNombreDepensesParUtilisateur(utilisateur.id) }} dépense{{
          obtenirNombreDepensesParUtilisateur(utilisateur.id) > 1 ? 's' : ''
        }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatistiquesUtilisateurs',
  props: {
    utilisateurs: {
      type: Array,
      required: true,
    },
    depenses: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const formaterMontant = (montant) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format(montant)
    }

    const obtenirTotalParUtilisateur = (utilisateurId) => {
      console.log('HEREEEEE ', props.depenses)
      return props.depenses
        .filter((depense) => depense.utilisateurId === utilisateurId)
        .reduce((total, depense) => total + parseFloat(depense.montant), 0)
    }

    const obtenirNombreDepensesParUtilisateur = (utilisateurId) => {
      return props.depenses.filter((depense) => depense.utilisateurId === utilisateurId).length
    }

    return {
      formaterMontant,
      obtenirTotalParUtilisateur,
      obtenirNombreDepensesParUtilisateur,
    }
  },
}
</script>
