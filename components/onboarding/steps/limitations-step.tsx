"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const COMMON_LIMITATIONS = [
  "Lower back issues",
  "Knee problems",
  "Shoulder impingement",
  "Wrist/elbow pain",
  "Hip mobility issues",
  "Previous injuries",
  "Chronic conditions",
  "None of the above",
]

interface LimitationsStepProps {
  onNext: (data: any) => void
  onBack?: () => void
  initialData: any
}

export function LimitationsStep({ onNext, onBack, initialData }: LimitationsStepProps) {
  const [limitations, setLimitations] = useState<string[]>(initialData.limitations || [])
  const [additionalInfo, setAdditionalInfo] = useState<string>(initialData.additionalInfo || "")

  const toggleLimitation = (limitation: string) => {
    if (limitation === "None of the above") {
      setLimitations(["None of the above"])
    } else {
      setLimitations((prev) => {
        const filtered = prev.filter((item) => item !== "None of the above")
        return prev.includes(limitation) ? filtered.filter((item) => item !== limitation) : [...filtered, limitation]
      })
    }
  }

  const handleNext = () => {
    onNext({
      limitations,
      additionalInfo,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Do you have any physical limitations or injuries?</h3>
        <p className="text-muted-foreground">
          This helps us modify exercises to keep you safe and ensure proper progression.
        </p>
      </div>

      <div className="space-y-4">
        <Card className="p-4 border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMMON_LIMITATIONS.map((limitation) => (
              <div key={limitation} className="flex items-center space-x-2">
                <Checkbox
                  id={limitation}
                  checked={limitations.includes(limitation)}
                  onCheckedChange={() => toggleLimitation(limitation)}
                />
                <label htmlFor={limitation} className="text-sm cursor-pointer">
                  {limitation}
                </label>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          <Label htmlFor="additional-info" className="text-base font-medium">
            Additional details (optional)
          </Label>
          <Textarea
            id="additional-info"
            placeholder="Please provide any additional information about injuries, medical conditions, or specific concerns..."
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="bg-input border-border min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Note: This information is used only to customize your workouts. Always consult with healthcare professionals
            for medical advice.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button onClick={handleNext} disabled={limitations.length === 0} className={!onBack ? "ml-auto" : ""}>
          Continue
        </Button>
      </div>
    </div>
  )
}
