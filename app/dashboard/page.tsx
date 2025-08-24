"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Dumbbell, Target, TrendingUp, Zap, BookOpen, BarChart3, Lightbulb } from "lucide-react"
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
    <div className="min-h-screen bg-[#1d1c21]">
      <Navigation />
      <div className="p-4 pb-20 md:pb-6">
        <div className="max-w-sm mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src="/images/pfxv-logo.png" alt="PFxV" className="w-32 h-32 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hello, {user?.email?.split("@")[0] || "Athlete"}</h1>
              <p className="text-slate-400 text-sm">Welcome back to your fitness journey</p>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 text-center">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">Weekly Volume</p>
              <div className="text-4xl font-bold text-white">
                {weeklyStats.totalVolume.toLocaleString()}
                <span className="text-2xl text-slate-400">lbs</span>
              </div>
              <p className="text-slate-400 text-xs">
                {weeklyStats.completedWorkouts} workouts • {weeklyStats.currentStreak} day streak
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/coach">
              <Card className="bg-[#c0d7dd] border-0 rounded-2xl p-4 relative cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-2 left-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#1d1c21]" />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="text-2xl font-bold text-[#1d1c21] mb-1">AI Coach</div>
                  <p className="text-[#1d1c21]/70 text-sm">Personal guidance</p>
                </div>
              </Card>
            </Link>

            <Link href="/learn">
              <Card className="bg-[#e6dff1] border-0 rounded-2xl p-4 relative cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-2 left-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#1d1c21]" />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="text-2xl font-bold text-[#1d1c21] mb-1">Learn & Grow</div>
                  <p className="text-[#1d1c21]/70 text-sm">Knowledge base</p>
                </div>
              </Card>
            </Link>

            <Link href="/progress">
              <Card className="bg-[#f2eee8] border-0 rounded-2xl p-4 relative cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
                <div className="absolute top-2 left-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-[#1d1c21]" />
                  </div>
                </div>
                <div className="mt-8">
                  <div className="text-2xl font-bold text-[#1d1c21] mb-1">Track Progress</div>
                  <p className="text-[#1d1c21]/70 text-sm">Monitor gains</p>
                </div>
              </Card>
            </Link>

            <Card className="bg-[#c0d7dd] border-0 rounded-2xl p-4 relative cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl">
              <div className="absolute top-2 left-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-[#1d1c21]" />
                </div>
              </div>
              <div className="mt-8">
                <div className="text-2xl font-bold text-[#1d1c21] mb-1">Built with Science</div>
                <p className="text-[#1d1c21]/70 text-sm">Evidence-based</p>
              </div>
            </Card>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">Today's Workout</CardTitle>
                  <CardDescription className="text-slate-400">Upper Body Strength</CardDescription>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Ready</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  45-60 min
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />3 exercises
                </span>
              </div>
              <Link href="/workout">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 rounded-xl h-12 font-semibold">
                  Start Workout
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSessions.length > 0 ? (
                  recentSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                    >
                      <div>
                        <div className="font-medium text-white text-sm">{session.workout_name}</div>
                        <div className="text-xs text-slate-400">
                          {formatDate(session.completed_at)} • {session.duration_minutes} min
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                        Completed
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No workouts completed yet</p>
                    <p className="text-xs">Start your first workout to see progress!</p>
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
