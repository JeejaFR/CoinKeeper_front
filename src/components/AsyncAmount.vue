<template>
  <span v-if="formattedAmount">{{ formattedAmount }}{{ selectedCurrency }}</span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import currencyService from '@/services/currencyService.js';

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
  selectedCurrency: {
    type: String,
    required: true,
  }
});

const formattedAmount = ref(null);

async function convertAndFormatAmount() {
  const baseCurrency = '€';
  const rate = await currencyService.getExchangeRate(baseCurrency, props.selectedCurrency);

  let amount = props.amount;
  if (rate) {
    amount *= rate;
  }

  const formatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  formattedAmount.value = formatter.format(amount).replace(/\.00$/, '');
}

onMounted(() => {
  convertAndFormatAmount();
});

watch(() => props.selectedCurrency, convertAndFormatAmount);
watch(() => props.amount, convertAndFormatAmount);

</script>
