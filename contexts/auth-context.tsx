"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  name: string
  fitnessLevel?: "beginner" | "intermediate" | "advanced"
  goals?: string[]
  experience?: string
  equipment?: string[]
  gymAccess?: string
  timeAvailable?: string
  daysPerWeek?: string
  limitations?: string
  preferences?: string[]
  dislikes?: string
  // Sports science focused metrics
  bodyWeight?: number
  height?: number
  age?: number
  activityLevel?: string
  injuryHistory?: string[]
  fitnessAssessment?: {
    pushUps?: number
    plankTime?: number
    flexibility?: string
    cardioLevel?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateProfile: (profileData: Partial<User>) => Promise<boolean>
  saveOnboardingData: (onboardingData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user)
      }
      setIsLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", supabaseUser.id).single()

    const { data: onboarding } = await supabase.from("onboarding_data").select("*").eq("id", supabaseUser.id).single()

    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: profile?.display_name || supabaseUser.email!.split("@")[0],
      fitnessLevel: (onboarding?.experience_level as "beginner" | "intermediate" | "advanced") || "beginner",
      goals: onboarding?.fitness_goals || [],
      experience: onboarding?.experience_level || "",
      equipment: onboarding?.available_equipment || [],
      gymAccess: onboarding?.gym_access || "",
      timeAvailable: onboarding?.time_available || "",
      daysPerWeek: onboarding?.days_per_week || "",
      limitations: onboarding?.limitations || "",
      preferences: onboarding?.exercise_preferences || [],
      dislikes: onboarding?.exercise_dislikes || "",
      bodyWeight: profile?.body_weight || null,
      height: profile?.height || null,
      age: profile?.age || null,
      activityLevel: profile?.activity_level || "",
      injuryHistory: profile?.injury_history || [],
      fitnessAssessment: profile?.fitness_assessment || {},
    })
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setIsLoading(false)
    return !error
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    })

    if (!error && data.user) {
      // Create profile
      await supabase.from("profiles").insert({
        id: data.user.id,
        display_name: name,
      })
    }

    setIsLoading(false)
    return !error
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const saveOnboardingData = async (onboardingData: any): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase.from("onboarding_data").upsert({
        id: user.id,
        fitness_goals: onboardingData.goals,
        experience_level: onboardingData.experience,
        available_equipment: onboardingData.equipment,
        gym_access: onboardingData.gymAccess,
        time_available: onboardingData.timeAvailable,
        days_per_week: onboardingData.daysPerWeek,
        limitations: onboardingData.limitations,
        exercise_preferences: onboardingData.preferences,
        exercise_dislikes: onboardingData.dislikes,
        updated_at: new Date().toISOString(),
      })

      if (!error) {
        // Reload user profile to reflect changes
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()
        if (supabaseUser) {
          await loadUserProfile(supabaseUser)
        }
      }

      return !error
    } catch (error) {
      console.error("Error saving onboarding data:", error)
      return false
    }
  }

  const updateProfile = async (profileData: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        display_name: profileData.name || user.name,
        body_weight: profileData.bodyWeight,
        height: profileData.height,
        age: profileData.age,
        activity_level: profileData.activityLevel,
        injury_history: profileData.injuryHistory,
        fitness_assessment: profileData.fitnessAssessment,
        updated_at: new Date().toISOString(),
      })

      if (!error) {
        // Reload user profile to reflect changes
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()
        if (supabaseUser) {
          await loadUserProfile(supabaseUser)
        }
      }

      return !error
    } catch (error) {
      console.error("Error updating profile:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        updateProfile,
        saveOnboardingData,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
