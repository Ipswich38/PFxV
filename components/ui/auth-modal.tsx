"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("[v0] Auth form submitted:", { email, isSignUp })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#2a2930] rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{isSignUp ? "Join PFxV" : "Welcome Back"}</h2>
          <p className="text-gray-400 text-sm">
            {isSignUp ? "Start your fitness journey today" : "Sign in to continue your fitness journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1d1c21] border-gray-600 text-white mt-1"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#1d1c21] border-gray-600 text-white mt-1"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#ff4b33] hover:bg-[#ff4b33]/90 text-white">
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}
