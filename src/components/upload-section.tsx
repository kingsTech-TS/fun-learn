"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useBookStore } from "../../lib/store"

interface UploadedFile {
  file: File
  progress: number
  status: "uploading" | "processing" | "complete" | "error"
  id: string
}

export function UploadSection() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [bookTitle, setBookTitle] = useState("")
  const [bookAuthor, setBookAuthor] = useState("")
  const { addBook } = useBookStore()
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
      id: Math.random().toString(36).substr(2, 9),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile.id)
    })
  }, [])

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15

      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress: Math.min(progress, 100),
                status: progress >= 100 ? "processing" : "uploading",
              }
            : file,
        ),
      )

      if (progress >= 100) {
        clearInterval(interval)
        // Simulate processing time
        setTimeout(() => {
          setUploadedFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, status: "complete" } : file)))
        }, 2000)
      }
    }, 200)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/epub+zip": [".epub"],
      "text/plain": [".txt"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: true,
  })

  const handleSaveBook = (uploadedFile: UploadedFile) => {
    if (uploadedFile.status !== "complete") return

    const title = bookTitle || uploadedFile.file.name.replace(/\.[^/.]+$/, "")
    const author = bookAuthor || "Unknown Author"

    addBook({//Argument of type is not assignabe
      title,
      author,
      fileSize: formatFileSize(uploadedFile.file.size),
    })

    // Reset form
    setBookTitle("")
    setBookAuthor("")
    setUploadedFiles((prev) => prev.filter((f) => f.id !== uploadedFile.id))

    // Navigate to library
    router.push("/library")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-primary" />
    }
  }

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing..."
      case "complete":
        return "Ready to save"
      case "error":
        return "Upload failed"
    }
  }

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <CardContent className="p-12">
          <div
            {...getRootProps()}
            className={`text-center space-y-4 cursor-pointer transition-colors ${
              isDragActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <input {...getInputProps()} />
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {isDragActive ? "Drop your books here" : "Upload your books"}
              </h3>
              <p className="text-muted-foreground">Drag and drop files here, or click to browse</p>
              <p className="text-sm text-muted-foreground">Supports PDF, EPUB, TXT, DOC, and DOCX files</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Details Form */}
      {uploadedFiles.some((f) => f.status === "complete") && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h3 className="text-lg font-semibold">Book Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                placeholder="Enter book title"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Enter author name"
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Uploaded Files</h3>
            <div className="space-y-3">
              {uploadedFiles.map((uploadedFile) => (
                <motion.div
                  key={uploadedFile.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(uploadedFile.status)}
                        <div>
                          <p className="font-medium text-foreground">{uploadedFile.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(uploadedFile.file.size)} • {getStatusText(uploadedFile.status)}
                          </p>
                        </div>
                      </div>

                      {uploadedFile.status === "complete" && (
                        <Button onClick={() => handleSaveBook(uploadedFile)}>Save to Library</Button>
                      )}
                    </div>

                    {(uploadedFile.status === "uploading" || uploadedFile.status === "processing") && (
                      <div className="mt-3">
                        <Progress value={uploadedFile.progress} className="h-2" />
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
