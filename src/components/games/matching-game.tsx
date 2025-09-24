"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, RotateCcw, Clock, Shuffle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Book } from "../../../lib/store"

interface MatchingGameProps {
  book: Book
}

const PAIRS = [
  { id: 1, term: "Critical Thinking", definition: "Objective analysis to form judgment" },
  { id: 2, term: "Metacognition", definition: "Awareness of thought processes" },
  { id: 3, term: "Active Learning", definition: "Engaged learning method" },
  { id: 4, term: "Knowledge Retention", definition: "Ability to remember information" },
  { id: 5, term: "Cognitive Load", definition: "Mental effort in working memory" },
  { id: 6, term: "Learning Objective", definition: "Statement of learning goals" },
]

interface GameCard {
  id: string
  content: string
  pairId: number
  type: "term" | "definition"
  matched: boolean
}

export function MatchingGame({ book }: MatchingGameProps) {
  const [cards, setCards] = useState<GameCard[]>([])
  const [selectedCards, setSelectedCards] = useState<GameCard[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameComplete) {
        setTimeElapsed((prev) => prev + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [gameComplete])

  useEffect(() => {
    if (matchedPairs.length === PAIRS.length) {
      setGameComplete(true)
      const timeBonus = Math.max(0, 300 - timeElapsed) // Bonus for completing under 5 minutes
      const accuracyBonus = Math.max(0, (PAIRS.length * 2 - attempts) * 10)
      setScore(matchedPairs.length * 100 + timeBonus + accuracyBonus)
    }
  }, [matchedPairs, timeElapsed, attempts])

  const initializeGame = () => {
    const gameCards: GameCard[] = []

    PAIRS.forEach((pair) => {
      gameCards.push({
        id: `term-${pair.id}`,
        content: pair.term,
        pairId: pair.id,
        type: "term",
        matched: false,
      })
      gameCards.push({
        id: `def-${pair.id}`,
        content: pair.definition,
        pairId: pair.id,
        type: "definition",
        matched: false,
      })
    })

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }

  const handleCardClick = (card: GameCard) => {
    if (card.matched || selectedCards.length >= 2 || selectedCards.includes(card)) {
      return
    }

    const newSelected = [...selectedCards, card]
    setSelectedCards(newSelected)

    if (newSelected.length === 2) {
      setAttempts((prev) => prev + 1)
      setTimeout(() => {
        checkMatch(newSelected)
      }, 1000)
    }
  }

  const checkMatch = (selected: GameCard[]) => {
    const [card1, card2] = selected

    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
      // Match found
      setMatchedPairs((prev) => [...prev, card1.pairId])
      setCards((prev) => prev.map((card) => (card.pairId === card1.pairId ? { ...card, matched: true } : card)))
    }

    setSelectedCards([])
  }

  const resetGame = () => {
    setMatchedPairs([])
    setSelectedCards([])
    setScore(0)
    setTimeElapsed(0)
    setGameComplete(false)
    setAttempts(0)
    initializeGame()
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setSelectedCards([])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCardStyle = (card: GameCard) => {
    if (card.matched) {
      return "bg-green-100 border-green-300 text-green-800"
    }
    if (selectedCards.includes(card)) {
      return "bg-blue-100 border-blue-300 text-blue-800"
    }
    return "bg-card hover:bg-muted/50 border-border"
  }

  if (gameComplete) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Perfect Match!</CardTitle>
              <CardDescription className="text-lg">
                You matched all pairs in {formatTime(timeElapsed)} with {attempts} attempts
              </CardDescription>
            </div>
            <div className="text-4xl font-bold text-primary">{score} points</div>
            <div className="flex gap-2 justify-center">
              <Button onClick={resetGame} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(timeElapsed)}
          </Badge>
          <Badge variant="outline">
            Matches: {matchedPairs.length}/{PAIRS.length}
          </Badge>
          <Badge variant="outline">Attempts: {attempts}</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={shuffleCards} size="sm" className="gap-2 bg-transparent">
            <Shuffle className="h-4 w-4" />
            Shuffle
          </Button>
          <Button variant="outline" onClick={resetGame} size="sm" className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Match Terms with Definitions</CardTitle>
          <CardDescription>Click on cards to match terms with their corresponding definitions</CardDescription>
        </CardHeader>
      </Card>

      {/* Game Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: card.matched ? 1 : 1.02 }}
              whileTap={{ scale: card.matched ? 1 : 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all h-32 ${getCardStyle(card)} ${
                  card.matched ? "cursor-default" : "card-hover"
                }`}
                onClick={() => handleCardClick(card)}
              >
                <CardContent className="p-4 h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-balance leading-tight">{card.content}</div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {card.type === "term" ? "Term" : "Definition"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
