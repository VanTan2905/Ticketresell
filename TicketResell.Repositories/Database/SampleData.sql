-- Inserting sample data into Role table
INSERT INTO [Role] ([RoleId],
    [Rolename],
[Description])
VALUES
    ('RO1', 'Buyer', 'User with permissions to list and sell products'), 
    ('RO2', 'Seller', 'User with permissions to browse and purchase products'), 
    ('RO3', 'Staff', 'Staff member responsible for managing operations'), 
    ('RO4', 'Admin', 'Administrator with full system access and permissions');

INSERT INTO [User] (
    [UserId],
    [Username],
    [Password],
    [Status],
    [CreateDate],
    [Gmail],
    [Fullname],
    [Sex],
    [Phone],
    [Address],
    [Avatar],
    [Birthday],
    [Bio],
    [Verify],
    [Bank],
    [BankType],
    [SellAddress],
[Cccd]
)
VALUES
    ('cuongdola@personal.example.com', 'cuong', '$2a$11$lpQIMMrn83p0gJD.ffa/ueyBT4W4yZ7aSThowNWZCFlBF9eUfRyze', 1, '2024-10-31 03:32:16.7381148', 'cuongdola@personal.example.com', 'cuong', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('giap@personal.example.com', 'giap', '$2a$11$lpQIMMrn83p0gJD.ffa/ueyBT4W4yZ7aSThowNWZCFlBF9eUfRyze', 1, '2024-10-31 03:32:16.7381148', 'giap@personal.example.com', 'giap', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('khangseller@personal.example.com', 'khang seller', '$2a$11$lpQIMMrn83p0gJD.ffa/ueyBT4W4yZ7aSThowNWZCFlBF9eUfRyze', 1, '2024-10-31 03:32:16.7381148', 'khangseller@personal.example.com', 'khang seller', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('khongphaiquang@personal.example.com', 'quang', '$2a$11$lpQIMMrn83p0gJD.ffa/ueyBT4W4yZ7aSThowNWZCFlBF9eUfRyze', 1, '2024-10-31 03:32:16.7381148', 'khongphaiquang@personal.example.com', 'quang', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('vinhseller@personal.example.com', 'vinh seller', '$2a$11$lpQIMMrn83p0gJD.ffa/ueyBT4W4yZ7aSThowNWZCFlBF9eUfRyze', 1, '2024-10-31 03:32:16.7381148', 'vinhseller@personal.example.com', 'vinh seller', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
--testpassword123456

INSERT INTO [UserRole] ([UserId], [RoleId])
VALUES
    ('giap@personal.example.com', 'RO1'),
    ('khangseller@personal.example.com', 'RO1'),
    ('vinhseller@personal.example.com', 'RO1'),
    ('khangseller@personal.example.com', 'RO2'),
    ('vinhseller@personal.example.com', 'RO2'),
    ('khongphaiquang@personal.example.com', 'RO3'),
    ('cuongdola@personal.example.com', 'RO4');

-- Rating table insertions
INSERT INTO [TicketResellManagement].[dbo].[Rating]
([RatingId], [UserId], [SellerId], [Stars], [Comment], [CreateDate])
VALUES
    (1, 'giap@personal.example.com', 'khangseller@personal.example.com', 5, 'Great seller, very reliable!', '2024-10-31'),
    (2, 'giap@personal.example.com', 'vinhseller@personal.example.com', 4, 'Good experience, minor issues but resolved quickly.', '2024-10-31'),
    (3, 'khongphaiquang@personal.example.com', 'cuongdola@personal.example.com', 3, 'Average experience, could improve response time.', '2024-10-31'),
    (4, 'vinhseller@personal.example.com', 'khangseller@personal.example.com', 5, 'Exceptional service, highly recommend!', '2024-10-31'),
    (5, 'khangseller@personal.example.com', 'giap@personal.example.com', 2, 'Not satisfied, slow response.', '2024-10-31');


-- Chèn 10 bản ghi mẫu vào bảng Category
INSERT INTO [Category] ([CategoryId],
    [Name],
[Description])
VALUES
    ('CAT001', N'Âm nhạc', N'Tất cả các thể loại sự kiện âm nhạc và hòa nhạc.'), ('CAT002', N'Thể thao', N'Các sự kiện thể thao khác nhau bao gồm bóng đá, bóng rổ và nhiều hơn nữa.'), ('CAT003', N'Nhà hát', N'Các buổi biểu diễn và vở kịch trực tiếp.'), ('CAT004', N'Lễ hội', N'Các lễ hội văn hóa và âm nhạc.'), ('CAT005', N'Hội nghị', N'Các hội nghị về kinh doanh và công nghệ.'), ('CAT006', N'Hội thảo', N'Các hội thảo giáo dục và seminar.'), ('CAT007', N'Triển lãm', N'Các triển lãm nghệ thuật và khoa học.'), ('CAT008', N'Hài kịch', N'Các buổi biểu diễn hài kịch và sự kiện hài.'), ('CAT009', N'Nhảy múa', N'Các buổi biểu diễn nhảy múa và ballet.'), ('CAT010', N'Ma thuật', N'Các buổi biểu diễn ma thuật và ảo thuật.');

-- Extended Revenue table insertions for sellers
INSERT INTO [TicketResellManagement].[dbo].[Revenue]
([RevenueId], [SellerId], [StartDate], [EndDate], [Revenue], [Type])
VALUES
    -- Daily revenues
    (1, 'khangseller@personal.example.com', '2024-10-25', '2024-10-26', 180.00, 'Day'),
    (2, 'khangseller@personal.example.com', '2024-10-27', '2024-10-28', 250.50, 'Day'),
    (3, 'vinhseller@personal.example.com', '2024-10-26', '2024-10-27', 220.30, 'Day'),
    (4, 'vinhseller@personal.example.com', '2024-10-28', '2024-10-29', 195.00, 'Day'),
    (5, 'vinhseller@personal.example.com', '2024-10-29', '2024-10-30', 210.40, 'Day'),

    -- Monthly revenues
    (6, 'khangseller@personal.example.com', '2024-08-01', '2024-09-01', 2800.75, 'Month'),
    (7, 'khangseller@personal.example.com', '2024-09-01', '2024-10-01', 3400.25, 'Month'),
    (8, 'vinhseller@personal.example.com', '2024-07-01', '2024-08-01', 3100.00, 'Month'),
    (9, 'vinhseller@personal.example.com', '2024-08-01', '2024-09-01', 2900.50, 'Month'),
    (10, 'vinhseller@personal.example.com', '2024-09-01', '2024-10-01', 3200.45, 'Month'),

    -- Yearly revenues
    (11, 'khangseller@personal.example.com', '2023-01-01', '2024-01-01', 47000.00, 'Year'),
    (12, 'khangseller@personal.example.com', '2022-01-01', '2023-01-01', 44000.50, 'Year'),
    (13, 'vinhseller@personal.example.com', '2023-01-01', '2024-01-01', 50000.25, 'Year'),
    (14, 'vinhseller@personal.example.com', '2022-01-01', '2023-01-01', 48000.75, 'Year');


INSERT INTO [Ticket] ([TicketId], [SellerId], [Name], [Cost], [Location], [StartDate], [CreateDate], [ModifyDate], [Status], [Image], [Description], [Qr])
VALUES
    ('TICKET001', 'vinhseller@personal.example.com', N'Đêm Nhạc Trịnh Công Sơn', 500000, N'Số 76 Đường Nguyễn Chí Thanh, Quận Đống Đa, Hà Nội', '2024-11-15 19:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET001', N'Đêm nhạc tưởng nhớ nhạc sĩ Trịnh Công Sơn với các ca sĩ hàng đầu Việt Nam', NULL),

    ('TICKET002', 'khangseller@personal.example.com', N'Lễ Hội Ẩm Thực Hà Nội', 200000, N'Số 28 Hồ Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội', '2024-11-20 10:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET002', N'Trải nghiệm văn hóa ẩm thực Hà Nội với hơn 100 gian hàng đặc sản', NULL),

    ('TICKET003', 'vinhseller@personal.example.com', N'Giải Bóng Đá Cộng Đồng', 150000, N'Phường Thanh Trì, Quận Hoàng Mai, Hà Nội', '2024-11-25 08:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET003', N'Giải đấu bóng đá amateur với sự tham gia của 16 đội bóng', NULL),

    ('TICKET004', 'khangseller@personal.example.com', N'Triển Lãm Nghệ Thuật Đương Đại', 300000, N'Tầng 8, Số 37 Đường Tôn Đức Thắng, Quận 1, TP. Hồ Chí Minh', '2024-12-01 09:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET004', N'Triển lãm các tác phẩm nghệ thuật đương đại của các nghệ sĩ trẻ Việt Nam', NULL),

    ('TICKET005', 'vinhseller@personal.example.com', N'Hòa Nhạc Dàn Nhạc Giao Hưởng', 800000, N'Số 27B Đường Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh', '2024-12-05 20:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET005', N'Đêm nhạc cổ điển với dàn nhạc giao hưởng thành phố', NULL),

    ('TICKET006', 'khangseller@personal.example.com', N'Giải Võ Thuật Truyền Thống', 250000, N'Số 17 Đường Phan Chu Trinh, TP. Thanh Hóa', '2024-12-10 09:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET006', N'Giải đấu võ thuật với các môn phái truyền thống Việt Nam', NULL),

    ('TICKET007', 'vinhseller@personal.example.com', N'Lễ Hội Ánh Sáng', 400000, N'Số 218 Đường 30/4, TP. Cần Thơ', '2024-12-15 18:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET007', N'Lễ hội ánh sáng với các tiết mục biểu diễn nghệ thuật đương đại', NULL),

    ('TICKET008', 'khangseller@personal.example.com', N'Live Show Nhạc Trẻ', 600000, N'Số 53 Đường Nguyễn Sỹ Sách, Phường Hưng Bình, Nghệ An', '2024-12-20 19:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET008', N'Đêm nhạc với sự góp mặt của các ca sĩ trẻ nổi tiếng', NULL),

    ('TICKET009', 'vinhseller@personal.example.com', N'Hội Thảo Khởi Nghiệp', 350000, N'Số 40 Phố Hàng Mành, Quận Hoàn Kiếm, Hà Nội', '2024-12-25 08:30:00', '2024-10-31', '2024-10-31', 1, 'TICKET009', N'Hội thảo chia sẻ kinh nghiệm khởi nghiệp từ các doanh nhân thành công', NULL),

    ('TICKET010', 'khangseller@personal.example.com', N'Triển Lãm Ảnh Di Sản', 200000, N'Đường Cửa Đại, Phường Cẩm Châu, Quảng Nam', '2024-12-30 09:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET010', N'Triển lãm ảnh về di sản văn hóa Việt Nam', NULL),

    ('TICKET011', 'vinhseller@personal.example.com', N'Đêm Diễn Kịch', 450000, N'Lô B8, Khu Công Nghiệp Hiệp Phước, Huyện Nhà Bè, TP. Hồ Chí Minh', '2025-01-05 19:30:00', '2024-10-31', '2024-10-31', 1, 'TICKET011', N'Vở kịch hiện đại với dàn diễn viên trẻ tài năng', NULL),

    ('TICKET012', 'khangseller@personal.example.com', N'Giải Marathon Thành Phố', 300000, N'Số 158 Đường Lê Thánh Tông, TP. Hạ Long, Quảng Ninh', '2025-01-10 05:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET012', N'Giải chạy marathon với nhiều cự ly phù hợp mọi đối tượng', NULL),

    ('TICKET013', 'vinhseller@personal.example.com', N'Festival Âm Nhạc Dân Tộc', 250000, N'Số 202 Khách sạn Lake View, D10 Giảng Võ, Hà Nội', '2025-01-15 18:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET013', N'Đêm nhạc với các nhạc cụ dân tộc truyền thống', NULL),

    ('TICKET014', 'khangseller@personal.example.com', N'Hội Chợ Công Nghệ', 150000, N'Số 29-31 Đường Nguyễn Văn Trỗi, Phường 12, Quận Phú Nhuận, TP. Hồ Chí Minh', '2025-01-20 09:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET014', N'Triển lãm công nghệ với các sản phẩm mới nhất', NULL),

    ('TICKET015', 'vinhseller@personal.example.com', N'Đêm Nhạc Jazz', 700000, N'Số 112 Đường Trần Não, Phường Bình An, Quận 2, TP. Hồ Chí Minh', '2025-01-25 20:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET015', N'Đêm nhạc jazz với các nghệ sĩ quốc tế', NULL),

    ('TICKET016', 'khangseller@personal.example.com', N'Lễ Hội Văn Hóa Trà', 180000, N'Số 44 Phố Nguyễn Du, Hà Nội', '2025-02-01 10:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET016', N'Trải nghiệm văn hóa trà đạo các vùng miền', NULL),

    ('TICKET017', 'vinhseller@personal.example.com', N'Hội Thảo Digital Marketing', 400000, N'Số 34/81 Khu phố 12, Phường Hố Nai, TP. Biên Hòa, Đồng Nai', '2025-02-05 08:30:00', '2024-10-31', '2024-10-31', 1, 'TICKET017', N'Hội thảo về xu hướng digital marketing mới nhất', NULL),

    ('TICKET018', 'khangseller@personal.example.com', N'Biểu Diễn Xiếc', 200000, N'Số 149X/A11 Đường Tô Hiến Thành, Quận 10, TP. Hồ Chí Minh', '2025-02-10 15:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET018', N'Show xiếc đặc sắc với các nghệ sĩ xiếc hàng đầu', NULL),

    ('TICKET019', 'vinhseller@personal.example.com', N'Festival Ẩm Thực Đường Phố', 250000, N'Số 76 Đường Nguyễn Chí Thanh, Quận Đống Đa, Hà Nội', '2025-02-15 11:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET019', N'Hội ẩm thực đường phố với nhiều món ăn độc đáo', NULL),

    ('TICKET020', 'khangseller@personal.example.com', N'Cuộc Thi Tìm Kiếm Tài Năng', 500000, N'Số 43 Đường Hòa Bình, Phường Phú Hòa, TP. Thủ Dầu Một', '2025-02-20 14:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET020', N'Cuộc thi tìm kiếm tài năng nghệ thuật dành cho giới trẻ', NULL),

    ('TICKET021', 'vinhseller@personal.example.com', N'Hội Thảo Hướng Nghiệp', 150000, N'Số 45 Đường Nguyễn Thị Minh Khai, TP. Đà Lạt', '2025-02-25 09:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET021', N'Hội thảo chia sẻ kinh nghiệm từ các chuyên gia', NULL),

    ('TICKET022', 'khangseller@personal.example.com', N'Triển Lãm Thiết Kế Thời Trang', 300000, N'Số 9 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh', '2025-03-01 18:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET022', N'Triển lãm các tác phẩm thời trang từ các nhà thiết kế trẻ', NULL),

    ('TICKET023', 'vinhseller@personal.example.com', N'Đêm Nhạc Phim', 500000, N'Số 123 Đường Trần Phú, TP. Nha Trang', '2025-03-05 20:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET023', N'Đêm nhạc phim với sự tham gia của dàn nhạc giao hưởng', NULL),

    ('TICKET024', 'khangseller@personal.example.com', N'Hội Thảo Công Nghệ Thông Tin', 250000, N'Số 47 Đường Lê Duẩn, Quận 3, TP. Hồ Chí Minh', '2025-03-10 08:30:00', '2024-10-31', '2024-10-31', 1, 'TICKET024', N'Hội thảo về công nghệ thông tin và các xu hướng mới', NULL),

    ('TICKET025', 'vinhseller@personal.example.com', N'Cuộc Thi Nấu Ăn', 200000, N'Số 22 Đường Huỳnh Thúc Kháng, TP. Pleiku', '2025-03-15 11:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET025', N'Cuộc thi nấu ăn với sự tham gia của các đầu bếp nổi tiếng', NULL),

    ('TICKET026', 'khangseller@personal.example.com', N'Giải Đua Xe Địa Hình', 400000, N'67 Lê Văn Sỹ, Quận 3, Thành phố Hồ Chí Minh', '2025-03-20 10:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET026', N'Giải đua xe địa hình với các tay đua chuyên nghiệp', NULL),

    ('TICKET027', 'vinhseller@personal.example.com', N'Lễ Hội Tóc Mây', 180000, N'34 Nguyễn Văn Trỗi, Quận Tân Bình, Thành phố Hồ Chí Minh', '2025-03-25 14:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET027', N'Lễ hội văn hóa tóc mây của người dân tộc thiểu số', NULL),

    ('TICKET028', 'khangseller@personal.example.com', N'Hội Thảo Khởi Nghiệp Bắt Đầu', 250000, N'30 Trần Đình Xu, Quận 5, Thành phố Hồ Chí Minh', '2025-03-30 09:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET028', N'Hội thảo dành cho những ai muốn khởi nghiệp', NULL),

    ('TICKET029', 'vinhseller@personal.example.com', N'Triển Lãm Sách', 300000, N'16 Hàng Bạc, Quận Hoàn Kiếm, Hà Nội', '2025-04-05 10:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET029', N'Triển lãm các đầu sách hay và mới', NULL),

    ('TICKET030', 'khangseller@personal.example.com', N'Cuộc Thi Thể Dục Thể Hình', 400000, N'82 Nguyễn Đình Chiểu, Thành phố Đà Lạt', '2025-04-10 09:00:00', '2024-10-31', '2024-10-31', 1, 'TICKET030', N'Cuộc thi thể dục thể hình với sự tham gia của các vận động viên chuyên nghiệp', NULL);


-- Sample data for Order table
-- Extended Order table insertions for users
-- Corrected Order table insertions with accurate totals based on OrderDetail
INSERT INTO [TicketResellManagement].[dbo].[Order]
    ([OrderId], [BuyerId], [Total], [Date], [Status], [PaymentMethod])
VALUES
    -- Giap's Orders
    -- OrderId 1: (500001 × 2) + (500002 × 3) = 2500007
    (1, 'giap@personal.example.com', 2500007.00, '2024-10-30', 0, 'Paypal'),
    -- OrderId 2: (500003 × 1) + (500004 × 2) = 1500011
    (2, 'giap@personal.example.com', 1500011.00, '2024-09-15', 1, 'VNPay'),
    -- OrderId 3: (500005 × 1) + (500006 × 2) = 1500017
    (3, 'giap@personal.example.com', 1500017.00, '2024-08-20', 2, 'Momo'),
    -- OrderId 4: (500007 × 3) + (500008 × 1) = 2000029
    (4, 'giap@personal.example.com', 2000029.00, '2024-07-10', 3, 'Paypal'),
    -- OrderId 5: (500009 × 4) + (500010 × 2) = 3000056
    (5, 'giap@personal.example.com', 3000056.00, '2024-06-05', -1, 'VNPay'),

    -- Khang Seller's Orders
    -- OrderId 6: (500011 × 1) + (500012 × 2) = 1500035
    (6, 'khangseller@personal.example.com', 1500035.00, '2024-10-30', 0, 'VNPay'),
    -- OrderId 7: (500013 × 1) + (500014 × 2) = 1500041
    (7, 'khangseller@personal.example.com', 1500041.00, '2024-09-10', 1, 'Momo'),
    -- OrderId 8: (500015 × 1) + (500016 × 3) = 2000063
    (8, 'khangseller@personal.example.com', 2000063.00, '2024-08-25', 2, 'Paypal'),
    -- OrderId 9: (500017 × 1) + (500018 × 2) = 1500053
    (9, 'khangseller@personal.example.com', 1500053.00, '2024-07-20', 3, 'VNPay'),
    -- OrderId 10: (500019 × 3) + (500020 × 1) = 2000077
    (10, 'khangseller@personal.example.com', 2000077.00, '2024-06-15', -1, 'Momo'),

    -- Vinh Seller's Orders
    -- OrderId 11: (500021 × 2) + (500022 × 3) = 2500107
    (11, 'vinhseller@personal.example.com', 2500107.00, '2024-10-30', 0, 'Momo'),
    -- OrderId 12: (500023 × 1) + (500024 × 2) = 1500071
    (12, 'vinhseller@personal.example.com', 1500071.00, '2024-09-05', 1, 'Paypal'),
    -- OrderId 13: (500025 × 2) + (500026 × 1) = 1500076
    (13, 'vinhseller@personal.example.com', 1500076.00, '2024-08-12', 2, 'VNPay'),
    -- OrderId 14: (500027 × 4) + (500028 × 5) = 4500248
    (14, 'vinhseller@personal.example.com', 4500248.00, '2024-07-08', 3, 'Momo'),
    -- OrderId 15: (500029 × 3) + (500030 × 10) = 6500387
    (15, 'vinhseller@personal.example.com', 6500387.00, '2024-06-01', -1, 'Paypal');


INSERT INTO [TicketResellManagement].[dbo].[OrderDetail]
([OrderDetailId], [OrderId], [TicketId], [Price], [Quantity])
VALUES
    -- Order Details for Giap's Orders
    (1, 1, 'TICKET001', 500001.00, 2),   -- OrderId 1
    (2, 1, 'TICKET002', 500002.00, 3),
    (3, 2, 'TICKET003', 500003.00, 1),  -- OrderId 2
    (4, 2, 'TICKET004', 500004.00, 2),
    (5, 3, 'TICKET005', 500005.00, 1),  -- OrderId 3
    (6, 3, 'TICKET006', 500006.00, 2),
    (7, 4, 'TICKET007', 500007.00, 3),   -- OrderId 4
    (8, 4, 'TICKET008', 500008.00, 1),
    (9, 5, 'TICKET009', 500009.00, 4),   -- OrderId 5
    (10, 5, 'TICKET010', 500010.00, 2),

    -- Order Details for Khang Seller's Orders
    (11, 6, 'TICKET011', 500011.00, 1),  -- OrderId 6
    (12, 6, 'TICKET012', 500012.00, 2),
    (13, 7, 'TICKET013', 500013.00, 1), -- OrderId 7
    (14, 7, 'TICKET014', 500014.00, 2),
    (15, 8, 'TICKET015', 500015.00, 1), -- OrderId 8
    (16, 8, 'TICKET016', 500016.00, 3),
    (17, 9, 'TICKET017', 500017.00, 1), -- OrderId 9
    (18, 9, 'TICKET018', 500018.00, 2),
    (19, 10, 'TICKET019', 500019.00, 3), -- OrderId 10
    (20, 10, 'TICKET020', 500020.00, 1),

    -- Order Details for Vinh Seller's Orders
    (21, 11, 'TICKET021', 500021.00, 2), -- OrderId 11
    (22, 11, 'TICKET022', 500022.00, 3),
    (23, 12, 'TICKET023', 500023.00, 1), -- OrderId 12
    (24, 12, 'TICKET024', 500024.00, 2),
    (25, 13, 'TICKET025', 500025.00, 2), -- OrderId 13
    (26, 13, 'TICKET026', 500026.00, 1),
    (27, 14, 'TICKET027', 500027.00, 4),  -- OrderId 14
    (28, 14, 'TICKET028', 500028.00, 5),
    (29, 15, 'TICKET029', 500029.00, 3),  -- OrderId 15
    (30, 15, 'TICKET030', 500030.00, 10);


-- Sample data for TicketCategory table ensuring all tickets have categories
INSERT INTO [TicketResellManagement].[dbo].[TicketCategory] ([TicketId], [CategoryId]) VALUES
    ('TICKET001', 'CAT001'),
    ('TICKET001', 'CAT002'),
    ('TICKET002', 'CAT001'),
    ('TICKET002', 'CAT003'),
    ('TICKET002', 'CAT004'),
    ('TICKET003', 'CAT002'),
    ('TICKET003', 'CAT005'),
    ('TICKET004', 'CAT003'),
    ('TICKET004', 'CAT006'),
    ('TICKET004', 'CAT007'),
    ('TICKET005', 'CAT001'),
    ('TICKET005', 'CAT002'),
    ('TICKET005', 'CAT008'),
    ('TICKET006', 'CAT002'),
    ('TICKET006', 'CAT009'),
    ('TICKET007', 'CAT004'),
    ('TICKET007', 'CAT010'),
    ('TICKET008', 'CAT001'),
    ('TICKET009', 'CAT003'),
    ('TICKET009', 'CAT005'),
    ('TICKET010', 'CAT006'),
    ('TICKET010', 'CAT007'),
    ('TICKET011', 'CAT008'),
    ('TICKET012', 'CAT002'),
    ('TICKET012', 'CAT003'),
    ('TICKET012', 'CAT005'),
    ('TICKET013', 'CAT001'),
    ('TICKET014', 'CAT009'),
    ('TICKET014', 'CAT010'),
    ('TICKET015', 'CAT001'),
    ('TICKET015', 'CAT002'),
    ('TICKET016', 'CAT003'),
    ('TICKET017', 'CAT004'),
    ('TICKET017', 'CAT005'),
    ('TICKET018', 'CAT006'),
    ('TICKET019', 'CAT007'),
    ('TICKET020', 'CAT001'),
    ('TICKET021', 'CAT002'),
    ('TICKET022', 'CAT008'),
    ('TICKET022', 'CAT010'),
    ('TICKET023', 'CAT003'),
    ('TICKET024', 'CAT005'),
    ('TICKET025', 'CAT006'),
    ('TICKET026', 'CAT001'),
    ('TICKET027', 'CAT002'),
    ('TICKET028', 'CAT003'),
    ('TICKET029', 'CAT004'),
    ('TICKET030', 'CAT009'),
    ('TICKET030', 'CAT010');