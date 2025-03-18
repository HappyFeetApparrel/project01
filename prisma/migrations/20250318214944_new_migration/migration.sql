-- AlterTable
ALTER TABLE "Brand" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "InventoryAdjustment" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SalesOrder" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserActivityLog" ALTER COLUMN "updated_at" DROP NOT NULL;
