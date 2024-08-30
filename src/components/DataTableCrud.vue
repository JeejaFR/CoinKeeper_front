<template>
  <v-data-table :headers="headers" :items="filteredTransactions" item-key="id" show-select v-model="selectedItems">
    <template v-slot:top>
      <!-- Toolbar for Actions -->
      <v-toolbar flat>
        <v-toolbar-title>Gestion des Dépenses {{ selectedItems.length > 1 ? '(' + selectedItems.length + 'sélectionnées) ' : ''}} </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Add New Transaction Button -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props" @click="openForm()"
              :disabled="selectedItems.length > 0">
              Ajouter une dépense
            </v-btn>
          </template>
          <TransactionsForm :editedItem="editedItem" :editedIndex="editedIndex" :categories="uniqueCategories"
            @create="createTransaction" @update="updateTransaction" @close="closeForm" />
        </v-dialog>

        <!-- Edit Selected Transactions Button -->
        <v-btn class="mb-2 mx-2" color="warning" dark @click="editSelectedItems()" v-if="selectedItems.length === 1">
          Modifier la dépense
        </v-btn>

        <!-- Delete Selected Transactions Button -->
        <v-btn class="mb-2" color="error" dark @click="deleteSelectedItems()" v-if="selectedItems.length > 0">
          Supprimer {{ selectedItems.length }} dépense(s)
        </v-btn>
        <v-btn class="mb-2 mx-2" color="primary" icon="mdi-export-variant" dark @click="exportToCSV">
        </v-btn>
      </v-toolbar>

      <!-- Filtres de Recherche -->
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

    <template v-slot:item.amount="{ item }">
      <AsyncAmount :amount="item.amount" :selectedCurrency="selectedCurrency" />
    </template>

    <template v-slot:item.date="{ item }">
      <span>{{ formatDate(item.date) }}</span>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
    </template>

    <template v-slot:no-data>
      <p>Aucune transaction trouvée</p>
    </template>
  </v-data-table>
  <v-dialog v-model="dialogDelete" max-width="500px">
    <v-card>
      <v-card-title class="headline">Confirmer la suppression</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer cette transaction ?
        Cette action est irréversible.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="closeDelete">Annuler</v-btn>
        <v-btn color="red darken-1" text @click="deleteItemConfirm">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue';
import { useCurrencyStore } from '@/stores/currencyStore'
import { parse, format } from 'date-fns';
import transactionService from '@/services/transactionService';
import currencyService from '@/services/currencyService.js';
import TransactionsForm from '@/components/forms/TransactionsForm.vue';
import AsyncAmount from '@/components/AsyncAmount';

const currencyStore = useCurrencyStore();

const selectedCurrency = computed({
  get: () => currencyStore.selectedCurrency,
});

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

const dialog = ref(false);
const dialogDelete = ref(false);
const creating = ref(false);

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
const selectedItems = ref([]);

function formatDate(dateString) {
  return format(new Date(dateString), 'dd/MM/yyyy');
}

const uniqueCategories = computed(() => {
  const categories = props.transactions.map(t => t.category);
  return [...new Set(categories)];
});

const filteredTransactions = computed(() => {
  return props.transactions.map(transaction => ({
    ...transaction,
  })).filter(transaction => {
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

async function formatAmount(amount) {
  const baseCurrency = '€';
  console.log("ICI : " + selectedCurrency.value);
  const rate = await currencyService.getExchangeRate(baseCurrency, selectedCurrency.value)

  console.log('amount: ' + amount);
  console.log('rate: ' + rate)

  if (rate) {
    amount = amount * rate;
  }

  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formatter.format(amount);

  return formattedAmount.endsWith('.00') ? formattedAmount.slice(0, -3) : formattedAmount;
}

async function exportToCSV() {
  const csvRows = [];

  const headers = ['Description', `Montant (${selectedCurrency.value})`, 'Catégorie', 'Date'];
  csvRows.push(headers.join(','));

  for (const transaction of filteredTransactions.value) {
    const rate = await currencyService.getExchangeRate('€', selectedCurrency.value);
    let amount = transaction.amount;
    if (rate) {
      amount *= rate;
    }
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount).replace(/\.00$/, '');

    const values = [
      transaction.description,
      formattedAmount,
      transaction.category,
      formatDate(transaction.date),
    ];
    csvRows.push(values.join(','));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


function openForm() {
  creating.value = true;
  editedItem.value = { ...defaultItem };
  dialog.value = true;
}

function editItem(item) {
  creating.value = false;
  editedIndex.value = props.transactions.findIndex(transaction => transaction.id === item.id);
  editedItem.value = { ...item };
  dialog.value = true;
}

function editSelectedItems() {
  if (selectedItems.value.length === 1) {
    const item = filteredTransactions.value.find(item => item.id == selectedItems.value);
    editItem(item);
  }
}

function deleteItem(item) {
  editedIndex.value = props.transactions.findIndex(transaction => transaction.id === item.id);
  dialogDelete.value = true;
}

async function deleteItemConfirm() {
  await transactionService.deleteTransaction(props.transactions[editedIndex.value].id);
  props.transactions.splice(editedIndex.value, 1);
  closeDelete();
}

async function deleteSelectedItems() {
  for (const itemID of selectedItems.value) {
    const index = props.transactions.findIndex(transaction => transaction.id === itemID);
    await transactionService.deleteTransaction(itemID);
    props.transactions.splice(index, 1);
  }
  selectedItems.value = [];
}

function closeForm() {
  dialog.value = false;
  editedItem.value = { ...defaultItem };
  editedIndex.value = -1;
}

function closeDelete() {
  dialogDelete.value = false;
}

function createTransaction(newTransaction) {
  // TODO verifier si entre les dates entrées
  props.transactions.push(newTransaction);
  closeForm();
}

function updateTransaction(updatedTransaction) {
  if (editedIndex.value > -1) {
    Object.assign(props.transactions[editedIndex.value], updatedTransaction);
  }
  closeForm();
}

watch(uniqueCategories, () => {
  selectedCategories.value = [];
});

watch(dialog, (val) => {
  if (!val) closeForm();
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
