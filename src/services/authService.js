import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const url = 'http://localhost:2000';


// TODO Verifier le token a chaque page (savoir s'il est encore bon)

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
  decodeToken: (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Erreur lors de la décodage du token:', error);
      return null;
    }
  }
};

export default authService;
