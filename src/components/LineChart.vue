<template>
  <v-card class="lineContainer">
    <Line :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

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
      }
    },
    y: {
      title: {
        display: true,
        text: 'Montant (€)'
      }
    }
  }
});

// Met à jour les données du graphique lorsque les transactions ou la période changent
watch([() => props.transactions, () => props.period], () => {
  const { transactions, period } = props;
  const groupedData = groupDataByPeriod(transactions, period);
  const labels = Object.keys(groupedData);
  const data = Object.values(groupedData);

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
function groupDataByPeriod(transactions, period) {
  const now = new Date();
  let startDate;
  switch (period) {
    case 'Cette semaine':
      startDate = new Date(now.setDate(now.getDate() - now.getDay()));
      break;
    case '2 dernières semaines':
      startDate = new Date(now.setDate(now.getDate() - now.getDay() - 14));
      break;
    case 'Ce mois-ci':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case '6 derniers mois':
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case 'Cette année':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'Tout':
      startDate = new Date(0);
      break;
  }
  
  return transactions.reduce((acc, { amount, date }) => {
    const transactionDate = new Date(date);
    if (transactionDate >= startDate) {
      let label;
      switch (period) {
        case 'Cette semaine':
          label = `${transactionDate.getDate()}/${transactionDate.getMonth() + 1}`;
          break;
        case '2 dernières semaines':
          label = `${transactionDate.getDate()}/${transactionDate.getMonth() + 1}`;
          break;
        case 'Ce mois-ci':
          label = `${transactionDate.getDate()}`;
          break;
        case '6 derniers mois':
          label = `${transactionDate.getMonth() + 1}/${transactionDate.getFullYear()}`;
          break;
        case 'Cette année':
          label = `${transactionDate.getMonth() + 1}`;
          break;
        case 'Tout':
          label = `${transactionDate.getFullYear()}`;
          break;
      }
      if (!acc[label]) acc[label] = 0;
      acc[label] += amount;
    }
    return acc;
  }, {});
}
</script>

<style scoped>
.lineContainer {
  padding: 1%;
}
</style>
