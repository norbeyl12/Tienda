// src/api/userApi.ts

import { data } from "react-router-dom";
import baseAPi from "./baseAPi";

// 🔹 Define la estructura de un producto según tu API
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
}

export const obtenerProductos = async (): Promise<{
  success: boolean;
  data?: Producto[];
  error?: string;
}> => {
  try {
    // 🔹 Llamada GET simple (sin headers de auth)
    const response = await baseAPi.get("/68b4d1b3ae596e708fde2aa7");
    return { success: true, data: response.data.record.products };
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
