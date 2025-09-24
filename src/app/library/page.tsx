import { Navigation } from "@/components/navigation"
import { LibrarySection } from "@/components/library-section"

export default function LibraryPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">Your Library</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Manage your uploaded books and track your learning progress.
            </p>
          </div>
          <LibrarySection />
        </div>
      </main>
    </div>
  )
}
