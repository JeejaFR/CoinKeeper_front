<template>
  <v-card class="sideBarContainer">
    <v-navigation-drawer v-model="drawer" temporary>
      <v-toolbar flat class="toolbar">
        <v-icon class="mdi mdi-bitcoin text-primary"></v-icon>
        <v-card-title class="text-primary">CoinKeeper</v-card-title>
        <v-fab class="closeButton text-primary" icon="mdi-backburger" @click.stop="closeDrawer" variant="plain"></v-fab>
      </v-toolbar>
      <v-divider class="navlist"></v-divider>
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
        <v-list-item 
          prepend-icon="mdi-shape-plus" 
          title="Catégories" 
          @click="navigateTo('Categories')">
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
    </v-navigation-drawer>
  </v-card>

  <div :class="drawer ? 'displayNone' : 'toggleButton'">
    <v-fab icon="mdi-forwardburger" @click.stop="openDrawer"></v-fab>
  </div>
</template>

<script setup>
import { ref,defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['open']);

const drawer = ref(false);
const router = useRouter();

function navigateTo(route) {
  router.push({ name: route });
}
function openDrawer(){
  emit('open');
  drawer.value = true;
}
function closeDrawer(){
  emit('close');
  drawer.value = false;
}
</script>


<style scoped>
.navlist{
  margin-top: 2rem;
}
.toolbarTitle{
  margin: 0.3rem;
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
  z-index: 9999;
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

.v-icon {
  color: #ffffff;
}
</style>
