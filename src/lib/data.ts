import fs from 'fs';
import path from 'path';
import { createClient as createSupabaseServerClient } from './supabase/server';
import { createAdminClient } from './supabase/admin';
import { isSupabaseConfigured } from './supabase/client';

export { SHIPPING_RULES, getShippingInfo } from './shipping';
export type { ShippingInfo } from './shipping';

// ============================================================
// Types
// ============================================================

export interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

export interface ProductStock {
  [color: string]: {
    [size: string]: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  basePrice: number;
  discountPercent: number;
  colors: ProductColor[];
  sizes: string[];
  stock: ProductStock;
  featured: boolean;
  createdAt: string;
  rating: number;
  soldCount: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  customerLastName: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes: string;
  subtotal: number;
  shipping: number;
  total: number;
  deliveryEstimate: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  userId?: string | null;
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: {
    country: string;
    city: string;
    address: string;
  }[];
  createdAt: string;
  isAdmin?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Profile {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  isAdmin: boolean;
  createdAt: string;
}

// ============================================================
// JSON fallback (dev/demo mode — no Supabase keys configured)
// ============================================================

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

function readJSON<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ============================================================
// Write helpers — writes use the service-role client because RLS
// only allows public reads on products/categories. The API routes
// verify the caller is an admin before reaching these functions.
// ============================================================

async function getWriteClient() {
  // If the service-role key isn't configured, fall back to the anon
  // server client so dev/demo mode still works.
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createAdminClient();
  }
  return createSupabaseServerClient();
}

// If the Supabase tables don't exist yet (schema.sql hasn't been run), fall
// back to the JSON demo data so the store keeps working during setup.
// PostgREST reports missing tables as PGRST205 ("Could not find the table ...
// in the schema cache") in newer versions — match both the old 42P01 and the
// newer message so the demo mode survives a stale/missing schema.
function shouldUseJsonFallback(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const msg = (error.message ?? '').toLowerCase();
  return Boolean(
    error.code === '42P01' ||
      error.code === 'PGRST205' ||
      msg.includes('does not exist') ||
      msg.includes('schema cache')
  );
}

// ============================================================
// Products
// ============================================================

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  tags: string[];
  base_price: number;
  discount_percent: number;
  colors: ProductColor[];
  sizes: string[];
  stock: ProductStock;
  featured: boolean;
  created_at: string;
  rating: number;
  sold_count: number;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    category: row.category,
    tags: row.tags || [],
    basePrice: Number(row.base_price),
    discountPercent: row.discount_percent,
    colors: row.colors || [],
    sizes: row.sizes || [],
    stock: row.stock || {},
    featured: row.featured,
    createdAt: row.created_at,
    rating: Number(row.rating),
    soldCount: row.sold_count,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return readJSON<Product[]>('products.json');

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) return readJSON<Product[]>('products.json');
    return [];
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return readJSON<Product[]>('products.json').find(p => p.slug === slug);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return readJSON<Product[]>('products.json').find(p => p.slug === slug);
    }
    return undefined;
  }
  return data ? rowToProduct(data as ProductRow) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return readJSON<Product[]>('products.json').find(p => p.id === id);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return readJSON<Product[]>('products.json').find(p => p.id === id);
    }
    return undefined;
  }
  return data ? rowToProduct(data as ProductRow) : undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return readJSON<Product[]>('products.json').filter(p => p.category === category);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return readJSON<Product[]>('products.json').filter(p => p.category === category);
    }
    return [];
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return readJSON<Product[]>('products.json').filter(p => p.tags.includes(tag));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .contains('tags', [tag])
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return readJSON<Product[]>('products.json').filter(p => p.tags.includes(tag));
    }
    return [];
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return readJSON<Product[]>('products.json').filter(p => p.featured);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return readJSON<Product[]>('products.json').filter(p => p.featured);
    }
    return [];
  }
  return (data as ProductRow[]).map(rowToProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // Match name, description OR color *name* — never image URLs or hex codes
  // (a `colors::text.ilike` filter would falsely match "jpg", "unsplash",
  // "#000000" etc.). The catalog is small, so we fetch and filter in JS with
  // the exact same logic as the JSON fallback — and never embed user input
  // into a PostgREST filter string.
  const matches = (p: Product) =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.colors.some(c => c.name.toLowerCase().includes(q))

  const sortBySold = (rows: Product[]) =>
    rows.sort((a, b) => b.soldCount - a.soldCount)

  if (!isSupabaseConfigured()) {
    return sortBySold(readJSON<Product[]>('products.json').filter(matches));
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return sortBySold(readJSON<Product[]>('products.json').filter(matches));
    }
    return [];
  }
  return sortBySold((data as ProductRow[]).map(rowToProduct).filter(matches));
}

export async function saveProduct(product: Product): Promise<void> {
  if (!isSupabaseConfigured()) {
    const products = getProductsFromJSON();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) products[index] = product;
    else products.push(product);
    writeJSON('products.json', products);
    return;
  }

  const supabase = await getWriteClient();
  const row = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    tags: product.tags,
    base_price: product.basePrice,
    discount_percent: product.discountPercent,
    colors: product.colors,
    sizes: product.sizes,
    stock: product.stock,
    featured: product.featured,
    created_at: product.createdAt,
    rating: product.rating,
    sold_count: product.soldCount,
  };

  // Explicit onConflict avoids a PostgREST 409 when a row with the same PK
  // already exists — upsert semantics (insert or replace by primary key).
  const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
  if (error) throw new Error(error.message);
}

function getProductsFromJSON(): Product[] {
  return readJSON<Product[]>('products.json');
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const products = getProductsFromJSON().filter(p => p.id !== id);
    writeJSON('products.json', products);
    return;
  }

  const supabase = await getWriteClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================
// Orders
// ============================================================

interface OrderRow {
  id: string;
  user_id: string | null;
  items: CartItem[];
  customer_name: string;
  customer_last_name: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes: string | null;
  subtotal: number;
  shipping: number;
  total: number;
  delivery_estimate: string | null;
  payment_method: string;
  status: Order['status'];
  created_at: string;
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    userId: row.user_id,
    items: row.items || [],
    customerName: row.customer_name,
    customerLastName: row.customer_last_name,
    phone: row.phone,
    country: row.country,
    city: row.city,
    address: row.address,
    notes: row.notes || '',
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    deliveryEstimate: row.delivery_estimate || '',
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return readJSON<Order[]>('orders.json');

  // Admin-only read: use the service-role client so RLS (which keys off
  // profiles.is_admin) can't hide orders from the store owner.
  const supabase = await getWriteClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) return readJSON<Order[]>('orders.json');
    return [];
  }
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return readJSON<Order[]>('orders.json').filter(o => o.userId === userId);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return readJSON<Order[]>('orders.json').filter(o => o.userId === userId);
    }
    return [];
  }
  return (data as OrderRow[]).map(rowToOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  if (!isSupabaseConfigured()) {
    return readJSON<Order[]>('orders.json').find(o => o.id === id);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) {
      return readJSON<Order[]>('orders.json').find(o => o.id === id);
    }
    return undefined;
  }
  return data ? rowToOrder(data as OrderRow) : undefined;
}

export async function saveOrder(order: Order): Promise<void> {
  if (!isSupabaseConfigured()) {
    const orders = readJSON<Order[]>('orders.json');
    orders.push(order);
    writeJSON('orders.json', orders);
    return;
  }

  const supabase = await getWriteClient();
  const row = {
    id: order.id,
    user_id: order.userId || null,
    items: order.items,
    customer_name: order.customerName,
    customer_last_name: order.customerLastName,
    phone: order.phone,
    country: order.country,
    city: order.city,
    address: order.address,
    notes: order.notes,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    delivery_estimate: order.deliveryEstimate,
    payment_method: order.paymentMethod,
    status: order.status,
    created_at: order.createdAt,
  };

  const { error } = await supabase.from('orders').insert(row);
  if (error) throw new Error(error.message);
}

/**
 * Decrement product stock after an order is placed. Works for both the
 * Supabase (jsonb `stock` column) and the JSON fallback mode.
 */
export async function decrementStockForOrder(items: CartItem[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    const products = readJSON<Product[]>('products.json');
    for (const item of items) {
      const p = products.find(p => p.id === item.productId);
      if (!p) continue;
      const colorStock = p.stock[item.color];
      if (!colorStock) continue;
      const sizeKey = item.size || "";
      colorStock[sizeKey] = Math.max(0, (colorStock[sizeKey] ?? 0) - item.quantity);
    }
    writeJSON('products.json', products);
    return;
  }

  const supabase = await getWriteClient();
  for (const item of items) {
    const { data: row, error: readError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.productId)
      .maybeSingle();
    if (readError) throw new Error(readError.message);
    if (!row) continue;

    const stock: ProductStock = row.stock || {};
    const colorStock = stock[item.color] || {};
    const sizeKey = item.size || "";
    colorStock[sizeKey] = Math.max(0, (colorStock[sizeKey] ?? 0) - item.quantity);
    stock[item.color] = colorStock;

    const { error } = await supabase
      .from('products')
      .update({ stock })
      .eq('id', item.productId);
    if (error) throw new Error(error.message);
  }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  if (!isSupabaseConfigured()) {
    const orders = readJSON<Order[]>('orders.json');
    const index = orders.findIndex(o => o.id === id);
    if (index >= 0) {
      orders[index].status = status;
      writeJSON('orders.json', orders);
    }
    return;
  }

  const supabase = await getWriteClient();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

// ============================================================
// Users / Profiles (Supabase Auth backed)
// ============================================================

export async function getUsers(): Promise<User[]> {
  // Supabase Auth owns users; profiles are in the profiles table.
  if (!isSupabaseConfigured()) return readJSON<User[]>('users.json');

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) return readJSON<User[]>('users.json');
    return [];
  }

  // NOTE: Supabase returns snake_case columns (first_name, last_name,
  // is_admin, created_at) — map them to the camelCase User shape here.
  type ProfileRow = {
    id: string
    email: string | null
    first_name: string | null
    last_name: string | null
    phone: string | null
    is_admin: boolean
    created_at: string
  }

  return (data as ProfileRow[]).map(p => ({
    id: p.id,
    email: p.email || '',
    password: '',
    firstName: p.first_name || '',
    lastName: p.last_name || '',
    phone: p.phone || '',
    addresses: [],
    createdAt: p.created_at,
    isAdmin: p.is_admin,
  }));
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    isAdmin: data.is_admin,
    createdAt: data.created_at,
  };
}

export async function saveProfile(profile: {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await getWriteClient();
  const { error } = await supabase.from('profiles').upsert({
    id: profile.id,
    first_name: profile.firstName ?? null,
    last_name: profile.lastName ?? null,
    phone: profile.phone ?? null,
  });
  if (error) throw new Error(error.message);
}

// ============================================================
// Categories
// ============================================================

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  product_count: number;
}

function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    image: row.image || '',
    productCount: row.product_count,
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return readJSON<Category[]>('categories.json');

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    if (shouldUseJsonFallback(error)) return readJSON<Category[]>('categories.json');
    return [];
  }
  return (data as CategoryRow[]).map(rowToCategory);
}

export async function saveCategory(category: Category): Promise<void> {
  if (!isSupabaseConfigured()) {
    const categories = readJSON<Category[]>('categories.json');
    const index = categories.findIndex(c => c.id === category.id);
    if (index >= 0) categories[index] = category;
    else categories.push(category);
    writeJSON('categories.json', categories);
    return;
  }

  const supabase = await getWriteClient();
  const { error } = await supabase.from('categories').upsert({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    product_count: category.productCount,
  });
  if (error) throw new Error(error.message);
}

// ============================================================
// Favorites
// ============================================================

export async function getUserFavorites(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId);

  if (error) {
    console.warn('Supabase read failed (is the schema set up?):', error.message);
    return [];
  }
  return (data || []).map((f: { product_id: string }) => f.product_id);
}

export async function toggleFavorite(userId: string, productId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await getWriteClient();
  const { data: existing } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('favorites').insert({ user_id: userId, product_id: productId });
    if (error) throw new Error(error.message);
  }

  return getUserFavorites(userId);
}

// ============================================================
// Newsletter
// ============================================================

/**
 * Save a newsletter subscriber email. Uses the anon server client (the
 * `newsletter insert` RLS policy allows anyone to insert) or the JSON
 * fallback file in dev/demo mode.
 */
export async function subscribeNewsletter(email: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    let emails: string[] = [];
    try {
      emails = readJSON<string[]>('newsletter.json');
    } catch {
      // file doesn't exist yet
    }
    if (!emails.includes(email)) {
      emails.push(email);
      writeJSON('newsletter.json', emails);
    }
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email }, { onConflict: 'email' });

  if (error) {
    // Schema not set up yet (newsletter_subscribers table missing) — fall back
    // to the JSON demo file, same as the other data functions.
    if (shouldUseJsonFallback(error)) {
      let emails: string[] = [];
      try {
        emails = readJSON<string[]>('newsletter.json');
      } catch {
        // file doesn't exist yet
      }
      if (!emails.includes(email)) {
        emails.push(email);
        writeJSON('newsletter.json', emails);
      }
      return;
    }
    throw new Error(error.message);
  }
}

// ============================================================
// Shipping (constants live in ./shipping — client-safe)
// ============================================================
