"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { GoalsStep } from "./steps/goals-step"
import { ExperienceStep } from "./steps/experience-step"
import { EquipmentStep } from "./steps/equipment-step"
import { ScheduleStep } from "./steps/schedule-step"
import { LimitationsStep } from "./steps/limitations-step"
import { PreferencesStep } from "./steps/preferences-step"

const STEPS = [
  { id: "goals", title: "Fitness Goals", component: GoalsStep },
  { id: "experience", title: "Experience Level", component: ExperienceStep },
  { id: "equipment", title: "Equipment Access", component: EquipmentStep },
  { id: "schedule", title: "Schedule", component: ScheduleStep },
  { id: "limitations", title: "Physical Considerations", component: LimitationsStep },
  { id: "preferences", title: "Workout Preferences", component: PreferencesStep },
]

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const router = useRouter()

  const progress = ((currentStep + 1) / STEPS.length) * 100
  const CurrentStepComponent = STEPS[currentStep].component

  const handleNext = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }))

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Complete onboarding
      console.log("[v0] Onboarding completed with data:", { ...formData, ...stepData })
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            PF<span className="text-primary">x</span>V
          </h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Let's personalize your fitness journey</h2>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
            </p>
          </div>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
        </div>

        {/* Step Content */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>{STEPS[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              onNext={handleNext}
              onBack={currentStep > 0 ? handleBack : undefined}
              initialData={formData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
