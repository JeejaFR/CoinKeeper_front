<template>
  <v-card class="sideBarContainer">
    <v-navigation-drawer v-model="drawer" temporary>

      <v-toolbar flat class="toolbar">
        <v-icon class="mdi mdi-bitcoin"></v-icon>
        <h2 class="toolbarTitle">CoinKeeper</h2>
        <v-fab class="closeButton" icon="mdi-backburger" @click.stop="drawer = !drawer" variant="plain"></v-fab>
      </v-toolbar>

      <v-list density="compact" nav>
        <v-list-item 
          prepend-icon="mdi-view-dashboard" 
          title="Tableau de bord" 
          @click="navigateTo('Home')">
        </v-list-item>
        <v-list-item 
          prepend-icon="mdi-bank-transfer" 
          title="Transactions" 
          @click="navigateTo('Transactions')">
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <div class="spacer"></div>
      <v-list-item 
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg" 
        title="John Leider">
      </v-list-item>
    </v-navigation-drawer>
  </v-card>

  <div :class="drawer ? 'displayNone' : 'toggleButton'">
    <v-fab icon="mdi-forwardburger" @click.stop="drawer = !drawer"></v-fab>
  </div>

  <div class="routerContainer" :class="drawer ? 'small-router' : ''">
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const router = useRouter();

function navigateTo(route) {
  router.push({ name: route });
}
</script>


<style scoped>
.toolbarTitle{
  margin: 0.3rem
}
.displayNone {
  display: none;
}
.closeButton{
  margin-left: 10%;
}
.toggleButton {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 9998;
}
.routerContainer {
  transition: all 0.2s ease-in-out;
}

.small-router {
  width: 85%;
  margin-left: 16%;
}

.container {
  background-color: rgb(15, 15, 15);
}

.sideBarContainer {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
}

.toolbar {
  color: #ffffff;
  padding-left: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.spacer {
  flex-grow: 1;
}

.v-list-item {
  transition: background-color 0.3s ease;
}

.v-list-item:hover {
  background-color: #444444;
}

.v-icon {
  color: #ffffff;
}
</style>
