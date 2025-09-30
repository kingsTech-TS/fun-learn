"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Settings, Trophy, Target, BookOpen, Clock } from "lucide-react"
import { useBookStore } from "../../../lib/store"

export default function ProfilePage() {
  const { books } = useBookStore()
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    studyGoal: 30,
    notifications: true,
    darkMode: true,
    autoPlay: false,
  })

  const totalBooks = books.length
  const completedBooks = books.filter(
    (book) => book.progress.summary && book.progress.quiz && book.progress.games && book.progress.audio,
  ).length
  const totalQuizzes = books.reduce((sum, book) => sum + (book.quizResults?.length || 0), 0)
  const averageScore =
    books.reduce((sum, book) => {
      const scores = book.quizResults?.map((r) => r.score) || []//property 'quizResults does not exsit ontype Book
      return sum + (scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0)
    }, 0) / (books.length || 1)

  const achievements = [
    { name: "First Book", description: "Uploaded your first book", earned: totalBooks > 0 },
    { name: "Quiz Master", description: "Completed 10 quizzes", earned: totalQuizzes >= 10 },
    {
      name: "Perfect Score",
      description: "Got 100% on a quiz",
      earned: books.some((book) => book.quizResults?.some((r) => r.score === 100)),
    },
    { name: "Game Champion", description: "Played all game types", earned: books.some((book) => book.progress.games) },
    {
      name: "Audio Learner",
      description: "Listened to 5 audio books",
      earned: books.filter((book) => book.progress.audio).length >= 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <Navigation />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile & Settings</h1>
          <p className="text-slate-300">Manage your account and track your learning progress</p>
        </div> 

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600">
              <Trophy className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600">
              <Target className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Daily Study Goal (minutes)</Label>
                  <Input
                    id="goal"
                    type="number"
                    value={profile.studyGoal}
                    onChange={(e) => setProfile((prev) => ({ ...prev, studyGoal: Number.parseInt(e.target.value) }))}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-8 h-8 text-purple-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{totalBooks}</p>
                      <p className="text-slate-400">Total Books</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{completedBooks}</p>
                      <p className="text-slate-400">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{totalQuizzes}</p>
                      <p className="text-slate-400">Quizzes Taken</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-8 h-8 text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{Math.round(averageScore)}%</p>
                      <p className="text-slate-400">Avg Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Learning Progress</CardTitle>
                <CardDescription>Your overall learning journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Books Completed</span>
                    <span className="text-white">
                      {completedBooks}/{totalBooks}
                    </span>
                  </div>
                  <Progress value={(completedBooks / Math.max(totalBooks, 1)) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Daily Goal Progress</span>
                    <span className="text-white">25/{profile.studyGoal} min</span>
                  </div>
                  <Progress value={(25 / profile.studyGoal) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`bg-slate-800/50 border-slate-700 transition-all duration-300 ${achievement.earned ? "ring-2 ring-purple-500" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.earned ? "bg-purple-600" : "bg-slate-600"}`}
                      >
                        <Trophy className={`w-6 h-6 ${achievement.earned ? "text-white" : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${achievement.earned ? "text-white" : "text-slate-400"}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-slate-400 text-sm">{achievement.description}</p>
                        {achievement.earned && <Badge className="mt-2 bg-purple-600 text-white">Earned</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Preferences</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Push Notifications</Label>
                    <p className="text-slate-400 text-sm">Receive reminders and updates</p>
                  </div>
                  <Switch
                    checked={profile.notifications}
                    onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, notifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Dark Mode</Label>
                    <p className="text-slate-400 text-sm">Use dark theme</p>
                  </div>
                  <Switch
                    checked={profile.darkMode}
                    onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, darkMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-white">Auto-play Audio</Label>
                    <p className="text-slate-400 text-sm">Automatically start audio playback</p>
                  </div>
                  <Switch
                    checked={profile.autoPlay}
                    onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, autoPlay: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
