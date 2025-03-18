/*
  Warnings:

  - You are about to drop the column `order_item_id` on the `ProductReturn` table. All the data in the column will be lost.
  - You are about to drop the column `processed_by` on the `ProductReturn` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ProductReturn` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductReturn" DROP CONSTRAINT "ProductReturn_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductReturn" DROP CONSTRAINT "ProductReturn_processed_by_fkey";

-- DropForeignKey
ALTER TABLE "ProductReturn" DROP CONSTRAINT "ProductReturn_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductReturn" DROP CONSTRAINT "ProductReturn_user_id_fkey";

-- AlterTable
ALTER TABLE "InventoryAdjustment" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductReturn" DROP COLUMN "order_item_id",
DROP COLUMN "processed_by",
DROP COLUMN "user_id",
ADD COLUMN     "order_id" INTEGER,
ADD COLUMN     "processed_by_user_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "product_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SalesOrder" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserActivityLog" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductReturn" ADD CONSTRAINT "ProductReturn_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "SalesOrder"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturn" ADD CONSTRAINT "ProductReturn_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReturn" ADD CONSTRAINT "ProductReturn_processed_by_user_id_fkey" FOREIGN KEY ("processed_by_user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
