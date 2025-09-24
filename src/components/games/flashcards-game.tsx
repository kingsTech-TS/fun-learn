"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff, Shuffle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Book } from "../../../lib/store"

interface FlashcardsGameProps {
  book: Book
}

const FLASHCARDS = [
  {
    id: 1,
    front: "Critical Thinking",
    back: "The objective analysis and evaluation of an issue in order to form a judgment.",
  },
  {
    id: 2,
    front: "Learning Objective",
    back: "A statement that describes what learners will be able to do after completing instruction.",
  },
  {
    id: 3,
    front: "Metacognition",
    back: "Awareness and understanding of one's own thought processes.",
  },
  {
    id: 4,
    front: "Active Learning",
    back: "A method of learning in which students are actively engaged in the learning process.",
  },
  {
    id: 5,
    front: "Knowledge Retention",
    back: "The ability to remember and recall information over time.",
  },
  {
    id: 6,
    front: "Cognitive Load",
    back: "The amount of mental effort being used in working memory during learning.",
  },
]

export function FlashcardsGame({ book }: FlashcardsGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<number[]>([])
  const [unknownCards, setUnknownCards] = useState<number[]>([])
  const [shuffledCards, setShuffledCards] = useState(FLASHCARDS)
  const [showStats, setShowStats] = useState(false)

  const currentCard = shuffledCards[currentIndex]
  const progress = ((currentIndex + 1) / shuffledCards.length) * 100

  const handleNext = () => {
    setIsFlipped(false)
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowStats(true)
    }
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleKnown = () => {
    if (!knownCards.includes(currentCard.id)) {
      setKnownCards([...knownCards, currentCard.id])
      setUnknownCards(unknownCards.filter((id) => id !== currentCard.id))
    }
    handleNext()
  }

  const handleUnknown = () => {
    if (!unknownCards.includes(currentCard.id)) {
      setUnknownCards([...unknownCards, currentCard.id])
      setKnownCards(knownCards.filter((id) => id !== currentCard.id))
    }
    handleNext()
  }

  const shuffleCards = () => {
    const shuffled = [...FLASHCARDS].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowStats(false)
  }

  const resetGame = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCards([])
    setUnknownCards([])
    setShowStats(false)
    setShuffledCards(FLASHCARDS)
  }

  if (showStats) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-3xl">Flashcards Complete!</CardTitle>
              <CardDescription className="text-lg">Here's how you did:</CardDescription>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{knownCards.length}</div>
                <div className="text-sm text-green-700">Known</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{unknownCards.length}</div>
                <div className="text-sm text-red-700">Need Review</div>
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={resetGame} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Start Over
              </Button>
              <Button onClick={shuffleCards} variant="outline" className="gap-2 bg-transparent">
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {currentIndex + 1} / {shuffledCards.length}
          </Badge>
          <div className="w-32 bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
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

      {/* Flashcard */}
      <div className="max-w-2xl mx-auto">
        <div className="relative h-80">
          <AnimatePresence mode="wait">
            <motion.div
              key={isFlipped ? "back" : "front"}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Card className="h-full cursor-pointer card-hover" onClick={() => setIsFlipped(!isFlipped)}>
                <CardContent className="h-full flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="text-2xl md:text-3xl font-bold text-balance">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      {isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="text-sm">{isFlipped ? "Click to see term" : "Click to see definition"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation and Actions */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-2 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {isFlipped && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUnknown}
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              Need Review
            </Button>
            <Button onClick={handleKnown} className="bg-green-600 hover:bg-green-700">
              I Know This
            </Button>
          </div>
        )}

        <Button variant="outline" onClick={handleNext} className="gap-2 bg-transparent">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          Known: {knownCards.length}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          Need Review: {unknownCards.length}
        </div>
      </div>
    </div>
  )
}
