// SQL Queries for AdventureWorksLT2022 - Updated to match exact schema
const queries = {
  // Product queries with full schema mapping
  products: {
    getAll: `
      SELECT 
        p.ProductID,
        p.Name,
        p.ProductNumber,
        p.Color,
        p.StandardCost,
        p.ListPrice,
        p.Size,
        p.Weight,
        p.ProductCategoryID,
        p.ProductModelID,
        p.SellStartDate,
        p.SellEndDate,
        p.DiscontinuedDate,
        p.ThumbnailPhoto,
        p.ThumbnailPhotoFileName,
        p.rowguid,
        p.ModifiedDate,
        pc.Name as CategoryName,
        pm.Name as ProductModelName,
        pm.CatalogDescription,
        pd.Description as ProductDescription
      FROM SalesLT.Product p
      LEFT JOIN SalesLT.ProductCategory pc ON p.ProductCategoryID = pc.ProductCategoryID
      LEFT JOIN SalesLT.ProductModel pm ON p.ProductModelID = pm.ProductModelID
      LEFT JOIN SalesLT.ProductModelProductDescription pmpd ON pm.ProductModelID = pmpd.ProductModelID
      LEFT JOIN SalesLT.ProductDescription pd ON pmpd.ProductDescriptionID = pd.ProductDescriptionID
        AND pmpd.Culture = 'en'
      WHERE p.SellEndDate IS NULL OR p.SellEndDate > GETDATE()
      ORDER BY p.Name
    `,

    getById: `
      SELECT 
        p.ProductID,
        p.Name,
        p.ProductNumber,
        p.Color,
        p.StandardCost,
        p.ListPrice,
        p.Size,
        p.Weight,
        p.ProductCategoryID,
        p.ProductModelID,
        p.SellStartDate,
        p.SellEndDate,
        p.DiscontinuedDate,
        p.ThumbnailPhoto,
        p.ThumbnailPhotoFileName,
        p.rowguid,
        p.ModifiedDate,
        pc.Name as CategoryName,
        pm.Name as ProductModelName,
        pm.CatalogDescription,
        pd.Description as ProductDescription
      FROM SalesLT.Product p
      LEFT JOIN SalesLT.ProductCategory pc ON p.ProductCategoryID = pc.ProductCategoryID
      LEFT JOIN SalesLT.ProductModel pm ON p.ProductModelID = pm.ProductModelID
      LEFT JOIN SalesLT.ProductModelProductDescription pmpd ON pm.ProductModelID = pmpd.ProductModelID
      LEFT JOIN SalesLT.ProductDescription pd ON pmpd.ProductDescriptionID = pd.ProductDescriptionID
        AND pmpd.Culture = 'en'
      WHERE p.ProductID = @productId
    `,

    getByCategory: `
      SELECT 
        p.ProductID,
        p.Name,
        p.ProductNumber,
        p.Color,
        p.StandardCost,
        p.ListPrice,
        p.Size,
        p.Weight,
        p.ProductCategoryID,
        p.ProductModelID,
        p.SellStartDate,
        p.SellEndDate,
        p.DiscontinuedDate,
        p.ThumbnailPhoto,
        p.ThumbnailPhotoFileName,
        p.rowguid,
        p.ModifiedDate,
        pc.Name as CategoryName,
        pm.Name as ProductModelName,
        pm.CatalogDescription,
        pd.Description as ProductDescription
      FROM SalesLT.Product p
      LEFT JOIN SalesLT.ProductCategory pc ON p.ProductCategoryID = pc.ProductCategoryID
      LEFT JOIN SalesLT.ProductModel pm ON p.ProductModelID = pm.ProductModelID
      LEFT JOIN SalesLT.ProductModelProductDescription pmpd ON pm.ProductModelID = pmpd.ProductModelID
      LEFT JOIN SalesLT.ProductDescription pd ON pmpd.ProductDescriptionID = pd.ProductDescriptionID
        AND pmpd.Culture = 'en'
      WHERE p.ProductCategoryID = @categoryId
        AND (p.SellEndDate IS NULL OR p.SellEndDate > GETDATE())
      ORDER BY p.Name
    `,

    search: `
      SELECT 
        p.ProductID,
        p.Name,
        p.ProductNumber,
        p.Color,
        p.StandardCost,
        p.ListPrice,
        p.Size,
        p.Weight,
        p.ProductCategoryID,
        p.ProductModelID,
        p.SellStartDate,
        p.SellEndDate,
        p.DiscontinuedDate,
        p.ThumbnailPhoto,
        p.ThumbnailPhotoFileName,
        p.rowguid,
        p.ModifiedDate,
        pc.Name as CategoryName,
        pm.Name as ProductModelName,
        pm.CatalogDescription,
        pd.Description as ProductDescription
      FROM SalesLT.Product p
      LEFT JOIN SalesLT.ProductCategory pc ON p.ProductCategoryID = pc.ProductCategoryID
      LEFT JOIN SalesLT.ProductModel pm ON p.ProductModelID = pm.ProductModelID
      LEFT JOIN SalesLT.ProductModelProductDescription pmpd ON pm.ProductModelID = pmpd.ProductModelID
      LEFT JOIN SalesLT.ProductDescription pd ON pmpd.ProductDescriptionID = pd.ProductDescriptionID
        AND pmpd.Culture = 'en'
      WHERE (p.Name LIKE @searchTerm 
         OR p.ProductNumber LIKE @searchTerm 
         OR pc.Name LIKE @searchTerm
         OR pd.Description LIKE @searchTerm)
        AND (p.SellEndDate IS NULL OR p.SellEndDate > GETDATE())
      ORDER BY p.Name
    `,
  },

  // Customer queries with address relationships
  customers: {
    getAll: `
      SELECT 
        c.CustomerID,
        c.NameStyle,
        c.Title,
        c.FirstName,
        c.MiddleName,
        c.LastName,
        c.Suffix,
        c.CompanyName,
        c.SalesPerson,
        c.EmailAddress,
        c.Phone,
        c.PasswordHash,
        c.PasswordSalt,
        c.rowguid,
        c.ModifiedDate,
        COUNT(soh.SalesOrderID) as TotalOrders,
        ISNULL(SUM(soh.TotalDue), 0) as TotalSpent
      FROM SalesLT.Customer c
      LEFT JOIN SalesLT.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      GROUP BY c.CustomerID, c.NameStyle, c.Title, c.FirstName, c.MiddleName, 
               c.LastName, c.Suffix, c.CompanyName, c.SalesPerson, c.EmailAddress, 
               c.Phone, c.PasswordHash, c.PasswordSalt, c.rowguid, c.ModifiedDate
      ORDER BY c.FirstName, c.LastName
    `,

    getById: `
      SELECT 
        c.CustomerID,
        c.NameStyle,
        c.Title,
        c.FirstName,
        c.MiddleName,
        c.LastName,
        c.Suffix,
        c.CompanyName,
        c.SalesPerson,
        c.EmailAddress,
        c.Phone,
        c.PasswordHash,
        c.PasswordSalt,
        c.rowguid,
        c.ModifiedDate,
        COUNT(soh.SalesOrderID) as TotalOrders,
        ISNULL(SUM(soh.TotalDue), 0) as TotalSpent
      FROM SalesLT.Customer c
      LEFT JOIN SalesLT.SalesOrderHeader soh ON c.CustomerID = soh.CustomerID
      WHERE c.CustomerID = @customerId
      GROUP BY c.CustomerID, c.NameStyle, c.Title, c.FirstName, c.MiddleName, 
               c.LastName, c.Suffix, c.CompanyName, c.SalesPerson, c.EmailAddress, 
               c.Phone, c.PasswordHash, c.PasswordSalt, c.rowguid, c.ModifiedDate
    `,

    getByEmail: `
      SELECT 
        c.CustomerID,
        c.NameStyle,
        c.Title,
        c.FirstName,
        c.MiddleName,
        c.LastName,
        c.Suffix,
        c.CompanyName,
        c.SalesPerson,
        c.EmailAddress,
        c.Phone,
        c.PasswordHash,
        c.PasswordSalt,
        c.rowguid,
        c.ModifiedDate
      FROM SalesLT.Customer c
      WHERE c.EmailAddress = @email
    `,

    getCustomerAddresses: `
      SELECT 
        a.AddressID,
        a.AddressLine1,
        a.AddressLine2,
        a.City,
        a.StateProvince,
        a.CountryRegion,
        a.PostalCode,
        a.rowguid,
        a.ModifiedDate,
        ca.AddressType
      FROM SalesLT.CustomerAddress ca
      INNER JOIN SalesLT.Address a ON ca.AddressID = a.AddressID
      WHERE ca.CustomerID = @customerId
    `,
  },

  // Category queries
  categories: {
    getAll: `
      SELECT 
        ProductCategoryID,
        ParentProductCategoryID,
        Name,
        rowguid,
        ModifiedDate
      FROM SalesLT.ProductCategory
      ORDER BY Name
    `,

    getById: `
      SELECT 
        ProductCategoryID,
        ParentProductCategoryID,
        Name,
        rowguid,
        ModifiedDate
      FROM SalesLT.ProductCategory
      WHERE ProductCategoryID = @categoryId
    `,
  },

  // Sales order queries with full details
  orders: {
    getAll: `
      SELECT 
        soh.SalesOrderID,
        soh.RevisionNumber,
        soh.OrderDate,
        soh.DueDate,
        soh.ShipDate,
        soh.Status,
        soh.OnlineOrderFlag,
        soh.SalesOrderNumber,
        soh.PurchaseOrderNumber,
        soh.AccountNumber,
        soh.CustomerID,
        soh.ShipToAddressID,
        soh.BillToAddressID,
        soh.ShipMethod,
        soh.CreditCardApprovalCode,
        soh.SubTotal,
        soh.TaxAmt,
        soh.Freight,
        soh.TotalDue,
        soh.Comment,
        soh.rowguid,
        soh.ModifiedDate,
        c.FirstName + ' ' + c.LastName as CustomerName,
        c.EmailAddress as CustomerEmail,
        c.CompanyName as CustomerCompany
      FROM SalesLT.SalesOrderHeader soh
      INNER JOIN SalesLT.Customer c ON soh.CustomerID = c.CustomerID
      ORDER BY soh.OrderDate DESC
    `,

    getByCustomer: `
      SELECT 
        soh.SalesOrderID,
        soh.RevisionNumber,
        soh.OrderDate,
        soh.DueDate,
        soh.ShipDate,
        soh.Status,
        soh.OnlineOrderFlag,
        soh.SalesOrderNumber,
        soh.PurchaseOrderNumber,
        soh.AccountNumber,
        soh.CustomerID,
        soh.ShipToAddressID,
        soh.BillToAddressID,
        soh.ShipMethod,
        soh.CreditCardApprovalCode,
        soh.SubTotal,
        soh.TaxAmt,
        soh.Freight,
        soh.TotalDue,
        soh.Comment,
        soh.rowguid,
        soh.ModifiedDate,
        c.FirstName + ' ' + c.LastName as CustomerName,
        c.EmailAddress as CustomerEmail,
        c.CompanyName as CustomerCompany
      FROM SalesLT.SalesOrderHeader soh
      INNER JOIN SalesLT.Customer c ON soh.CustomerID = c.CustomerID
      WHERE soh.CustomerID = @customerId
      ORDER BY soh.OrderDate DESC
    `,

    getOrderDetails: `
      SELECT 
        sod.SalesOrderID,
        sod.SalesOrderDetailID,
        sod.OrderQty,
        sod.ProductID,
        sod.UnitPrice,
        sod.UnitPriceDiscount,
        sod.LineTotal,
        sod.rowguid,
        sod.ModifiedDate,
        p.Name as ProductName,
        p.ProductNumber,
        p.Color as ProductColor
      FROM SalesLT.SalesOrderDetail sod
      INNER JOIN SalesLT.Product p ON sod.ProductID = p.ProductID
      WHERE sod.SalesOrderID = @orderId
      ORDER BY sod.SalesOrderDetailID
    `,
  },

  // Health check and utility queries
  health: {
    basic: "SELECT 1 as health_check",
    detailed: `
      SELECT 
        @@VERSION as server_version,
        DB_NAME() as database_name,
        GETDATE() as current_time,
        @@SERVERNAME as server_name
    `,
    tableCount: `
      SELECT COUNT(*) as table_count
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = 'SalesLT'
    `,
  },
};

module.exports = queries;
