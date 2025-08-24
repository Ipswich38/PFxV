"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  BookOpen,
  Dumbbell,
  Apple,
  Heart,
  Brain,
  Clock,
  Star,
  ChevronRight,
  Play,
  CheckCircle,
} from "lucide-react"

interface Article {
  id: string
  title: string
  description: string
  category: "training" | "nutrition" | "recovery" | "mindset" | "technique"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  readTime: number
  rating: number
  completed: boolean
  content: string
  keyPoints: string[]
}

interface LearningPath {
  id: string
  title: string
  description: string
  articles: string[]
  progress: number
  estimatedTime: number
}

const categories = [
  { id: "all", label: "All Topics", icon: BookOpen },
  { id: "training", label: "Training", icon: Dumbbell },
  { id: "nutrition", label: "Nutrition", icon: Apple },
  { id: "recovery", label: "Recovery", icon: Heart },
  { id: "mindset", label: "Mindset", icon: Brain },
  { id: "technique", label: "Technique", icon: Star },
]

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Progressive Overload: The Foundation of Strength Training",
    description: "Learn the fundamental principle that drives all strength and muscle gains.",
    category: "training",
    difficulty: "Beginner",
    readTime: 8,
    rating: 4.9,
    completed: false,
    keyPoints: [
      "Progressive overload is the gradual increase of stress placed on the body during exercise",
      "Can be achieved through increased weight, reps, sets, or decreased rest time",
      "Essential for continued adaptation and avoiding plateaus",
    ],
    content: `Progressive overload is the cornerstone of effective strength training. This principle states that in order to continue making gains, you must gradually increase the demands placed on your muscles over time.

**Methods of Progressive Overload:**

1. **Increase Weight** - The most common method. Add 2.5-5lbs when you can complete all sets with perfect form.

2. **Increase Reps** - If you can't add weight, add 1-2 reps per set until you reach the top of your rep range.

3. **Increase Sets** - Add an additional set to increase total volume.

4. **Decrease Rest Time** - Reduce rest periods to increase training density.

5. **Improve Range of Motion** - Go deeper into movements for greater muscle activation.

**Implementation Strategy:**
- Track all your lifts in a training log
- Aim for small, consistent increases (2-5% per week)
- Focus on one variable at a time
- Listen to your body and deload when needed

Remember: Progressive overload doesn't mean going heavier every single workout. Some sessions focus on technique, others on volume. The key is consistent progression over weeks and months.`,
  },
  {
    id: "2",
    title: "Macronutrient Timing for Optimal Performance",
    description: "Discover when and how to eat carbs, protein, and fats for maximum results.",
    category: "nutrition",
    difficulty: "Intermediate",
    readTime: 12,
    rating: 4.7,
    completed: true,
    keyPoints: [
      "Protein timing matters less than total daily intake",
      "Carbs are most beneficial around workouts",
      "Fats should be minimized immediately pre/post workout",
    ],
    content: `Nutrient timing can optimize your training performance and recovery, though total daily intake remains most important.

**Pre-Workout Nutrition (1-3 hours before):**
- 20-40g carbohydrates for energy
- 10-20g protein for muscle protection
- Minimal fat and fiber to avoid digestive issues
- Examples: Banana + protein shake, oatmeal with berries

**Post-Workout Nutrition (within 2 hours):**
- 20-40g high-quality protein for muscle protein synthesis
- 30-60g carbohydrates to replenish glycogen
- Examples: Protein shake + banana, chicken + rice

**Daily Distribution:**
- Spread protein evenly throughout the day (20-30g per meal)
- Time carbs around training for energy and recovery
- Include healthy fats with meals away from workouts

**Key Principles:**
1. Consistency beats perfection
2. Individual tolerance varies
3. Adjust based on training intensity and goals
4. Hydration is equally important as food timing`,
  },
  {
    id: "3",
    title: "Sleep Optimization for Muscle Recovery",
    description: "Master the most underrated aspect of fitness: quality sleep and recovery.",
    category: "recovery",
    difficulty: "Beginner",
    readTime: 10,
    rating: 4.8,
    completed: false,
    keyPoints: [
      "7-9 hours of quality sleep is essential for muscle recovery",
      "Growth hormone peaks during deep sleep phases",
      "Poor sleep negatively impacts protein synthesis and performance",
    ],
    content: `Sleep is when the magic happens. During quality sleep, your body repairs muscle tissue, consolidates motor learning, and releases growth hormone.

**Sleep Optimization Strategies:**

**Environment:**
- Keep bedroom cool (65-68°F)
- Complete darkness (blackout curtains, eye mask)
- Minimize noise or use white noise
- Comfortable, supportive mattress and pillows

**Sleep Hygiene:**
- Consistent sleep/wake times (even on weekends)
- No screens 1 hour before bed
- Avoid caffeine 6+ hours before sleep
- Light dinner 2-3 hours before bed

**Pre-Sleep Routine:**
- 10-15 minutes of light stretching or meditation
- Reading or journaling
- Progressive muscle relaxation
- Consistent routine signals your body it's time to sleep

**Recovery Benefits:**
- Muscle protein synthesis increases during deep sleep
- Growth hormone release peaks in first few hours
- Immune system strengthening
- Mental recovery and stress reduction

Track your sleep quality and notice how it correlates with your training performance and recovery.`,
  },
  {
    id: "4",
    title: "Building Mental Resilience in Training",
    description: "Develop the mindset that separates good athletes from great ones.",
    category: "mindset",
    difficulty: "Advanced",
    readTime: 15,
    rating: 4.6,
    completed: false,
    keyPoints: [
      "Mental resilience is trainable like any physical skill",
      "Visualization and self-talk are powerful performance tools",
      "Embracing discomfort leads to breakthrough moments",
    ],
    content: `Mental resilience is the difference between giving up when things get tough and pushing through to achieve your goals.

**Components of Mental Resilience:**

**1. Growth Mindset**
- View challenges as opportunities to improve
- Embrace failure as feedback, not defeat
- Focus on process over outcome

**2. Visualization Techniques**
- Mental rehearsal of successful lifts
- Visualize overcoming obstacles
- Practice 5-10 minutes daily

**3. Self-Talk Strategies**
- Replace "I can't" with "I'm learning"
- Use positive, present-tense affirmations
- Develop personal power phrases

**4. Stress Inoculation**
- Gradually expose yourself to challenging situations
- Practice breathing techniques under stress
- Build confidence through small wins

**Practical Applications:**
- Set process goals, not just outcome goals
- Celebrate effort and improvement, not just results
- Develop pre-lift routines that build confidence
- Learn from setbacks instead of dwelling on them

Remember: Your mind is your most powerful tool. Train it with the same dedication you train your body.`,
  },
  {
    id: "5",
    title: "Perfect Squat Technique: A Complete Guide",
    description: "Master the king of exercises with proper form, common mistakes, and progressions.",
    category: "technique",
    difficulty: "Beginner",
    readTime: 18,
    rating: 4.9,
    completed: false,
    keyPoints: [
      "Proper setup and bracing are crucial for safe squatting",
      "Depth and knee tracking are key technical points",
      "Progressive loading allows for skill development",
    ],
    content: `The squat is fundamental to human movement and strength training. Master this pattern for better performance and injury prevention.

**Setup and Positioning:**

**Bar Position:**
- High bar: On upper traps, more upright torso
- Low bar: On rear delts, more hip hinge

**Foot Position:**
- Shoulder-width apart or slightly wider
- Toes pointed slightly outward (15-30 degrees)
- Weight distributed across whole foot

**The Descent:**
1. Initiate with hip hinge, not knee bend
2. Keep chest up and core braced
3. Knees track over toes
4. Descend until hip crease below knee cap

**The Ascent:**
1. Drive through whole foot
2. Lead with chest, not hips
3. Maintain knee tracking
4. Exhale forcefully through sticking point

**Common Mistakes:**
- Knee valgus (knees caving in)
- Forward lean/butt wink
- Heel rise
- Inadequate depth
- Poor breathing pattern

**Progression Strategy:**
1. Bodyweight squats (master the pattern)
2. Goblet squats (add load, learn to brace)
3. Front squats (build upper back strength)
4. Back squats (full expression of strength)

Practice mobility work daily and film your squats to assess technique.`,
  },
]

const mockLearningPaths: LearningPath[] = [
  {
    id: "1",
    title: "Strength Training Fundamentals",
    description: "Master the basics of effective strength training",
    articles: ["1", "5"],
    progress: 25,
    estimatedTime: 45,
  },
  {
    id: "2",
    title: "Nutrition Mastery",
    description: "Complete guide to fueling your fitness goals",
    articles: ["2"],
    progress: 100,
    estimatedTime: 30,
  },
  {
    id: "3",
    title: "Recovery & Regeneration",
    description: "Optimize recovery for maximum gains",
    articles: ["3"],
    progress: 0,
    estimatedTime: 25,
  },
]

export default function LearningHub() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const filteredArticles = mockArticles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const completedArticles = mockArticles.filter((article) => article.completed).length
  const totalArticles = mockArticles.length
  const overallProgress = (completedArticles / totalArticles) * 100

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Article Header */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="bg-transparent">
              ← Back to Hub
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <Badge variant="outline">{selectedArticle.difficulty}</Badge>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle.readTime} min read</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{selectedArticle.rating}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedArticle.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{selectedArticle.content}</div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="bg-transparent">
              Save for Later
            </Button>
            <Button
              onClick={() => {
                // Mark as completed
                const updatedArticles = mockArticles.map((article) =>
                  article.id === selectedArticle.id ? { ...article, completed: true } : article,
                )
                console.log("[v0] Article marked as completed:", selectedArticle.title)
              }}
            >
              Mark as Complete
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20 md:pb-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Learning Hub</h1>
          <p className="text-muted-foreground">Master the science and art of fitness</p>

          {/* Progress Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</div>
                  <div className="text-sm text-muted-foreground">Overall Progress</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {completedArticles}/{totalArticles}
                  </div>
                  <div className="text-sm text-muted-foreground">Articles Completed</div>
                </div>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search articles, topics, or techniques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2 whitespace-nowrap bg-transparent"
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Learning Paths */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Learning Paths</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockLearningPaths.map((path) => (
              <Card key={path.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{path.estimatedTime} min total</span>
                    <span className="font-medium">{path.progress}% complete</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                  <Button size="sm" className="w-full flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>{path.progress === 0 ? "Start Path" : "Continue"}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {selectedCategory === "all"
              ? "All Articles"
              : `${categories.find((c) => c.id === selectedCategory)?.label} Articles`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                    {article.completed && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                  </div>
                  <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {article.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} min</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{article.rating}</span>
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="w-full flex items-center space-x-2 bg-transparent">
                    <span>{article.completed ? "Read Again" : "Read Article"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
