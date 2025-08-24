"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const GOALS = [
  {
    id: "strength",
    title: "Build Strength",
    description: "Increase overall strength and power",
    icon: "💪",
  },
  {
    id: "muscle",
    title: "Build Muscle",
    description: "Gain muscle mass and size",
    icon: "🏋️",
  },
  {
    id: "endurance",
    title: "Improve Endurance",
    description: "Enhance cardiovascular fitness",
    icon: "🏃",
  },
  {
    id: "weight_loss",
    title: "Lose Weight",
    description: "Reduce body fat and weight",
    icon: "⚖️",
  },
  {
    id: "general_fitness",
    title: "General Fitness",
    description: "Overall health and wellness",
    icon: "🎯",
  },
  {
    id: "sport_specific",
    title: "Sport Performance",
    description: "Train for specific sports",
    icon: "⚽",
  },
]

interface GoalsStepProps {
  onNext: (data: any) => void
  onBack?: () => void
  initialData: any
}

export function GoalsStep({ onNext, onBack, initialData }: GoalsStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(initialData.goals || [])

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  const handleNext = () => {
    onNext({ goals: selectedGoals })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">What are your primary fitness goals?</h3>
        <p className="text-muted-foreground">
          Select all that apply. This helps us create the perfect program for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GOALS.map((goal) => (
          <Card
            key={goal.id}
            className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
              selectedGoals.includes(goal.id) ? "border-primary bg-primary/5" : "border-border"
            }`}
            onClick={() => toggleGoal(goal.id)}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{goal.icon}</span>
              <div className="flex-1">
                <h4 className="font-medium">{goal.title}</h4>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
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
        <Button onClick={handleNext} disabled={selectedGoals.length === 0} className={!onBack ? "ml-auto" : ""}>
          Continue
        </Button>
      </div>
    </div>
  )
}
