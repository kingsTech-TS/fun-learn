"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Brain, Gamepad2, Headphones, Sparkles, FileText } from "lucide-react"
import { SummaryTab } from "@/components/dashboard/summary-tab"
import { QuizTab } from "@/components/dashboard/quiz-tab"
import { GamesTab } from "@/components/dashboard/games-tab"
import { AudioTab } from "@/components/dashboard/audio-tab"
import { motion } from "framer-motion"
import { Book, useBookStore } from "../../lib/store"

interface BookDashboardProps {
  book: Book
}

export function BookDashboard({ book }: BookDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { updateBookProgress } = useBookStore()

  const progressCount = Object.values(book.progress).filter(Boolean).length
  const totalFeatures = Object.keys(book.progress).length
  const progressPercentage = (progressCount / totalFeatures) * 100

  const features = [
    {
      id: "summary",
      title: "Summary",
      description: "AI-generated book summary",
      icon: BookOpen,
      completed: book.progress.summary,
      available: true,
    },
    {
      id: "quiz",
      title: "Quiz",
      description: "Interactive knowledge test",
      icon: Brain,
      completed: book.progress.quiz,
      available: true,
    },
    {
      id: "games",
      title: "Games",
      description: "Learning games and activities",
      icon: Gamepad2,
      completed: book.progress.games,
      available: true,
    },
    {
      id: "audio",
      title: "Audio",
      description: "Text-to-speech conversion",
      icon: Headphones,
      completed: book.progress.audio,
      available: true,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Book Info Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{book.title}</CardTitle>
              <CardDescription className="text-base">
                by {book.author} • {book.fileSize} • Uploaded {new Date(book.uploadDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {progressCount}/{totalFeatures} Features
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Learning Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-3 progress-glow" />
          </div>
        </CardContent>
      </Card>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="overview" className="flex flex-col gap-1 py-3">
            <FileText className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <TabsTrigger key={feature.id} value={feature.id} className="flex flex-col gap-1 py-3">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{feature.title}</span>
                {feature.completed && <div className="w-1 h-1 bg-green-500 rounded-full" />}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="card-hover h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </div>
                        </div>
                        {feature.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Complete
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setActiveTab(feature.id)}
                        variant={feature.completed ? "outline" : "default"}
                        className="w-full"
                      >
                        {feature.completed ? "View" : "Generate"} {feature.title}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <SummaryTab book={book} />
        </TabsContent>

        <TabsContent value="quiz">
          <QuizTab book={book} />
        </TabsContent>

        <TabsContent value="games">
          <GamesTab book={book} />
        </TabsContent>

        <TabsContent value="audio">
          <AudioTab book={book} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
