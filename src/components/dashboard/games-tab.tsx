"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Sparkles, Clock, Trophy } from "lucide-react"
import { WordPuzzleGame } from "@/components/games/word-puzzle-game"
import { FlashcardsGame } from "@/components/games/flashcards-game"
import { MatchingGame } from "@/components/games/matching-game"
import { motion } from "framer-motion"
import { Book, useBookStore } from "../../../lib/store"

interface GamesTabProps {
  book: Book
}

export function GamesTab({ book }: GamesTabProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeGame, setActiveGame] = useState<string | null>(null)
  const [gamesGenerated, setGamesGenerated] = useState(false)
  const { updateBookProgress } = useBookStore()

  const handleGenerateGames = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      setGamesGenerated(true)
      updateBookProgress(book.id, "games")
      setIsGenerating(false)
    }, 2500)
  }

  const games = [
    {
      id: "word-puzzle",
      title: "Word Puzzle",
      description: "Find hidden words related to the book's key concepts",
      icon: "🧩",
      difficulty: "Easy",
      estimatedTime: "5-10 min",
    },
    {
      id: "flashcards",
      title: "Flashcards",
      description: "Review important terms and definitions",
      icon: "📚",
      difficulty: "Medium",
      estimatedTime: "10-15 min",
    },
    {
      id: "matching",
      title: "Matching Game",
      description: "Match concepts with their definitions or examples",
      icon: "🎯",
      difficulty: "Medium",
      estimatedTime: "8-12 min",
    },
  ]

  if (!book.progress.games && !isGenerating && !gamesGenerated) {
    return (
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Generate Learning Games</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              Create interactive games based on "{book.title}" to make learning fun and engaging.
            </CardDescription>
          </div>
          <Button onClick={handleGenerateGames} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Games
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
            <CardTitle className="text-2xl">Generating Games...</CardTitle>
            <CardDescription className="text-base">
              Creating interactive learning games for "{book.title}".
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

  if (activeGame) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActiveGame(null)} className="gap-2">
            ← Back to Games
          </Button>
          <Badge variant="outline">{games.find((g) => g.id === activeGame)?.title}</Badge>
        </div>

        {activeGame === "word-puzzle" && <WordPuzzleGame book={book} />}
        {activeGame === "flashcards" && <FlashcardsGame book={book} />}
        {activeGame === "matching" && <MatchingGame book={book} />}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Learning Games Ready!</CardTitle>
              <CardDescription>Interactive games generated from "{book.title}"</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="card-hover h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{game.icon}</div>
                  <Badge variant="outline">{game.difficulty}</Badge>
                </div>
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {game.estimatedTime}
                </div>
                <Button onClick={() => setActiveGame(game.id)} className="w-full">
                  Play Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
