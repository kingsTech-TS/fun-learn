"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, BookOpen, Clock, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { Book, useBookStore } from "../../../lib/store"

interface SummaryTabProps {
  book: Book
}

export function SummaryTab({ book }: SummaryTabProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { generateSummary } = useBookStore()

  const handleGenerateSummary = async () => {
    setIsGenerating(true)
    // Simulate generation time
    setTimeout(() => {
      generateSummary(book.id)
      setIsGenerating(false)
    }, 3000)
  }

  if (!book.summary && !isGenerating) {
    return (
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Generate Book Summary</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              Create an AI-powered summary that captures the key concepts, themes, and insights from "{book.title}".
            </CardDescription>
          </div>
          <Button onClick={handleGenerateSummary} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Summary
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isGenerating) {
    return (
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Generating Summary...</CardTitle>
            <CardDescription className="text-base">
              Our AI is analyzing "{book.title}" and creating a comprehensive summary.
            </CardDescription>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            This usually takes 2-3 minutes
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Book Summary</CardTitle>
              <CardDescription>AI-generated summary of "{book.title}"</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-base leading-relaxed">{book.summary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Key Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Education</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Learning</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reading Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12 min</p>
            <p className="text-xs text-muted-foreground">Average reading time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Intermediate</p>
            <p className="text-xs text-muted-foreground">Reading level</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
