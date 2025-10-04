// ProductCategory model for AdventureWorksLT2022
class ProductCategory {
  constructor(data) {
    this.ProductCategoryID = data.ProductCategoryID;
    this.ParentProductCategoryID = data.ParentProductCategoryID;
    this.Name = data.Name;
    this.rowguid = data.rowguid;
    this.ModifiedDate = data.ModifiedDate;

    // Computed fields
    this.isParentCategory = !this.ParentProductCategoryID;
    this.hasSubCategories = false; // Will be set by controller if needed
  }

  // Convert to API response format
  toApiResponse() {
    return {
      id: this.ProductCategoryID,
      ProductCategoryID: this.ProductCategoryID,
      name: this.Name,
      Name: this.Name,
      parentId: this.ParentProductCategoryID,
      ParentProductCategoryID: this.ParentProductCategoryID,
      isParentCategory: this.isParentCategory,
      hasSubCategories: this.hasSubCategories,
      ModifiedDate: this.ModifiedDate,
    };
  }

  // Convert to database format
  toDatabaseFormat() {
    return {
      ParentProductCategoryID: this.ParentProductCategoryID,
      Name: this.Name,
    };
  }
}

module.exports = ProductCategory;
