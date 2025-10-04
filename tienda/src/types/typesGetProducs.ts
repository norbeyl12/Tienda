export interface Producto {
  ProductID: number;
  Name: string;
  ProductNumber: string;
  Color: string | null;
  StandardCost: number;
  ListPrice: number;
  Size: string | null;
  Weight: number | null;
  ProductCategoryID: number;
  ProductModelID: number;
  SellStartDate: string;
  SellEndDate: string | null;
  DiscontinuedDate: string | null;
  ThumbNailPhoto?: {
    type: string;
    data: number[];
  };
  ThumbnailPhotoFileName: string;
  rowguid: string;
  ModifiedDate: string;
}