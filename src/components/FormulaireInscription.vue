<template>
  <div class="conteneur-inscription">
    <h2>Créer un compte</h2>
    <form @submit.prevent="gererInscription">
      <div class="groupe-champ">
        <label for="nomUtilisateur">Nom d'utilisateur</label>
        <input id="nomUtilisateur" type="text" v-model="utilisateur.nomUtilisateur" required />
      </div>

      <div class="groupe-champ">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="utilisateur.email" required />
      </div>

      <div class="groupe-champ">
        <label for="motDePasse">Mot de passe</label>
        <input id="motDePasse" type="password" v-model="utilisateur.motDePasse" required />
      </div>

      <div class="groupe-champ">
        <label for="nom">Nom</label>
        <input id="nom" type="text" v-model="utilisateur.nom" required />
      </div>

      <div class="groupe-champ">
        <label for="prenom">Prénom</label>
        <input id="prenom" type="text" v-model="utilisateur.prenom" required />
      </div>

      <button type="submit" class="bouton-inscription">S'inscrire</button>
    </form>
    <p v-if="message" class="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '../services/api'

const utilisateur = reactive({
  nomUtilisateur: '',
  email: '',
  motDePasse: '',
  nom: '',
  prenom: '',
})

const message = ref('')

const gererInscription = async () => {
  try {
    const reponse = await api.post('/utilisateurs/inscription', utilisateur)
    message.value = 'Inscription réussie ! Redirection...'
    console.log('Inscription réussie !', reponse.data)
  } catch (erreur) {
    message.value =
      "Erreur lors de l'inscription : " +
      (erreur.response?.data?.message || 'Vérifiez vos informations.')
    console.error("Erreur lors de l'inscription", erreur)
  }
}
</script>

<style scoped>
.conteneur-inscription {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #333;
}

.groupe-champ {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.8rem;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.bouton-inscription {
  width: 100%;
  padding: 0.8rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.bouton-inscription:hover {
  background-color: #0056b3;
}

.message {
  text-align: center;
  margin-top: 1rem;
  color: red;
}
</style>
