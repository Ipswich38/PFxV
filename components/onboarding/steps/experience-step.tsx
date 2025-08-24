"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const EXPERIENCE_LEVELS = [
  {
    id: "beginner",
    title: "Beginner",
    description: "New to fitness or returning after a long break",
    details: "0-6 months of consistent training",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description: "Some experience with regular workouts",
    details: "6 months - 2 years of consistent training",
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Experienced with structured training programs",
    details: "2+ years of consistent training",
  },
  {
    id: "expert",
    title: "Expert",
    description: "Highly experienced, possibly competitive",
    details: "5+ years with advanced programming knowledge",
  },
]

interface ExperienceStepProps {
  onNext: (data: any) => void
  onBack?: () => void
  initialData: any
}

export function ExperienceStep({ onNext, onBack, initialData }: ExperienceStepProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(initialData.experience || "")

  const handleNext = () => {
    onNext({ experience: selectedLevel })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">What's your fitness experience level?</h3>
        <p className="text-muted-foreground">This helps us design workouts at the right intensity for you.</p>
      </div>

      <div className="space-y-3">
        {EXPERIENCE_LEVELS.map((level) => (
          <Card
            key={level.id}
            className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
              selectedLevel === level.id ? "border-primary bg-primary/5" : "border-border"
            }`}
            onClick={() => setSelectedLevel(level.id)}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{level.title}</h4>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedLevel === level.id ? "border-primary bg-primary" : "border-muted-foreground"
                  }`}
                />
              </div>
              <p className="text-sm text-muted-foreground">{level.description}</p>
              <p className="text-xs text-muted-foreground font-medium">{level.details}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button onClick={handleNext} disabled={!selectedLevel} className={!onBack ? "ml-auto" : ""}>
          Continue
        </Button>
      </div>
    </div>
  )
}
