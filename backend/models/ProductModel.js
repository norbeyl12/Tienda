// ProductModel model for AdventureWorksLT2022
class ProductModel {
  constructor(data) {
    this.ProductModelID = data.ProductModelID;
    this.Name = data.Name;
    this.CatalogDescription = data.CatalogDescription;
    this.rowguid = data.rowguid;
    this.ModifiedDate = data.ModifiedDate;
  }

  // Convert to API response format
  toApiResponse() {
    return {
      id: this.ProductModelID,
      ProductModelID: this.ProductModelID,
      name: this.Name,
      Name: this.Name,
      catalogDescription: this.CatalogDescription,
      CatalogDescription: this.CatalogDescription,
      ModifiedDate: this.ModifiedDate,
    };
  }

  // Convert to database format
  toDatabaseFormat() {
    return {
      Name: this.Name,
      CatalogDescription: this.CatalogDescription,
    };
  }
}

module.exports = ProductModel;
