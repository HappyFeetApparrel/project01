import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  for (let i = 0; i < 100; i++) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "jmnicolas4me@gmail.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Test123!", 10);
      await prisma.user.create({
        data: {
          name: "Admin",
          email: "jmnicolas4me@gmail.com",
          password: hashedPassword,
          role: "Admin",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: faker.helpers.arrayElement(["Admin", "Manager", "Staff"]),
      },
    });
  }

  // Seed Categories
  for (let i = 0; i < 100; i++) {
    await prisma.category.create({
      data: {
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
      },
    });
  }

  // // Seed Suppliers
  for (let i = 0; i < 100; i++) {
    await prisma.supplier.create({
      data: {
        name: faker.company.name(),
        contact_person: faker.person.fullName(),
        phone_number: faker.phone.number(),
        email_address: faker.internet.email(),
        address: faker.location.streetAddress(),
        supplied_products: faker.commerce.productName(),
      },
    });
  }

  // // Seed Brand
  for (let i = 0; i < 100; i++) {
    await prisma.brand.create({
      data: {
        name: faker.company.name(),
      },
    });
  }

  const year = new Date().getFullYear();

  // Helper to get a random date in a specific month
  function randomDateInMonth(month: number, year: number) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0); // end of the month
    return faker.date.between({ from: start, to: end });
  }

  // Seed Products
  for (let month = 0; month < 12; month++) {
    for (let i = 0; i < 100; i++) {
      await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.lorem.paragraph(),
          category_id: faker.number.int({ min: 1, max: 100 }),
          quantity_in_stock: faker.number.int({ min: 10, max: 100 }),
          unit_price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
          cost_price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
          supplier_id: faker.number.int({ min: 1, max: 100 }),
          size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
          color: faker.color.human(),
          product_image: faker.image.url(),
          status: faker.helpers.arrayElement([
            "Available",
            "Discontinued",
            "Out of Stock",
          ]),
          discount: faker.number.float({ min: 0, max: 50 }),
          quantity_damaged: faker.number.int({ min: 0, max: 10 }),
          quantity_returned: faker.number.int({ min: 0, max: 5 }),
          brand_id: faker.number.int({ min: 1, max: 100 }), // Ensure this matches the brand table
          date_of_entry: randomDateInMonth(month, year),
          created_at: randomDateInMonth(month, year),
        },
      });
    }
  }

  // // Seed Payment Methods
  for (let i = 0; i < 100; i++) {
    await prisma.paymentMethod.create({
      data: {
        name: faker.finance.transactionType(),
        description: faker.lorem.sentence(),
      },
    });
  }

  // // Seed Sales Orders
  for (let i = 0; i < 100; i++) {
    const total_price = faker.number.float({
      min: 100,
      max: 1000,
      fractionDigits: 2,
    });
    const discountPercentage = faker.number.int({ min: 0, max: 50 }); // e.g. 10%
    const discountedTotal =
      total_price - (total_price * discountPercentage) / 100;
    const amount_given = faker.number.float({
      min: discountedTotal,
      max: discountedTotal + 500,
      fractionDigits: 2,
    });

    const change = amount_given - discountedTotal;

    await prisma.salesOrder.create({
      data: {
        order_code: `ORD-${faker.string.uuid().slice(0, 8).toUpperCase()}`,
        user_id: faker.number.int({ min: 1, max: 100 }),
        payment_method_id: faker.number.int({ min: 1, max: 5 }), // or adjust to your actual method count
        amount_given,
        change,
        total_price,
        discountPercentage,
        discountedTotal,
      },
    });
  }

  // // Seed Order Items
  for (let i = 0; i < 100; i++) {
    await prisma.orderItem.create({
      data: {
        order_id: faker.number.int({ min: 1, max: 100 }),
        product_id: faker.number.int({ min: 1, max: 100 }),
        quantity: faker.number.int({ min: 1, max: 10 }),
        unit_price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
        total_price: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
      },
    });
  }

  // // Seed Inventory Adjustments
  for (let i = 0; i < 100; i++) {
    const isStockIn = faker.datatype.boolean();
    await prisma.inventoryAdjustment.create({
      data: {
        product_id: faker.number.int({ min: 1, max: 100 }),
        quantity_changed:
          faker.number.int({ min: 1000, max: 15000 }) * (isStockIn ? 1 : -1),
        reason: faker.lorem.sentence(),
        adjusted_by: faker.number.int({ min: 1, max: 100 }),
      },
    });
  }

  // // Seed User Activity Logs
  for (let i = 0; i < 100; i++) {
    await prisma.userActivityLog.create({
      data: {
        user_id: faker.number.int({ min: 1, max: 100 }),
        action: faker.helpers.arrayElement([
          "Created Product",
          "Updated Order",
          "Deleted Category",
        ]),
        details: faker.lorem.sentences(),
      },
    });
  }

  // Seed Product Returns
  for (let i = 0; i < 100; i++) {
    await prisma.return.create({
      data: {
        order_id: faker.number.int({ min: 1, max: 100 }),
        processed_by_id: faker.number.int({ min: 1, max: 100 }),
        product_id: faker.number.int({ min: 1, max: 100 }),
        quantity: faker.number.int({ min: 1, max: 5 }),
        reason: faker.helpers.arrayElement([
          "Defective",
          "Wrong Item",
          "Customer Changed Mind",
        ]),
        created_at: faker.date.past(),
      },
    });
  }
}

main()
  .then(() => console.log("Seeding completed!"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

// ,
// "postinstall": "prisma generate && prisma migrate deploy"
