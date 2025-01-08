import { NextResponse } from "next/server";


import prisma from "@/lib/prisma";


export async function GET(): Promise<NextResponse> {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                user_id: "desc", // Adjust this to the appropriate timestamp field (e.g., "updatedAt")
            },
        });

        console.log('Suppliers:', users);
        return NextResponse.json({ data: users }, { status: 200 });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ error: (error as Error) }, { status: 500 });
    }
}


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