<template>
  <v-card class="card-stat" max-width="300">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-subtitle class="d-flex align-center justify-left">
      <div class="stat-value">{{ floatValue }}</div>
    </v-card-subtitle>
    <div class="lowerContainer">
      <v-icon class="stat-icon" :color="trendColor">{{ trendIcon }}</v-icon>
      <span :style="{ color: trendColor }">{{ trendValue }}</span>
      <br>
      <small>{{ description }}</small>
    </div>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Titre',
  },
  floatValue: {
    type: [Number, String],
    default: '0.00',
  },
  trendIcon: {
    type: String,
    default: 'mdi-trending-down',
  },
  trendValue: {
    type: String,
    default: '0.00%',
  },
  description: {
    type: String,
    default: 'Description',
  },
});

const trendColor = props.trendValue.startsWith('-') ? 'red' : 'green';
</script>

<style scoped>
.lowerContainer{
  margin-top: 1rem;
}
.card-stat {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0px 0px 16px 16px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  margin-right: 8px;
}

.stat-icon {
  font-size: 2rem;
  margin: 0 4px;
}

.text-center {
  text-align: center;
}

.headline {
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
