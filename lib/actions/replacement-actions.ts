"use server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { Product } from "@/prisma/type";

// 🟢 CREATE — Product Replacement
export async function createProductReplacement({
  original_order_id,
  replacement_product_id,
  quantity,
  reason,
  processed_by_id,
}: {
  original_order_id: number;
  replacement_product_id: number;
  quantity: number;
  reason: string;
  processed_by_id: number;
}) {
  try {
    const product_replacement = await prisma.product.findUnique({
      where: { product_id: replacement_product_id },
      select: { quantity_in_stock: true },
    });

    if (!product_replacement) {
      return { success: false, error: "Product replacement not found" };
    }

    if (quantity > product_replacement.quantity_in_stock) {
      return {
        success: false,
        error: "Not enough stock to replace the product.",
      };
    }

    const created = await prisma.replace.create({
      data: {
        original_order_id,
        replacement_product_id,
        quantity,
        reason,
        processed_by_id,
      },
    });

    await prisma.product.update({
      where: { product_id: replacement_product_id },
      data: { quantity_in_stock: { decrement: quantity } },
    });

    return { success: true, data: created };
  } catch (error) {
    console.error("Create Product Replacement Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createOrderReplacement({
  processed_by_id,
  items,
  totalAmount,
  change,
  original_order_id,
  replacement_product_id,
  quantity,
  reason,
  paymentMethodId,
  amountGiven,
}: {
  processed_by_id: number;
  items: any[];
  totalAmount: number;
  change: number;
  original_order_id: number;
  replacement_product_id: number;
  quantity: number;
  reason: string;
  paymentMethodId: number;
  amountGiven: number;
}) {
  try {
    // Check stock availability for replacement product
    const replacementProduct = await prisma.product.findUnique({
      where: { product_id: replacement_product_id },
      select: { quantity_in_stock: true },
    });

    if (!replacementProduct) {
      return { success: false, error: "Replacement product not found." };
    }

    if (quantity > replacementProduct.quantity_in_stock) {
      return {
        success: false,
        error: "Not enough stock to fulfill replacement.",
      };
    }

    // Generate a unique order code
    const orderCode = `ORD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // Create a new sales order for the replacement
    const salesOrder = await prisma.salesOrder.create({
      data: {
        order_code: orderCode,
        user_id: processed_by_id,
        payment_method_id: paymentMethodId,
        amount_given: amountGiven,
        change: change,
        total_price: totalAmount,
      },
    });

    // Insert order items and adjust inventory for the replacement
    await Promise.all(
      items.map(async (item) => {
        const { product, quantity_in_stock } = item;

        // Create the order item in SalesOrder
        await prisma.orderItem.create({
          data: {
            order_id: salesOrder.order_id,
            product_id: product.product_id,
            quantity: quantity_in_stock,
            unit_price: product.unit_price,
            total_price: product.unit_price * quantity_in_stock,
          },
        });

        // Inventory adjustment for the original product being replaced
        await prisma.inventoryAdjustment.create({
          data: {
            product_id: product.product_id,
            quantity_changed: -quantity_in_stock,
            reason: "Replacement Order",
            adjusted_by: processed_by_id,
          },
        });

        // Update the product stock in the Product table
        await prisma.product.update({
          where: { product_id: product.product_id },
          data: {
            quantity_in_stock: {
              decrement: quantity_in_stock,
            },
          },
        });
      })
    );

    // Log the replacement in the Replace model
    const createdReplacement = await prisma.replace.create({
      data: {
        original_order_id,
        original_product_id: items[0].product.product_id, // Assuming the first item is the original product
        replacement_product_id,
        replacement_order_id: salesOrder.order_id,
        reason,
        processed_by_id,
        quantity,
      },
    });

    return {
      success: true,
      data: {
        order: salesOrder,
        orderCode: orderCode,
        replacement: createdReplacement,
      },
    };
  } catch (error) {
    console.error("Create Order Replacement Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// 🟡 READ — Get All Replacements
export async function getAllReplacements() {
  try {
    const replacements = await prisma.replace.findMany({
      orderBy: { replace_id: "desc" },
      select: {
        quantity: true,
        reason: true,
        original_product: {
          select: {
            name: true,
          },
        },
        replacement_product: {
          select: {
            name: true,
          },
        },
        original_order: {
          select: {
            order_code: true,
          },
        },
        replacement_order: {
          select: {
            order_code: true,
          },
        },
      },
    });

    // Flatten the result
    const formatted = replacements.map((r) => ({
      quantity: r.quantity,
      reason: r.reason,
      original_product_name: r.original_product?.name ?? null,
      replacement_product_name: r.replacement_product?.name ?? null,
      original_order: r.original_order?.order_code ?? null,
      replacement_order: r.replacement_order?.order_code ?? null, // r.replacement_order?.name ?? null,
    }));

    return { success: true, data: formatted };
  } catch (error) {
    console.error("Fetch Replacements Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// 🔴 DELETE — Replacement
// export async function deleteReplacement(replace_id: number) {
//   try {
//     const record = await prisma.replace.findUnique({
//       where: { replace_id },
//     });

//     if (!record) {
//       return { success: false, error: "Replacement not found" };
//     }

//     // Roll back stock adjustments
//     if (
//       record.replacement_product_id &&
//       record.original_product_id &&
//       record.quantity
//     ) {
//       await prisma.product.update({
//         where: { product_id: record.replacement_product_id },
//         data: { stock: { increment: record.quantity } },
//       });

//       await prisma.product.update({
//         where: { product_id: record.original_product_id },
//         data: { stock: { decrement: record.quantity } },
//       });
//     }

//     await prisma.replace.delete({
//       where: { replace_id },
//     });

//     return {
//       success: true,
//       message: "Replacement deleted and inventory rolled back",
//     };
//   } catch (error) {
//     console.error("Delete Replacement Error:", error);
//     return { success: false, error: (error as Error).message };
//   }
// }
