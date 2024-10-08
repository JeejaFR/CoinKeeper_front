import { jwtDecode } from "jwt-decode";
import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;

const authService = {
  login: async (payload) => {
    try {
      const response = await axios.post(`${url}/login`, payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      throw error;
    }
  },
  register: async (payload) => {
    try {
      const response = await axios.post(`${url}/register`, payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
      throw error;
    }
  },
  isTokenValid: async (token) => {
    try {
      const response = await axios.get(`${url}/checkToken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data.valid) {
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erreur lors de la verification du token", error);
      throw error;
    }
  },
  decodeToken: (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Erreur lors de la décodage du token:", error);
      return null;
    }
  },
};

export default authService;
