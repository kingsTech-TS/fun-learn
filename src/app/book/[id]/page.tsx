"use client"

import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { BookDashboard } from "@/components/book-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useBookStore } from "../../../../lib/store"

export default function BookPage() {
  const params = useParams()
  const { books } = useBookStore()
  const book = books.find((b) => b.id === params.id)

  if (!book) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center space-y-4">
              <h1 className="text-2xl font-bold">Book Not Found</h1>
              <p className="text-muted-foreground">The book you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/library">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Library
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/library">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-balance">{book.title}</h1>
              <p className="text-muted-foreground">by {book.author}</p>
            </div>
          </div>
          <BookDashboard book={book} />
        </div>
      </main>
    </div>
  )
}
