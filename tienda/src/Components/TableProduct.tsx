import React from "react";
import type { Producto } from "../types/typesGetProducs";

interface Props {
  productos: Producto[];
}

// función para convertir el buffer en base64
const byteArrayToBase64 = (byteArray: number[]) => {
  const binary = byteArray.map((b) => String.fromCharCode(b)).join("");
  return btoa(binary);
};

// helper para formatear números
const formatNumber = (value?: number | null) =>
  value != null ? value.toFixed(2) : "0.00";

// helper para formatear fechas
const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "N/A";

const ProductosTable: React.FC<Props> = ({ productos }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Número</th>
            <th className="border px-2 py-1">Color</th>
            <th className="border px-2 py-1">Costo</th>
            <th className="border px-2 py-1">Precio</th>
            <th className="border px-2 py-1">Tamaño</th>
            <th className="border px-2 py-1">Peso</th>
            <th className="border px-2 py-1">Categoría</th>
            <th className="border px-2 py-1">Modelo</th>
            <th className="border px-2 py-1">Inicio Venta</th>
            <th className="border px-2 py-1">Fin Venta</th>
            <th className="border px-2 py-1">Descontinuado</th>
            <th className="border px-2 py-1">Imagen</th>
            <th className="border px-2 py-1">Archivo Img</th>
            <th className="border px-2 py-1">rowguid</th>
            <th className="border px-2 py-1">Modificado</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            let imageSrc = "";
            if (p.ThumbNailPhoto?.data) {
              const base64 = byteArrayToBase64(p.ThumbNailPhoto.data);
              imageSrc = `data:image/gif;base64,${base64}`;
            }

            return (
              <tr key={p.ProductID} className="hover:bg-gray-100">
                <td className="border px-2 py-1">{p.ProductID ?? "N/A"}</td>
                <td className="border px-2 py-1">{p.Name ?? "N/A"}</td>
                <td className="border px-2 py-1">{p.ProductNumber ?? "N/A"}</td>
                <td className="border px-2 py-1">{p.Color ?? "N/A"}</td>
                <td className="border px-2 py-1">
                  {formatNumber(p.StandardCost)}
                </td>
                <td className="border px-2 py-1">
                  {formatNumber(p.ListPrice)}
                </td>
                <td className="border px-2 py-1">{p.Size ?? "N/A"}</td>
                <td className="border px-2 py-1">{p.Weight ?? "N/A"}</td>
                <td className="border px-2 py-1">
                  {p.ProductCategoryID ?? "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {p.ProductModelID ?? "N/A"}
                </td>
                <td className="border px-2 py-1">
                  {formatDate(p.SellStartDate)}
                </td>
                <td className="border px-2 py-1">
                  {formatDate(p.SellEndDate)}
                </td>
                <td className="border px-2 py-1">
                  {formatDate(p.DiscontinuedDate)}
                </td>
                <td className="border px-2 py-1">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={p.Name ?? "Producto"}
                      className="w-12 h-12"
                    />
                  ) : (
                    "Sin Imagen"
                  )}
                </td>
                <td className="border px-2 py-1">
                  {p.ThumbnailPhotoFileName ?? "N/A"}
                </td>
                <td className="border px-2 py-1">{p.rowguid ?? "N/A"}</td>
                <td className="border px-2 py-1">
                  {formatDate(p.ModifiedDate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosTable;
