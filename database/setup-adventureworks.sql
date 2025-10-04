-- Script to create AdventureWorks sample tables for Tienda application
-- This creates simplified tables based on AdventureWorks schema

USE master;
GO

-- Create AdventureWorks database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AdventureWorks')
BEGIN
    CREATE DATABASE AdventureWorks;
END
GO

USE AdventureWorks;
GO

-- Create Product Category table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProductCategory')
BEGIN
    CREATE TABLE ProductCategory (
        ProductCategoryID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL,
        ModifiedDate DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create Product table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Product')
BEGIN
    CREATE TABLE Product (
        ProductID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(50) NOT NULL,
        ProductNumber NVARCHAR(25) NOT NULL UNIQUE,
        CategoryID INT,
        Color NVARCHAR(15),
        StandardCost DECIMAL(10,2),
        ListPrice DECIMAL(10,2) NOT NULL,
        Size NVARCHAR(5),
        Weight DECIMAL(8,2),
        ProductLine NCHAR(2),
        SafetyStockLevel SMALLINT NOT NULL,
        ReorderPoint SMALLINT NOT NULL,
        DaysToManufacture INT NOT NULL,
        SellStartDate DATETIME2 NOT NULL,
        SellEndDate DATETIME2,
        ModifiedDate DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (CategoryID) REFERENCES ProductCategory(ProductCategoryID)
    );
END
GO

-- Create Customer table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Customer')
BEGIN
    CREATE TABLE Customer (
        CustomerID INT IDENTITY(1,1) PRIMARY KEY,
        PersonID INT,
        StoreID INT,
        TerritoryID INT,
        AccountNumber NVARCHAR(10) NOT NULL UNIQUE,
        ModifiedDate DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create Person table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Person')
BEGIN
    CREATE TABLE Person (
        BusinessEntityID INT IDENTITY(1,1) PRIMARY KEY,
        PersonType NCHAR(2) NOT NULL,
        NameStyle BIT NOT NULL DEFAULT 0,
        Title NVARCHAR(8),
        FirstName NVARCHAR(50) NOT NULL,
        MiddleName NVARCHAR(50),
        LastName NVARCHAR(50) NOT NULL,
        Suffix NVARCHAR(10),
        EmailPromotion INT NOT NULL DEFAULT 0,
        ModifiedDate DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Create EmailAddress table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'EmailAddress')
BEGIN
    CREATE TABLE EmailAddress (
        BusinessEntityID INT NOT NULL,
        EmailAddressID INT IDENTITY(1,1),
        EmailAddress NVARCHAR(50),
        ModifiedDate DATETIME2 DEFAULT GETDATE(),
        PRIMARY KEY (BusinessEntityID, EmailAddressID),
        FOREIGN KEY (BusinessEntityID) REFERENCES Person(BusinessEntityID)
    );
END
GO

-- Insert sample categories
INSERT INTO ProductCategory (Name) VALUES 
('Bicicletas'),
('Accesorios'),
('Ropa'),
('Componentes')
GO

-- Insert sample products
INSERT INTO Product (Name, ProductNumber, CategoryID, Color, StandardCost, ListPrice, SafetyStockLevel, ReorderPoint, DaysToManufacture, SellStartDate) VALUES 
('Mountain Bike Red', 'BK-M18S-42', 1, 'Red', 500.00, 1200.00, 100, 50, 4, '2023-01-01'),
('Road Bike Blue', 'BK-R89B-48', 1, 'Blue', 800.00, 1800.00, 80, 40, 5, '2023-01-01'),
('Hybrid Bike Black', 'BK-H93B-54', 1, 'Black', 600.00, 1400.00, 90, 45, 4, '2023-01-01'),
('Casco Protector', 'HE-0001', 2, 'White', 20.00, 45.00, 200, 100, 1, '2023-01-01'),
('Guantes Ciclismo', 'GL-0001', 2, 'Black', 15.00, 35.00, 150, 75, 1, '2023-01-01'),
('Jersey Deportivo', 'JE-0001', 3, 'Blue', 25.00, 55.00, 100, 50, 2, '2023-01-01'),
('Pantalón Ciclismo', 'PA-0001', 3, 'Black', 30.00, 65.00, 80, 40, 2, '2023-01-01'),
('Cadena Bicicleta', 'CH-0001', 4, NULL, 8.00, 18.00, 300, 150, 1, '2023-01-01'),
('Frenos Disco', 'BR-0001', 4, 'Silver', 45.00, 95.00, 60, 30, 3, '2023-01-01'),
('Ruedas 26 pulgadas', 'WH-0001', 4, 'Black', 75.00, 165.00, 40, 20, 5, '2023-01-01')
GO

-- Insert sample persons
INSERT INTO Person (PersonType, FirstName, MiddleName, LastName, Title) VALUES 
('SC', 'Laura', 'Sofia', 'Mora Ruiz', 'Ms.'),
('SC', 'Carlos', NULL, 'Pérez', 'Mr.'),
('SC', 'Marta', NULL, 'López', 'Ms.'),
('SC', 'Juan', NULL, 'Rodríguez', 'Mr.'),
('SC', 'Ana', 'María', 'González', 'Ms.'),
('SC', 'Pedro', 'Luis', 'Martínez', 'Mr.')
GO

-- Insert sample customers
INSERT INTO Customer (PersonID, AccountNumber) VALUES 
(1, 'AW00000122'),
(2, 'AW00000124'), 
(3, 'AW00000128'),
(4, 'AW00000130'),
(5, 'AW00000135'),
(6, 'AW00000140')
GO

-- Insert sample email addresses
INSERT INTO EmailAddress (BusinessEntityID, EmailAddress) VALUES 
(1, 'laura.mora@email.com'),
(2, 'carlos.perez@email.com'),
(3, 'marta.lopez@email.com'),
(4, 'juan.rodriguez@email.com'),
(5, 'ana.gonzalez@email.com'),
(6, 'pedro.martinez@email.com')
GO

PRINT 'AdventureWorks database setup completed successfully!'
GO