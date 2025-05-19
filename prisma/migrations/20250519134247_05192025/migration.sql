-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "password_reset_token" TEXT,
    "password_reset_expires" DATETIME
);

-- CreateTable
CREATE TABLE "Product" (
    "product_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category_id" INTEGER,
    "quantity_in_stock" INTEGER NOT NULL,
    "unit_price" REAL NOT NULL,
    "cost_price" REAL NOT NULL,
    "supplier_id" INTEGER,
    "date_of_entry" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "size" TEXT,
    "color" TEXT,
    "product_image" TEXT,
    "brand_id" INTEGER,
    "expiration_date" DATETIME,
    "status" TEXT NOT NULL,
    "discount" REAL,
    "quantity_damaged" INTEGER NOT NULL DEFAULT 0,
    "quantity_returned" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "Product_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand" ("brand_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("category_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Supplier" (
    "supplier_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contact_person" TEXT,
    "phone_number" TEXT,
    "email_address" TEXT,
    "address" TEXT,
    "supplied_products" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "SalesOrder" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_code" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER,
    "amount_given" REAL NOT NULL,
    "change" REAL NOT NULL,
    "total_price" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "SalesOrder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesOrder_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "PaymentMethod" ("payment_method_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "order_item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" REAL NOT NULL,
    "total_price" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "SalesOrder" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "payment_method_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "InventoryAdjustment" (
    "adjustment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "quantity_changed" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "adjusted_by" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "InventoryAdjustment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "InventoryAdjustment_adjusted_by_fkey" FOREIGN KEY ("adjusted_by") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Return" (
    "return_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER,
    "product_id" INTEGER,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "processed_by_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "Return_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "SalesOrder" ("order_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Return_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("product_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Return_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "User" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Replace" (
    "replace_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_order_id" INTEGER,
    "original_product_id" INTEGER,
    "replacement_product_id" INTEGER,
    "replacement_order_id" INTEGER,
    "reason" TEXT NOT NULL,
    "processed_by_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "Replace_original_order_id_fkey" FOREIGN KEY ("original_order_id") REFERENCES "SalesOrder" ("order_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Replace_replacement_order_id_fkey" FOREIGN KEY ("replacement_order_id") REFERENCES "SalesOrder" ("order_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Replace_original_product_id_fkey" FOREIGN KEY ("original_product_id") REFERENCES "Product" ("product_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Replace_replacement_product_id_fkey" FOREIGN KEY ("replacement_product_id") REFERENCES "Product" ("product_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Replace_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "category_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "Brand" (
    "brand_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME
);

-- CreateTable
CREATE TABLE "UserActivityLog" (
    "log_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "UserActivityLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "setting_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_reset_token_key" ON "User"("password_reset_token");

-- CreateIndex
CREATE UNIQUE INDEX "SalesOrder_order_code_key" ON "SalesOrder"("order_code");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_name_key" ON "Setting"("name");
