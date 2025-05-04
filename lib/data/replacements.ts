import {
  mockReplacements,
  mockReturns,
  mockProducts,
  mockOrders,
  mockOrderItems,
  mockPaymentMethods,
} from "./mock-data";

export async function getReplacements() {
  try {
    // Return static mock data instead of fetching from database
    return mockReplacements;
  } catch (error) {
    console.error("Error fetching replacements:", error);
    throw new Error("Failed to fetch replacements");
  }
}

export async function getReplacementById(id: number) {
  try {
    // Find the replacement with the matching ID from mock data
    const replacement = mockReplacements.find(
      (replacement) => replacement.replace_id === id
    );

    if (!replacement) {
      return null;
    }

    return replacement;
  } catch (error) {
    console.error("Error fetching replacement:", error);
    throw new Error("Failed to fetch replacement");
  }
}

export async function getReturnById(id: number) {
  try {
    // Find the return with the matching ID from mock data
    const returnData = mockReturns.find(
      (returnItem) => returnItem.return_id === id
    );

    if (!returnData) {
      return null;
    }

    return returnData;
  } catch (error) {
    console.error("Error fetching return:", error);
    throw new Error("Failed to fetch return");
  }
}

export async function getProductById(id: number) {
  try {
    // Find the product with the matching ID from mock data
    const product = mockProducts.find((product) => product.product_id === id);

    if (!product) {
      return null;
    }

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function getOrderById(id: number) {
  try {
    // Find the order with the matching ID from mock data
    const order = mockOrders.find((order) => order.order_id === id);

    if (!order) {
      return null;
    }

    // Get order items for this order
    const orderItems = mockOrderItems.filter((item) => item.order_id === id);

    // Add order items to the order
    return {
      ...order,
      order_items: orderItems.map((item) => ({
        ...item,
        product: mockProducts.find(
          (product) => product.product_id === item.product_id
        ),
      })),
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
}

export async function getPaymentMethods() {
  try {
    return mockPaymentMethods;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw new Error("Failed to fetch payment methods");
  }
}
