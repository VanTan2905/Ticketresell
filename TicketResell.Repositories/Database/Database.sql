IF
OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
CREATE TABLE [__EFMigrationsHistory]
(
    [
    MigrationId]
    nvarchar
(
    150
) NOT NULL,
    [ProductVersion] nvarchar
(
    32
) NOT NULL,
    CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY
(
[
    MigrationId]
)
    );
END;
GO

BEGIN
TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [Category]
(
    [
    CategoryId]
    varchar
(
    50
) NOT NULL,
    [Name] nvarchar
(
    255
) NULL,
    [Description] nvarchar
(
    max
) NULL,
    CONSTRAINT [PK__Category__19093A0BEBBEB954] PRIMARY KEY
(
[
    CategoryId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [Role]
(
    [
    RoleId]
    varchar
(
    50
) NOT NULL,
    [Rolename] varchar
(
    100
) NULL,
    [Description] varchar
(
    max
) NULL,
    CONSTRAINT [PK__Role__8AFACE1AE4BFB3F2] PRIMARY KEY
(
[
    RoleId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [SellConfig]
(
    [
    SellConfigId]
    varchar
(
    50
) NOT NULL,
    [Commision] float NULL,
    CONSTRAINT [PK__SellConf__42545BD905ACD877] PRIMARY KEY
(
[
    SellConfigId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [User]
(
    [
    UserId]
    varchar
(
    50
) NOT NULL,
    [SellConfigId] varchar
(
    50
) NULL,
    [Username] varchar
(
    100
) NULL,
    [Password] nvarchar
(
    255
) NULL,
    [Status] int NULL,
    [CreateDate] datetime2 NULL,
    [Gmail] varchar
(
    100
) NULL,
    [Fullname] nvarchar
(
    255
) NULL,
    [Sex] nvarchar
(
    10
) NULL,
    [Phone] varchar
(
    20
) NULL,
    [Address] nvarchar
(
    255
) NULL,
    [Avatar] varchar
(
    255
) NULL,
    [Birthday] datetime2 NULL,
    [Bio] nvarchar
(
    max
) NULL,
    [Verify] int NULL,
    [Bank] varchar
(
    100
) NULL,
    [BankType] varchar
(
    50
) NULL,
    [SellAddress] nvarchar
(
    255
) NULL,
    [Cccd] varchar
(
    50
) NULL,
    CONSTRAINT [PK__User__1788CC4CA0A0D49E] PRIMARY KEY
(
[
    UserId]
),
    CONSTRAINT [FK__User__SellConfig__398D8EEE] FOREIGN KEY
(
[
    SellConfigId]
) REFERENCES [SellConfig]
(
[
    SellConfigId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [Order]
(
    [
    OrderId]
    varchar
(
    50
) NOT NULL,
    [BuyerId] varchar
(
    50
) NULL,
    [Total] float NULL,
    [Date] datetime2 NULL,
    [Status] int NULL,
    CONSTRAINT [PK__Order__C3905BCF6786352F] PRIMARY KEY
(
[
    OrderId]
),
    CONSTRAINT [FK__Order__BuyerId__4222D4EF] FOREIGN KEY
(
[
    BuyerId]
) REFERENCES [User]
(
[
    UserId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [Revenue]
(
    [
    RevenueId]
    varchar
(
    50
) NOT NULL,
    [SellerId] varchar
(
    50
) NULL,
    [StartDate] datetime2 NULL,
    [EndDate] datetime2 NULL,
    [Revenue] float NULL,
    [Type] varchar
(
    50
) NULL,
    CONSTRAINT [PK__Revenue__275F16DD1765A79B] PRIMARY KEY
(
[
    RevenueId]
),
    CONSTRAINT [FK__Revenue__SellerI__44FF419A] FOREIGN KEY
(
[
    SellerId]
) REFERENCES [User]
(
[
    UserId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [Ticket]
(
    [
    TicketId]
    varchar
(
    50
) NOT NULL,
    [SellerId] varchar
(
    50
) NULL,
    [Name] nvarchar
(
    255
) NULL,
    [Cost] float NULL,
    [Location] nvarchar
(
    255
) NULL,
    [StartDate] datetime2 NULL,
    [CreateDate] datetime2 NULL,
    [ModifyDate] datetime2 NULL,
    [Status] int NULL,
    [Image] varchar
(
    255
) NULL,
    CONSTRAINT [PK__Ticket__712CC607A2C872D9] PRIMARY KEY
(
[
    TicketId]
),
    CONSTRAINT [FK__Ticket__SellerId__47DBAE45] FOREIGN KEY
(
[
    SellerId]
) REFERENCES [User]
(
[
    UserId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [UserRole]
(
    [
    UserId]
    varchar
(
    50
) NOT NULL,
    [RoleId] varchar
(
    50
) NOT NULL,
    CONSTRAINT [PK__UserRole__AF2760AD6F602E5A] PRIMARY KEY
(
    [
    UserId],
[
    RoleId]
),
    CONSTRAINT [FK__UserRole__RoleId__3F466844] FOREIGN KEY
(
[
    RoleId]
) REFERENCES [Role]
(
[
    RoleId]
),
    CONSTRAINT [FK__UserRole__UserId__3E52440B] FOREIGN KEY
(
[
    UserId]
) REFERENCES [User]
(
[
    UserId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [OrderDetail]
(
    [
    OrderDetailId]
    varchar
(
    50
) NOT NULL,
    [OrderId] varchar
(
    50
) NULL,
    [TicketId] varchar
(
    50
) NULL,
    [Price] float NULL,
    [Quantity] int NULL,
    CONSTRAINT [PK__OrderDet__D3B9D36C61677EDA] PRIMARY KEY
(
[
    OrderDetailId]
),
    CONSTRAINT [FK__OrderDeta__Order__4AB81AF0] FOREIGN KEY
(
[
    OrderId]
) REFERENCES [Order]
(
[
    OrderId]
),
    CONSTRAINT [FK__OrderDeta__Ticke__4BAC3F29] FOREIGN KEY
(
[
    TicketId]
) REFERENCES [Ticket]
(
[
    TicketId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE TABLE [TicketCategory]
(
    [
    TicketId]
    varchar
(
    50
) NOT NULL,
    [CategoryId] varchar
(
    50
) NOT NULL,
    CONSTRAINT [PK__TicketCa__D0BC55A783CF062B] PRIMARY KEY
(
    [
    TicketId],
[
    CategoryId]
),
    CONSTRAINT [FK__TicketCat__Categ__5165187F] FOREIGN KEY
(
[
    CategoryId]
) REFERENCES [Category]
(
[
    CategoryId]
),
    CONSTRAINT [FK__TicketCat__Ticke__5070F446] FOREIGN KEY
(
[
    TicketId]
) REFERENCES [Ticket]
(
[
    TicketId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_Order_BuyerId] ON [Order] ([BuyerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_OrderDetail_OrderId] ON [OrderDetail] ([OrderId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_OrderDetail_TicketId] ON [OrderDetail] ([TicketId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_Revenue_SellerId] ON [Revenue] ([SellerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_Ticket_SellerId] ON [Ticket] ([SellerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_TicketCategory_CategoryId] ON [TicketCategory] ([CategoryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_User_SellConfigId] ON [User] ([SellConfigId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
CREATE INDEX [IX_UserRole_RoleId] ON [UserRole] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20240918161624_Init'
)
BEGIN
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240918161624_Init', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN
TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241007145104_UpdateTicketTable'
)
BEGIN
ALTER TABLE [Ticket] ADD [Description] nvarchar(255) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241007145104_UpdateTicketTable'
)
BEGIN
ALTER TABLE [Ticket] ADD [Qr] image NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241007145104_UpdateTicketTable'
)
BEGIN
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241007145104_UpdateTicketTable', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN
TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241018153857_UpdateDescription'
)
BEGIN
    DECLARE
@var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c]
ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Ticket]') AND [c].[name] = N'Description');
IF
@var0 IS NOT NULL EXEC(N'ALTER TABLE [Ticket] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Ticket] ALTER COLUMN [Description] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241018153857_UpdateDescription'
)
BEGIN
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241018153857_UpdateDescription', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN
TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024031524_AddChatTable'
)
BEGIN
CREATE TABLE [Chat]
(
    [
    SenderId]
    varchar
(
    50
) NOT NULL,
    [ReceiverId] varchar
(
    50
) NOT NULL,
    [Message] nvarchar
(
    1000
) NOT NULL,
    CONSTRAINT [PK_Chat] PRIMARY KEY
(
    [
    SenderId],
[
    ReceiverId]
),
    CONSTRAINT [FK_Chat_Receiver] FOREIGN KEY
(
[
    ReceiverId]
) REFERENCES [User]
(
[
    UserId]
),
    CONSTRAINT [FK_Chat_Sender] FOREIGN KEY
(
[
    SenderId]
) REFERENCES [User]
(
[
    UserId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024031524_AddChatTable'
)
BEGIN
CREATE INDEX [IX_Chat_ReceiverId] ON [Chat] ([ReceiverId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024031524_AddChatTable'
)
BEGIN
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241024031524_AddChatTable', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN
TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024032800_updateChatTable'
)
BEGIN
ALTER TABLE [Chat] DROP CONSTRAINT [PK_Chat];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024032800_updateChatTable'
)
BEGIN
ALTER TABLE [Chat] ADD [ChatId] nvarchar(450) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024032800_updateChatTable'
)
BEGIN
ALTER TABLE [Chat] ADD CONSTRAINT [PK_Chat] PRIMARY KEY ([ChatId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024032800_updateChatTable'
)
BEGIN
CREATE INDEX [IX_Chat_SenderId] ON [Chat] ([SenderId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241024032800_updateChatTable'
)
BEGIN
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241024032800_updateChatTable', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN
TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025140611_ChatTableDate'
)
BEGIN
ALTER TABLE [Chat] ADD [Date] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025140611_ChatTableDate'
)
BEGIN
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241025140611_ChatTableDate', N'8.0.8');
END;
GO

COMMIT;
GO

BEGIN
TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025143758_UpdateDatabase'
)
BEGIN
    DECLARE
@var1 sysname;
SELECT @var1 = [d].[name]
FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c]
ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[User]') AND [c].[name] = N'Username');
IF
@var1 IS NOT NULL EXEC(N'ALTER TABLE [User] DROP CONSTRAINT [' + @var1 + '];');
ALTER TABLE [User] ALTER COLUMN [Username] nvarchar(100) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025143758_UpdateDatabase'
)
BEGIN
ALTER TABLE [Order] ADD [PaymentMethod] nvarchar(50) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025143758_UpdateDatabase'
)
BEGIN
    DECLARE
@var2 sysname;
SELECT @var2 = [d].[name]
FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c]
ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Chat]') AND [c].[name] = N'ChatId');
IF
@var2 IS NOT NULL EXEC(N'ALTER TABLE [Chat] DROP CONSTRAINT [' + @var2 + '];');
ALTER TABLE [Chat] ADD DEFAULT N'' FOR [ChatId];
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025143758_UpdateDatabase'
)
BEGIN
CREATE TABLE [Rating]
(
    [
    RatingId]
    varchar
(
    50
) NOT NULL,
    [UserId] varchar
(
    50
) NOT NULL,
    [SellerId] varchar
(
    50
) NULL,
    [Stars] int NULL,
    [Comment] nvarchar
(
    max
) NULL,
    [CreateDate] datetime NULL DEFAULT
(
    (
    getdate
(
))),
    CONSTRAINT [PK__Rating__FCCDF87C6FC41DB2] PRIMARY KEY
(
[
    RatingId]
),
    CONSTRAINT [FK_Rating_Seller] FOREIGN KEY
(
[
    SellerId]
) REFERENCES [User]
(
[
    UserId]
) ON DELETE SET NULL,
    CONSTRAINT [FK_Rating_User] FOREIGN KEY
(
[
    UserId]
) REFERENCES [User]
(
[
    UserId]
)
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025143758_UpdateDatabase'
)
BEGIN
CREATE INDEX [IX_Rating_SellerId] ON [Rating] ([SellerId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025143758_UpdateDatabase'
)
BEGIN
CREATE INDEX [IX_Rating_UserId] ON [Rating] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20241025143758_UpdateDatabase'
)
BEGIN
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241025143758_UpdateDatabase', N'8.0.8');
END;
GO

COMMIT;
GO

