"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Book {
  id: string
  title: string
  author: string
  uploadDate: string
  fileSize: string
  summary?: string
  quizzes?: Quiz[]
  audioUrl?: string
  quizResults?: QuizResult[]   // 👈 NEW: track quiz attempts
  progress: {
    summary: boolean
    quiz: boolean
    games: boolean
    audio: boolean
  }
}

export interface Quiz {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface QuizResult {
  score: number
  date: string
}

interface BookStore {
  books: Book[]
  currentBook: Book | null
  addBook: (book: Omit<Book, "id" | "uploadDate" | "progress" | "quizResults">) => void
  setCurrentBook: (book: Book | null) => void
  updateBookProgress: (bookId: string, feature: keyof Book["progress"], value?: boolean) => void
  generateSummary: (bookId: string) => void
  generateQuiz: (bookId: string) => void
  generateAudio: (bookId: string) => void
  generateGames: (bookId: string) => void
  addQuizResult: (bookId: string, score: number) => void   // 👈 NEW
  removeBook: (bookId: string) => void
  clearLibrary: () => void
}

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      books: [],
      currentBook: null,

      addBook: (bookData) => {
        const newBook: Book = {
          ...bookData,
          id: Math.random().toString(36).substr(2, 9),
          uploadDate: new Date().toISOString(),
          quizResults: [],   // 👈 start empty
          progress: {
            summary: false,
            quiz: false,
            games: false,
            audio: false,
          },
        }
        set((state) => ({
          books: [...state.books, newBook],
          currentBook: newBook,
        }))
      },

      setCurrentBook: (book) => set({ currentBook: book }),

      updateBookProgress: (bookId, feature, value = true) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? { ...book, progress: { ...book.progress, [feature]: value } }
              : book,
          ),
        }))
      },

      generateSummary: (bookId) => {
        const mockSummary =
          "This is a comprehensive summary of the book covering key concepts, main themes, and important takeaways."

        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? { ...book, summary: mockSummary, progress: { ...book.progress, summary: true } }
              : book,
          ),
        }))
      },

      generateQuiz: (bookId) => {
        const mockQuizzes: Quiz[] = [
          {
            id: "1",
            question: "What is the main theme of this book?",
            options: ["Adventure", "Romance", "Education", "Mystery"],
            correctAnswer: 2,
            explanation: "The book focuses primarily on educational concepts and learning methodologies.",
          },
          {
            id: "2",
            question: "Which concept is emphasized throughout the chapters?",
            options: ["Critical thinking", "Memorization", "Speed reading", "Note-taking"],
            correctAnswer: 0,
            explanation: "Critical thinking is a recurring theme that helps readers analyze complex topics.",
          },
        ]

        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? { ...book, quizzes: mockQuizzes, progress: { ...book.progress, quiz: true } }
              : book,
          ),
        }))
      },

      generateAudio: (bookId) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? { ...book, audioUrl: "/placeholder-audio.mp3", progress: { ...book.progress, audio: true } }
              : book,
          ),
        }))
      },

      generateGames: (bookId) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId ? { ...book, progress: { ...book.progress, games: true } } : book,
          ),
        }))
      },

      addQuizResult: (bookId, score) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? {
                  ...book,
                  quizResults: [
                    ...(book.quizResults || []),
                    { score, date: new Date().toISOString() },
                  ],
                }
              : book,
          ),
        }))
      },

      removeBook: (bookId) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
          currentBook: get().currentBook?.id === bookId ? null : get().currentBook,
        }))
      },

      clearLibrary: () => set({ books: [], currentBook: null }),
    }),
    { name: "edulearn-storage" },
  ),
)
