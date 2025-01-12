import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";


interface UpdateData {
    name: string;
    email: string;
    role: string;
    updated_at: Date;
    password?: string; // password is optional
}

// GET all users
export async function GET(): Promise<NextResponse> {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                user_id: "desc",
            },
            include: {
                orders: true,
                adjustments: true,
                logs: true,
            },
        });

        return NextResponse.json({ data: users }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// POST: Create a new user
export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });

        return NextResponse.json({ data: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// PUT: Update an existing user
export async function PUT(req: Request): Promise<NextResponse> {
    try {
        const { user_id, name, email, password, role } = await req.json();

        if (!user_id) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        const updateData: UpdateData = {
            name,
            email,
            role,
            updated_at: new Date(),
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { user_id },
            data: updateData,
        });

        return NextResponse.json({ data: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

// DELETE: Remove a user
export async function DELETE(req: Request): Promise<NextResponse> {
    try {
        const { user_id } = await req.json();

        if (!user_id) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        await prisma.user.delete({
            where: { user_id },
        });

        return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
