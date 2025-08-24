"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Check, Clock, Dumbbell, Target, Info, RefreshCw } from "lucide-react"

interface Exercise {
  id: string
  name: string
  targetMuscles: string[]
  sets: number
  reps: string
  weight?: string
  restTime: number
  instructions: string[]
  tips: string
  completed: boolean
  setData: { reps: number; weight: number; completed: boolean }[]
}

interface Workout {
  id: string
  name: string
  date: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  exercises: Exercise[]
  completed: boolean
}

// Mock workout data
const mockWorkout: Workout = {
  id: "1",
  name: "Upper Body Strength",
  date: "Today",
  duration: "45-60 min",
  difficulty: "Intermediate",
  completed: false,
  exercises: [
    {
      id: "1",
      name: "Barbell Bench Press",
      targetMuscles: ["Chest", "Triceps", "Shoulders"],
      sets: 4,
      reps: "8-10",
      weight: "135 lbs",
      restTime: 180,
      instructions: [
        "Lie flat on bench with feet firmly on ground",
        "Grip bar slightly wider than shoulder width",
        "Lower bar to chest with control",
        "Press bar up explosively while maintaining form",
      ],
      tips: "Keep your shoulder blades retracted throughout the movement",
      completed: false,
      setData: [
        { reps: 0, weight: 135, completed: false },
        { reps: 0, weight: 135, completed: false },
        { reps: 0, weight: 135, completed: false },
        { reps: 0, weight: 135, completed: false },
      ],
    },
    {
      id: "2",
      name: "Bent-Over Barbell Row",
      targetMuscles: ["Lats", "Rhomboids", "Rear Delts"],
      sets: 4,
      reps: "8-10",
      weight: "115 lbs",
      restTime: 180,
      instructions: [
        "Stand with feet hip-width apart, holding barbell",
        "Hinge at hips, keep back straight",
        "Pull bar to lower chest/upper abdomen",
        "Lower with control, feeling stretch in lats",
      ],
      tips: "Focus on pulling with your back muscles, not your arms",
      completed: false,
      setData: [
        { reps: 0, weight: 115, completed: false },
        { reps: 0, weight: 115, completed: false },
        { reps: 0, weight: 115, completed: false },
        { reps: 0, weight: 115, completed: false },
      ],
    },
    {
      id: "3",
      name: "Overhead Press",
      targetMuscles: ["Shoulders", "Triceps", "Core"],
      sets: 3,
      reps: "10-12",
      weight: "95 lbs",
      restTime: 120,
      instructions: [
        "Stand with feet shoulder-width apart",
        "Hold bar at shoulder level with overhand grip",
        "Press bar straight up overhead",
        "Lower with control to starting position",
      ],
      tips: "Keep your core tight and avoid arching your back",
      completed: false,
      setData: [
        { reps: 0, weight: 95, completed: false },
        { reps: 0, weight: 95, completed: false },
        { reps: 0, weight: 95, completed: false },
      ],
    },
  ],
}

export default function WorkoutInterface() {
  const [workout, setWorkout] = useState<Workout>(mockWorkout)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  const currentExercise = workout.exercises[currentExerciseIndex]
  const currentSet = currentExercise?.setData[currentSetIndex]

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1)
      }, 1000)
    } else if (restTimer === 0 && isResting) {
      setIsResting(false)
    }
    return () => clearInterval(interval)
  }, [isResting, restTimer])

  const startRestTimer = () => {
    setRestTimer(currentExercise.restTime)
    setIsResting(true)
  }

  const completeSet = (reps: number, weight: number) => {
    const updatedWorkout = { ...workout }
    const exercise = updatedWorkout.exercises[currentExerciseIndex]
    exercise.setData[currentSetIndex] = { reps, weight, completed: true }

    // Check if exercise is complete
    const allSetsComplete = exercise.setData.every((set) => set.completed)
    if (allSetsComplete) {
      exercise.completed = true
    }

    setWorkout(updatedWorkout)

    // Move to next set or exercise
    if (currentSetIndex < exercise.setData.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1)
      startRestTimer()
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setCurrentSetIndex(0)
      startRestTimer()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const workoutProgress = (workout.exercises.filter((e) => e.completed).length / workout.exercises.length) * 100

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Workout Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{workout.name}</CardTitle>
                <CardDescription className="flex items-center space-x-4 mt-2">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration}</span>
                  </span>
                  <Badge variant="secondary">{workout.difficulty}</Badge>
                  <span>{workout.date}</span>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{Math.round(workoutProgress)}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <Progress value={workoutProgress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">{formatTime(restTimer)}</div>
                <div className="text-muted-foreground">Rest between sets</div>
                <Button variant="outline" onClick={() => setIsResting(false)} className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Skip Rest</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Exercise */}
        {currentExercise && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Dumbbell className="w-5 h-5" />
                    <span>{currentExercise.name}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    {currentExercise.targetMuscles.map((muscle) => (
                      <Badge key={muscle} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center space-x-1"
                >
                  <Info className="w-4 h-4" />
                  <span>Instructions</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Exercise Instructions */}
              {showInstructions && (
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h4 className="font-medium">Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {currentExercise.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                  <div className="bg-primary/10 p-3 rounded border-l-4 border-primary">
                    <p className="text-sm font-medium">💡 Tip: {currentExercise.tips}</p>
                  </div>
                </div>
              )}

              {/* Set Tracking */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    Set {currentSetIndex + 1} of {currentExercise.sets}
                  </h4>
                  <div className="text-sm text-muted-foreground">
                    Target: {currentExercise.reps} reps @ {currentExercise.weight}
                  </div>
                </div>

                {/* Set Input */}
                <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="weight" className="text-sm">
                      Weight (lbs)
                    </Label>
                    <Input id="weight" type="number" defaultValue={currentSet?.weight || 0} className="mt-1" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="reps" className="text-sm">
                      Reps
                    </Label>
                    <Input id="reps" type="number" defaultValue={currentSet?.reps || 0} className="mt-1" />
                  </div>
                  <Button
                    onClick={() => {
                      const weightInput = document.getElementById("weight") as HTMLInputElement
                      const repsInput = document.getElementById("reps") as HTMLInputElement
                      completeSet(Number.parseInt(repsInput.value), Number.parseInt(weightInput.value))
                    }}
                    className="flex items-center space-x-2 mt-6"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete Set</span>
                  </Button>
                </div>

                {/* Previous Sets */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">Previous Sets:</h5>
                  {currentExercise.setData.map((set, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        set.completed ? "bg-primary/10 text-primary" : "bg-muted/50"
                      }`}
                    >
                      <span>Set {index + 1}</span>
                      <span>{set.completed ? `${set.reps} reps @ ${set.weight} lbs` : "Not completed"}</span>
                      {set.completed && <Check className="w-4 h-4" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={exercise.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    index === currentExerciseIndex
                      ? "border-primary bg-primary/5"
                      : exercise.completed
                        ? "border-green-500 bg-green-500/5"
                        : "border-border"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        exercise.completed
                          ? "bg-green-500 text-white"
                          : index === currentExerciseIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                      }`}
                    >
                      {exercise.completed ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps
                      </div>
                    </div>
                  </div>
                  {index === currentExerciseIndex && <Badge variant="default">Current</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workout Actions */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
            <RefreshCw className="w-4 h-4" />
            <span>Restart Workout</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Finish Workout</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
