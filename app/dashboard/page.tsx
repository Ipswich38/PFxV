"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Dumbbell, Target, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import OnboardingFlow from "@/components/onboarding-flow"
import { useAuth } from "@/contexts/auth-context"
import { createBrowserClient } from "@supabase/ssr"

interface WorkoutSession {
  id: string
  workout_name: string
  duration_minutes: number
  completed_at: string
  exercises_completed: any
}

interface WeeklyStats {
  completedWorkouts: number
  totalWorkouts: number
  currentStreak: number
  totalVolume: number
}

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    completedWorkouts: 0,
    totalWorkouts: 4,
    currentStreak: 0,
    totalVolume: 0,
  })
  const [hasOnboardingData, setHasOnboardingData] = useState(false)
  const { user } = useAuth()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    if (user) {
      loadUserData()
    }
  }, [user])

  const loadUserData = async () => {
    if (!user) return

    const { data: onboardingData } = await supabase.from("onboarding_data").select("*").eq("id", user.id).single()

    setHasOnboardingData(!!onboardingData)

    const { data: sessions } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(3)

    if (sessions) {
      setRecentSessions(
        sessions.map((session) => ({
          id: session.id,
          workout_name: session.notes || "Workout Session",
          duration_minutes: session.duration_minutes || 0,
          completed_at: session.completed_at,
          exercises_completed: session.exercises_completed,
        })),
      )
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { data: weekSessions } = await supabase
      .from("workout_sessions")
      .select("*")
      .eq("user_id", user.id)
      .gte("completed_at", oneWeekAgo.toISOString())

    const { data: allSessions } = await supabase
      .from("workout_sessions")
      .select("completed_at")
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false })

    let streak = 0
    if (allSessions && allSessions.length > 0) {
      const today = new Date()
      let currentDate = new Date(today)

      for (const session of allSessions) {
        const sessionDate = new Date(session.completed_at)
        const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff <= 1) {
          streak++
          currentDate = sessionDate
        } else {
          break
        }
      }
    }

    const { data: volumeData } = await supabase
      .from("progress_tracking")
      .select("value")
      .eq("user_id", user.id)
      .eq("metric_type", "volume")
      .gte("recorded_at", oneWeekAgo.toISOString())

    const totalVolume = volumeData?.reduce((sum, record) => sum + Number(record.value), 0) || 0

    setWeeklyStats({
      completedWorkouts: weekSessions?.length || 0,
      totalWorkouts: 4,
      currentStreak: streak,
      totalVolume: Math.round(totalVolume),
    })
  }

  if (!hasOnboardingData && user) {
    return <OnboardingFlow />
  }

  if (showOnboarding) {
    return <OnboardingFlow />
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1 p-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/images/pfxv-logo.png" alt="PFxV Logo" className="w-12 h-12 object-contain logo-3d" />
              <div>
                <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
                <p className="text-muted-foreground mt-1">Ready to crush today's workout?</p>
              </div>
            </div>
            <Button onClick={() => setShowOnboarding(true)} variant="outline">
              Update Goals
            </Button>
          </div>

          {/* Today's Workout */}
          <Card className="bg-white/10 backdrop-blur-md border border-cta/20 rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Dumbbell className="w-5 h-5" />
                    <span>Today's Workout</span>
                  </CardTitle>
                  <CardDescription>Upper Body Strength • 45-60 min</CardDescription>
                </div>
                <Badge variant="default">Ready</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>3 exercises</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>45-60 min</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Intermediate</span>
                </span>
              </div>
              <Link href="/workout">
                <Button className="w-full" variant="cta">
                  Start Workout
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {weeklyStats.completedWorkouts}/{weeklyStats.totalWorkouts}
                </div>
                <p className="text-sm text-muted-foreground">Workouts completed</p>
                <Progress value={(weeklyStats.completedWorkouts / weeklyStats.totalWorkouts) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cta">{weeklyStats.currentStreak}</div>
                <p className="text-sm text-muted-foreground">Days active</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weeklyStats.totalVolume.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">lbs this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{session.workout_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(session.completed_at)} • {session.duration_minutes} min
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Completed
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No workouts completed yet</p>
                    <p className="text-sm">Start your first workout to see your progress here!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
