import axios from "axios";

const baseAPi = axios.create({
  baseURL: "http://localhost:3000/api",
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