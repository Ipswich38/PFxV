"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const EQUIPMENT_OPTIONS = [
  {
    id: "full_gym",
    title: "Full Gym Access",
    description: "Commercial gym with all equipment",
    icon: "🏢",
  },
  {
    id: "home_gym",
    title: "Home Gym",
    description: "Well-equipped home setup",
    icon: "🏠",
  },
  {
    id: "basic_equipment",
    title: "Basic Equipment",
    description: "Dumbbells, resistance bands, etc.",
    icon: "🏋️",
  },
  {
    id: "bodyweight_only",
    title: "Bodyweight Only",
    description: "No equipment needed",
    icon: "🤸",
  },
]

const SPECIFIC_EQUIPMENT = [
  "Barbell & Plates",
  "Dumbbells",
  "Resistance Bands",
  "Pull-up Bar",
  "Kettlebells",
  "Cable Machine",
  "Squat Rack",
  "Bench",
  "Cardio Equipment",
]

interface EquipmentStepProps {
  onNext: (data: any) => void
  onBack?: () => void
  initialData: any
}

export function EquipmentStep({ onNext, onBack, initialData }: EquipmentStepProps) {
  const [selectedAccess, setSelectedAccess] = useState<string>(initialData.equipmentAccess || "")
  const [specificEquipment, setSpecificEquipment] = useState<string[]>(initialData.specificEquipment || [])

  const toggleEquipment = (equipment: string) => {
    setSpecificEquipment((prev) =>
      prev.includes(equipment) ? prev.filter((item) => item !== equipment) : [...prev, equipment],
    )
  }

  const handleNext = () => {
    onNext({
      equipmentAccess: selectedAccess,
      specificEquipment: specificEquipment,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">What equipment do you have access to?</h3>
        <p className="text-muted-foreground">We'll design workouts based on your available equipment.</p>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Primary Access</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EQUIPMENT_OPTIONS.map((option) => (
            <Card
              key={option.id}
              className={`p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                selectedAccess === option.id ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={() => setSelectedAccess(option.id)}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <h5 className="font-medium">{option.title}</h5>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedAccess && selectedAccess !== "bodyweight_only" && (
        <div className="space-y-4">
          <h4 className="font-medium">Specific Equipment Available</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SPECIFIC_EQUIPMENT.map((equipment) => (
              <div key={equipment} className="flex items-center space-x-2">
                <Checkbox
                  id={equipment}
                  checked={specificEquipment.includes(equipment)}
                  onCheckedChange={() => toggleEquipment(equipment)}
                />
                <label htmlFor={equipment} className="text-sm cursor-pointer">
                  {equipment}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button onClick={handleNext} disabled={!selectedAccess} className={!onBack ? "ml-auto" : ""}>
          Continue
        </Button>
      </div>
    </div>
  )
}
