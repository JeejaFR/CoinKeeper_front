<template>
  <div class="donutContainer">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Enregistre tous les éléments nécessaires pour le graphique en anneau
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

// Données du graphique
const chartData = ref({
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'Distribution des couleurs',
      data: [12, 19, 3, 5, 2, 3],
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
.donutContainer{
  padding: 0% 5% 15% 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
