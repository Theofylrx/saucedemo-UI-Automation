-- Seed test data for e-commerce database

-- Insert test users
INSERT INTO users (username, email, first_name, last_name) VALUES
    ('standard_user', 'standard@saucedemo.com', 'Standard', 'User'),
    ('locked_out_user', 'locked@saucedemo.com', 'Locked', 'User'),
    ('problem_user', 'problem@saucedemo.com', 'Problem', 'User'),
    ('performance_glitch_user', 'performance@saucedemo.com', 'Performance', 'User')
ON CONFLICT (username) DO NOTHING;

-- Insert test products (matching saucedemo.com products)
INSERT INTO products (id, name, description, price, inventory_count, category) VALUES
    ('sauce-labs-backpack', 'Sauce Labs Backpack', 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.', 29.99, 10, 'bags'),
    ('sauce-labs-bike-light', 'Sauce Labs Bike Light', 'A red light isn''t the desired state in testing but it sure helps when riding your bike at night.', 9.99, 15, 'accessories'),
    ('sauce-labs-bolt-t-shirt', 'Sauce Labs Bolt T-Shirt', 'Get your testing superhero on with the Sauce Labs bolt T-shirt. From the minions of the Test.allTheThings().', 15.99, 20, 'clothing'),
    ('sauce-labs-fleece-jacket', 'Sauce Labs Fleece Jacket', 'It''s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.', 49.99, 8, 'clothing'),
    ('sauce-labs-onesie', 'Sauce Labs Onesie', 'Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won''t unravel.', 7.99, 25, 'clothing'),
    ('test.allthethings()-t-shirt-(red)', 'Test.allTheThings() T-Shirt (Red)', 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests.', 15.99, 12, 'clothing')
ON CONFLICT (id) DO NOTHING;

-- Insert sample orders
INSERT INTO orders (user_id, order_number, total_amount, status)
SELECT
    u.id,
    'ORD-' || LPAD(u.id::text, 5, '0') || '-001',
    29.99,
    'confirmed'
FROM users u
WHERE u.username = 'standard_user'
ON CONFLICT (order_number) DO NOTHING;

-- Insert order items for the sample order
INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
SELECT
    o.id,
    'sauce-labs-backpack',
    'Sauce Labs Backpack',
    1,
    29.99,
    29.99
FROM orders o
WHERE o.order_number = 'ORD-00001-001';
