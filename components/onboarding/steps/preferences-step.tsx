"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const WORKOUT_STYLES = [
  {
    id: "strength_training",
    title: "Strength Training",
    description: "Focus on compound movements and progressive overload",
  },
  {
    id: "bodybuilding",
    title: "Bodybuilding",
    description: "Muscle isolation and hypertrophy focus",
  },
  {
    id: "powerlifting",
    title: "Powerlifting",
    description: "Squat, bench, deadlift specialization",
  },
  {
    id: "functional",
    title: "Functional Training",
    description: "Movement patterns for daily life",
  },
  {
    id: "hiit",
    title: "HIIT/Circuit",
    description: "High-intensity interval training",
  },
  {
    id: "calisthenics",
    title: "Calisthenics",
    description: "Bodyweight movement mastery",
  },
]

const INTENSITY_LEVELS = [
  { value: "low", label: "Low - Easy pace, focus on form" },
  { value: "moderate", label: "Moderate - Challenging but manageable" },
  { value: "high", label: "High - Push your limits" },
  { value: "variable", label: "Variable - Mix of intensities" },
]

interface PreferencesStepProps {
  onNext: (data: any) => void
  onBack?: () => void
  initialData: any
}

export function PreferencesStep({ onNext, onBack, initialData }: PreferencesStepProps) {
  const [workoutStyles, setWorkoutStyles] = useState<string[]>(initialData.workoutStyles || [])
  const [intensity, setIntensity] = useState<string>(initialData.intensity || "")
  const [musicPreference, setMusicPreference] = useState<boolean>(initialData.musicPreference || false)
  const [progressTracking, setProgressTracking] = useState<boolean>(initialData.progressTracking !== false)

  const toggleWorkoutStyle = (styleId: string) => {
    setWorkoutStyles((prev) => (prev.includes(styleId) ? prev.filter((id) => id !== styleId) : [...prev, styleId]))
  }

  const handleNext = () => {
    onNext({
      workoutStyles,
      intensity,
      musicPreference,
      progressTracking,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Final step: Your workout preferences</h3>
        <p className="text-muted-foreground">
          These preferences help us create workouts you'll actually enjoy and stick with.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">What workout styles interest you?</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {WORKOUT_STYLES.map((style) => (
              <Card
                key={style.id}
                className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                  workoutStyles.includes(style.id) ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => toggleWorkoutStyle(style.id)}
              >
                <div className="space-y-2">
                  <h4 className="font-medium">{style.title}</h4>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Preferred workout intensity</Label>
          <Select value={intensity} onValueChange={setIntensity}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select your preferred intensity" />
            </SelectTrigger>
            <SelectContent>
              {INTENSITY_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">Additional preferences</Label>
          <Card className="p-4 border-border space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="music"
                checked={musicPreference}
                onCheckedChange={(checked) => setMusicPreference(checked as boolean)}
              />
              <label htmlFor="music" className="text-sm cursor-pointer">
                Include music recommendations during workouts
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tracking"
                checked={progressTracking}
                onCheckedChange={(checked) => setProgressTracking(checked as boolean)}
              />
              <label htmlFor="tracking" className="text-sm cursor-pointer">
                Enable detailed progress tracking and analytics
              </label>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={workoutStyles.length === 0 || !intensity}
          className={!onBack ? "ml-auto" : ""}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  )
}
