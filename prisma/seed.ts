import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Seed Users
    for (let i = 0; i < 100; i++) {
        const existingAdmin = await prisma.user.findUnique({
          where: { email: 'jmnicolas4me@gmail.com' },
        });
      
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Test123!', 10);
          await prisma.user.create({
            data: {
              name: 'Admin',
              email: 'jmnicolas4me@gmail.com',
              password: hashedPassword,
              role: 'Admin',
            },
          });
        }
      
        const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);
        await prisma.user.create({
          data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: faker.helpers.arrayElement(['Admin', 'Manager', 'Staff']),
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

    // Seed Suppliers
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

    // Seed Products
    for (let i = 0; i < 100; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.lorem.paragraph(),
                category_id: faker.number.int({ min: 1, max: 100 }),
                // sku: `SKU-${i + 1}`,
                quantity_in_stock: faker.number.int({ min: 10, max: 100 }),
                unit_price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
                cost_price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
                supplier_id: faker.number.int({ min: 1, max: 100 }),
                size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                color: faker.color.human(),
                product_image: faker.image.url(),
                // tags: faker.lorem.words(3).split(' '),
                status: faker.helpers.arrayElement(['Active', 'Discontinued', 'Out of Stock']),
                discount: faker.number.float({ min: 0, max: 50 }),
                quantity_damaged: faker.number.int({ min: 0, max: 10 }), // random value between 0 and 10
                quantity_returned: faker.number.int({ min: 0, max: 5 }), // random value between 0 and 5
            },
        });
    }

    // Seed Payment Methods
    for (let i = 0; i < 100; i++) {
        await prisma.paymentMethod.create({
            data: {
                name: faker.finance.transactionType(),
                description: faker.lorem.sentence(),
            },
        });
    }

    // Seed Sales Orders
    for (let i = 0; i < 100; i++) {
        await prisma.salesOrder.create({
            data: {
                order_code: `ORD-${faker.string.uuid().slice(0, 8).toUpperCase()}`,
                user_id: faker.number.int({ min: 1, max: 100 }),
                payment_method_id: faker.number.int({ min: 1, max: 100 }),
                amount_given: faker.number.float({ min: 50, max: 500 }),
                change: faker.number.float({ min: 0, max: 50 }),
                total_price: faker.number.float({ min: 100, max: 1000 }),
            },
        });
    }

    // Seed Order Items
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

    // Seed Inventory Adjustments
    for (let i = 0; i < 100; i++) {
        const isStockIn = faker.datatype.boolean();
        await prisma.inventoryAdjustment.create({
            data: {
                product_id: faker.number.int({ min: 1, max: 100 }),
                quantity_changed: faker.number.int({ min: 1000, max: 15000 }) * (isStockIn ? 1 : -1), // Positive for stock-in, negative for stock-out
                reason: faker.lorem.sentence(),
                adjusted_by: faker.number.int({ min: 1, max: 100 }),
            },
        });
    }

    // Seed User Activity Logs
    for (let i = 0; i < 100; i++) {
        await prisma.userActivityLog.create({
            data: {
                user_id: faker.number.int({ min: 1, max: 100 }),
                action: faker.helpers.arrayElement(['Created Product', 'Updated Order', 'Deleted Category']),
                details: faker.lorem.sentences(),
            },
        });
    }


    // Seed Product Returns
    for (let i = 0; i < 100; i++) {
        await prisma.productReturn.create({
            data: {
                order_item_id: faker.number.int({ min: 1, max: 100 }),
                user_id: faker.number.int({ min: 1, max: 100 }),
                product_id: faker.number.int({ min: 1, max: 100 }),
                quantity: faker.number.int({ min: 1, max: 5 }),
                reason: faker.helpers.arrayElement(["Defective", "Wrong Item", "Customer Changed Mind"]),
                processed_by: faker.number.int({ min: 1, max: 100 }),
                created_at: faker.date.past(),
            },
        });
    }
    
}

main()
    .then(() => console.log('Seeding completed!'))
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());