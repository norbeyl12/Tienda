import axios from "axios";

// 🔹 Define la estructura de un producto según tu API de AdventureWorks
export interface Producto {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  brand: string;
  image_url: string;
  color?: string;
}

export const obtenerProductos = async (): Promise<{
  success: boolean;
  data?: Producto[];
  error?: string;
}> => {
  try {
    // 🔗 Conectar a tu API de AdventureWorks local
    const response = await axios.get("http://localhost:3000/api/products");

    return {
      success: true,
      data: response.data.data, // La respuesta viene en response.data.data
    };
  } catch (error: any) {
    console.error("Error conectando a AdventureWorks:", error);

    if (error.response?.data) {
      return {
        success: false,
        error:
          error.response.data.error ||
          "Error al obtener productos de AdventureWorks",
      };
    }

    // Si falla la conexión local, usar datos de respaldo
    if (
      error.code === "ECONNREFUSED" ||
      error.message.includes("Network Error")
    ) {
      console.warn(
        "⚠️  No se pudo conectar a la base de datos local, usando datos de respaldo"
      );
      return {
        success: false,
        error:
          "No se pudo conectar a la base de datos AdventureWorks. Verifique que el servidor esté ejecutándose.",
      };
    }

    return {
      success: false,
      error: "No se pudo conectar al servidor de AdventureWorks",
    };
  }
};
