<template>
  <SideBar @open="drawer=true;" @close="drawer=false"/>
  <section class="transactionsContainer" :class="drawer?'littleContainer':''">
    <AppBar />
    <div class="transactionTitle">
      <h1>Dépenses</h1>
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
    <v-card class="dataTable">
      <div class="dataTableContainer">
        <DataTable :transactions="transactions" />
      </div>
    </v-card>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import DataTable from '@/components/DataTableCrud.vue';
import AppBar from '@/components/AppBar.vue';
import transactionService from '@/services/transactionService.js';


const periodOptions = [
  'Cette semaine',
  '2 dernières semaines',
  'Ce mois-ci',
  '6 derniers mois',
  'Cette année',
  'Tout'
];

const selectedPeriod = ref('Cette semaine');

const drawer = ref(false);
const transactions = ref([]);
const totalAmount = ref(0);

function clearSelection() {
  selectedPeriod.value = 'Cette semaine';
}

async function getTransactionByPeriode() {
  try {
    const response = await transactionService.getTransactionParPeriode(selectedPeriod.value);
    transactions.value = response; 
    totalAmount.value = transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
  }
}

onMounted(() => {
  getTransactionByPeriode();
});

watch(selectedPeriod, () => {
  getTransactionByPeriode();
});
</script>

<style scoped>
.littleContainer{
  width: 85%;
  margin-left: 16%;
}
.transactionsContainer {
  padding: 0rem 2rem 2rem 2rem;
  transition: margin-left 0.2s ease, width 0.2s ease;
}
.transactionTitle{
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
</style>