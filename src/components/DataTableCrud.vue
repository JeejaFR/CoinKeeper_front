<template>
  <v-data-table :headers="headers" :items="filteredTransactions" :sort-by="[{ key: 'date', order: 'asc' }]" show-select>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Depenses</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Add Button -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              Ajouter une dépense
            </v-btn>
          </template>
          <TransactionsForm :editedItem="editedItem" @close="dialog = false" />
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Supprimer cette dépense</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Annuler</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Confirmer</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>

      <div class="filter-container">
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Recherche" single-line variant="outlined"
          hide-details class="search-bar"></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div>
          <p style="font-size: 12px; text-decoration: underline; margin-bottom: 8px;">Filtres:</p>
          <v-chip-group v-model="selectedCategories" multiple class="chips-group" selected-class="text-primary">
            <v-chip v-for="category in uniqueCategories" :key="category" :value="category" class="category-chip">
              {{ category }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>

    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue';
import TransactionsForm from '@/components/forms/TransactionsForm.vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  description: '',
  amount: 0,
  category: '',
  date: '',
});
const defaultItem = {
  description: '',
  amount: 0,
  category: '',
  date: '',
};
const search = ref('');
const selectedCategories = ref([]);

// Function to get unique categories
const uniqueCategories = computed(() => {
  const categories = props.transactions.map(t => t.category);
  return [...new Set(categories)];
});

// Filtered transactions based on search and selected categories
const filteredTransactions = computed(() => {
  return props.transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(transaction.category);
    return matchesSearch && matchesCategory;
  });
});

const headers = [
  { title: 'Description', key: 'description' },
  { title: 'Montant', key: 'amount' },
  { title: 'Catégorie', key: 'category' },
  { title: 'Date', key: 'date' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Transaction' : 'Edit Transaction';
});

function editItem(item) {
  editedIndex.value = props.transactions.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
}

function deleteItem(item) {
  editedIndex.value = props.transactions.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
}

function deleteItemConfirm() {
  props.transactions.splice(editedIndex.value, 1);
  closeDelete();
}

function close() {
  dialog.value = false;
  editedItem.value = { ...defaultItem };
  editedIndex.value = -1;
}

function closeDelete() {
  dialogDelete.value = false;
  editedItem.value = { ...defaultItem };
  editedIndex.value = -1;
}

function save() {
  if (editedIndex.value > -1) {
    Object.assign(props.transactions[editedIndex.value], editedItem.value);
  } else {
    props.transactions.push(editedItem.value);
  }
  close();
}

watch(dialog, (val) => {
  if (!val) close();
});

watch(dialogDelete, (val) => {
  if (!val) closeDelete();
});
</script>

<style scoped>
.filter-container {
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 1rem;
}

.search-bar {
  flex: 1;
  margin-right: 16px;
  max-width: 40%;
}

.chips-group {
  flex: 2;
  display: flex;
  flex-wrap: wrap;
}

.category-chip {
  margin: 4px;
  cursor: pointer;
}

.category-chip:hover {
  background-color: #e0e0e0;
  /* Light grey on hover */
}
</style>
