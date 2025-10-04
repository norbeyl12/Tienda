// Customer model for AdventureWorksLT2022 - Updated to match exact schema
class Customer {
  constructor(data) {
    // Direct mapping from SalesLT.Customer table
    this.CustomerID = data.CustomerID;
    this.NameStyle = data.NameStyle;
    this.Title = data.Title;
    this.FirstName = data.FirstName;
    this.MiddleName = data.MiddleName;
    this.LastName = data.LastName;
    this.Suffix = data.Suffix;
    this.CompanyName = data.CompanyName;
    this.SalesPerson = data.SalesPerson;
    this.EmailAddress = data.EmailAddress;
    this.Phone = data.Phone;
    this.PasswordHash = data.PasswordHash;
    this.PasswordSalt = data.PasswordSalt;
    this.rowguid = data.rowguid;
    this.ModifiedDate = data.ModifiedDate;

    // Related data from JOINs (addresses, orders)
    this.Addresses = data.Addresses || [];
    this.TotalOrders = data.TotalOrders || 0;
    this.TotalSpent = data.TotalSpent || 0;

    // Computed fields for frontend compatibility
    this.fullName = this.getFullName();
    this.displayName = this.getDisplayName();
    this.customerType = this.getCustomerType();
    this.isActive = true; // Could be computed based on recent orders
  }

  getFullName() {
    const parts = [
      this.Title,
      this.FirstName,
      this.MiddleName,
      this.LastName,
      this.Suffix,
    ].filter((part) => part && part.trim());

    return parts.join(" ") || this.CompanyName || "Cliente Anónimo";
  }

  getDisplayName() {
    if (this.FirstName && this.LastName) {
      return `${this.FirstName} ${this.LastName}`;
    }
    return this.CompanyName || `Cliente ${this.CustomerID}`;
  }

  getCustomerType() {
    return this.CompanyName ? "Empresa" : "Individual";
  }

  formatDate(date) {
    if (!date) return null;
    return new Date(date).toLocaleDateString("es-ES");
  }

  // Convert to API response format (compatible with existing frontend)
  toApiResponse() {
    return {
      id: this.CustomerID.toString(),
      CustomerID: this.CustomerID,
      name: this.fullName,
      fullName: this.fullName,
      FirstName: this.FirstName,
      LastName: this.LastName,
      user: this.displayName,
      displayName: this.displayName,
      email: this.EmailAddress,
      EmailAddress: this.EmailAddress,
      phone: this.Phone,
      Phone: this.Phone,
      companyName: this.CompanyName,
      CompanyName: this.CompanyName,
      customerType: this.customerType,
      title: this.Title,
      Title: this.Title,
      suffix: this.Suffix,
      Suffix: this.Suffix,
      salesPerson: this.SalesPerson,
      SalesPerson: this.SalesPerson,
      seller: this.SalesPerson || "Sistema",
      totalOrders: this.TotalOrders,
      totalSpent: this.TotalSpent,
      isActive: this.isActive,
      modificationDate: this.formatDate(this.ModifiedDate),
      ModifiedDate: this.ModifiedDate,
      addresses: this.Addresses,
    };
  }

  // Convert to database format for inserts/updates
  toDatabaseFormat() {
    return {
      NameStyle: this.NameStyle || false,
      Title: this.Title,
      FirstName: this.FirstName,
      MiddleName: this.MiddleName,
      LastName: this.LastName,
      Suffix: this.Suffix,
      CompanyName: this.CompanyName,
      SalesPerson: this.SalesPerson,
      EmailAddress: this.EmailAddress,
      Phone: this.Phone,
      PasswordHash: this.PasswordHash,
      PasswordSalt: this.PasswordSalt,
    };
  }
}

module.exports = Customer;
