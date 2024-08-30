<template>
  <SideBar @open="drawer = true;" @close="drawer = false" />
  <section class="dashboardContainer" :class="drawer ? 'littleContainer' : ''">
    <AppBar />
    <div class="dashBoardTitle">
      <h1>Tableau de bord</h1>
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
    <div class="flex">
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Total dépenses" :floatValue="convertedAmount + `${selectedCurrency}`"
            trendIcon="mdi-trending-down" trendValue="-99%" description="Depuis le mois dernier" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Nombre de dépenses" :floatValue="transactions.length" trendIcon="mdi-trending-up"
            trendValue="99%" description="Depuis le mois dernier" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Répartition des dépenses" floatValue="-000%" trendIcon="mdi-trending-down"
            trendValue="-99%" description="Depuis le mois dernier" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Épargne" floatValue="-000€" trendIcon="mdi-trending-up" trendValue="99%"
            description="Depuis le mois dernier" />
        </v-col>
      </v-row>
      <div class="sparklineContainer">
        <LineChart :transactions="transactions" :period="selectedPeriod" />
      </div>
    </div>
    <div class="flex secondContainer">
      <v-card class="dataTable">
        <v-card-title>Mes dépenses</v-card-title>
        <div class="dataTableContainer">
          <DataTable :transactions="transactions" />
        </div>
      </v-card>
      <v-card class="categoryChart">
        <v-card-title>Dépenses par catégorie</v-card-title>
        <DonutChart :transactions="transactions" />
      </v-card>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import LittleCard from '@/components/LittleCard.vue';
import LineChart from '@/components/LineChart.vue';
import DonutChart from '@/components/DonutChart.vue';
import DataTable from '@/components/DataTable.vue';
import AppBar from '@/components/AppBar.vue';
import transactionService from '@/services/transactionService.js';
import { useCurrencyStore } from '@/stores/currencyStore';
import currencyService from '@/services/currencyService.js'; // Un service hypothétique pour obtenir les taux de conversion

const currencyStore = useCurrencyStore();

const selectedCurrency = computed({
  get: () => currencyStore.selectedCurrency,
});

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
const convertedAmount = ref(0);

function clearSelection() {
  selectedPeriod.value = 'Cette semaine';
}

async function getTransactionByPeriode() {
  try {
    const response = await transactionService.getTransactionParPeriode(selectedPeriod.value);
    transactions.value = response;
    totalAmount.value = transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Convertir le montant total dans la devise sélectionnée
    await convertCurrency();
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
  }
}

async function convertCurrency() {
  try {
    const rate = await currencyService.getExchangeRate('€', selectedCurrency.value);
    convertedAmount.value = (totalAmount.value * rate).toFixed(2);
  } catch (error) {
    console.error('Erreur lors de la conversion de la devise:', error);
  }
}

onMounted(() => {
  getTransactionByPeriode();
});

watch(selectedPeriod, () => {
  getTransactionByPeriode();
});

watch(selectedCurrency, () => {
  convertCurrency();
});
</script>



<style scoped>
.littleContainer {
  width: 85%;
  margin-left: 16%;
}

.selectContainer {
  margin-top: 2rem;
  width: 20%;
}

.custom-select {
  min-width: 200px;
}

.dashBoardTitle {
  display: flex;
  gap: 2rem;
  font-size: 2rem;
  justify-content: space-between;
}

.flex {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.secondContainer {
  margin-top: 2rem;
}

.dataTable {
  width: 70%;
}

.categoryChart {
  width: 30%;
}

.sparklineContainer {
  width: 80%;
}

.dashboardContainer {
  padding: 0rem 2rem 2rem 2rem;
  transition: margin-left 0.2s ease, width 0.2s ease;
}
</style>
