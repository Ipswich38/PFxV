"use client"

import { useState, useEffect } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  className?: string
}

export function TypingEffect({ text, speed = 50, className = "" }: TypingEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)

      const restartTimeout = setTimeout(() => {
        setDisplayText("")
        setCurrentIndex(0)
        setIsComplete(false)
      }, 3000)

      return () => clearTimeout(restartTimeout)
    }
  }, [currentIndex, text, speed, isComplete])

  return (
    <span className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}
