import { z } from "zod";

// Schema for product replacement form
export const productReplacementSchema = z
  .object({
    originalOrderId: z.coerce
      .number({
        required_error: "Original product is required",
        invalid_type_error: "Original product must be a number",
      })
      .positive("Original product ID must be a positive number"),
    replacementProductId: z.coerce
      .number({
        required_error: "Replacement product is required",
        invalid_type_error: "Replacement product must be a number",
      })
      .positive("Replacement product ID must be a positive number"),
    quantity: z.coerce
      .number({
        required_error: "Replacement product is required",
        invalid_type_error: "Replacement product must be a number",
      })
      .positive("Replacement product ID must be a positive number"),

    reason: z.string().min(1, "Reason is required"),

    otherReason: z.string().optional(),
  })
  .refine(
    (data) => {
      // If reason is "Other", otherReason is required
      return (
        data.reason !== "Other" ||
        (data.otherReason && data.otherReason.trim().length > 0)
      );
    },
    {
      message: "Other reason is required when 'Other' is selected",
      path: ["otherReason"],
    }
  );

// Schema for order replacement form
export const orderReplacementSchema = z
  .object({
    originalOrderId: z.coerce
      .number({
        required_error: "Original order is required",
        invalid_type_error: "Original order must be a number",
      })
      .positive("Original order ID must be a positive number"),

    replacementProductId: z.coerce
      .number({
        required_error: "Replacement product is required",
        invalid_type_error: "Replacement product must be a number",
      })
      .positive("Replacement product ID must be a positive number"),

    quantity: z.coerce
      .number({
        required_error: "Quantity is required",
        invalid_type_error: "Quantity must be a number",
      })
      .positive("Quantity ID must be a positive number"),

    paymentMethodId: z.coerce
      .number({
        required_error: "Payment Method is required",
        invalid_type_error: "Payment Method must be a number",
      })
      .positive("Payment Method ID must be a positive number"),

    amountGiven: z.coerce
      .number({
        required_error: "Amount Given is required",
        invalid_type_error: "Amount Given must be a number",
      })
      .positive("Amount Given ID must be a positive number"),
    reason: z.string().min(1, "Reason is required"),

    otherReason: z.string().optional(),
  })
  .refine(
    (data) => {
      // If reason is "Other", otherReason is required
      return (
        data.reason !== "Other" ||
        (data.otherReason && data.otherReason.trim().length > 0)
      );
    },
    {
      message: "Other reason is required when 'Other' is selected",
      path: ["otherReason"],
    }
  );

// Schema for payment processing form
export const paymentProcessSchema = z.object({
  replacementId: z.number({
    required_error: "Replacement ID is required",
  }),

  paymentMethodId: z.coerce
    .number({
      required_error: "Payment method is required",
      invalid_type_error: "Payment method must be a number",
    })
    .positive("Payment method ID must be a positive number"),

  amountGiven: z.coerce
    .number({
      required_error: "Amount given is required",
      invalid_type_error: "Amount given must be a number",
    })
    .positive("Amount given must be a positive number"),
});

// Schema for refund processing form
export const refundProcessSchema = z.object({
  replacementId: z.number({
    required_error: "Replacement ID is required",
  }),
});
