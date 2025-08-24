"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Lightbulb, Dumbbell, Apple, Target } from "lucide-react"

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
    prompt: "Can you check my form on bench press?",
    category: "form",
  },
  {
    id: "2",
    label: "Exercise Substitute",
    icon: Target,
    prompt: "I can't do squats today, what's a good substitute?",
    category: "workout",
  },
  {
    id: "3",
    label: "Nutrition Advice",
    icon: Apple,
    prompt: "What should I eat post-workout for muscle recovery?",
    category: "nutrition",
  },
  {
    id: "4",
    label: "Motivation",
    icon: Lightbulb,
    prompt: "I'm feeling unmotivated today, help me get pumped!",
    category: "motivation",
  },
]

// Mock AI responses based on categories and keywords
const getAIResponse = (userMessage: string): { content: string; category: string } => {
  const message = userMessage.toLowerCase()

  // Form-related responses
  if (message.includes("form") || message.includes("technique")) {
    return {
      content: `Great question about form! Here are key points for proper technique:

🎯 **Key Form Cues:**
• Keep your core engaged throughout the movement
• Maintain neutral spine alignment
• Control the eccentric (lowering) phase
• Focus on the target muscle group

**Common Mistakes to Avoid:**
• Rushing through reps
• Using momentum instead of muscle control
• Neglecting proper breathing pattern

Would you like me to break down the specific exercise you're working on? I can provide detailed cues for better performance and injury prevention.`,
      category: "form",
    }
  }

  // Substitute exercises
  if (message.includes("substitute") || message.includes("replace") || message.includes("can't do")) {
    return {
      content: `No problem! Here are some excellent alternatives:

🔄 **Exercise Substitutions:**
• **Squats** → Bulgarian split squats, goblet squats, or leg press
• **Bench Press** → Push-ups, dumbbell press, or chest dips
• **Deadlifts** → Romanian deadlifts, hip thrusts, or kettlebell swings
• **Pull-ups** → Lat pulldowns, inverted rows, or resistance band pulls

**Selection Criteria:**
✅ Same movement pattern
✅ Similar muscle groups
✅ Matches your available equipment

What specific exercise are you looking to substitute? I can give you more targeted alternatives based on your goals and equipment.`,
      category: "workout",
    }
  }

  // Nutrition advice
  if (
    message.includes("nutrition") ||
    message.includes("eat") ||
    message.includes("food") ||
    message.includes("diet")
  ) {
    return {
      content: `Excellent nutrition question! Here's what I recommend:

🍎 **Post-Workout Nutrition (within 30-60 min):**
• **Protein:** 20-30g (chicken, fish, protein shake, Greek yogurt)
• **Carbs:** 30-60g (rice, banana, oats, sweet potato)
• **Hydration:** 16-24oz water + electrolytes if intense session

**Daily Nutrition Principles:**
• Eat 0.8-1g protein per lb bodyweight
• Include vegetables with every meal
• Time carbs around workouts
• Stay hydrated (half your bodyweight in oz)

**Sample Post-Workout Meals:**
• Protein shake + banana
• Greek yogurt + berries + granola
• Chicken + rice + vegetables

What's your primary goal? I can tailor nutrition advice for muscle building, fat loss, or performance.`,
      category: "nutrition",
    }
  }

  // Motivation and mindset
  if (
    message.includes("motivat") ||
    message.includes("pump") ||
    message.includes("tired") ||
    message.includes("lazy")
  ) {
    return {
      content: `I hear you! Everyone has those days. Let's get you fired up! 🔥

💪 **Remember Your WHY:**
• You started this journey for a reason
• Every rep is building a stronger, healthier you
• Consistency beats perfection every time

**Quick Motivation Boost:**
🎯 Focus on just showing up - that's 80% of the battle
⚡ Start with 5 minutes - momentum builds momentum
🏆 Celebrate small wins - they compound into big results
💯 You're already stronger than when you started

**Today's Mantra:** 
*"I don't have to be perfect, I just have to be present."*

What's one small thing you can do right now to move toward your goals? Even 10 push-ups or a 5-minute walk counts!`,
      category: "motivation",
    }
  }

  // Workout planning
  if (message.includes("workout") || message.includes("routine") || message.includes("program")) {
    return {
      content: `Let's optimize your training! Here's my approach:

🏋️ **Workout Structure:**
• **Frequency:** 3-5 days/week depending on goals
• **Duration:** 45-75 minutes per session
• **Split:** Upper/Lower or Push/Pull/Legs for intermediate+

**Key Principles:**
✅ Progressive overload (gradually increase weight/reps)
✅ Compound movements first (squats, deadlifts, presses)
✅ 48-72 hours rest between training same muscle groups
✅ Track your lifts to monitor progress

**This Week's Focus:**
• Master movement patterns before adding weight
• Aim for 2-3 sets in reserve (RPE 7-8)
• Include mobility work pre/post workout

What's your current training experience and main goal? I can suggest a more specific program structure.`,
      category: "workout",
    }
  }

  // Default response
  return {
    content: `Thanks for reaching out! I'm here to help with all aspects of your fitness journey.

🤖 **I can assist with:**
• Workout programming and exercise selection
• Form cues and technique improvements
• Nutrition guidance and meal planning
• Motivation and mindset coaching
• Recovery and injury prevention
• Progress tracking strategies

**Popular Topics:**
• "How do I improve my bench press?"
• "What should I eat before/after workouts?"
• "I'm plateauing, what should I change?"
• "How do I stay consistent with training?"

What specific area would you like to dive into? I'm here to provide personalized guidance based on your goals and current situation.`,
    category: "general",
  }
}

export default function AICoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hey there! I'm your AI fitness coach. I'm here to help you with workouts, nutrition, form checks, and motivation. 

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
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(content)
      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        sender: "coach",
        timestamp: new Date(),
        category: aiResponse.category as any,
      }

      setMessages((prev) => [...prev, coachMessage])
      setIsTyping(false)
    }, 1500)
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
            <span>AI Fitness Coach</span>
            <Badge variant="secondary" className="ml-2">
              Online
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
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
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
            placeholder="Ask me about workouts, nutrition, form, or anything fitness-related..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage(inputValue)}
            className="flex-1"
          />
          <Button onClick={() => sendMessage(inputValue)} disabled={!inputValue.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
