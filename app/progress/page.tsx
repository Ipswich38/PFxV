import ProgressTracking from "@/components/progress-tracking"
import Navigation from "@/components/navigation"

export default function ProgressPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1">
        <ProgressTracking />
      </div>
    </div>
  )
}
