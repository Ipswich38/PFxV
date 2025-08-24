import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              PF<span className="text-primary">x</span>V
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold">Start your journey</h2>
          <p className="text-muted-foreground">Create your account and unlock personalized fitness coaching</p>
        </div>

        {/* Signup Form */}
        <SignupForm />

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
