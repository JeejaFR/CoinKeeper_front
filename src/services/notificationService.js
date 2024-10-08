import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("authToken");

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await axios.get(
        `${url}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications", error);
      throw error;
    }
  },
  deleteNotification: async (notificationID) => {
    try {
      const response = await axios.delete(
        `${url}/notifications/${notificationID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppresion de la notification", error);
      throw error;
    }
  },
deleteAllNotifications: async () => {
    try {
      const response = await axios.delete(
        `${url}/notifications/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppresion des notifications", error);
      throw error;
    }
  },
};

export default notificationService;
