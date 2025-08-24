"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Target, Dumbbell, Clock, Heart } from "lucide-react"

interface OnboardingData {
  goals: string[]
  experience: string
  equipment: string[]
  gymAccess: string
  timeAvailable: string
  daysPerWeek: string
  limitations: string
  preferences: string[]
  dislikes: string
}

const steps = [
  { id: 1, title: "Fitness Goals", icon: Target },
  { id: 2, title: "Experience & Equipment", icon: Dumbbell },
  { id: 3, title: "Schedule", icon: Clock },
  { id: 4, title: "Health & Preferences", icon: Heart },
]

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    goals: [],
    experience: "",
    equipment: [],
    gymAccess: "",
    timeAvailable: "",
    daysPerWeek: "",
    limitations: "",
    preferences: [],
    dislikes: "",
  })
  const router = useRouter()

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: keyof OnboardingData, value: string) => {
    const currentArray = data[field] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value]
    updateData(field, newArray)
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    console.log("[v0] Complete Setup button clicked")
    console.log("[v0] Onboarding completed with data:", data)

    try {
      localStorage.setItem("pfxv_onboarding_data", JSON.stringify(data))
      localStorage.setItem("pfxv_onboarding_completed", "true")
      console.log("[v0] Data saved to localStorage successfully")

      console.log("[v0] Attempting to navigate to dashboard...")
      router.push("/dashboard")
      console.log("[v0] Navigation command executed")
    } catch (error) {
      console.error("[v0] Error during completion:", error)
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-[#1d1c21] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">
            Welcome to PF<span className="text-[#FF4B33]">x</span>V
          </h1>
          <p className="text-gray-400">Let's personalize your fitness journey</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 ${
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.id <= currentStep ? "bg-cta text-cta-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{step.title}</span>
                </div>
              )
            })}
          </div>
          <Progress value={progress} className="h-2" variant="cta" />
        </div>

        {/* Step Content */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              {React.createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
              <span>{steps[currentStep - 1].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <CardDescription className="text-gray-300">
                  What are your primary fitness goals? (Select all that apply)
                </CardDescription>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Build Muscle",
                    "Lose Weight",
                    "Increase Strength",
                    "Improve Endurance",
                    "General Fitness",
                    "Athletic Performance",
                    "Rehabilitation",
                    "Flexibility/Mobility",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={data.goals.includes(goal)}
                        onCheckedChange={() => handleArrayToggle("goals", goal)}
                      />
                      <Label htmlFor={goal} className="text-sm text-white">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium text-white">What's your fitness experience level?</Label>
                  <RadioGroup
                    value={data.experience}
                    onValueChange={(value) => updateData("experience", value)}
                    className="mt-3"
                  >
                    {[
                      { value: "beginner", label: "Beginner (0-1 years)" },
                      { value: "intermediate", label: "Intermediate (1-3 years)" },
                      { value: "advanced", label: "Advanced (3+ years)" },
                      { value: "expert", label: "Expert/Competitive" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-white">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium text-white">Do you have gym access?</Label>
                  <RadioGroup
                    value={data.gymAccess}
                    onValueChange={(value) => updateData("gymAccess", value)}
                    className="mt-3"
                  >
                    {[
                      { value: "full-gym", label: "Full gym access" },
                      { value: "home-gym", label: "Home gym setup" },
                      { value: "minimal", label: "Minimal equipment" },
                      { value: "bodyweight", label: "Bodyweight only" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-white">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium text-white">
                    Available Equipment (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      "Dumbbells",
                      "Barbell",
                      "Resistance Bands",
                      "Pull-up Bar",
                      "Kettlebells",
                      "Cable Machine",
                      "Cardio Equipment",
                      "Yoga Mat",
                    ].map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={data.equipment.includes(equipment)}
                          onCheckedChange={() => handleArrayToggle("equipment", equipment)}
                        />
                        <Label htmlFor={equipment} className="text-sm text-white">
                          {equipment}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium text-white">
                    How much time can you dedicate per workout?
                  </Label>
                  <RadioGroup
                    value={data.timeAvailable}
                    onValueChange={(value) => updateData("timeAvailable", value)}
                    className="mt-3"
                  >
                    {[
                      { value: "30min", label: "30 minutes or less" },
                      { value: "45min", label: "30-45 minutes" },
                      { value: "60min", label: "45-60 minutes" },
                      { value: "90min", label: "60-90 minutes" },
                      { value: "90min+", label: "90+ minutes" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-white">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium text-white">How many days per week can you work out?</Label>
                  <RadioGroup
                    value={data.daysPerWeek}
                    onValueChange={(value) => updateData("daysPerWeek", value)}
                    className="mt-3"
                  >
                    {[
                      { value: "2-3", label: "2-3 days" },
                      { value: "3-4", label: "3-4 days" },
                      { value: "4-5", label: "4-5 days" },
                      { value: "5-6", label: "5-6 days" },
                      { value: "daily", label: "Daily" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-white">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="limitations" className="text-base font-medium text-white">
                    Do you have any injuries, limitations, or health conditions we should know about?
                  </Label>
                  <Textarea
                    id="limitations"
                    placeholder="e.g., Lower back issues, knee problems, etc. (Optional)"
                    value={data.limitations}
                    onChange={(e) => updateData("limitations", e.target.value)}
                    className="mt-3"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium text-white">
                    Exercise Preferences (Select all that apply)
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {[
                      "Compound Movements",
                      "Isolation Exercises",
                      "Cardio Training",
                      "HIIT Workouts",
                      "Yoga/Stretching",
                      "Functional Training",
                      "Olympic Lifts",
                      "Bodyweight Exercises",
                    ].map((preference) => (
                      <div key={preference} className="flex items-center space-x-2">
                        <Checkbox
                          id={preference}
                          checked={data.preferences.includes(preference)}
                          onCheckedChange={() => handleArrayToggle("preferences", preference)}
                        />
                        <Label htmlFor={preference} className="text-sm text-white">
                          {preference}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="dislikes" className="text-base font-medium text-white">
                    Any exercises you particularly dislike or want to avoid?
                  </Label>
                  <Textarea
                    id="dislikes"
                    placeholder="e.g., Burpees, running, etc. (Optional)"
                    value={data.dislikes}
                    onChange={(e) => updateData("dislikes", e.target.value)}
                    className="mt-3"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="flex items-center space-x-2" variant="cta">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="flex items-center space-x-2" variant="cta">
              <span>Complete Setup</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
