import axios from "axios";

const url = "http://localhost:2000";
const token = localStorage.getItem("authToken");

function nameToInt(periode, isPassed){
  var periodeToInt = isPassed ? 11 : 5; // 'Tout' par default
  switch (periode) {
    case "Cette semaine":
      periodeToInt = isPassed ? 6 : 0;
      break;
    case "2 dernières semaines":
      periodeToInt = isPassed ? 7 : 1;
      break;
    case "Ce mois-ci":
      periodeToInt = isPassed ? 8 : 2;
      break;
    case "6 derniers mois":
      periodeToInt = isPassed ? 9 : 3;
      break;
    case "Cette année":
      periodeToInt = isPassed ? 10 : 4;
      break;
    default:
      break;
  }
  return periodeToInt;
}

const transactionService = {
  getTransactionParPeriode: async (periode, isPassed) => {
    var periodeToInt = nameToInt(periode, isPassed);
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
  isTransactionInPeriode: (transaction, periode) => {
    let startDate;
    let endDate = new Date();

    switch (periode) {
      case "Cette semaine":
        startDate = new Date();
        const dayOfWeek = startDate.getDay();
        const difference = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - difference);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        break;
      case "2 dernières semaines":
        startDate = new Date();
        const pastTwoWeeksStart = endDate.getDay() + 7;
        startDate.setDate(endDate.getDate() - pastTwoWeeksStart);
        break;
      case "Ce mois-ci":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case "6 derniers mois":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);
        break;
      case "Cette année":
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case "Tout":
        return true;
      default:
        return false;
    }

    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  },
};

export default transactionService;
