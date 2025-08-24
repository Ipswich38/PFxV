import AICoachChat from "@/components/ai-coach-chat"
import Navigation from "@/components/navigation"

export default function CoachPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1">
        <AICoachChat />
      </div>
    </div>
  )
}
