import axios from "axios";

const url = "http://localhost:2000";
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
};

export default notificationService;
