import axios from "axios";

// 🔹 Define la estructura de un cliente según tu API de AdventureWorks
export interface Cliente {
  id: string;
  name: string;
  user: string;
  email?: string;
  phone?: string;
  companyName?: string;
  seller?: string;
  modificationDate?: string;
}

export const obtenerClientes = async (): Promise<{
  success: boolean;
  data?: Cliente[];
  error?: string;
}> => {
  try {
    // 🔗 Conectar a tu API de AdventureWorks local
    const response = await axios.get("http://localhost:3000/api/customers");

    return {
      success: true,
      data: response.data.data, // La respuesta viene en response.data.data
    };
  } catch (error: any) {
    console.error("Error conectando a AdventureWorks customers:", error);

    if (error.response?.data) {
      return {
        success: false,
        error:
          error.response.data.error ||
          "Error al obtener clientes de AdventureWorks",
      };
    }

    // Si falla la conexión local, usar datos de respaldo
    if (
      error.code === "ECONNREFUSED" ||
      error.message.includes("Network Error")
    ) {
      console.warn(
        "⚠️  No se pudo conectar a la base de datos local para clientes"
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

export const obtenerClientePorId = async (
  id: string
): Promise<{
  success: boolean;
  data?: Cliente;
  error?: string;
}> => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/customers/${id}`
    );

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error obteniendo cliente por ID:", error);

    if (error.response?.status === 404) {
      return {
        success: false,
        error: "Cliente no encontrado",
      };
    }

    if (error.response?.data) {
      return {
        success: false,
        error: error.response.data.error || "Error al obtener cliente",
      };
    }

    return { success: false, error: "No se pudo conectar al servidor" };
  }
};
