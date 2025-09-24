"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Search, Grid3X3, List, Plus, Calendar, FileText, Brain, Gamepad2, Headphones } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useBookStore } from "../../lib/store"

export function LibrarySection() {
  const { books } = useBookStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getProgressPercentage = (book: any) => {
    const completed = Object.values(book.progress).filter(Boolean).length
    const total = Object.keys(book.progress).length
    return (completed / total) * 100
  }

  const getProgressColor = (percentage: number) => {
    if (percentage === 100) return "text-green-600"
    if (percentage >= 50) return "text-yellow-600"
    return "text-blue-600"
  }

  if (books.length === 0) {
    return (
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Your Library is Empty</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              Upload your first book to start your learning journey with AI-powered summaries, quizzes, and more.
            </CardDescription>
          </div>
          <Button size="lg" asChild>
            <Link href="/upload">
              <Plus className="mr-2 h-4 w-4" />
              Upload Your First Book
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Library Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{books.length}</p>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Brain className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {books.filter((book) => getProgressPercentage(book) === 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {
                    books.filter((book) => {
                      const uploadDate = new Date(book.uploadDate)
                      const weekAgo = new Date()
                      weekAgo.setDate(weekAgo.getDate() - 7)
                      return uploadDate > weekAgo
                    }).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent>
            <p className="text-muted-foreground">No books found matching your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredBooks.map((book, index) => {
            const progressPercentage = getProgressPercentage(book)
            const progressColor = getProgressColor(progressPercentage)

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {viewMode === "grid" ? (
                  <Card className="card-hover h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                          <CardDescription>by {book.author}</CardDescription>
                        </div>
                        <Badge variant="outline" className={progressColor}>
                          {Math.round(progressPercentage)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(book.uploadDate).toLocaleDateString()}
                        <span>•</span>
                        <span>{book.fileSize}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {book.progress.summary && (
                          <div className="p-1 rounded bg-green-100">
                            <FileText className="h-3 w-3 text-green-600" />
                          </div>
                        )}
                        {book.progress.quiz && (
                          <div className="p-1 rounded bg-blue-100">
                            <Brain className="h-3 w-3 text-blue-600" />
                          </div>
                        )}
                        {book.progress.games && (
                          <div className="p-1 rounded bg-purple-100">
                            <Gamepad2 className="h-3 w-3 text-purple-600" />
                          </div>
                        )}
                        {book.progress.audio && (
                          <div className="p-1 rounded bg-orange-100">
                            <Headphones className="h-3 w-3 text-orange-600" />
                          </div>
                        )}
                      </div>

                      <Button asChild className="w-full">
                        <Link href={`/book/${book.id}`}>Open Book</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-lg">{book.title}</h3>
                            <p className="text-muted-foreground">by {book.author}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(book.uploadDate).toLocaleDateString()}
                              </div>
                              <span>{book.fileSize}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right space-y-1">
                            <Badge variant="outline" className={progressColor}>
                              {Math.round(progressPercentage)}%
                            </Badge>
                            <div className="flex items-center gap-1">
                              {book.progress.summary && (
                                <div className="p-1 rounded bg-green-100">
                                  <FileText className="h-3 w-3 text-green-600" />
                                </div>
                              )}
                              {book.progress.quiz && (
                                <div className="p-1 rounded bg-blue-100">
                                  <Brain className="h-3 w-3 text-blue-600" />
                                </div>
                              )}
                              {book.progress.games && (
                                <div className="p-1 rounded bg-purple-100">
                                  <Gamepad2 className="h-3 w-3 text-purple-600" />
                                </div>
                              )}
                              {book.progress.audio && (
                                <div className="p-1 rounded bg-orange-100">
                                  <Headphones className="h-3 w-3 text-orange-600" />
                                </div>
                              )}
                            </div>
                          </div>

                          <Button asChild>
                            <Link href={`/book/${book.id}`}>Open</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
