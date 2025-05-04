/*
  Warnings:

  - You are about to drop the column `return_id` on the `Replace` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Replace" (
    "replace_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "original_order_id" INTEGER NOT NULL,
    "original_product_id" INTEGER NOT NULL,
    "replacement_product_id" INTEGER NOT NULL,
    "replacement_order_id" INTEGER,
    "reason" TEXT NOT NULL,
    "processed_by_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "Replace_original_order_id_fkey" FOREIGN KEY ("original_order_id") REFERENCES "SalesOrder" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Replace_replacement_order_id_fkey" FOREIGN KEY ("replacement_order_id") REFERENCES "SalesOrder" ("order_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Replace_original_product_id_fkey" FOREIGN KEY ("original_product_id") REFERENCES "Product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Replace_replacement_product_id_fkey" FOREIGN KEY ("replacement_product_id") REFERENCES "Product" ("product_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Replace_processed_by_id_fkey" FOREIGN KEY ("processed_by_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Replace" ("created_at", "original_order_id", "original_product_id", "processed_by_id", "quantity", "reason", "replace_id", "replacement_order_id", "replacement_product_id", "updated_at") SELECT "created_at", "original_order_id", "original_product_id", "processed_by_id", "quantity", "reason", "replace_id", "replacement_order_id", "replacement_product_id", "updated_at" FROM "Replace";
DROP TABLE "Replace";
ALTER TABLE "new_Replace" RENAME TO "Replace";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
