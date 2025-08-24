import LearningHub from "@/components/learning-hub"
import Navigation from "@/components/navigation"

export default function LearnPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1">
        <LearningHub />
      </div>
    </div>
  )
}
