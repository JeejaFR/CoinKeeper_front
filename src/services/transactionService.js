import axios from "axios";

const url = "http://localhost:2000";
const token = localStorage.getItem("authToken");

const transactionService = {
  getTransactionParPeriode: async (periode) => {
    var periodeToInt = 5; // par défault tout
    switch (periode) {
      case "Cette semaine":
        periodeToInt = 0;
        break;
      case "2 dernières semaines":
        periodeToInt = 1;
        break;
      case "Ce mois-ci":
        periodeToInt = 2;
        break;
      case "6 derniers mois":
        periodeToInt = 3;
        break;
      case "Cette année":
        periodeToInt = 4;
        break;
      default:
        periodeToInt = 5;
        break;
    }
    try {
      const response = await axios.get(
        `${url}/transactions/periode/${periodeToInt}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions", error);
      throw error;
    }
  },
  createTransaction: async (transaction) => {
    try {
      const response = await axios.post(`${url}/transactions`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la transaction", error);
      throw error;
    }
  },
  updateTransaction: async (transactionID, transaction) => {
    try {
      const response = await axios.put(
        `${url}/transactions/${transactionID}`,
        transaction,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification de la transaction", error);
      throw error;
    }
  },
  deleteTransaction: async (transactionID) => {
    try {
      const response = await axios.delete(
        `${url}/transactions/${transactionID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppresion de la transaction", error);
      throw error;
    }
  },
};

export default transactionService;
