<template>
  <v-card class="lineContainer">
    <Line :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import currencyService from '@/services/currencyService.js';
import { useCurrencyStore } from '@/stores/currencyStore'

const currencyStore = useCurrencyStore();

const selectedCurrency = computed({
  get: () => currencyStore.selectedCurrency,
});


// Enregistre tous les éléments nécessaires pour le graphique linéaire
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);


const props = defineProps({
  transactions: Array,
  period: String
});

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Dépenses',
      borderColor: '#42A5F5',
      data: [],
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem.dataset.label + ': ' + tooltipItem.formattedValue;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Période'
      },
      ticks: {
        autoSkip: true,
        maxRotation: 45,
        minRotation: 0
      }
    },
    y: {
      title: {
        display: true,
        text: 'Montant'
      }
    }
  }
});

// Met à jour les données du graphique lorsque les transactions ou la période changent
watch([() => props.transactions, () => props.period, selectedCurrency], async () => {
  const { transactions, period } = props;
  const { labels, data } = await groupDataByPeriod(transactions, period);

  chartData.value = {
    labels: labels,
    datasets: [
      {
        label: 'Dépenses',
        borderColor: '#42A5F5',
        data: data,
      }
    ]
  };
}, { immediate: true });

// Fonction pour grouper les transactions en fonction de la période sélectionnée
async function groupDataByPeriod(transactions, period) {
  const now = new Date();
  let startDate;
  let endDate;

  switch (period) {
    case 'Cette semaine':
      startDate = getStartOfWeek(now);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    case '2 dernières semaines':
      startDate = new Date(now.setDate(now.getDate() - 14));
      endDate = new Date();
      break;
    case 'Ce mois-ci':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case '6 derniers mois':
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      endDate = new Date();
      break;
    case 'Cette année':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
      break;
    case 'Tout':
      startDate = new Date(Math.min(...transactions.map(t => new Date(t.date))));
      endDate = new Date();
      break;
  }

  const groupedData = transactions.reduce((acc, { amount, date }) => {
    const transactionDate = new Date(date);
    if (transactionDate >= startDate && transactionDate <= endDate) {
      const label = getLabelForPeriod(transactionDate, period);
      acc[label] = (acc[label] || 0) + amount;
    }
    return acc;
  }, {});

  return await getChartDataForPeriod(groupedData, startDate, endDate, period);
}

function getStartOfWeek(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  return startOfWeek;
}

function getLabelForPeriod(date, period) {
  switch (period) {
    case 'Cette semaine':
    case '2 dernières semaines':
      return `${date.getDate()}/${date.getMonth() + 1}`;
    case 'Ce mois-ci':
      return `${date.getDate()}`;
    case '6 derniers mois':
      return getWeekLabel(date);
    case 'Cette année':
    case 'Tout':
      return getMonthLabel(date);
    default:
      return '';
  }
}

async function getChartDataForPeriod(groupedData, startDate, endDate, period) {
  switch (period) {
    case 'Cette semaine':
      return await generateDailyData(groupedData, startDate, 7, true);
    case '2 dernières semaines':
      return await generateDailyData(groupedData, startDate, 14, true);
    case 'Ce mois-ci':
      return await generateDailyData(groupedData, startDate, new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate(), false);
    case '6 derniers mois':
      return await generateWeeklyData(groupedData, startDate, endDate);
    case 'Cette année':
    case 'Tout':
      return await generateMonthlyData(groupedData, startDate, endDate);
    default:
      return { labels: Object.keys(groupedData), data: Object.values(groupedData) };
  }
}

async function convertAndFormatAmount(convertedValue) {
  const baseCurrency = '€';
  const rate = await currencyService.getExchangeRate(baseCurrency, selectedCurrency.value);

  let amount = convertedValue;
  if (rate) {
    amount *= rate;
  }

  return amount.toFixed(2);
}

async function generateDailyData(groupedData, startDate, days, showMonth) {
  const labels = [];
  const data = [];
  for (let i = 0; i < days; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    const label = showMonth ? `${day.getDate()}/${day.getMonth() + 1}` : `${day.getDate()}`;
    labels.push(label);

    var convertedValue = 0;
    if (groupedData[label]) {
      convertedValue = await convertAndFormatAmount(groupedData[label])
    }
    data.push(convertedValue);
  }
  return { labels, data };
}

async function generateWeeklyData(groupedData, startDate, endDate) {
  const labels = [];
  const data = [];
  let startOfWeek = new Date(startDate);
  while (startOfWeek <= endDate) {
    const label = getWeekLabel(startOfWeek);
    labels.push(label);
    var convertedValue = 0;
    if (groupedData[label]) {
      convertedValue = await convertAndFormatAmount(groupedData[label])
    }
    data.push(convertedValue);
    startOfWeek.setDate(startOfWeek.getDate() + 7);
  }
  return { labels, data };
}

async function generateMonthlyData(groupedData, startDate, endDate) {
  const labels = [];
  const data = [];
  let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (currentMonth <= endDate) {
    const label = getMonthLabel(currentMonth);
    labels.push(label);
    var convertedValue = 0;
    if (groupedData[label]) {
      convertedValue = await convertAndFormatAmount(groupedData[label])
    }
    data.push(convertedValue);
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }
  return { labels, data };
}

function getWeekLabel(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((date - startOfYear) / 86400000 + 1) / 7);
  return `Semaine ${weekNumber} (${date.getMonth() + 1}/${date.getFullYear()})`;
}

function getMonthLabel(date) {
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

</script>

<style scoped>
.lineContainer {
  padding: 1%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
