import { defineStore } from 'pinia';

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    selectedCurrency: '€'
  }),
  actions: {
    setCurrency(currency) {
      this.selectedCurrency = currency;
    }
  }
});
