-- Create tenants table
CREATE TABLE tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add image_url to products table
ALTER TABLE products ADD COLUMN image_url TEXT;

-- Create frame_details table
CREATE TABLE frame_details (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id),
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lens_types table
CREATE TABLE lens_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name TEXT NOT NULL,
    description TEXT,
    price_modifier DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id),
    product_id UUID NOT NULL REFERENCES products(id),
    frame_detail_id UUID NOT NULL REFERENCES frame_details(id),
    lens_type_id UUID NOT NULL REFERENCES lens_types(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Create users table for authentication
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory_logs table for basic inventory tracking
CREATE TABLE inventory_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    frame_detail_id UUID NOT NULL REFERENCES frame_details(id),
    quantity_change INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_frame_details_product_id ON frame_details(product_id);
CREATE INDEX idx_lens_types_tenant_id ON lens_types(tenant_id);
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_frame_detail_id ON order_items(frame_detail_id);
CREATE INDEX idx_order_items_lens_type_id ON order_items(lens_type_id);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_inventory_logs_tenant_id ON inventory_logs(tenant_id);
CREATE INDEX idx_inventory_logs_frame_detail_id ON inventory_logs(frame_detail_id);


-- Insert tenants
INSERT INTO tenants (name, email) VALUES
('Clearsight Optometry', 'info@clearsight.com'),
('Vision Plus', 'contact@visionplus.com');

-- Insert products
INSERT INTO products (tenant_id, name, description, base_price, image_url) VALUES
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'Classic Aviator', 'Timeless aviator style', 129.99, 'https://placebear.com/300/200'),
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'Modern Rectangle', 'Sleek rectangular frames', 149.99, 'https://placebear.com/300/201'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'Round Retro', 'Vintage-inspired round frames', 139.99, 'https://placebear.com/301/200'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'Cat Eye Chic', 'Elegant cat eye design', 159.99, 'https://placebear.com/301/201');

-- Insert frame details
INSERT INTO frame_details (product_id, size, color, stock_quantity) VALUES
((SELECT id FROM products WHERE name = 'Classic Aviator'), 'Medium', 'Gold', 50),
((SELECT id FROM products WHERE name = 'Classic Aviator'), 'Large', 'Silver', 30),
((SELECT id FROM products WHERE name = 'Modern Rectangle'), 'Small', 'Black', 40),
((SELECT id FROM products WHERE name = 'Modern Rectangle'), 'Medium', 'Tortoise', 35),
((SELECT id FROM products WHERE name = 'Round Retro'), 'Medium', 'Bronze', 25),
((SELECT id FROM products WHERE name = 'Round Retro'), 'Large', 'Black', 20),
((SELECT id FROM products WHERE name = 'Cat Eye Chic'), 'Small', 'Red', 15),
((SELECT id FROM products WHERE name = 'Cat Eye Chic'), 'Medium', 'Blue', 20);

-- Insert lens types
INSERT INTO lens_types (tenant_id, name, description, price_modifier) VALUES
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'Single Vision', 'Standard single vision lenses', 0),
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'Bifocal', 'Bifocal lenses for near and far vision', 50),
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'Progressive', 'No-line multifocal lenses', 100),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'Single Vision', 'Basic single vision lenses', 0),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'Bifocal', 'Dual-focus lenses', 60),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'Progressive', 'Seamless multifocal lenses', 120);

-- Insert customers
INSERT INTO customers (tenant_id, first_name, last_name, email, phone) VALUES
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'John', 'Doe', 'john.doe@email.com', '555-1234'),
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'Jane', 'Smith', 'jane.smith@email.com', '555-5678'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'Bob', 'Johnson', 'bob.johnson@email.com', '555-9876'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'Alice', 'Brown', 'alice.brown@email.com', '555-4321');

-- Insert orders
INSERT INTO orders (tenant_id, customer_id, total_amount, status) VALUES
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), (SELECT id FROM customers WHERE email = 'john.doe@email.com'), 279.99, 'Completed'),
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), (SELECT id FROM customers WHERE email = 'jane.smith@email.com'), 199.99, 'Processing'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), (SELECT id FROM customers WHERE email = 'bob.johnson@email.com'), 259.99, 'Shipped'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), (SELECT id FROM customers WHERE email = 'alice.brown@email.com'), 319.99, 'Pending');

-- Insert order items
INSERT INTO order_items (order_id, product_id, frame_detail_id, lens_type_id, quantity, price) VALUES
((SELECT id FROM orders WHERE customer_id = (SELECT id FROM customers WHERE email = 'john.doe@email.com')), 
 (SELECT id FROM products WHERE name = 'Classic Aviator'), 
 (SELECT id FROM frame_details WHERE product_id = (SELECT id FROM products WHERE name = 'Classic Aviator') AND size = 'Medium' AND color = 'Gold'),
 (SELECT id FROM lens_types WHERE tenant_id = (SELECT id FROM tenants WHERE name = 'Clearsight Optometry') AND name = 'Progressive'),
 1, 279.99),
((SELECT id FROM orders WHERE customer_id = (SELECT id FROM customers WHERE email = 'jane.smith@email.com')),
 (SELECT id FROM products WHERE name = 'Modern Rectangle'),
 (SELECT id FROM frame_details WHERE product_id = (SELECT id FROM products WHERE name = 'Modern Rectangle') AND size = 'Small' AND color = 'Black'),
 (SELECT id FROM lens_types WHERE tenant_id = (SELECT id FROM tenants WHERE name = 'Clearsight Optometry') AND name = 'Single Vision'),
 1, 199.99),
((SELECT id FROM orders WHERE customer_id = (SELECT id FROM customers WHERE email = 'bob.johnson@email.com')),
 (SELECT id FROM products WHERE name = 'Round Retro'),
 (SELECT id FROM frame_details WHERE product_id = (SELECT id FROM products WHERE name = 'Round Retro') AND size = 'Large' AND color = 'Black'),
 (SELECT id FROM lens_types WHERE tenant_id = (SELECT id FROM tenants WHERE name = 'Vision Plus') AND name = 'Bifocal'),
 1, 259.99),
((SELECT id FROM orders WHERE customer_id = (SELECT id FROM customers WHERE email = 'alice.brown@email.com')),
 (SELECT id FROM products WHERE name = 'Cat Eye Chic'),
 (SELECT id FROM frame_details WHERE product_id = (SELECT id FROM products WHERE name = 'Cat Eye Chic') AND size = 'Medium' AND color = 'Blue'),
 (SELECT id FROM lens_types WHERE tenant_id = (SELECT id FROM tenants WHERE name = 'Vision Plus') AND name = 'Progressive'),
 1, 319.99);

-- Insert users
INSERT INTO users (tenant_id, email, password_hash, role) VALUES
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 'admin@clearsight.com', 'hashed_password_here', 'admin'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'), 'admin@visionplus.com', 'hashed_password_here', 'admin'),
(NULL, 'john.doe@email.com', 'hashed_password_here', 'customer'),
(NULL, 'jane.smith@email.com', 'hashed_password_here', 'customer'),
(NULL, 'bob.johnson@email.com', 'hashed_password_here', 'customer'),
(NULL, 'alice.brown@email.com', 'hashed_password_here', 'customer');

-- Insert inventory logs
INSERT INTO inventory_logs (tenant_id, frame_detail_id, quantity_change, reason) VALUES
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'), 
 (SELECT id FROM frame_details WHERE product_id = (SELECT id FROM products WHERE name = 'Classic Aviator') AND size = 'Medium' AND color = 'Gold'),
 -1, 'Sale'),
((SELECT id FROM tenants WHERE name = 'Vision Plus'),
 (SELECT id FROM frame_details WHERE product_id = (SELECT id FROM products WHERE name = 'Round Retro') AND size = 'Large' AND color = 'Black'),
 -1, 'Sale'),
((SELECT id FROM tenants WHERE name = 'Clearsight Optometry'),
 (SELECT id FROM frame_details WHERE product_id = (SELECT id FROM products WHERE name = 'Modern Rectangle') AND size = 'Medium' AND color = 'Tortoise'),
 10, 'Restock');