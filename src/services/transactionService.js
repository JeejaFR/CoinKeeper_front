import axios from 'axios';

const url = 'http://localhost:2000';

const transactionService = {
  getTransactionParPeriode: async (periode) => {
    var periodeToInt = 5; // par défault tout
    switch (periode) {
      case 'Cette semaine':
        periodeToInt = 0;
        break;
      case '2 dernières semaines':
        periodeToInt = 1;
        break;
      case 'Ce mois-ci':
        periodeToInt = 2;
        break;
      case '6 derniers mois':
        periodeToInt = 3;
        break;
      case 'Cette année':
        periodeToInt = 4;
        break;
      default:
        periodeToInt = 5;
        break;
    }
    try {
      const response = await axios.get(`${url}/transactions/periode/${periodeToInt}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la réccupération des transactions", error);
      throw error;
    }
  },
};

export default transactionService;
