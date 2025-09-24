import { Navigation } from "@/components/navigation"
import { UploadSection } from "@/components/upload-section"

export default function UploadPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">Upload Your Book</h1>
            <p className="text-xl text-muted-foreground text-pretty">
              Drag and drop your book file or click to browse. We support PDF, EPUB, and text formats.
            </p>
          </div>
          <UploadSection />
        </div>
      </main>
    </div>
  )
}
