import axios from 'axios';

const url = 'http://localhost:2000';

const authService = {
  login: async (payload) => {
    try {
      const response = await axios.post(`${url}/login`, payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      throw error; // Lancer l'erreur pour pouvoir la gérer dans le composant
    }
  },
  register: async (payload) => {
    try {
      const response = await axios.post(`${url}/register`, payload);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription", error);
      throw error; // Lancer l'erreur pour pouvoir la gérer dans le composant
    }
  }
};

export default authService;
