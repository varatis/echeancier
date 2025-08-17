<template>
  <div class="conteneur-connexion">
    <h2>Se connecter</h2>
    <form @submit.prevent="gererConnexion">
      <div class="groupe-champ">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="credentials.email" required />
      </div>

      <div class="groupe-champ">
        <label for="motDePasse">Mot de passe</label>
        <input id="motDePasse" type="password" v-model="credentials.motDePasse" required />
      </div>

      <button type="submit" class="bouton-connexion">Se connecter</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '../services/api'

const credentials = reactive({
  email: '',
  motDePasse: '',
})

const message = ref('')

const gererConnexion = async () => {
  try {
    const reponse = await api.post('/utilisateurs/connexion', credentials)
    const token = reponse.data.token
    localStorage.setItem('authToken', token)
    message.value = 'Connexion réussie ! Token stocké.'
    console.log('Connexion réussie ! Token stocké.', token)

    // Gérer la redirection vers une page sécurisée
    // window.location.href = '/dashboard';
  } catch (erreur) {
    message.value =
      'Erreur de connexion : ' +
      (erreur.response?.data?.message || 'Email ou mot de passe incorrect.')
    console.error('Erreur lors de la connexion', erreur)
  }
}
</script>

<style scoped>
/* Utiliser le même style que FormulaireInscription.vue pour les classes .conteneur-inscription, .groupe-champ, etc. */
/* Renommer les classes spécifiques pour éviter les conflits si nécessaire */
.conteneur-connexion {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.bouton-connexion {
  width: 100%;
  padding: 0.8rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.bouton-connexion:hover {
  background-color: #218838;
}

.message {
  text-align: center;
  margin-top: 1rem;
  color: red;
}
</style>
