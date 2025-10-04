-- Script to enable SQL Server authentication and create an API user
-- This will enable mixed mode authentication and create a user for the API

-- First, let's check current authentication mode
SELECT 
    CASE SERVERPROPERTY('IsIntegratedSecurityOnly') 
        WHEN 1 THEN 'Windows Authentication Only'
        WHEN 0 THEN 'Mixed Mode (SQL Server and Windows)'
    END as CurrentAuthMode;

-- Enable mixed mode authentication (requires SQL Server restart)
EXEC xp_instance_regwrite 
    N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer',
    N'LoginMode', 
    REG_DWORD, 
    2;

-- Create a login for the API
CREATE LOGIN [api_user] WITH PASSWORD=N'ApiPassword123!', DEFAULT_DATABASE=[AdventureWorksLT2022], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF;

-- Create a user in the AdventureWorksLT2022 database
USE [AdventureWorksLT2022];
CREATE USER [api_user] FOR LOGIN [api_user];

-- Grant necessary permissions to read data
ALTER ROLE [db_datareader] ADD MEMBER [api_user];

-- Grant permissions to the SalesLT schema specifically
GRANT SELECT ON SCHEMA::[SalesLT] TO [api_user];

-- Verify the user was created
SELECT 
    name as LoginName,
    type_desc as LoginType,
    is_disabled as IsDisabled,
    create_date as CreateDate
FROM sys.server_principals 
WHERE name = 'api_user';

PRINT 'API user created successfully!'
PRINT 'IMPORTANT: You need to restart SQL Server for mixed mode authentication to take effect.'
PRINT 'After restart, you can connect with:'
PRINT 'Username: api_user'
PRINT 'Password: ApiPassword123!'