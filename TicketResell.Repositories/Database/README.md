# TicketResellManagement Database Schema

## Tables

### 1. Category

| Column Name   | Data Type       | Nullable | Description          |
|---------------|-----------------|----------|----------------------|
| `CategoryId`  | `varchar(50)`   | NOT NULL | Primary key          |
| `Name`        | `nvarchar(255)` | NULL     | Category name        |
| `Description` | `nvarchar(max)` | NULL     | Category description |

### 2. Role

| Column Name   | Data Type      | Nullable | Description      |
|---------------|----------------|----------|------------------|
| `RoleId`      | `varchar(50)`  | NOT NULL | Primary key      |
| `Rolename`    | `varchar(100)` | NULL     | Role name        |
| `Description` | `varchar(max)` | NULL     | Role description |

### 3. SellConfig

| Column Name    | Data Type     | Nullable | Description           |
|----------------|---------------|----------|-----------------------|
| `SellConfigId` | `varchar(50)` | NOT NULL | Primary key           |
| `Commision`    | `float`       | NULL     | Commission percentage |

### 4. User

| Column Name    | Data Type       | Nullable | Description               |
|----------------|-----------------|----------|---------------------------|
| `UserId`       | `varchar(50)`   | NOT NULL | Primary key               |
| `SellConfigId` | `varchar(50)`   | NULL     | Foreign key to SellConfig |
| `Username`     | `varchar(100)`  | NULL     | Username                  |
| `Password`     | `nvarchar(255)` | NULL     | User password             |
| `Status`       | `int`           | NULL     | Account status            |
| `CreateDate`   | `datetime2`     | NULL     | Account creation date     |
| `Gmail`        | `varchar(100)`  | NULL     | Gmail address             |
| `Fullname`     | `nvarchar(255)` | NULL     | Full name                 |
| `Sex`          | `nvarchar(10)`  | NULL     | Gender                    |
| `Phone`        | `varchar(20)`   | NULL     | Phone number              |
| `Address`      | `nvarchar(255)` | NULL     | Address                   |
| `Avatar`       | `varchar(255)`  | NULL     | Avatar URL                |
| `Birthday`     | `datetime2`     | NULL     | Date of birth             |
| `Bio`          | `nvarchar(max)` | NULL     | Bio/Description           |
| `Verify`       | `int`           | NULL     | Verification status       |
| `Bank`         | `varchar(100)`  | NULL     | Bank name                 |
| `BankType`     | `varchar(50)`   | NULL     | Bank type                 |
| `SellAddress`  | `nvarchar(255)` | NULL     | Selling address           |
| `Cccd`         | `varchar(50)`   | NULL     | ID card number            |

### 5. Order

| Column Name | Data Type     | Nullable | Description         |
|-------------|---------------|----------|---------------------|
| `OrderId`   | `varchar(50)` | NOT NULL | Primary key         |
| `BuyerId`   | `varchar(50)` | NULL     | Foreign key to User |
| `Total`     | `float`       | NULL     | Order total         |
| `Date`      | `datetime2`   | NULL     | Order date          |
| `Status`    | `int`         | NULL     | Order status        |

### 6. Revenue

| Column Name | Data Type     | Nullable | Description         |
|-------------|---------------|----------|---------------------|
| `RevenueId` | `varchar(50)` | NOT NULL | Primary key         |
| `SellerId`  | `varchar(50)` | NULL     | Foreign key to User |
| `StartDate` | `datetime2`   | NULL     | Revenue start date  |
| `EndDate`   | `datetime2`   | NULL     | Revenue end date    |
| `Revenue`   | `float`       | NULL     | Total revenue       |
| `Type`      | `varchar(50)` | NULL     | Revenue type        |

### 7. Ticket

| Column Name  | Data Type       | Nullable | Description            |
|--------------|-----------------|----------|------------------------|
| `TicketId`   | `varchar(50)`   | NOT NULL | Primary key            |
| `SellerId`   | `varchar(50)`   | NULL     | Foreign key to User    |
| `Name`       | `nvarchar(255)` | NULL     | Ticket name            |
| `Cost`       | `float`         | NULL     | Ticket cost            |
| `Location`   | `nvarchar(255)` | NULL     | Event location         |
| `StartDate`  | `datetime2`     | NULL     | Event start date       |
| `CreateDate` | `datetime2`     | NULL     | Ticket creation date   |
| `ModifyDate` | `datetime2`     | NULL     | Last modification date |
| `Status`     | `int`           | NULL     | Ticket status          |
| `Image`      | `varchar(255)`  | NULL     | Ticket image URL       |

### 8. UserRole

| Column Name | Data Type     | Nullable | Description                       |
|-------------|---------------|----------|-----------------------------------|
| `UserId`    | `varchar(50)` | NOT NULL | Primary key (Foreign key to User) |
| `RoleId`    | `varchar(50)` | NOT NULL | Primary key (Foreign key to Role) |

### 9. OrderDetail

| Column Name     | Data Type     | Nullable | Description           |
|-----------------|---------------|----------|-----------------------|
| `OrderDetailId` | `varchar(50)` | NOT NULL | Primary key           |
| `OrderId`       | `varchar(50)` | NULL     | Foreign key to Order  |
| `TicketId`      | `varchar(50)` | NULL     | Foreign key to Ticket |
| `Price`         | `float`       | NULL     | Ticket price          |
| `Quantity`      | `int`         | NULL     | Quantity              |

### 10. TicketCategory

| Column Name  | Data Type     | Nullable | Description                           |
|--------------|---------------|----------|---------------------------------------|
| `TicketId`   | `varchar(50)` | NOT NULL | Primary key (Foreign key to Ticket)   |
| `CategoryId` | `varchar(50)` | NOT NULL | Primary key (Foreign key to Category) |

## Indexes

- `IX_Order_BuyerId` on `Order` (`BuyerId`)
- `IX_OrderDetail_OrderId` on `OrderDetail` (`OrderId`)
- `IX_OrderDetail_TicketId` on `OrderDetail` (`TicketId`)
- `IX_Revenue_SellerId` on `Revenue` (`SellerId`)
- `IX_Ticket_SellerId` on `Ticket` (`SellerId`)
- `IX_TicketCategory_CategoryId` on `TicketCategory` (`CategoryId`)
- `IX_User_SellConfigId` on `User` (`SellConfigId`)
- `IX_UserRole_RoleId` on `UserRole` (`RoleId`)
