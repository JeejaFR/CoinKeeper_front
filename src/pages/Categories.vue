<template>
  <SideBar @open="drawer = true;" @close="drawer = false" />
  <section class="categoriesContainer" :class="drawer ? 'littleContainer' : ''">
    <AppBar />
    <div class="categorieTitle">
      <h1>Catégories</h1>
      <div class="selectContainer">
        <v-select v-model="selectedPeriod" :items="periodOptions" label="Période" variant="solo" dense
          class="custom-select">
          <v-list-item ripple @click="clearSelection">
            <v-list-item-content>
              <v-list-item-title>Tout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-select>
      </div>
    </div>
    <div class="addButtonContainer">
      <v-btn class="addButton" color="primary" dark @click="dialog = true;">
        Ajouter une catégorie
      </v-btn>
    </div>
    <v-container class="gridContainer">
      <v-row>
        <v-col v-for="categorie in categories" :key="categorie.id" cols="12" sm="6" md="4" lg="3">
          <CategorieCard :categorie="categorie" :periode="selectedPeriod"
            @delete="dialogDelete = true; selectedCategorie = categorie"
            @edit="selectedCategorie = categorie; editItem(categorie);" />
        </v-col>
      </v-row>
    </v-container>
  </section>
  <v-dialog v-model="dialog" max-width="500px">
    <CategoriesForm :editedItem="editedItem" :editedIndex="editedIndex" @create="createCategorie"
      @update="updateCategorie" @close="dialog = false;" />
  </v-dialog>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="headline">Confirmer la suppression</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer cette catégorie ?
        Cette action est irréversible.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="dialogDelete = false;">Annuler</v-btn>
        <v-btn color="red darken-1" text @click="deleteCategorie">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppBar from '@/components/AppBar.vue';
import { emitBus } from '@/plugins/eventBus';
import categorieService from '@/services/categorieService.js';
import CategorieCard from '@/components/CategorieCard.vue';
import CategoriesForm from '@/components/forms/CategoriesForm';

const drawer = ref(false);
const categories = ref([]);
const dialog = ref(false);
const dialogDelete = ref(false);
const periodOptions = [
  'Cette semaine',
  '2 dernières semaines',
  'Ce mois-ci',
  '6 derniers mois',
  'Cette année',
  'Tout'
];
const editedIndex = ref(-1);
const editedItem = ref({
  name: '',
  month_limit: 0,
});

const selectedPeriod = ref('Cette semaine');
const selectedCategorie = ref(null);
const creating = ref(false);


function triggerNotification() {
  emitBus('notificationEvent');
}

async function getCategories() {
  try {
    const response = await categorieService.getCategories();
    categories.value = response;
  } catch (error) {
    console.error('Erreur lors de la récupération des categories:', error);
  }
}

async function deleteCategorie() {
  await categorieService.deleteCategorie(selectedCategorie.value.id)
  var currentIndex = categories.value.findIndex(categorie => categorie.id === selectedCategorie.value.id);
  categories.value.splice(currentIndex, 1);
  triggerNotification();
  dialogDelete.value = false;
}

function editItem(item) {
  creating.value = false;
  editedIndex.value = categories.value.findIndex(categorie => categorie.id === item.id);
  editedItem.value = { ...item };
  dialog.value = true;
}

function createCategorie(categorie) {
  categories.value.push(categorie);
  dialog.value = false;
}

function updateCategorie(categorie) {
  if (editedIndex.value > -1) {
    Object.assign(categories.value[editedIndex.value], categorie);
  }
  dialog.value = false;
}

onMounted(() => {
  getCategories();
  triggerNotification();
});

</script>

<style scoped>
.addButtonContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.littleContainer {
  position: absolute;
  right: 0;
  width: 80%;
}

.categoriesContainer {
  padding: 0rem 2rem 2rem 2rem;
  transition: margin-left 0.2s ease, width 0.2s ease;
}

.gridContainer {
  width: 100%;
}

.categorieTitle {
  display: flex;
  gap: 2rem;
  font-size: 2rem;
  justify-content: space-between;
}

.selectContainer {
  margin-top: 2rem;
  width: 20%;
}

.custom-select {
  min-width: 200px;
}

.v-container {
  margin-top: 1rem;
}

/* Styles pour les écrans moyens (Tablette) */
@media (max-width: 1024px) {
  .categoriesContainer {
    padding: 1rem;
  }

  .categorieTitle {
    flex-direction: column;
    align-items: flex-start;
  }

  .selectContainer {
    width: 50%;
    margin-top: 1rem;
  }

  .custom-select {
    width: 100%;
  }

  .gridContainer {
    margin-top: 1rem;
  }

  .addButtonContainer {
    justify-content: flex-start;
  }

  .littleContainer {
    position: absolute;
    right: 0;
    width: 72%;
  }
}

/* Styles pour les petits écrans (Mobile) */
@media (max-width: 600px) {
  .categoriesContainer {
    padding: 1rem;
  }

  .categorieTitle {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .selectContainer {
    width: 100%;
    margin-top: 1rem;
  }

  .custom-select {
    width: 100%;
  }

  .gridContainer {
    width: 100%;
    margin-top: 1rem;
  }

  .addButtonContainer {
    justify-content: center;
    margin-top: 1rem;
  }

  .littleContainer {
    width: 100%;
    margin-left: 0;
  }
}
</style>
