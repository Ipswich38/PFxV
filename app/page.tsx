"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TypingEffect } from "@/components/ui/typing-effect"
import { AuthModal } from "@/components/ui/auth-modal"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#1d1c21] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-sm mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/images/pfxv-logo.png" alt="PFxV Logo" className="w-32 h-32 object-contain" />
          </div>

          {/* Main Value Display - matching reference design */}
          <div className="text-center mb-8">
            <TypingEffect
              text="Built with Science! Your AI-powered fitness coach, teacher, and tracker. Personalized workouts that adapt to your progress."
              className="text-sm text-gray-400"
            />
          </div>

          {/* 4 Cards Grid - exact colors from reference */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Card 1 - Light Blue */}
            <div
              onClick={handleCardClick}
              className="bg-[#c0d7dd] rounded-2xl p-4 relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center absolute top-2 left-2">
                <svg className="w-4 h-4 text-[#1d1c21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-xl font-bold text-[#1d1c21] mb-1 mt-8">AI Coach</div>
              <div className="text-xs text-[#1d1c21] opacity-70">Personalized guidance</div>
            </div>

            {/* Card 2 - Light Purple */}
            <div
              onClick={handleCardClick}
              className="bg-[#e6dff1] rounded-2xl p-4 relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center absolute top-2 left-2">
                <svg className="w-4 h-4 text-[#1d1c21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="text-xl font-bold text-[#1d1c21] mb-1 mt-8">Learn & Grow</div>
              <div className="text-xs text-[#1d1c21] opacity-70">Educational content</div>
            </div>

            {/* Card 3 - Light Peach */}
            <div
              onClick={handleCardClick}
              className="bg-[#f2eee8] rounded-2xl p-4 relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center absolute top-2 left-2">
                <svg className="w-4 h-4 text-[#1d1c21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="text-lg font-bold text-[#1d1c21] mb-1 mt-8">Train & Track Progress</div>
              <div className="text-xs text-[#1d1c21] opacity-70">Monitor your journey</div>
            </div>

            {/* Card 4 - Built with Science */}
            <div
              onClick={handleCardClick}
              className="bg-[#d4e8f0] rounded-2xl p-4 relative transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 cursor-pointer"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center absolute top-2 left-2">
                <svg className="w-4 h-4 text-[#1d1c21]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="text-xl font-bold text-[#1d1c21] mb-1 mt-8">Built with Science</div>
              <div className="text-xs text-[#1d1c21] opacity-70">Evidence-based approach</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full bg-[#ff4b33] hover:bg-[#ff4b33]/90 text-white">
              <Link href="/auth/sign-up">Start Your Journey</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
