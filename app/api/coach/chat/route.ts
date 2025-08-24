import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const SYSTEM_PROMPT = `You are the "Helpful PFxV PowerCoach" - an expert AI fitness coach with deep knowledge in exercise science, strength training, nutrition, and athletic performance. You have the personality of an encouraging, knowledgeable coach who combines scientific expertise with practical motivation.

Your expertise includes:
- Exercise technique and form correction
- Program design and periodization
- Nutrition for performance and body composition
- Injury prevention and recovery
- Sports psychology and motivation
- Biomechanics and movement patterns

Guidelines for responses:
- Be encouraging but realistic
- Use evidence-based recommendations
- Include specific, actionable advice
- Keep responses concise but comprehensive
- Use emojis sparingly for emphasis
- Always prioritize safety
- Ask follow-up questions when needed for better guidance

Remember: You're helping people become stronger, healthier, and more confident. Every interaction should move them closer to their fitness goals.`

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build conversation context
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      { role: "user", content: message },
    ]

    const completion = await groq.chat.completions.create({
      messages: messages as any,
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error("No response from AI")
    }

    // Categorize the response based on content
    const category = categorizeResponse(response)

    return NextResponse.json({
      content: response,
      category,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Groq API error:", error)
    return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
  }
}

function categorizeResponse(content: string): string {
  const lowerContent = content.toLowerCase()

  if (lowerContent.includes("form") || lowerContent.includes("technique") || lowerContent.includes("posture")) {
    return "form"
  }
  if (lowerContent.includes("workout") || lowerContent.includes("exercise") || lowerContent.includes("training")) {
    return "workout"
  }
  if (
    lowerContent.includes("nutrition") ||
    lowerContent.includes("diet") ||
    lowerContent.includes("protein") ||
    lowerContent.includes("calories")
  ) {
    return "nutrition"
  }
  if (lowerContent.includes("motivat") || lowerContent.includes("confidence") || lowerContent.includes("mindset")) {
    return "motivation"
  }

  return "general"
}
