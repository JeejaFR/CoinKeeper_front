<template>
  <v-card class="lineContainer">
    <Line :data="chartData" :options="chartOptions" />
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Enregistre tous les éléments nécessaires pour le graphique linéaire
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

// Données du graphique
const chartData = ref({
  labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Dépenses',
      borderColor: '#42A5F5',
      data: [40, 39, 10, 40, 39, 80],
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
          return tooltipItem.dataset.label + ': ' + tooltipItem.formattedValue;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Mois'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Valeurs'
      }
    }
  }
});
</script>

<style scoped>
  .lineContainer{
    padding: 1%;
  }
</style>
