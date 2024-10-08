create table
  public.gallery_images (
    id uuid not null default gen_random_uuid (),
    variant_id uuid not null,
    image_url text not null,
    created_at timestamp with time zone null default current_timestamp,
    constraint gallery_images_pkey primary key (id),
    constraint gallery_images_variant_id_fkey foreign key (variant_id) references variants (id)
  ) tablespace pg_default;

create index if not exists idx_gallery_images_variant_id on public.gallery_images using btree (variant_id) tablespace pg_default;

create table
  public.products (
    id uuid not null default gen_random_uuid (),
    tenant_id uuid not null,
    name text not null,
    base_price numeric(10, 2) not null,
    url text null,
    created_at timestamp with time zone null default current_timestamp,
    constraint products_pkey primary key (id),
    constraint products_tenant_id_fkey foreign key (tenant_id) references tenants (id)
  ) tablespace pg_default;

create index if not exists idx_products_tenant_id on public.products using btree (tenant_id) tablespace pg_default;

create table
  public.tenants (
    id uuid not null default gen_random_uuid (),
    name text not null,
    email text not null,
    created_at timestamp with time zone null default current_timestamp,
    preferences jsonb null,
    constraint tenants_pkey primary key (id),
    constraint tenants_email_key unique (email)
  ) tablespace pg_default;

  create table
  public.variants (
    id uuid not null default gen_random_uuid (),
    product_id uuid not null,
    color text not null,
    stock_quantity integer not null,
    image_url text null,
    created_at timestamp with time zone null default current_timestamp,
    constraint variants_pkey primary key (id),
    constraint variants_product_id_fkey foreign key (product_id) references products (id)
  ) tablespace pg_default;

create index if not exists idx_variants_product_id on public.variants using btree (product_id) tablespace pg_default;