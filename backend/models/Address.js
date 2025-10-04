// Address model for AdventureWorksLT2022
class Address {
  constructor(data) {
    this.AddressID = data.AddressID;
    this.AddressLine1 = data.AddressLine1;
    this.AddressLine2 = data.AddressLine2;
    this.City = data.City;
    this.StateProvince = data.StateProvince;
    this.CountryRegion = data.CountryRegion;
    this.PostalCode = data.PostalCode;
    this.rowguid = data.rowguid;
    this.ModifiedDate = data.ModifiedDate;

    // Computed fields
    this.fullAddress = this.getFullAddress();
  }

  getFullAddress() {
    let address = this.AddressLine1;
    if (this.AddressLine2) {
      address += `, ${this.AddressLine2}`;
    }
    address += `, ${this.City}`;
    if (this.StateProvince) {
      address += `, ${this.StateProvince}`;
    }
    if (this.PostalCode) {
      address += ` ${this.PostalCode}`;
    }
    if (this.CountryRegion) {
      address += `, ${this.CountryRegion}`;
    }
    return address;
  }

  // Convert to API response format
  toApiResponse() {
    return {
      id: this.AddressID,
      AddressID: this.AddressID,
      addressLine1: this.AddressLine1,
      AddressLine1: this.AddressLine1,
      addressLine2: this.AddressLine2,
      AddressLine2: this.AddressLine2,
      city: this.City,
      City: this.City,
      stateProvince: this.StateProvince,
      StateProvince: this.StateProvince,
      countryRegion: this.CountryRegion,
      CountryRegion: this.CountryRegion,
      postalCode: this.PostalCode,
      PostalCode: this.PostalCode,
      fullAddress: this.fullAddress,
      ModifiedDate: this.ModifiedDate,
    };
  }

  // Convert to database format
  toDatabaseFormat() {
    return {
      AddressLine1: this.AddressLine1,
      AddressLine2: this.AddressLine2,
      City: this.City,
      StateProvince: this.StateProvince,
      CountryRegion: this.CountryRegion,
      PostalCode: this.PostalCode,
    };
  }
}

module.exports = Address;
