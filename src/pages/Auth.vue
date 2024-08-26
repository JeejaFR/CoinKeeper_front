<template>
  <v-container fluid fill-height class="loginContainer">
    <v-card class="d-flex flex-row loginCard">
      <AuthForm :isLogin="isLogin" @register="switchComponent"/>
      <div class="imageContainer">

      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthForm from '../components/AuthForm.vue'

var isLogin = ref(true);

function switchComponent(){
  isLogin.value = !isLogin.value;
}
</script>

<style scoped>

.imageContainer {
  background-image: url('https://static.vecteezy.com/system/resources/thumbnails/025/067/762/small_2x/4k-beautiful-colorful-abstract-wallpaper-photo.jpg');
  background-size: cover;
  height: 100%;
  width: 80%;
}

.loginCard {
  width: 80%;
  height: 80%;
}

.loginContainer {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
