"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Dumbbell, Target, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import OnboardingFlow from "@/components/onboarding-flow"

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  if (showOnboarding) {
    return <OnboardingFlow />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1 p-6 pb-20 md:pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back to PF<span className="text-primary">x</span>V
              </h1>
              <p className="text-muted-foreground mt-1">Ready to crush today's workout?</p>
            </div>
            <Button onClick={() => setShowOnboarding(true)} variant="outline">
              Update Goals
            </Button>
          </div>

          {/* Today's Workout */}
          <Card className="border-primary">
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
                <Button className="w-full">Start Workout</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3/4</div>
                <p className="text-sm text-muted-foreground">Workouts completed</p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">12</div>
                <p className="text-sm text-muted-foreground">Days active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,580</div>
                <p className="text-sm text-muted-foreground">lbs this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Yesterday", workout: "Lower Body Power", duration: "52 min", status: "Completed" },
                  { date: "2 days ago", workout: "Upper Body Hypertrophy", duration: "48 min", status: "Completed" },
                  { date: "4 days ago", workout: "Full Body Strength", duration: "61 min", status: "Completed" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{activity.workout}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.date} • {activity.duration}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
