<template>
  <div class="appbarContainer">
    <v-btn icon variant="solo" @click="search">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn icon variant="solo" @click="notifications">
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <v-btn icon variant="solo" @click="settings">
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-menu
      v-model:menu="menu"
      offset-y
      transition="scale-transition"
      min-width="150"
    >
      <template #activator="{ on, attrs }">
        <v-avatar
          v-bind="attrs"
          v-on="on"
          size="48"
          class="ml-2"
        >
          <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const menu = ref(false);

function search() {
  // Action pour le bouton de recherche
  console.log('Recherche');
}

function notifications() {
  // Action pour le bouton de notifications
  console.log('Notifications');
}

function settings() {
  // Action pour le bouton de paramètres
  console.log('Paramètres');
}
</script>

<style scoped>

.v-avatar {
  cursor: pointer;
}

.appbarContainer{
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 1rem;
}

</style>
