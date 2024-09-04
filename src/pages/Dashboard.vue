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
    <div class="firstRowContainer">
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Total dépenses" :floatValue="convertedAmount + `${selectedCurrency}`"
            :trendIcon="totalAmountPercentageChange >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
            :trendValue="totalAmountPercentageChange + '%'" :description="descriptionComputed" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Nombre de dépenses" :floatValue="transactions.length"
            :trendIcon="transactionCountPercentageChange >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
            :trendValue="transactionCountPercentageChange + '%'" :description="descriptionComputed" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Catégorie préférée" :floatValue="favoriteCategorie" trendIcon="mdi-cash"
            :trendValue="convertedSpending + `${selectedCurrency}`" :description="descriptionCategorieFavorie" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Dépenses moyennes" :floatValue="convertedAverage + `${selectedCurrency}`"
            :trendIcon="averageAmountPercentageChange >= 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
            :trendValue="averageAmountPercentageChange + '%'" :description="descriptionComputed" />
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
import currencyService from '@/services/currencyService.js';
import { emitBus } from '@/plugins/eventBus';

function triggerNotification() {
  emitBus('notificationEvent');
}

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
const passedTransaction = ref([]);
const totalAmount = ref(0);
const averageAmount = ref(0);
const convertedAmount = ref(0);
const convertedAverage = ref(0);
const favoriteCategorie = ref('');
const favoriteCategorieSpending = ref(0);
const convertedSpending = ref(0);

const totalAmountPast = ref(0);
const averageAmountPast = ref(0);
const convertedTotalAmountPast = ref(0);
const convertedAverageAmountPast = ref(0);

// Calcul du pourcentage de variation pour le montant total des dépenses
const totalAmountPercentageChange = computed(() => {
  if (totalAmountPast.value === 0) {
    return totalAmount.value > 0 ? 100 : 0; // Si la valeur précédente était 0, toute augmentation est infinie
  }
  return (((totalAmount.value - totalAmountPast.value) / totalAmountPast.value) * 100).toFixed(2);
});

// Calcul du pourcentage de variation pour le nombre de transactions
const transactionCountPercentageChange = computed(() => {
  if (passedTransaction.value.length === 0) {
    return transactions.value.length > 0 ? 100 : 0; // Si aucune transaction avant, toute augmentation est infinie
  }
  return (((transactions.value.length - passedTransaction.value.length) / passedTransaction.value.length) * 100).toFixed(2);
});

// Calcul du pourcentage de variation pour la dépense moyenne
const averageAmountPercentageChange = computed(() => {
  if (averageAmountPast.value === 0) {
    return averageAmount.value > 0 ? 100 : 0; // Si aucune moyenne avant, toute augmentation est infinie
  }
  return (((averageAmount.value - averageAmountPast.value) / averageAmountPast.value) * 100).toFixed(2);
});

const descriptionComputed = computed(() => {
  switch (selectedPeriod.value) {
    case 'Cette semaine':
      return 'Par rapport à la semaine dernière';
    case '2 dernières semaines':
      return 'Par rapport aux 2 semaines précèdentes';
    case 'Ce mois-ci':
      return 'Par rapport au mois dernier';
    case '6 derniers mois':
      return 'Par rapport aux 6 mois précedents';
    case 'Cette année':
      return 'Par rapport à l\'année dernière';
    default:
      return 'Depuis le début';
  }
});

const descriptionCategorieFavorie = computed(() => {
  switch (selectedPeriod.value) {
    case 'Cette semaine':
      return 'Dépénsé cette semaine';
    case '2 dernières semaines':
      return 'Dépensé les 2 dernières semaines';
    case 'Ce mois-ci':
      return 'Dépensé ce mois-ci';
    case '6 derniers mois':
      return 'Dépensé ces 6 derniers mois';
    case 'Cette année':
      return 'Dépense cette année';
    default:
      return 'Dépensé depuis le début';
  }
});

function clearSelection() {
  selectedPeriod.value = 'Cette semaine';
}

function getMostExpensiveCategory(transactions) {
  const categorySpending = transactions.value.reduce((spendingMap, transaction) => {
    if (!spendingMap[transaction.category]) {
      spendingMap[transaction.category] = 0;
    }
    spendingMap[transaction.category] += transaction.amount;
    return spendingMap;
  }, {});

  let highestSpendingCategory = null;
  let maxSpending = 0;

  for (const [category, spending] of Object.entries(categorySpending)) {
    if (spending > maxSpending) {
      highestSpendingCategory = category;
      maxSpending = spending;
    }
  }

  favoriteCategorie.value = highestSpendingCategory || 'Aucune';
  favoriteCategorieSpending.value = maxSpending || 0;
}

async function getTransactionByPeriode() {
  try {
    const response = await transactionService.getTransactionParPeriode(selectedPeriod.value, false);
    transactions.value = response;
    totalAmount.value = transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);

    const transactionCount = transactions.value.length;
    averageAmount.value = transactionCount > 0 ? totalAmount.value / transactionCount : 0;

    getMostExpensiveCategory(transactions);

    // Convertir le montant total dans la devise sélectionnée
    await convertCurrency();
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
  }
}

// Recupère les transactions de la periode précedente pour les pourcentages sous les cards
async function getTransactionByPassedPeriode() {
  try {
    const response = await transactionService.getTransactionParPeriode(selectedPeriod.value, true);
    passedTransaction.value = response;
    totalAmountPast.value = passedTransaction.value.reduce((sum, transaction) => sum + transaction.amount, 0);

    const transactionCount = passedTransaction.value.length;
    averageAmountPast.value = transactionCount > 0 ? totalAmountPast.value / transactionCount : 0;

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
    convertedAverage.value = (averageAmount.value * rate).toFixed(2);
    convertedSpending.value = (favoriteCategorieSpending.value * rate).toFixed(2);
    convertedAverageAmountPast.value = (averageAmountPast.value * rate).toFixed(2);
    convertedTotalAmountPast.value = (totalAmountPast.value * rate).toFixed(2);
  } catch (error) {
    console.error('Erreur lors de la conversion de la devise:', error);
  }
}

onMounted(() => {
  getTransactionByPeriode();
  getTransactionByPassedPeriode();
  triggerNotification();
});

watch(selectedPeriod, () => {
  getTransactionByPeriode();
  getTransactionByPassedPeriode();
});

watch(selectedCurrency, () => {
  convertCurrency();
});
</script>



<style scoped>
.littleContainer {
  position: absolute;
  right: 0;
  width: 80%;
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

.firstRowContainer {
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

/* Styles pour les écrans moyens (Tablette) */
@media (max-width: 1024px) {
  .dashboardContainer {
    padding: 1rem;
  }

  .dashBoardTitle {
    flex-direction: column;
    align-items: flex-start;
  }

  .selectContainer {
    width: 50%;
  }

  .firstRowContainer {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .secondContainer {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .dataTable,
  .categoryChart,
  .sparklineContainer {
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
  .dashboardContainer {
    padding: 1rem;
  }

  .dashBoardTitle {
    font-size: 1.5rem;
  }

  .selectContainer {
    width: 100%;
    margin-top: 1rem;
  }

  .firstRowContainer,
  .secondContainer {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .dataTable,
  .categoryChart,
  .sparklineContainer {
    width: 100%;
  }

  .custom-select {
    width: 100%;
  }
}
</style>
