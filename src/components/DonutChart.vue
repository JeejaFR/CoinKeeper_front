<template>
  <div class="donutContainer">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import currencyService from '@/services/currencyService.js';
import { useCurrencyStore } from '@/stores/currencyStore';

const currencyStore = useCurrencyStore();

const selectedCurrency = computed(() => currencyStore.selectedCurrency);

// Enregistre tous les éléments nécessaires pour le graphique en anneau
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  }
});

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Montants par catégorie',
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
      hoverOffset: 4
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
          return `${tooltipItem.label}: ${chartData.value.datasets[0].data[tooltipItem.dataIndex]}`;
        }
      }
    }
  }
});

// Met à jour les données du graphique lorsque les transactions changent ou la devise sélectionnée
watch([() => props.transactions, () => selectedCurrency.value], async () => {
  const { transactions } = props;
  const amountsByCategory = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  // Convertir les montants en fonction de la devise sélectionnée
  const labels = Object.keys(amountsByCategory);
  const data = await Promise.all(Object.values(amountsByCategory).map(amount => convertAndFormatAmount(amount)));

  chartData.value = {
    labels: labels,
    datasets: [
      {
        label: 'Montants par catégorie',
        data: data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        hoverOffset: 4
      }
    ]
  };
}, { immediate: true });

// Fonction pour convertir les montants
async function convertAndFormatAmount(amount) {
  const baseCurrency = '€';
  const rate = await currencyService.getExchangeRate(baseCurrency, selectedCurrency.value);

  if (rate) {
    amount *= rate;
  }

  return amount.toFixed(2);
}
</script>

<style scoped>
.donutContainer {
  padding: 0% 5% 15% 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
