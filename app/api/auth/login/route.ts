import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { email, password }: LoginRequestBody = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        orders: true,
        adjustments: true,
        logs: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
