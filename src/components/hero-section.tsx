"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Brain, Gamepad2, Headphones } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance"
            >
              Transform Books into
              <span className="text-primary block">Interactive Learning</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty"
            >
              Upload any book and instantly generate summaries, quizzes, interactive games, and audio versions. Make
              learning engaging, fun, and effective.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="text-lg px-8 py-6 group" asChild>
              <Link href="/upload">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent" asChild>
              <Link href="/library">View Demo</Link>
            </Button>
          </motion.div>

          {/* Feature icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center items-center gap-8 pt-12"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Summaries</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="p-3 rounded-full bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Quizzes</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="p-3 rounded-full bg-primary/10">
                <Gamepad2 className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Games</span>
            </div>

            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="p-3 rounded-full bg-primary/10">
                <Headphones className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Audio</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
