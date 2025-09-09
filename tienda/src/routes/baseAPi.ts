import axios from "axios";

const baseAPi = axios.create({
  baseURL: "https://api.jsonbin.io/v3/b",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptar respuestas
baseAPi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Error en la API:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default baseAPi;