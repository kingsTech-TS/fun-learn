"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Headphones, Sparkles, Clock, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { motion } from "framer-motion"
import { Book, useBookStore } from "../../../lib/store"

interface AudioTabProps {
  book: Book
}

export function AudioTab({ book }: AudioTabProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(1847) // Mock duration in seconds
  const [volume, setVolume] = useState([75])
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const { generateAudio } = useBookStore()

  const handleGenerateAudio = async () => {
    setIsGenerating(true)
    setTimeout(() => {
      generateAudio(book.id)
      setIsGenerating(false)
    }, 4000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control actual audio playback
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
    // In a real app, this would seek the audio
  }

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

  if (!book.progress.audio && !isGenerating) {
    return (
      <Card className="text-center p-12">
        <CardContent className="space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Headphones className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Generate Audio Version</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              Convert "{book.title}" to high-quality audio using advanced text-to-speech technology.
            </CardDescription>
          </div>
          <Button onClick={handleGenerateAudio} size="lg" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Audio
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
            <CardTitle className="text-2xl">Generating Audio...</CardTitle>
            <CardDescription className="text-base">
              Converting "{book.title}" to audio format with natural voice synthesis.
            </CardDescription>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            This usually takes 3-5 minutes
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Audio Player */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Headphones className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle>Audio Version Ready!</CardTitle>
              <CardDescription>High-quality audio of "{book.title}"</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider value={[currentTime]} onValueChange={handleSeek} max={duration} step={1} className="w-full" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button onClick={handlePlayPause} size="lg" className="rounded-full w-16 h-16">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
            </Button>
            <Button variant="outline" size="sm">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume and Speed Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Volume</span>
              </div>
              <Slider value={volume} onValueChange={setVolume} max={100} step={1} />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Playback Speed</span>
              <div className="flex gap-1">
                {speedOptions.map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackSpeed === speed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackSpeed(speed)}
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatTime(duration)}</p>
            <p className="text-xs text-muted-foreground">Total listening time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Voice Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Premium</p>
            <p className="text-xs text-muted-foreground">Natural AI voice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Format</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">MP3</p>
            <p className="text-xs text-muted-foreground">High quality audio</p>
          </CardContent>
        </Card>
      </div>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Download Options</CardTitle>
          <CardDescription>Save the audio file for offline listening</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">Download MP3</Button>
            <Button variant="outline">Download M4A</Button>
            <Button variant="outline">Share Link</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
