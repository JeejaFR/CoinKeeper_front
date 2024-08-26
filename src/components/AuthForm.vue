<template>
  <v-card__text class="pa-4 cardContent">
    <v-card-title class="cardTitle">
      <span class="headline">{{ isLogin ? 'CONNEXION' : 'INSCRIPTION' }}</span>
    </v-card-title>

    <v-form class="loginForm">
      <v-text-field v-model="email" label="Adresse e-mail" outlined dense type="email"
        :rules="formSubmitted && !isLogin ? [emailRules] : []"
        :error-messages="formSubmitted && !isLogin ? emailErrors : []"></v-text-field>

      <v-text-field v-model="password" label="Mot de passe" outlined dense type="password"
        :rules="formSubmitted && !isLogin ? [passwordRules] : []"
        :error-messages="formSubmitted && !isLogin ? passwordErrors : []"></v-text-field>

      <v-if v-if="!isLogin">
        <v-text-field v-model="confirmPassword" label="Confirmer le mot de passe" outlined dense type="password"
          :rules="formSubmitted ? [confirmPasswordRules] : []"
          :error-messages="formSubmitted ? confirmPasswordErrors : []"></v-text-field>
      </v-if>

      <div v-if="isLogin">
        <div class="passwordContainer">
          <v-spacer></v-spacer>
          <v-btn text @click="forgotPassword" class="forgotPassword">
            Mot de passe oublié ?
          </v-btn>
        </div>
      </div>
      <p v-if="errorMessage" class="errorMessage">Email ou mot de passe incorrect</p>
      <v-btn @click="isLogin ? login() : register()" color="primary" class="mt-4 loginBtn" block>
        {{ isLogin ? 'Connexion' : 'Inscription' }}
      </v-btn>
    </v-form>

    <div class="signIn mt-4">
      <v-text>
        Vous {{ isLogin ? 'n\'avez' : 'avez' }} pas de compte ?
        <v-btn text @click="this.$emit('register'); formSubmitted = false;" class="link">
          {{ isLogin ? 'Inscrivez-vous' : 'Se connecter' }}
        </v-btn>
      </v-text>
    </div>
  </v-card__text>
</template>

<script setup>
import { ref, defineProps, computed, watch } from 'vue';
import { useRouter } from 'vue-router'; 
import authService from '../services/authService';

const router = useRouter();

const props = defineProps({
  isLogin: Boolean
});

const emailError = ref('');
const formSubmitted = ref(false);
const errorMessage = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const emailRules = [
  (v) => !!v || 'Adresse e-mail requise',
  (v) => /.+@.+\..+/.test(v) || 'Adresse e-mail invalide',
];

const passwordRules = [
  (v) => !!v || 'Mot de passe requis',
  (v) => (v && v.length >= 8) || 'Le mot de passe doit contenir au moins 8 caractères',
  (v) => (v && /[A-Z]/.test(v)) || 'Le mot de passe doit contenir au moins une lettre majuscule',
  (v) => (v && /[0-9]/.test(v)) || 'Le mot de passe doit contenir au moins un chiffre',
];

const confirmPasswordRules = [
  (v) => !!v || 'Confirmer le mot de passe requis',
  (v) => v === password.value || 'Les mots de passe ne correspondent pas',
];

const emailErrors = computed(() => {
  if (emailError.value) return [emailError.value];
  return emailRules.map(rule => rule(email.value)).filter(msg => msg !== true);
});
const passwordErrors = computed(() => passwordRules.map(rule => rule(password.value)).filter(msg => msg !== true));
const confirmPasswordErrors = computed(() => confirmPasswordRules.map(rule => rule(confirmPassword.value)).filter(msg => msg !== true));

watch(email, () => {
  emailError.value = '';
});


function showErrorMessage() {
  errorMessage.value = true;
  setTimeout(() => {
    errorMessage.value = false;
  }, 3000);
}

async function login() {
  formSubmitted.value = true;
  // Valide les champs avant d'envoyer la requête
  if (emailErrors.value.length) {
    showErrorMessage();
    return;
  }

  const payload = {
    email: email.value,
    password: password.value
  };

  try {
    const data = await authService.login(payload);

    if (data.token) {
      localStorage.setItem('authToken', data.token);
      router.push({ name: 'Home' });
    }
  } catch (error) {
    showErrorMessage();
  }
}

async function register() {
  formSubmitted.value = true;
  // Valide les champs avant d'envoyer la requête
  if (emailErrors.value.length || passwordErrors.value.length || confirmPasswordErrors.value.length) {
    return;
  }

  const payload = {
    email: email.value,
    password: password.value
  };

  try {
    const data = await authService.register(payload);
    
    if (data.body.token) {
      // Stocke le token dans le localStorage
      localStorage.setItem('authToken', data.token);
      // Redirige vers la page d'accueil ou une autre page protégée
      router.push({ name: 'Home' });
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      // Vérifie si l'erreur est liée à la contrainte UNIQUE sur l'email
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.includes('UNIQUE constraint failed')) {
          emailError.value = 'Cette adresse e-mail est déjà utilisée.';
        } else {
          emailError.value = 'Une erreur est survenue lors de l\'inscription.';
        }
      } else {
        emailError.value = 'Une erreur est survenue lors de l\'inscription.';
      }
    }
  }
}

function forgotPassword() {
  // Implémente la logique pour la récupération de mot de passe ici
  console.log('Mot de passe oublié ?');
}
</script>

<style scoped>
.errorMessage {
  text-align: center;
  margin-top: 1rem;
  color: #F44336;
}

.passwordContainer {
  display: flex;
  margin-bottom: 1%;
}

.forgotPassword {
  border: none;
  box-shadow: none;
}

.cardTitle {
  text-align: center;
  font-size: 3rem;
}

.cardContent {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.signIn {
  text-align: center;
  margin-top: 20% !important;
}

.link {
  text-decoration: none;
  color: #2196F3;
}

.loginForm {
  margin-top: 3rem;
  padding-left: 5%;
  padding-right: 5%;
}

.loginBtn {
  height: 4rem !important;
  font-size: 1.3rem;
}
</style>
