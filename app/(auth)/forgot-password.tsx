"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { ThreeDots } from "react-loader-spinner";

// import axios
import { api } from "@/lib/axios";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Define the form schema with Zod
const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Must be a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

interface Message {
  type: string;
  description: string;
}

export default function ForgotPassword() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [error, setError] = useState<Message>()

  // Initialize the form with React Hook Form and Zod resolver
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })


  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      setIsLoading(true);
      setError(undefined);
      // Replace with actual API call to your backend
      const response = await api.post("/send", {
        email: data.email,
            }
        );

        if (response.status === 200) {
          setIsLoading(false);
          form.reset()
          // setIsOpen(false)
          setError({
              type: "success",
              description: `Forgot password email sent. Please check you email.`,
          })
        }
      

    } catch (error) {
      setIsLoading(false);
      // setIsOpen(false);
      setError({
          type: "error",
          description: `If this email is associated with an account, you will receive further instructions.`,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 text-sm font-medium text-primary">
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email address and we&apos;ll send you instructions to reset your password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="forgot-password-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="name@example.com" className="pl-10" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              error && <span className={`text-xs ${error.type == 'error' ? 'text-red-500' : 'text-green-500'}`}>{error.description}</span>
            }
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" form="forgot-password-form" disabled={isLoading} className="w-full">
                {isLoading ? <ThreeDots width="30" color="#fff" /> : "Send reset link"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

