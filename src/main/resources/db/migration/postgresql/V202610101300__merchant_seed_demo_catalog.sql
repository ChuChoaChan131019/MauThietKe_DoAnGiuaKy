INSERT INTO shops (owner_id, shop_name, description, phone, address, status, submitted_at, approved_at, created_at, updated_at)
SELECT u.id, 'NOLA Store', 'Demo shop for the public catalog.', '0900000001', 'Demo address 1',
       'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
WHERE LOWER(u.email) = 'demo-owner-nola@senvia.local'
  AND NOT EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.id);

INSERT INTO shops (owner_id, shop_name, description, phone, address, status, submitted_at, approved_at, created_at, updated_at)
SELECT u.id, 'MORI Store', 'Demo shop for the public catalog.', '0900000002', 'Demo address 2',
       'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
WHERE LOWER(u.email) = 'demo-owner-mori@senvia.local'
  AND NOT EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.id);

INSERT INTO shops (owner_id, shop_name, description, phone, address, status, submitted_at, approved_at, created_at, updated_at)
SELECT u.id, 'KANSO Store', 'Demo shop for the public catalog.', '0900000003', 'Demo address 3',
       'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
WHERE LOWER(u.email) = 'demo-owner-kanso@senvia.local'
  AND NOT EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.id);

INSERT INTO shops (owner_id, shop_name, description, phone, address, status, submitted_at, approved_at, created_at, updated_at)
SELECT u.id, 'MAISON 28 Store', 'Demo shop for the public catalog.', '0900000004', 'Demo address 4',
       'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
WHERE LOWER(u.email) = 'demo-owner-maison@senvia.local'
  AND NOT EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.id);

INSERT INTO shops (owner_id, shop_name, description, phone, address, status, submitted_at, approved_at, created_at, updated_at)
SELECT u.id, 'FORM Store', 'Demo shop for the public catalog.', '0900000005', 'Demo address 5',
       'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
WHERE LOWER(u.email) = 'demo-owner-form@senvia.local'
  AND NOT EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.id);

INSERT INTO shops (owner_id, shop_name, description, phone, address, status, submitted_at, approved_at, created_at, updated_at)
SELECT u.id, 'ASTER Store', 'Demo shop for the public catalog.', '0900000006', 'Demo address 6',
       'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
WHERE LOWER(u.email) = 'demo-owner-aster@senvia.local'
  AND NOT EXISTS (SELECT 1 FROM shops s WHERE s.owner_id = u.id);

INSERT INTO categories (name, description, active, created_at, updated_at)
SELECT 'Thời trang', 'Danh mục thời trang demo.', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Thời trang');

INSERT INTO categories (name, description, active, created_at, updated_at)
SELECT 'Nhà cửa', 'Danh mục nhà cửa demo.', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Nhà cửa');

INSERT INTO categories (name, description, active, created_at, updated_at)
SELECT 'Làm đẹp', 'Danh mục làm đẹp demo.', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Làm đẹp');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Canvas Tote Bag', 'Túi tote canvas cao cấp với thiết kế tối giản.',
       1190000.00, 45, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'NOLA Store' AND c.name = 'Thời trang'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Canvas Tote Bag');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Linen Shirt', 'Áo sơ mi chất liệu linen thoáng mát.',
       890000.00, 0, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'MORI Store' AND c.name = 'Thời trang'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Linen Shirt');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Brass Table Lamp', 'Đèn bàn đồng nguyên khối mang phong cách cổ điển.',
       1290000.00, 5, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'KANSO Store' AND c.name = 'Nhà cửa'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Brass Table Lamp');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Signature Parfum', 'Nước hoa unisex hương gỗ tự nhiên.',
       2490000.00, 12, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'MAISON 28 Store' AND c.name = 'Làm đẹp'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Signature Parfum');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Ceramic Vase', 'Bình hoa gốm sứ thủ công.',
       690000.00, 20, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'FORM Store' AND c.name = 'Nhà cửa'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Ceramic Vase');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Wall Frame', 'Khung tranh treo tường gỗ sồi.',
       790000.00, 15, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'ASTER Store' AND c.name = 'Nhà cửa'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Wall Frame');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Leather Wallet', 'Ví da thật cao cấp.',
       950000.00, 30, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'NOLA Store' AND c.name = 'Thời trang'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Leather Wallet');

INSERT INTO products (shop_id, category_id, name, description, price, stock_quantity, status, created_at, updated_at)
SELECT s.id, c.id, 'Desk Organizer', 'Kệ để bàn tiện dụng.',
       550000.00, 50, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM shops s CROSS JOIN categories c
WHERE s.shop_name = 'MORI Store' AND c.name = 'Nhà cửa'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.shop_id = s.id AND p.name = 'Desk Organizer');

