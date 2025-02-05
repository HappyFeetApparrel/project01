export type User = {
    user_id: number;
    name: string;
    email: string;
    password: string;
    role: string; // e.g., Admin, Manager, Staff
    created_at: Date;
    updated_at: Date;

    // Relations
    orders: SalesOrder[];
    adjustments: InventoryAdjustment[];
    logs: UserActivityLog[];
};

export type Product = {
    product_id: number;
    name: string;
    description?: string;
    category_id?: number;
    quantity_in_stock: number;
    unit_price: number;
    cost_price: number;
    supplier_id?: number;
    date_of_entry: Date;
    size?: string; // e.g., S, M, L, XL
    color?: string;
    product_image?: string; // URL or path to image
    brand_id?: number;
    expiration_date?: Date;
    status: string; // e.g., Active, Discontinued, Out of Stock
    discount?: number; // Optional discount percentage

    // Relations
    category?: Category;
    brand?: Brand;
    supplier?: Supplier;
    order_items: OrderItem[];
    adjustments: InventoryAdjustment[];
};

export type Supplier = {
    supplier_id: number;
    name: string;
    contact_person?: string;
    phone_number?: string;
    email_address?: string;
    address?: string;
    supplied_products?: string; // Category or product type

    // Relations
    products: Product[];
};

export type SalesOrder = {
    order_id: number;
    order_code: string;
    user_id: number;
    payment_method_id?: number;
    amount_given: number;
    change: number;
    total_price: number;
    created_at: Date;

    // Relations
    user: User;
    payment_method?: PaymentMethod;
    order_items: OrderItem[];
};

export type OrderItem = {
    order_item_id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;

    // Relations
    order: SalesOrder;
    product: Product;
};

export type PaymentMethod = {
    payment_method_id: number;
    name: string;
    description?: string;

    // Relations
    sales_orders: SalesOrder[];
};

export type InventoryAdjustment = {
    adjustment_id: number;
    product_id: number;
    quantity_changed: number;
    reason: string;
    adjusted_by: number;
    created_at: Date;

    // Relations
    product: Product;
    adjusted_by_user: User;
};

export type Category = {
    category_id: number;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;

    // Relations
    products: Product[];
};

export type Brand = {
    brand_id: number;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;

    // Relations
    products: Product[];
};

export type UserActivityLog = {
    log_id: number;
    user_id: number;
    action: string;
    details?: string; // Optional JSON for extra info
    created_at: Date;

    // Relations
    user: User;
};

export type Setting = {
    setting_id: number;
    name: string;
    value: string; // Store JSON or simple values
};

export type UserActivityLogFormatted = Omit<UserActivityLog, "created_at" | "user"> & {
    name: string;
    avatar: string;
    timeAgo: string;
};