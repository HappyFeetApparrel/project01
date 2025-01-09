import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // Seed Users
    for (let i = 0; i < 100; i++) {
        await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
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
                barcode: faker.string.uuid(),
                quantity_in_stock: faker.number.int({ min: 10, max: 100 }),
                reorder_level: faker.number.int({ min: 5, max: 20 }),
                unit_price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
                cost_price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
                supplier_id: faker.number.int({ min: 1, max: 100 }),
                size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                color: faker.color.human(),
                material: faker.commerce.productMaterial(),
                style_design: faker.word.sample(),
                product_image: faker.image.url(),
                brand: faker.company.name(),
                season: faker.helpers.arrayElement(['Summer', 'Winter', 'All Seasons']),
                // tags: faker.lorem.words(3).split(' '),
                status: faker.helpers.arrayElement(['Active', 'Discontinued', 'Out of Stock']),
                location: faker.location.streetAddress(),
                discount: faker.number.float({ min: 0, max: 50 }),
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
        await prisma.inventoryAdjustment.create({
            data: {
                product_id: faker.number.int({ min: 1, max: 100 }),
                quantity_changed: faker.number.int({ min: 1000, max: 15000 }),
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
}

main()
    .then(() => console.log('Seeding completed!'))
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
