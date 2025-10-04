// Product model for AdventureWorksLT2022 - Updated to match exact schema
class Product {
  constructor(data) {
    // Direct mapping from SalesLT.Product table
    this.ProductID = data.ProductID;
    this.Name = data.Name;
    this.ProductNumber = data.ProductNumber;
    this.Color = data.Color;
    this.StandardCost = data.StandardCost;
    this.ListPrice = data.ListPrice;
    this.Size = data.Size;
    this.Weight = data.Weight;
    this.ProductCategoryID = data.ProductCategoryID;
    this.ProductModelID = data.ProductModelID;
    this.SellStartDate = data.SellStartDate;
    this.SellEndDate = data.SellEndDate;
    this.DiscontinuedDate = data.DiscontinuedDate;
    this.ThumbnailPhoto = data.ThumbnailPhoto;
    this.ThumbnailPhotoFileName = data.ThumbnailPhotoFileName;
    this.rowguid = data.rowguid;
    this.ModifiedDate = data.ModifiedDate;

    // Related data from JOINs
    this.CategoryName = data.CategoryName;
    this.ProductModelName = data.ProductModelName;
    this.CatalogDescription = data.CatalogDescription;
    this.ProductDescription = data.ProductDescription;

    // Computed fields for frontend compatibility
    this.currency = "USD";
    this.stock = this.getRandomStock();
    this.brand = "Adventure Works";
    this.image_url = this.generateImageUrl();
    this.isActive =
      !this.SellEndDate || new Date(this.SellEndDate) > new Date();
  }

  getRandomStock() {
    // Generate stock based on product availability
    if (this.DiscontinuedDate) return 0;
    if (!this.isActive) return 0;
    // Generate random stock between 5-150 for active products
    return Math.floor(Math.random() * 146) + 5;
  }

  generateImageUrl() {
    // Use product ID for consistent image generation
    if (this.ThumbnailPhotoFileName) {
      // If there's a thumbnail filename, create a placeholder URL
      return `https://picsum.photos/300/300?random=${this.ProductID}`;
    }
    // Default fallback image based on category
    const categoryMap = {
      1: "bike",
      2: "component",
      3: "clothing",
      4: "accessory",
    };
    const category = categoryMap[this.ProductCategoryID] || "product";
    return `https://picsum.photos/300/300?random=${this.ProductID}&category=${category}`;
  }

  // Get product status
  getStatus() {
    if (this.DiscontinuedDate) return "discontinued";
    if (!this.isActive) return "inactive";
    return "active";
  }

  // Convert to API response format (compatible with existing frontend)
  toApiResponse() {
    return {
      id: this.ProductID,
      ProductID: this.ProductID,
      name: this.Name,
      Name: this.Name,
      category: this.CategoryName || "General",
      CategoryName: this.CategoryName,
      price: this.ListPrice,
      ListPrice: this.ListPrice,
      StandardCost: this.StandardCost,
      currency: this.currency,
      stock: this.stock,
      brand: this.brand,
      color: this.Color || "Sin especificar",
      Color: this.Color,
      size: this.Size,
      Size: this.Size,
      weight: this.Weight,
      Weight: this.Weight,
      ProductNumber: this.ProductNumber,
      description: this.ProductDescription || this.Name,
      ProductDescription: this.ProductDescription,
      image_url: this.image_url,
      status: this.getStatus(),
      isActive: this.isActive,
      SellStartDate: this.SellStartDate,
      SellEndDate: this.SellEndDate,
      ModifiedDate: this.ModifiedDate,
      ProductModelID: this.ProductModelID,
      ProductModelName: this.ProductModelName,
      CatalogDescription: this.CatalogDescription,
    };
  }

  // Convert to database format for inserts/updates
  toDatabaseFormat() {
    return {
      Name: this.Name,
      ProductNumber: this.ProductNumber,
      Color: this.Color,
      StandardCost: this.StandardCost,
      ListPrice: this.ListPrice,
      Size: this.Size,
      Weight: this.Weight,
      ProductCategoryID: this.ProductCategoryID,
      ProductModelID: this.ProductModelID,
      SellStartDate: this.SellStartDate,
      SellEndDate: this.SellEndDate,
      DiscontinuedDate: this.DiscontinuedDate,
      ThumbnailPhotoFileName: this.ThumbnailPhotoFileName,
    };
  }
}

module.exports = Product;
