"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "./animated-counter"

const stats = [
  { number: 10000, label: "Books Processed", suffix: "+" },
  { number: 50000, label: "Quizzes Generated", suffix: "+" },
  { number: 25000, label: "Hours of Audio", suffix: "+" },
  { number: 95, label: "Learning Improvement", suffix: "%" },
]

export function StatsSection() {
  return (
    <section className="py-20 px-4 bg-card/20 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-balance">Trusted by Learners Worldwide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of students, professionals, and lifelong learners who have transformed their reading
            experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center space-y-2"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary">
                <AnimatedCounter end={stat.number} />
                {stat.suffix}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
