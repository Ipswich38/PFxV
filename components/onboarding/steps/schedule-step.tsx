"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const WORKOUT_DURATION = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "75", label: "1 hour 15 minutes" },
  { value: "90", label: "1 hour 30 minutes" },
  { value: "120", label: "2+ hours" },
]

const FREQUENCY_OPTIONS = [
  { value: "2", label: "2 days per week" },
  { value: "3", label: "3 days per week" },
  { value: "4", label: "4 days per week" },
  { value: "5", label: "5 days per week" },
  { value: "6", label: "6 days per week" },
  { value: "7", label: "7 days per week" },
]

interface ScheduleStepProps {
  onNext: (data: any) => void
  onBack?: () => void
  initialData: any
}

export function ScheduleStep({ onNext, onBack, initialData }: ScheduleStepProps) {
  const [frequency, setFrequency] = useState<string>(initialData.frequency || "")
  const [duration, setDuration] = useState<string>(initialData.duration || "")
  const [availableDays, setAvailableDays] = useState<string[]>(initialData.availableDays || [])

  const toggleDay = (day: string) => {
    setAvailableDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleNext = () => {
    onNext({
      frequency,
      duration,
      availableDays,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Let's plan your workout schedule</h3>
        <p className="text-muted-foreground">Tell us about your availability so we can create a realistic program.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium">How often do you want to work out?</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select workout frequency" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">How long can you work out per session?</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue placeholder="Select workout duration" />
            </SelectTrigger>
            <SelectContent>
              {WORKOUT_DURATION.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">Which days work best for you?</Label>
          <Card className="p-4 border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox id={day} checked={availableDays.includes(day)} onCheckedChange={() => toggleDay(day)} />
                  <label htmlFor={day} className="text-sm cursor-pointer">
                    {day}
                  </label>
                </div>
              ))}
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
          disabled={!frequency || !duration || availableDays.length === 0}
          className={!onBack ? "ml-auto" : ""}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
