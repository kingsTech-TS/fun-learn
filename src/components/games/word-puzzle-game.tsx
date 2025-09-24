"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, RotateCcw, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"
import { Book } from "../../../lib/store"

interface WordPuzzleGameProps {
  book: Book
}

const WORDS = ["LEARNING", "EDUCATION", "KNOWLEDGE", "STUDY", "WISDOM", "GROWTH", "INSIGHT", "CONCEPT"]
const GRID_SIZE = 12

export function WordPuzzleGame({ book }: WordPuzzleGameProps) {
  const [grid, setGrid] = useState<string[][]>([])
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  useEffect(() => {
    generateGrid()
    const timer = setInterval(() => {
      if (!gameComplete) {
        setTimeElapsed((prev) => prev + 1)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [gameComplete])

  useEffect(() => {
    if (foundWords.length === WORDS.length) {
      setGameComplete(true)
    }
  }, [foundWords])

  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(""))

    // Place words randomly
    WORDS.forEach((word) => {
      let placed = false
      let attempts = 0
      while (!placed && attempts < 100) {
        const direction = Math.floor(Math.random() * 3) // 0: horizontal, 1: vertical, 2: diagonal
        const row = Math.floor(Math.random() * GRID_SIZE)
        const col = Math.floor(Math.random() * GRID_SIZE)

        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction)
          placed = true
        }
        attempts++
      }
    })

    // Fill empty cells with random letters
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j] === "") {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        }
      }
    }

    setGrid(newGrid)
  }

  const canPlaceWord = (grid: string[][], word: string, row: number, col: number, direction: number) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal
    ]
    const [dRow, dCol] = directions[direction]

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow
      const newCol = col + i * dCol
      if (
        newRow >= GRID_SIZE ||
        newCol >= GRID_SIZE ||
        (grid[newRow][newCol] !== "" && grid[newRow][newCol] !== word[i])
      ) {
        return false
      }
    }
    return true
  }

  const placeWord = (grid: string[][], word: string, row: number, col: number, direction: number) => {
    const directions = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diagonal
    ]
    const [dRow, dCol] = directions[direction]

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow
      const newCol = col + i * dCol
      grid[newRow][newCol] = word[i]
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCells((prev) => [...prev, { row, col }])
    } else {
      setSelectedCells([{ row, col }])
      setIsSelecting(true)
    }
  }

  const handleMouseUp = () => {
    if (selectedCells.length > 1) {
      checkForWord()
    }
    setIsSelecting(false)
  }

  const checkForWord = () => {
    const selectedLetters = selectedCells.map(({ row, col }) => grid[row][col]).join("")
    const reversedLetters = selectedLetters.split("").reverse().join("")

    const foundWord = WORDS.find((word) => word === selectedLetters || word === reversedLetters)

    if (foundWord && !foundWords.includes(foundWord)) {
      setFoundWords((prev) => [...prev, foundWord])
      setScore((prev) => prev + foundWord.length * 10)
    }

    setSelectedCells([])
  }

  const resetGame = () => {
    setFoundWords([])
    setScore(0)
    setTimeElapsed(0)
    setGameComplete(false)
    generateGrid()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col)
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
              <CardTitle className="text-3xl">Puzzle Complete!</CardTitle>
              <CardDescription className="text-lg">
                You found all {WORDS.length} words in {formatTime(timeElapsed)}
              </CardDescription>
            </div>
            <div className="text-4xl font-bold text-primary">{score} points</div>
            <Button onClick={resetGame} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Play Again
            </Button>
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
          <Badge variant="outline" className="gap-1">
            <Trophy className="h-3 w-3" />
            {score} points
          </Badge>
        </div>
        <Button variant="outline" onClick={resetGame} size="sm" className="gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Word Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Find the Hidden Words</CardTitle>
              <CardDescription>Click and drag to select words in any direction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-1 max-w-2xl mx-auto" onMouseUp={handleMouseUp}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-8 h-8 text-sm font-mono border rounded transition-colors ${
                        isCellSelected(rowIndex, colIndex)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onMouseEnter={() => {
                        if (isSelecting) {
                          setSelectedCells((prev) => [...prev, { row: rowIndex, col: colIndex }])
                        }
                      }}
                    >
                      {cell}
                    </button>
                  )),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Words List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Words to Find</CardTitle>
              <CardDescription>
                {foundWords.length}/{WORDS.length} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {WORDS.map((word) => (
                  <div
                    key={word}
                    className={`p-2 rounded text-sm font-mono ${
                      foundWords.includes(word)
                        ? "bg-green-100 text-green-800 line-through"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {word}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Hint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Words can be horizontal, vertical, or diagonal. They may also be spelled backwards!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
