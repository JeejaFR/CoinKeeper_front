<template>
  <div style="padding: 2%;">
    <v-data-table v-model:items-per-page="itemsPerPage" :headers="headers" :items="paginatedTransactions"
      :items-length="transactions.length" :loading="loading" @update:options="loadItems"></v-data-table>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

// Props reçues du parent
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});

const itemsPerPage = ref(5);
const headers = ref([
  {
    title: 'Description',
    align: 'start',
    sortable: true,
    key: 'description',
  },
  { title: 'Montant (€)', key: 'amount', align: 'end', sortable: true },
  { title: 'Catégorie', key: 'category', align: 'end', sortable: true },
  { title: 'Date', key: 'date', align: 'end', sortable: true },
]);

const loading = ref(false);
const page = ref(1);
const sortBy = ref([]);

// Calcul des transactions paginées et triées
const paginatedTransactions = computed(() => {
  let items = [...props.transactions];

  // Tri des éléments si nécessaire
  if (sortBy.value.length) {
    const sortKey = sortBy.value[0].key;
    const sortOrder = sortBy.value[0].order;
    items.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });
  }

  const start = (page.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return items.slice(start, end);
});

// Fonction pour charger les éléments
function loadItems(options) {
  page.value = options.page;
  itemsPerPage.value = options.itemsPerPage;
  sortBy.value = options.sortBy;
}

// Watcher pour détecter les changements dans les transactions
watch(
  () => props.transactions,
  () => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  }
);
</script>
