// SalesOrder model for AdventureWorksLT2022
class SalesOrder {
  constructor(data) {
    // SalesOrderHeader fields
    this.SalesOrderID = data.SalesOrderID;
    this.RevisionNumber = data.RevisionNumber;
    this.OrderDate = data.OrderDate;
    this.DueDate = data.DueDate;
    this.ShipDate = data.ShipDate;
    this.Status = data.Status;
    this.OnlineOrderFlag = data.OnlineOrderFlag;
    this.SalesOrderNumber = data.SalesOrderNumber;
    this.PurchaseOrderNumber = data.PurchaseOrderNumber;
    this.AccountNumber = data.AccountNumber;
    this.CustomerID = data.CustomerID;
    this.ShipToAddressID = data.ShipToAddressID;
    this.BillToAddressID = data.BillToAddressID;
    this.ShipMethod = data.ShipMethod;
    this.CreditCardApprovalCode = data.CreditCardApprovalCode;
    this.SubTotal = data.SubTotal;
    this.TaxAmt = data.TaxAmt;
    this.Freight = data.Freight;
    this.TotalDue = data.TotalDue;
    this.Comment = data.Comment;
    this.rowguid = data.rowguid;
    this.ModifiedDate = data.ModifiedDate;

    // Related customer data from JOINs
    this.CustomerName = data.CustomerName;
    this.CustomerEmail = data.CustomerEmail;
    this.CustomerCompany = data.CustomerCompany;

    // Computed fields
    this.statusText = this.getStatusText();
    this.isComplete = this.Status === 5; // Assuming 5 is complete status
    this.isPending = this.Status === 1; // Assuming 1 is pending status
  }

  getStatusText() {
    const statusMap = {
      1: "En Proceso",
      2: "Aprobado",
      3: "Backordered",
      4: "Rechazado",
      5: "Enviado",
      6: "Cancelado",
    };
    return statusMap[this.Status] || "Desconocido";
  }

  // Convert to API response format
  toApiResponse() {
    return {
      id: this.SalesOrderID,
      SalesOrderID: this.SalesOrderID,
      orderNumber: this.SalesOrderNumber,
      SalesOrderNumber: this.SalesOrderNumber,
      orderDate: this.OrderDate,
      OrderDate: this.OrderDate,
      dueDate: this.DueDate,
      DueDate: this.DueDate,
      shipDate: this.ShipDate,
      ShipDate: this.ShipDate,
      status: this.Status,
      Status: this.Status,
      statusText: this.statusText,
      customerID: this.CustomerID,
      CustomerID: this.CustomerID,
      customerName: this.CustomerName,
      customerEmail: this.CustomerEmail,
      customerCompany: this.CustomerCompany,
      subTotal: this.SubTotal,
      SubTotal: this.SubTotal,
      taxAmount: this.TaxAmt,
      TaxAmt: this.TaxAmt,
      freight: this.Freight,
      Freight: this.Freight,
      totalDue: this.TotalDue,
      TotalDue: this.TotalDue,
      comment: this.Comment,
      Comment: this.Comment,
      isComplete: this.isComplete,
      isPending: this.isPending,
      ModifiedDate: this.ModifiedDate,
    };
  }

  // Convert to database format
  toDatabaseFormat() {
    return {
      RevisionNumber: this.RevisionNumber,
      OrderDate: this.OrderDate,
      DueDate: this.DueDate,
      ShipDate: this.ShipDate,
      Status: this.Status,
      OnlineOrderFlag: this.OnlineOrderFlag,
      SalesOrderNumber: this.SalesOrderNumber,
      PurchaseOrderNumber: this.PurchaseOrderNumber,
      AccountNumber: this.AccountNumber,
      CustomerID: this.CustomerID,
      ShipToAddressID: this.ShipToAddressID,
      BillToAddressID: this.BillToAddressID,
      ShipMethod: this.ShipMethod,
      CreditCardApprovalCode: this.CreditCardApprovalCode,
      SubTotal: this.SubTotal,
      TaxAmt: this.TaxAmt,
      Freight: this.Freight,
      TotalDue: this.TotalDue,
      Comment: this.Comment,
    };
  }
}

module.exports = SalesOrder;
