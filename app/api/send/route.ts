import { NextResponse } from "next/server";
import {Resend} from "resend"
import ForgotPasswordEmail from "@/components/email/template";
import { randomBytes } from "crypto";
import { addMinutes } from "date-fns";
import { Prisma } from '@prisma/client';
import prisma from "@/lib/prisma";


interface UpdateData {
    password_reset_token: String;
    password_reset_expires: Date;
}

export async function GET() {

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'jmnicolas4me@gmail.com',
            subject: 'Forgot Password',
            react: ForgotPasswordEmail({username: 'zeno'})
          });

        return NextResponse.json({
            'hello': 'world!'
        })
    } catch (error) {
        return NextResponse.json({
            error
        })
    }
}


export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate a secure reset token
        const resetToken = randomBytes(32).toString("hex");
        const expiresAt = addMinutes(new Date(), 15); // Token expires in 15 minutes

        // Update user with reset token and expiration time
        const updateData: UpdateData = {
            password_reset_token: resetToken,
            password_reset_expires: expiresAt,
        };
        await prisma.user.update({
            where: { email },
            data: updateData as Prisma.UserUpdateInput,
        });

        // Send email with reset link
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
        // await sendPasswordResetEmail(email, resetLink);

        const resend = new Resend(process.env.RESEND_API_KEY);

        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: user.email,
            subject: 'Happy Feet and Apparel | Passwordc Reset Request for ' + user.name,
            react: ForgotPasswordEmail({username: user.name, resetPasswordUrl: resetLink})
          });
        
        return NextResponse.json({ message: "Password reset link sent!" }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}