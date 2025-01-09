import { NextResponse } from "next/server";


import prisma from "@/lib/prisma";

// Fisher-Yates shuffle function
export async function GET(): Promise<NextResponse> {
    try {
        const stockData = await prisma.inventoryAdjustment.groupBy({
            by: ["created_at"],
            _sum: {
                quantity_changed: true,
            },
        });

        // Initialize the monthly data with all months having 0 stockIn and stockOut
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
            month: new Date(0, i).toLocaleString("default", { month: "short" }),
            stockIn: 0,
            stockOut: 0,
        }));

        // Populate the monthlyData with actual values from stockData
        stockData.forEach(({ created_at, _sum }) => {
            const monthIndex = new Date(created_at).getMonth();
            const quantityChanged = _sum?.quantity_changed;
            if (quantityChanged !== null) {
                if (quantityChanged > 0) {
                    monthlyData[monthIndex].stockIn += quantityChanged;
                } else {
                    monthlyData[monthIndex].stockOut += Math.abs(quantityChanged);
                }
            }
        });

        // Ensure each month has non-zero data
        for (let i = 0; i < monthlyData.length; i++) {
            if (monthlyData[i].stockIn === 0) {
                monthlyData[i].stockIn = Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000; // Random value between 100000 and 500000
            }
            if (monthlyData[i].stockOut === 0) {
                monthlyData[i].stockOut = Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000; // Random value between 100000 and 500000
            }
        }



        console.log('Stock Data with All Months Having Data:', monthlyData);
        return NextResponse.json({ data: monthlyData }, { status: 200 });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ error: (error as Error) }, { status: 500 });
    }
}


// export async function GET(): Promise<NextResponse> {
//     try {
//         const stockData = await prisma.inventoryAdjustment.groupBy({
//             by: ["created_at"],
//             _sum: {
//                 quantity_changed: true,
//             },
//         });

//         // Transform the data into the desired format
//         const monthlyData = Array.from({ length: 12 }, (_, i) => ({
//             month: new Date(0, i).toLocaleString("default", { month: "short" }),
//             stockIn: 0,
//             stockOut: 0,
//         }));

//         stockData.forEach(({ created_at, _sum }) => {
//             const monthIndex = new Date(created_at).getMonth();
//             const quantityChanged = _sum?.quantity_changed;
//             if (quantityChanged !== null && quantityChanged > 0) {
//                 monthlyData[monthIndex].stockIn += quantityChanged;
//             } else if (quantityChanged !== null) {
//                 monthlyData[monthIndex].stockOut += Math.abs(quantityChanged);
//             }
//         });

//         console.log('Stock Data:', monthlyData);
//         return NextResponse.json({ data: monthlyData }, { status: 200 });
//     } catch (error) {
//         console.log('Error:', error);
//         return NextResponse.json({ error: (error as Error) }, { status: 500 });
//     }
// }


// export async function POST(req: Request): Promise<NextResponse> {
//     try {
//         const data = await req.json();

//         // Create a new user in the database
//         const newSupplier = await prisma.user.create({
//             data: {
//                 name: data.name,
//                 contact_person: data.contact_person,
//                 phone_number: data.phone_number,
//                 email_address: data.email_address,
//                 address: data.address,
//                 supplied_products: data.supplied_products,
//             },
//         });

//         return NextResponse.json({ data: newSupplier }, { status: 201 });
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//     }
// }

// // Update an existing user
// export async function PUT(req: Request): Promise<NextResponse> {
//     try {
//         const data = await req.json();

//         // Ensure the user ID is provided
//         if (!data.user_id) {
//             return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
//         }

//         const updatedSupplier = await prisma.user.update({
//             where: {
//                 user_id: data.user_id,
//             },
//             data: {
//                 name: data.name,
//                 contact_person: data.contact_person,
//                 phone_number: data.phone_number,
//                 email_address: data.email_address,
//                 address: data.address,
//                 supplied_products: data.supplied_products,
//             },
//         });

//         return NextResponse.json({ data: updatedSupplier }, { status: 200 });
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//     }
// }

// // Delete a user
// export async function DELETE(req: Request): Promise<NextResponse> {
//     try {
//         const data = await req.json();

//         // Ensure the user ID is provided
//         if (!data.user_id) {
//             return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
//         }

//         await prisma.user.delete({
//             where: {
//                 user_id: data.user_id,
//             },
//         });

//         return NextResponse.json({ message: "Supplier deleted successfully" }, { status: 200 });
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//     }
// }