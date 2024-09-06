import axios from "axios";

const url = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("authToken");

const categorieService = {
  getCategories: async () => {
    try {
      const response = await axios.get(
        `${url}/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des categories", error);
      throw error;
    }
  },
  createCategorie: async (categorie) => {
    try {
      const response = await axios.post(`${url}/categories`, categorie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la categorie", error);
      throw error;
    }
  },
  updateCategorie: async (categorieID, categorie) => {
    try {
      const response = await axios.put(
        `${url}/categories/${categorieID}`,
        categorie,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la modification de la categorie", error);
      throw error;
    }
  },
  deleteCategorie: async (categorieID) => {
    try {
      const response = await axios.delete(
        `${url}/categories/${categorieID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppresion de la categorie", error);
      throw error;
    }
  },
};

export default categorieService;
