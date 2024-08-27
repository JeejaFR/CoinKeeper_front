<template>
  <div class="donutContainer">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Enregistre tous les éléments nécessaires pour le graphique en anneau
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Props reçues du parent
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  }
});

// Préparer les données pour le graphique en donut
const chartData = computed(() => {
  // Agréger les montants par catégorie
  const amountsByCategory = props.transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  return {
    labels: Object.keys(amountsByCategory),
    datasets: [
      {
        label: 'Montants par catégorie',
        data: Object.values(amountsByCategory),
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
});

// Options du graphique
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem.label + ': ' + tooltipItem.raw;
        }
      }
    }
  }
});
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
