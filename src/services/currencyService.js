const currencyService = {
  symbolToCode: {
    '€': 'EUR',
    '$': 'USD',
    '£': 'GBP',
    '¥': 'JPY',
  },

  getExchangeRate: async function (baseCurrencySymbol, targetCurrencySymbol) {
    const baseCurrency = this.symbolToCode[baseCurrencySymbol];
    const targetCurrency = this.symbolToCode[targetCurrencySymbol];

    if (!targetCurrency || !baseCurrency) {
      console.error('Nous ne prenons pas en compte cette monnaie: '+ baseCurrencySymbol + ' | ' + targetCurrencySymbol);
      return null;
    }

    const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.rates[targetCurrency];
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      return null;
    }
  }
};

export default currencyService;
