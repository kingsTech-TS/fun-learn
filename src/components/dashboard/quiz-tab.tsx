"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Clock, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { motion } from "framer-motion"
import { Book, useBookStore } from "../../../lib/store"

interface QuizTabProps {
  book: Book
}

export function QuizTab({ book }: QuizTabProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const { generateQuiz } = useBookStore()

  const handleGenerateQuiz = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      generateQuiz(book.id)
      setIsGenerating(false)
    }, 2500)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (book.quizzes && currentQuestionIndex < book.quizzes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setShowResults(false)
    setQuizStarted(false)
  }

  const calculateScore = () => {
    if (!book.quizzes) return 0
    const correct = selectedAnswers.filter((answer, index) => answer === book.quizzes![index].correctAnswer).length
    return Math.round((correct / book.quizzes.length) * 100)
  }

  if (!book.quizzes && !isGenerating) {
    return (
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Generate Interactive Quiz</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              Create personalized quiz questions based on the key concepts from "{book.title}".
            </CardDescription>
          </div>
          <Button onClick={handleGenerateQuiz} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Quiz
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
            <CardTitle className="text-2xl">Generating Quiz...</CardTitle>
            <CardDescription className="text-base">
              Creating personalized questions based on "{book.title}".
            </CardDescription>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            This usually takes 1-2 minutes
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!quizStarted) {
    return (
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <Brain className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Quiz Ready!</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              Test your knowledge with {book.quizzes?.length} questions about "{book.title}".
            </CardDescription>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              ~5 minutes
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4" />
              {book.quizzes?.length} questions
            </div>
          </div>
          <Button onClick={() => setQuizStarted(true)} size="lg">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === book.quizzes![index].correctAnswer,
    ).length

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
        <Card className="text-center p-8">
          <CardContent className="space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">
                You scored {correctAnswers} out of {book.quizzes?.length} questions
              </CardDescription>
            </div>
            <div className="text-4xl font-bold text-primary">{score}%</div>
            <Button onClick={handleRestartQuiz} variant="outline" className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Answers</h3>
          {book.quizzes?.map((quiz, index) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{quiz.question}</CardTitle>
                  {selectedAnswers[index] === quiz.correctAnswer ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {quiz.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg border ${
                        optionIndex === quiz.correctAnswer
                          ? "bg-green-50 border-green-200 text-green-800"
                          : selectedAnswers[index] === optionIndex
                            ? "bg-red-50 border-red-200 text-red-800"
                            : "bg-muted/50"
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">{quiz.explanation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    )
  }

  const currentQuiz = book.quizzes![currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / book.quizzes!.length) * 100

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {book.quizzes?.length}
              </CardTitle>
              <CardDescription className="text-lg font-semibold text-foreground mt-1">
                {currentQuiz.question}
              </CardDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}%</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {currentQuiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted/50 hover:bg-muted border-border"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button onClick={handlePreviousQuestion} variant="outline" disabled={currentQuestionIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestionIndex] === undefined}>
              {currentQuestionIndex === book.quizzes!.length - 1 ? "Finish Quiz" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
