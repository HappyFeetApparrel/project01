import { NextResponse } from "next/server";


import prisma from "@/lib/prisma";


export async function GET(): Promise<NextResponse> {
    try {
        const products = await prisma.product.findMany();
        return NextResponse.json({ data: products }, { status: 200 });
    } catch (error) {
        console.log('Error:');
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


export async function POST(req: Request): Promise<NextResponse> {
    try {
        const data = await req.json();
        return NextResponse.json({ data: data }, { status: 200 });
    } catch (error) {
        console.log('Error:');
        console.log(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
