<template>
  <section class="dashboardContainer">
    <div class="dashBoardTitle">
      <h1>Tableau de bord</h1>
      <div class="selectContainer">
        <v-select v-model="selectedPeriod" :items="periodOptions" label="Période" variant="solo" dense class="custom-select">
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
          <LittleCard title="Total dépenses" floatValue="1234.56€" trendIcon="mdi-trending-down" trendValue="-1.3%"
            description="Depuis le mois dernier" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Nombre de dépenses" floatValue="30" trendIcon="mdi-trending-up" trendValue="1.3%"
            description="Depuis le mois dernier" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Répartition des dépenses" floatValue="45%" trendIcon="mdi-trending-down" trendValue="-0.7%"
            description="Depuis le mois dernier" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6">
          <LittleCard title="Épargne" floatValue="567.89€" trendIcon="mdi-trending-up" trendValue="2.5%"
            description="Depuis le mois dernier" />
        </v-col>
      </v-row>
      <div class="sparklineContainer">
        <LineChart />
      </div>
    </div>
    <div class="flex secondContainer">
      <v-card class="dataTable">
        <v-card-title>Mes dernières dépenses</v-card-title>
        <div class="dataTableContainer">
          <DataTable />
        </div>
      </v-card>
      <v-card class="categoryChart">
        <v-card-title>Dépenses par catégorie</v-card-title>
        <DonutChart />
      </v-card>
    </div>
  </section>
</template>

<script setup>
import LittleCard from '@/components/LittleCard.vue';
import LineChart from '@/components/LineChart.vue';
import DonutChart from '@/components/DonutChart.vue';
import DataTable from '@/components/DataTable.vue'
import { ref } from 'vue';

const periodOptions = [
  'Cette semaine',
  '2 dernières semaines',
  'Ce mois-ci',
  '6 derniers mois',
  'Cette année',
  'Tout'
];

const selectedPeriod = ref('Cette semaine');

function clearSelection() {
  selectedPeriod.value = 'Cette semaine';
}
</script>

<style scoped>
.selectContainer {
  width: 25%;
  /* Ajuste selon les besoins */
}

.custom-select {
  min-width: 200px;
  /* Largeur minimale */
}

.dashBoardTitle {
  display: flex;
  gap: 2rem;
  font-size: 2rem;
  margin-bottom: 2rem;
  justify-content: space-between;
}

.flex {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.selectContainer {
  width: 20%;
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
  padding: 2rem;
}
</style>
