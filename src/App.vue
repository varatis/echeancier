<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <GestionnaireDepenses />
  </div>
</template>

<script>
import GestionnaireDepenses from './components/GestionnaireDepenses.vue'

export default {
  name: 'App',
  components: {
    GestionnaireDepenses,
  },
}
</script>

<style>
@import 'tailwindcss';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Styles pour mobile */
@media (max-width: 768px) {
  input,
  select {
    font-size: 16px; /* Évite le zoom automatique sur iOS */
  }
}

/* Animation pour les transitions */
.fondu-entrant-actif,
.fondu-sortant-actif {
  transition: opacity 0.3s;
}
.fondu-entrant-depuis,
.fondu-sortant-vers {
  opacity: 0;
}

/* Styles personnalisés pour l'application */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

/* Amélioration de l'accessibilité */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus,
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Optimisation pour les appareils tactiles */
@media (hover: none) and (pointer: coarse) {
  button {
    min-height: 44px; /* Taille minimale recommandée pour les boutons sur mobile */
  }
}
</style>
