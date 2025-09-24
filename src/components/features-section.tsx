"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, Gamepad2, Headphones, Upload, Zap } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Upload,
    title: "Easy Book Upload",
    description: "Drag and drop any book file. We support PDF, EPUB, and text formats with instant processing.",
  },
  {
    icon: BookOpen,
    title: "Smart Summaries",
    description: "AI-powered summaries that capture key concepts, themes, and insights from your books.",
  },
  {
    icon: Brain,
    title: "Interactive Quizzes",
    description: "Generate custom quizzes with multiple choice questions to test your understanding.",
  },
  {
    icon: Gamepad2,
    title: "Learning Games",
    description: "Word puzzles, flashcards, and matching games make learning fun and memorable.",
  },
  {
    icon: Headphones,
    title: "Audio Versions",
    description: "Convert your books to audio format for learning on-the-go or accessibility.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "All features are generated instantly with our advanced AI processing pipeline.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Everything You Need to Learn Better</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Transform any book into a complete learning experience with our comprehensive suite of educational tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover h-full bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <div className="p-2 w-fit rounded-lg bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
