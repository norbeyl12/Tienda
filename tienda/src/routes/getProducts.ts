import type { Producto } from "../types/typesGetProducs";
import baseAPi from "./baseAPi";

export const obtenerProductos = async (): Promise<{
  success: boolean;
  data?: Producto[];
  error?: string;
}> => {
  try {
    const response = await baseAPi.get("/products");
    console.log("Respuesta API:", response.data);

    return { success: true, data: response.data.result as Producto[] };
  } catch (error: any) {
    if (error.response?.data) {
      return {
        success: false,
        error: error.response.data.detail || "Error al obtener productos",
      };
    }
    return { success: false, error: "No se pudo conectar al servidor" };
  }
};
