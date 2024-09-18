-- Create tenants table
CREATE TABLE tenants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    name TEXT NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create variants table (previously frame_details)
CREATE TABLE variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id),
    color TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create gallery_images table
CREATE TABLE gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    variant_id UUID NOT NULL REFERENCES variants(id),
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_products_tenant_id ON products(tenant_id);
CREATE INDEX idx_variants_product_id ON variants(product_id);
CREATE INDEX idx_gallery_images_variant_id ON gallery_images(variant_id);

-- Create function to insert JSON data
CREATE OR REPLACE FUNCTION insert_products_json(data JSON, tenant_id UUID)
RETURNS SETOF UUID AS $$
DECLARE
    product JSON;
    product_id UUID;
    variant JSON;
    variant_id UUID;
    gallery_image TEXT;
BEGIN
    -- Loop through each product in the array
    FOR product IN SELECT * FROM json_array_elements(data)
    LOOP
        -- Insert into products table
        INSERT INTO products (tenant_id, name, base_price, url)
        VALUES (
            tenant_id, 
            product->>'title', 
            (REPLACE(product->>'price', '$', ''))::DECIMAL, 
            product->>'url'
        )
        RETURNING id INTO product_id;

        -- Insert variants
        FOR variant IN SELECT * FROM json_array_elements(product->'variants')
        LOOP
            -- Insert into variants table
            INSERT INTO variants (product_id, color, stock_quantity, image_url)
            VALUES (product_id, variant->>'color', 100, variant->>'image_url')
            RETURNING id INTO variant_id;

            -- Insert gallery images
            FOR gallery_image IN SELECT * FROM json_array_elements_text(variant->'gallery_images')
            LOOP
                INSERT INTO gallery_images (variant_id, image_url)
                VALUES (variant_id, gallery_image);
            END LOOP;
        END LOOP;

        -- Return the product_id
        RETURN NEXT product_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Insert a sample tenant
INSERT INTO tenants (name, email) VALUES ('keeneye', 'supa cool email that I totally already added');

-- Insert sample data using the function
SELECT * FROM insert_products_json(
    '[
  {
    "title": "Monohull",
    "price": "$150.00",
    "url": "https://www.oakley.com/en-us/product/W0OX5151?variant=888392497505",
    "variants": [
      {
        "color": "Pewter",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/1bca6c66-3d87-448b-80f6-ad3600bf40c0/86b086e9-b366-458c-877e-ad5a00966e29/0OX5151__515102__P21__shad__qt.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/1bca6c66-3d87-448b-80f6-ad3600bf40c0/e0e0f001-0b3a-4a97-a5e2-ad5a00967a3f/0OX5151__515102__P21__shad__fr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/1bca6c66-3d87-448b-80f6-ad3600bf40c0/e9ab9b24-4db4-4ff5-8618-ad5a00967bd4/0OX5151__515102__P21__shad__lt.png",
          "https://assets2.oakley.com/cdn-record-files-pi/1bca6c66-3d87-448b-80f6-ad3600bf40c0/6052393f-234e-410b-8089-ad5a00967720/0OX5151__515102__P21__shad__al1.png",
          "https://assets2.oakley.com/cdn-record-files-pi/1bca6c66-3d87-448b-80f6-ad3600bf40c0/b02e7941-df1e-4168-aada-ad5a00967564/0OX5151__515102__P21__shad__cfr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/1bca6c66-3d87-448b-80f6-ad3600bf40c0/3fb0d5e7-c459-467e-b77f-ad5a009671ba/0OX5151__515102__P21__shad__al3.png",
          "https://assets2.oakley.com/cdn-record-files-pi/1bca6c66-3d87-448b-80f6-ad3600bf40c0/048043b3-44c1-43c9-a9fe-ad5a00966fd8/0OX5151__515102__P21__shad__al4.png"
        ]
      }
    ]
  },
  {
    "title": "Conductor",
    "price": "$120.50",
    "url": "https://www.oakley.com/en-us/product/W0OX3186?variant=888392089830",
    "variants": [
      {
        "color": "Chrome",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/721c91ca-404b-4ca7-a852-a46c0150b699/8e38c076-5b4c-4ee3-8fa9-b13b01073030/0OX3186__318603__P21__shad__qt.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/721c91ca-404b-4ca7-a852-a46c0150b699/6dcfc5a6-9fd8-451a-a76c-b13b01073bbe/0OX3186__318603__P21__shad__fr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/721c91ca-404b-4ca7-a852-a46c0150b699/70263b76-a5e0-4875-8eb0-b13b01073d92/0OX3186__318603__P21__shad__lt.png",
          "https://assets2.oakley.com/cdn-record-files-pi/721c91ca-404b-4ca7-a852-a46c0150b699/27e94a54-9ff8-4485-8980-b13b010738c5/0OX3186__318603__P21__shad__al1.png",
          "https://assets2.oakley.com/cdn-record-files-pi/721c91ca-404b-4ca7-a852-a46c0150b699/35f50755-0426-40b7-80ad-b13b010736eb/0OX3186__318603__P21__shad__cfr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/721c91ca-404b-4ca7-a852-a46c0150b699/5767588f-8c0a-4120-b099-b13b010733bf/0OX3186__318603__P21__shad__al3.png",
          "https://assets2.oakley.com/cdn-record-files-pi/721c91ca-404b-4ca7-a852-a46c0150b699/520632d3-afff-40e9-8820-b13b010731f9/0OX3186__318603__P21__shad__al4.png"
        ]
      },
      {
        "color": "Satin Black",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/03a48af8-9c6c-4583-b43f-a42600bb6b49/b478e513-fb1c-4f2f-a74f-a45a00b02cf6/0OX3186__318601_030A.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/03a48af8-9c6c-4583-b43f-a42600bb6b49/d17655e5-54c4-42af-8815-a45a00b02922/0OX3186__318601_000A.png",
          "https://assets2.oakley.com/cdn-record-files-pi/03a48af8-9c6c-4583-b43f-a42600bb6b49/f5381727-2e20-46e7-9b09-a45a00b04173/0OX3186__318601_180A.png",
          "https://assets2.oakley.com/cdn-record-files-pi/03a48af8-9c6c-4583-b43f-a42600bb6b49/d696bace-dc62-43be-b383-a45a00b03512/0OX3186__318601_090A.png"
        ]
      },
      {
        "color": "Satin Blackwhite",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/3c382afd-7713-48b5-b705-a42600bbe175/fe1c2b9c-ae44-4387-8556-b13b0107b3c1/0OX3186__318605__P21__shad__qt.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/3c382afd-7713-48b5-b705-a42600bbe175/415ea63c-d554-46de-a2c1-b13b0107bf24/0OX3186__318605__P21__shad__fr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/3c382afd-7713-48b5-b705-a42600bbe175/6c99e656-5536-4eb0-bb10-b13b0107c0e1/0OX3186__318605__P21__shad__lt.png",
          "https://assets2.oakley.com/cdn-record-files-pi/3c382afd-7713-48b5-b705-a42600bbe175/5cb16e83-0ef2-44aa-bb43-b13b0107bc13/0OX3186__318605__P21__shad__al1.png",
          "https://assets2.oakley.com/cdn-record-files-pi/3c382afd-7713-48b5-b705-a42600bbe175/a15578b4-318c-41a8-84de-b13b0107ba55/0OX3186__318605__P21__shad__cfr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/3c382afd-7713-48b5-b705-a42600bbe175/4ba1c520-ed0f-49e5-9aef-b13b0107b71a/0OX3186__318605__P21__shad__al3.png",
          "https://assets2.oakley.com/cdn-record-files-pi/3c382afd-7713-48b5-b705-a42600bbe175/e966c455-bfa5-41c4-9ed7-b13b0107b559/0OX3186__318605__P21__shad__al4.png"
        ]
      }
    ]
  },
  {
    "title": "Tumbleweed",
    "price": "$241.00",
    "url": "https://www.oakley.com/en-us/product/W0OX3112?variant=700285511030",
    "variants": [
      {
        "color": "Matte Cement",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/38a01aee-eba3-4028-b92c-a35700b85500/f3c5774c-2bee-441b-9f89-b13b0100d801/0OX3112__311204__P21__shad__qt.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/38a01aee-eba3-4028-b92c-a35700b85500/1b6bf279-90f6-4c12-85e9-b13b0100e286/0OX3112__311204__P21__shad__fr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/38a01aee-eba3-4028-b92c-a35700b85500/33b329f2-fae8-4171-af7c-b13b0100e3fc/0OX3112__311204__P21__shad__lt.png",
          "https://assets2.oakley.com/cdn-record-files-pi/38a01aee-eba3-4028-b92c-a35700b85500/48e7c9a4-6176-4d59-b472-b13b0100dfd4/0OX3112__311204__P21__shad__al1.png",
          "https://assets2.oakley.com/cdn-record-files-pi/38a01aee-eba3-4028-b92c-a35700b85500/3b0465e5-f8f3-46aa-ab5f-b13b0100de27/0OX3112__311204__P21__shad__cfr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/38a01aee-eba3-4028-b92c-a35700b85500/4b3ca2b6-c90a-478d-9caf-b13b0100dadf/0OX3112__311204__P21__shad__al3.png",
          "https://assets2.oakley.com/cdn-record-files-pi/38a01aee-eba3-4028-b92c-a35700b85500/83664649-b034-48e2-8602-b13b0100d96c/0OX3112__311204__P21__shad__al4.png"
        ]
      }
    ]
  },
  {
    "title": "Plungeline",
    "price": "$176.00",
    "url": "https://www.oakley.com/en-us/product/W0OX8146?variant=888392563170",
    "variants": [
      {
        "color": "Polished Black Fade",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/f72fb131-899b-4962-9ee3-ad1b00361623/e47d2649-71f3-4746-9c9e-ad5a007c07df/0OX8146__814608__P21__shad__qt.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/f72fb131-899b-4962-9ee3-ad1b00361623/8de1db85-8740-46b0-99c2-ad5a007c163c/0OX8146__814608__P21__shad__fr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/f72fb131-899b-4962-9ee3-ad1b00361623/408c574c-c6a3-4d25-a5e1-ad5a007c1816/0OX8146__814608__P21__shad__lt.png",
          "https://assets2.oakley.com/cdn-record-files-pi/f72fb131-899b-4962-9ee3-ad1b00361623/12bd9458-ec63-4cd7-bbb7-ad5a007c12d7/0OX8146__814608__P21__shad__al1.png",
          "https://assets2.oakley.com/cdn-record-files-pi/f72fb131-899b-4962-9ee3-ad1b00361623/37372db1-3a83-4d95-899b-ad5a007c1034/0OX8146__814608__P21__shad__cfr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/f72fb131-899b-4962-9ee3-ad1b00361623/81274ff1-01a2-4ddf-b402-ad5a007c0c0b/0OX8146__814608__P21__shad__al3.png",
          "https://assets2.oakley.com/cdn-record-files-pi/f72fb131-899b-4962-9ee3-ad1b00361623/7a4d4e22-c251-4a99-9c05-ad5a007c09f2/0OX8146__814608__P21__shad__al4.png"
        ]
      },
      {
        "color": "Matte Dark Jade Opaline",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/df3da78f-16a9-4b27-8e3e-b01b00a01d75/7670ed12-4701-4fa6-949d-b01b00a87c5d/0OX8146__814610__P21__shad__qt.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/df3da78f-16a9-4b27-8e3e-b01b00a01d75/70d9198d-47da-44bc-bcd1-b01b00a88079/0OX8146__814610__P21__shad__fr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/df3da78f-16a9-4b27-8e3e-b01b00a01d75/ac8d226a-4296-40de-93a4-b01b00a886a4/0OX8146__814610__P21__shad__lt.png",
          "https://assets2.oakley.com/cdn-record-files-pi/df3da78f-16a9-4b27-8e3e-b01b00a01d75/0b26bab2-68f7-49b6-8b28-b01b00a88c8a/0OX8146__814610__P21__shad__al1.png",
          "https://assets2.oakley.com/cdn-record-files-pi/df3da78f-16a9-4b27-8e3e-b01b00a01d75/3aaa181a-f5ff-4442-81f2-b01b00a88a72/0OX8146__814610__P21__shad__cfr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/df3da78f-16a9-4b27-8e3e-b01b00a01d75/b365cd1d-19bd-4cfa-87b6-b01b00a8843c/0OX8146__814610__P21__shad__al3.png",
          "https://assets2.oakley.com/cdn-record-files-pi/df3da78f-16a9-4b27-8e3e-b01b00a01d75/77e46204-e82b-4293-aff7-b01b00a88255/0OX8146__814610__P21__shad__al4.png"
        ]
      },
      {
        "color": "Matte Blue Steel",
        "image_url": "https://assets2.oakley.com/cdn-record-files-pi/ca31ead6-91d4-44fa-8dfe-b01b00a021ca/b21c6f34-037e-4c5f-9ec6-b01b00a8bc02/0OX8146__814611__P21__shad__qt.png",
        "gallery_images": [
          "https://assets2.oakley.com/cdn-record-files-pi/ca31ead6-91d4-44fa-8dfe-b01b00a021ca/0bb3c7b1-e918-47dd-8205-b01b00a8bf6c/0OX8146__814611__P21__shad__fr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/ca31ead6-91d4-44fa-8dfe-b01b00a021ca/6a0d24a3-90e6-4d0e-bdbd-b01b00a8c5a3/0OX8146__814611__P21__shad__lt.png",
          "https://assets2.oakley.com/cdn-record-files-pi/ca31ead6-91d4-44fa-8dfe-b01b00a021ca/ae892eb7-883c-47d0-85ee-b01b00a8cb93/0OX8146__814611__P21__shad__al1.png",
          "https://assets2.oakley.com/cdn-record-files-pi/ca31ead6-91d4-44fa-8dfe-b01b00a021ca/83fcd08e-b8b4-4eb8-836f-b01b00a8c990/0OX8146__814611__P21__shad__cfr.png",
          "https://assets2.oakley.com/cdn-record-files-pi/ca31ead6-91d4-44fa-8dfe-b01b00a021ca/1f2b4936-cc5b-4f33-93d4-b01b00a8c320/0OX8146__814611__P21__shad__al3.png",
          "https://assets2.oakley.com/cdn-record-files-pi/ca31ead6-91d4-44fa-8dfe-b01b00a021ca/b5c93897-2da3-4f2b-9d5c-b01b00a8c118/0OX8146__814611__P21__shad__al4.png"
        ]
      }
    ]
  },
  . . .
]'::json,
    (SELECT id FROM tenants WHERE name = 'keeneye')
);