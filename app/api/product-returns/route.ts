import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
    try {
        const productReturns = await prisma.productReturn.findMany({
            orderBy: {
                created_at: "desc",
            },
        });

        console.log('Product Returns:', productReturns);
        return NextResponse.json({ data: productReturns }, { status: 200 });
    } catch (error) {
        console.log('Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();
        const { user_id, id, type, reason, otherReason, quantity = 1 } = data;

        if (!user_id) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        if (!id) {
            return NextResponse.json({ error: "Product ID or Order ID is required." }, { status: 400 });
        }

        if ( !reason ) {
            return NextResponse.json({ error: "Reason is required." }, { status: 400 });
        }

        if ( !type) {
            return NextResponse.json({ error: "Type is required." }, { status: 400 });
        }

        const returnReason = reason === "Other" ? otherReason : reason;

        const productReturn = await prisma.productReturn.create({
            data: {
            // @ts-ignore
              order_id: type === "order" ? id : null,
              product_id: type === "product" ? id : null,
              quantity,
              reason: returnReason,
              processed_by_user_id: user_id,
              updated_at: new Date(), // Add this line
            },
          });

        return NextResponse.json({ data: productReturn }, { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();
        const { return_id, user_id, id, type, quantity, reason, otherReason } = data;

        if (!return_id) {
            return NextResponse.json({ error: "Return ID is required." }, { status: 400 });
        }

        const returnReason = reason === "Other" ? otherReason : reason;

        const updatedProductReturn = await prisma.productReturn.update({
            where: { return_id },
            data: {
            // @ts-ignore
                order_id: type === "order" ? id : null,
                product_id: type === "product" ? id : null,
                quantity,
                reason: returnReason,
                processed_by_user_id: user_id,
                updated_at: new Date(), // Add this line
              },
        });

        return NextResponse.json({ data: updatedProductReturn }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();
        const { return_id } = data;

        if (!return_id) {
            return NextResponse.json({ error: "Return ID is required." }, { status: 400 });
        }

        await prisma.productReturn.delete({ where: { return_id } });

        return NextResponse.json({ message: "Product return deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}