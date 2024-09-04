<template>
  <SideBar @open="drawer=true;" @close="drawer=false"/>
  <section class="transactionsContainer" :class="drawer?'littleContainer':''">
    <AppBar />
    <div class="transactionTitle">
      <h1>Transactions</h1>
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
        <DataTable :transactions="transactions" :periode="selectedPeriod"/>
      </div>
    </v-card>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import DataTable from '@/components/DataTableCrud.vue';
import AppBar from '@/components/AppBar.vue';
import transactionService from '@/services/transactionService.js';
import { emitBus } from '@/plugins/eventBus';

function triggerNotification() {
  emitBus('notificationEvent');
}

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
    const response = await transactionService.getTransactionParPeriode(selectedPeriod.value, false);
    transactions.value = response; 
    totalAmount.value = transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
  }
}

onMounted(() => {
  getTransactionByPeriode();
  triggerNotification();
});

watch(selectedPeriod, () => {
  getTransactionByPeriode();
});
</script>

<style scoped>
.littleContainer {
  position: absolute;
  right: 0;
  width: 80%;
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

/* Styles pour les écrans moyens (Tablette) */
@media (max-width: 1024px) {
  .transactionsContainer {
    padding: 1rem;
  }

  .transactionTitle {
    flex-direction: column;
    align-items: flex-start;
  }

  .selectContainer {
    width: 50%;
    margin-top: 0rem;
  }

  .dataTable {
    width: 100%;
  }

  .littleContainer {
    position: absolute;
    right: 0;
    width: 72%;
  }
}

/* Styles pour les petits écrans (Mobile) */
@media (max-width: 600px) {
  .transactionsContainer {
    padding: 1rem;
  }

  .transactionTitle {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .selectContainer {
    width: 100%;
    margin-top: 0rem;
  }

  .custom-select {
    width: 100%;
  }

  .dataTable {
    width: 100%;
    margin-top: 1rem;
  }
}
</style>