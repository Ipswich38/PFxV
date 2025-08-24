"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Lightbulb, Dumbbell, Apple, Target, Loader2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "coach"
  timestamp: Date
  category?: "workout" | "nutrition" | "motivation" | "form" | "general"
}

interface QuickAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  prompt: string
  category: string
}

const quickActions: QuickAction[] = [
  {
    id: "1",
    label: "Form Check",
    icon: Dumbbell,
    prompt: "Can you check my form on bench press and give me specific cues?",
    category: "form",
  },
  {
    id: "2",
    label: "Exercise Substitute",
    icon: Target,
    prompt: "I can't do squats today due to knee discomfort, what's a good substitute?",
    category: "workout",
  },
  {
    id: "3",
    label: "Nutrition Advice",
    icon: Apple,
    prompt: "What should I eat post-workout for optimal muscle recovery and growth?",
    category: "nutrition",
  },
  {
    id: "4",
    label: "Motivation",
    icon: Lightbulb,
    prompt: "I'm feeling unmotivated and considering skipping my workout today. Help me get back on track!",
    category: "motivation",
  },
]

export default function AICoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hey there! I'm your PFxV PowerCoach 💪 

I'm here to help you crush your fitness goals with science-backed advice on training, nutrition, form, and mindset. Whether you're a beginner or seasoned athlete, I'll provide personalized guidance to help you get stronger, healthier, and more confident.

What can I help you with today? Feel free to ask me anything about your fitness journey!`,
      sender: "coach",
      timestamp: new Date(),
      category: "general",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.content,
        sender: "coach",
        timestamp: new Date(),
        category: data.category,
      }

      setMessages((prev) => [...prev, coachMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Fallback message on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember that consistency is key to reaching your fitness goals! 💪",
        sender: "coach",
        timestamp: new Date(),
        category: "general",
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt)
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "workout":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "nutrition":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "motivation":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20"
      case "form":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <Card className="rounded-none border-x-0 border-t-0">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>PFxV PowerCoach</span>
            <Badge variant="secondary" className="ml-2">
              AI Powered
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                disabled={isTyping}
                className="flex items-center space-x-2 whitespace-nowrap bg-transparent"
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className={message.sender === "coach" ? "bg-primary text-primary-foreground" : ""}>
                {message.sender === "coach" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
            <div className={`flex-1 max-w-[80%] ${message.sender === "user" ? "text-right" : ""}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.content}</div>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                {message.category && message.sender === "coach" && (
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(message.category)}`}>
                    {message.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">PowerCoach is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your PowerCoach about workouts, nutrition, form, motivation..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)}
            disabled={isTyping}
            className="flex-1"
          />
          <Button onClick={() => sendMessage(inputValue)} disabled={!inputValue.trim() || isTyping}>
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
