"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  Zap,
  BarChart3,
  Activity,
  Flame,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

interface WorkoutRecord {
  date: string
  exercise: string
  weight: number
  reps: number
  sets: number
  volume: number
}

interface BodyMetric {
  date: string
  weight: number
  bodyFat?: number
  muscle?: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  category: "strength" | "consistency" | "milestone"
}

interface PersonalRecord {
  exercise: string
  weight: number
  reps: number
  date: string
  improvement: number
}

// Mock data
const mockWorkoutHistory: WorkoutRecord[] = [
  { date: "2024-01-15", exercise: "Bench Press", weight: 135, reps: 8, sets: 4, volume: 4320 },
  { date: "2024-01-17", exercise: "Bench Press", weight: 140, reps: 8, sets: 4, volume: 4480 },
  { date: "2024-01-19", exercise: "Bench Press", weight: 145, reps: 8, sets: 4, volume: 4640 },
  { date: "2024-01-22", exercise: "Bench Press", weight: 145, reps: 10, sets: 4, volume: 5800 },
  { date: "2024-01-24", exercise: "Bench Press", weight: 150, reps: 8, sets: 4, volume: 4800 },
]

const mockBodyMetrics: BodyMetric[] = [
  { date: "2024-01-01", weight: 180, bodyFat: 15.2, muscle: 152.6 },
  { date: "2024-01-08", weight: 181, bodyFat: 14.8, muscle: 154.1 },
  { date: "2024-01-15", weight: 182, bodyFat: 14.5, muscle: 155.6 },
  { date: "2024-01-22", weight: 183, bodyFat: 14.2, muscle: 157.0 },
]

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Workout",
    description: "Completed your first workout session",
    icon: "🎯",
    unlockedAt: "2024-01-01",
    category: "milestone",
  },
  {
    id: "2",
    title: "Week Warrior",
    description: "Completed 7 consecutive days of workouts",
    icon: "🔥",
    unlockedAt: "2024-01-08",
    category: "consistency",
  },
  {
    id: "3",
    title: "Bench Press Beast",
    description: "Bench pressed your bodyweight",
    icon: "💪",
    unlockedAt: "2024-01-15",
    category: "strength",
  },
  {
    id: "4",
    title: "Volume King",
    description: "Lifted over 10,000 lbs in a single workout",
    icon: "👑",
    unlockedAt: "2024-01-20",
    category: "strength",
  },
]

const mockPersonalRecords: PersonalRecord[] = [
  { exercise: "Bench Press", weight: 150, reps: 8, date: "2024-01-24", improvement: 15 },
  { exercise: "Squat", weight: 225, reps: 5, date: "2024-01-23", improvement: 25 },
  { exercise: "Deadlift", weight: 275, reps: 3, date: "2024-01-21", improvement: 35 },
  { exercise: "Overhead Press", weight: 95, reps: 10, date: "2024-01-22", improvement: 10 },
]

export default function ProgressTracking() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")

  const currentStreak = 12
  const totalWorkouts = 45
  const totalVolume = 125680
  const currentWeight = 183
  const weightChange = 3
  const muscleGain = 4.4

  const timeframes = [
    { value: "week", label: "7 Days" },
    { value: "month", label: "30 Days" },
    { value: "quarter", label: "3 Months" },
    { value: "year", label: "1 Year" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 pb-20 md:pb-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
              <img src="/images/pfxv-logo.png" alt="PFxV" className="h-12 w-auto" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Progress Tracking</h1>
          <p className="text-gray-300">Your fitness journey visualized</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-emerald-500/20 backdrop-blur-md border-emerald-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{currentStreak}</div>
                  <p className="text-sm text-emerald-200">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/20 backdrop-blur-md border-purple-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-purple-400">{totalWorkouts}</div>
                  <p className="text-sm text-purple-200">Total Workouts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-500/20 backdrop-blur-md border-orange-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-orange-400">{totalVolume.toLocaleString()}</div>
                  <p className="text-sm text-orange-200">Total Volume (lbs)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-pink-500/20 backdrop-blur-md border-pink-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-pink-400">{currentWeight}</span>
                    <div className="flex items-center text-green-400">
                      <ChevronUp className="w-4 h-4" />
                      <span className="text-sm">+{weightChange}</span>
                    </div>
                  </div>
                  <p className="text-sm text-pink-200">Current Weight (lbs)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different tracking views */}
        <Tabs defaultValue="strength" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md border border-white/20">
            <TabsTrigger
              value="strength"
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Strength
            </TabsTrigger>
            <TabsTrigger
              value="body"
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Body Comp
            </TabsTrigger>
            <TabsTrigger
              value="consistency"
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Consistency
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="text-white data-[state=active]:bg-orange-500 data-[state=active]:text-white"
            >
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Strength Progress */}
          <TabsContent value="strength" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Strength Progression</h2>
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <Button
                    key={timeframe.value}
                    variant={selectedTimeframe === timeframe.value ? "cta" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                    className={
                      selectedTimeframe !== timeframe.value
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        : ""
                    }
                  >
                    {timeframe.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Personal Records */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <span>Personal Records</span>
                </CardTitle>
                <CardDescription className="text-gray-300">Your best lifts and recent improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPersonalRecords.map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div>
                        <div className="font-medium text-white">{record.exercise}</div>
                        <div className="text-sm text-gray-300">
                          {record.weight} lbs × {record.reps} reps
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-green-400">
                          <ChevronUp className="w-4 h-4" />
                          <span className="font-medium">+{record.improvement} lbs</span>
                        </div>
                        <div className="text-xs text-gray-400">{record.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strength Chart Placeholder */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white">Bench Press Progression</CardTitle>
                <CardDescription className="text-gray-300">Weight progression over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                  <div className="text-center space-y-2">
                    <BarChart3 className="w-12 h-12 text-orange-400 mx-auto" />
                    <p className="text-gray-300">Interactive chart showing strength progression</p>
                    <p className="text-sm text-gray-400">135 lbs → 150 lbs (+15 lbs in 30 days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Body Composition */}
          <TabsContent value="body" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Body Composition</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Weight</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{currentWeight} lbs</div>
                  <div className="flex items-center space-x-1 text-green-400 mt-1">
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm">+{weightChange} lbs this month</span>
                  </div>
                  <Progress value={75} className="mt-3" />
                  <p className="text-xs text-gray-400 mt-1">Goal: 185 lbs</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Body Fat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">14.2%</div>
                  <div className="flex items-center space-x-1 text-green-400 mt-1">
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-sm">-1.0% this month</span>
                  </div>
                  <Progress value={60} className="mt-3" />
                  <p className="text-xs text-gray-400 mt-1">Goal: 12%</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white">Muscle Mass</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">157 lbs</div>
                  <div className="flex items-center space-x-1 text-green-400 mt-1">
                    <ChevronUp className="w-4 h-4" />
                    <span className="text-sm">+{muscleGain} lbs this month</span>
                  </div>
                  <Progress value={80} className="mt-3" />
                  <p className="text-xs text-gray-400 mt-1">Goal: 165 lbs</p>
                </CardContent>
              </Card>
            </div>

            {/* Body Composition Chart */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white">Body Composition Trends</CardTitle>
                <CardDescription className="text-gray-300">
                  Track your body composition changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                  <div className="text-center space-y-2">
                    <TrendingUp className="w-12 h-12 text-orange-400 mx-auto" />
                    <p className="text-gray-300">Body composition trend chart</p>
                    <p className="text-sm text-gray-400">Weight ↑ | Body Fat ↓ | Muscle ↑</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consistency */}
          <TabsContent value="consistency" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Workout Consistency</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <span>This Month</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Workouts Completed</span>
                    <span className="font-bold text-white">18/20</span>
                  </div>
                  <Progress value={90} className="h-2" />
                  <div className="text-sm text-gray-400">90% completion rate</div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Average per Week</span>
                    <span className="font-bold text-white">4.5</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Longest Streak</span>
                    <span className="font-bold text-white">12 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <span>Weekly Goals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Strength Training</span>
                      <span className="text-sm font-medium text-white">3/3</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Cardio Sessions</span>
                      <span className="text-sm font-medium text-white">2/2</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Active Recovery</span>
                      <span className="text-sm font-medium text-white">1/2</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workout Calendar */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white">Workout Calendar</CardTitle>
                <CardDescription className="text-gray-300">Your workout history at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                  <div className="text-center space-y-2">
                    <Calendar className="w-12 h-12 text-orange-400 mx-auto" />
                    <p className="text-gray-300">Interactive workout calendar</p>
                    <p className="text-sm text-gray-400">Green = Completed | Gray = Rest Day | Red = Missed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Achievements & Milestones</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAchievements.map((achievement) => (
                <Card key={achievement.id} className="bg-white/10 backdrop-blur-md border-orange-500/30 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs capitalize border-orange-500/50 text-orange-300">
                            {achievement.category}
                          </Badge>
                          <span className="text-xs text-gray-400">Unlocked {achievement.unlockedAt}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Next Achievements */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span>Next Achievements</span>
                </CardTitle>
                <CardDescription className="text-gray-300">Keep pushing to unlock these milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl opacity-50">🏆</div>
                      <div>
                        <div className="font-medium text-white">Century Club</div>
                        <div className="text-sm text-gray-300">Complete 100 total workouts</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">45/100</div>
                      <Progress value={45} className="w-20 h-2 mt-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl opacity-50">💎</div>
                      <div>
                        <div className="font-medium text-white">Diamond Streak</div>
                        <div className="text-sm text-gray-300">Maintain a 30-day workout streak</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">12/30</div>
                      <Progress value={40} className="w-20 h-2 mt-1" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl opacity-50">🚀</div>
                      <div>
                        <div className="font-medium text-white">Strength Rocket</div>
                        <div className="text-sm text-gray-300">Increase total 1RM by 100 lbs</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">65/100</div>
                      <Progress value={65} className="w-20 h-2 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
