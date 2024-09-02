<template>
  <v-card class="card-stat" max-width="300">
    <v-card-subtitle class="d-flex align-center justify-space-between">
      <div class="stat-value text-primary">{{ categorie.name }}</div>
      <div class="action-buttons ">
        <v-btn icon @click="editCategory" variant="text" size="small" title="Editer la catégorie">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteCategory" variant="'text" size="small" title="Supprimer la catégorie">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </v-card-subtitle>
    <v-card-text>
      <div class="lowerContainer">
        <div class="amount-info">
          <span>Dépensé (periode):</span>
          <AsyncAmount class="text-blue" :amount="totalDepense" :selectedCurrency="selectedCurrency" />
        </div>
        <div class="amount-info">
          <span>Limite mensuelle:</span>
          <AsyncAmount v-if="categorie.month_limit > 0" class="text-blue" :amount="categorie.month_limit" :selectedCurrency="selectedCurrency" />
          <span v-else>Aucune</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineProps, defineEmits } from 'vue';
import { useCurrencyStore } from '@/stores/currencyStore';
import AsyncAmount from '@/components/AsyncAmount';
import transactionService from '@/services/transactionService';
import { emitBus } from '@/plugins/eventBus';

function triggerNotification() {
  emitBus('notificationEvent');
}

const currencyStore = useCurrencyStore();

const selectedCurrency = computed({
  get: () => currencyStore.selectedCurrency,
});

const props = defineProps({
  categorie: {
    type: Object,
    default: () => ({ name: '' }),
  },
  periode: {
    type: String,
    required: true,
  }
});

const totalDepense = ref(0);

const emits = defineEmits(['edit', 'delete']);

async function getTransactions() {
  try {
    const transactions = await transactionService.getTransactionParPeriode(props.periode);
    totalDepense.value = transactions
      .filter(transaction => transaction.category === props.categorie.name)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions:', error);
  }
}

onMounted(() => {
  getTransactions();
});

watch(() => props.periode, () => {
  totalDepense.value = 0;
  getTransactions();
});

function editCategory() {
  emits('edit');
}

function deleteCategory() {
  emits('delete');
}
</script>

<style scoped>
.card-stat {
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 0.3s ease;
}

.card-stat:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.v-btn {
  border-radius: 50%;
  transition: background 0.3s ease;
}

.v-btn:hover {
  background: #e0e0e0;
}

.v-card-subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  padding: 0;
}

.lowerContainer {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #555;
}

.amount-info {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.amount-info span {
  font-weight: 500;
}
</style>
