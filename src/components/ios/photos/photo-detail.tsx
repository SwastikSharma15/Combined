"use client"

import { useState } from "react"
import { ArrowLeft, Share2, Heart, Trash2, MoreHorizontal } from "lucide-react"

interface PhotoDetailProps {
  photo: {
    id: string
    url: string
    timestamp: number
  }
  onBack: () => void
  onDelete: (id: string) => void
}

export function PhotoDetail({ photo, onBack, onDelete }: PhotoDetailProps) {
  const [showControls, setShowControls] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const handleImageClick = () => {
    setShowControls(!showControls)
  }

  return (
    <div className="h-full w-full bg-black flex flex-col relative select-none">
      {/* Header */}
      {showControls && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="Favorite"
            >
              <Heart className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="Delete"
            >
              <Trash2 className="h-5 w-5 text-white" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all shadow-md"
              aria-label="More"
            >
              <MoreHorizontal className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Photo */}
      <div className="flex-1 flex items-center justify-center p-2" onClick={handleImageClick}>
        <img
          src={photo.url || "/placeholder.svg"}
          alt={`Photo from ${formatDate(photo.timestamp)}`}
          className="max-h-full max-w-full object-contain select-none"
        />
      </div>

      {/* Footer */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-md">
            {formatDate(photo.timestamp)}
          </span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-center text-white">Delete Photo</h3>
            </div>
            <div className="p-5">
              <p className="text-center mb-5 text-gray-300 text-sm">Are you sure you want to delete this photo?</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors"
                  onClick={() => {
                    onDelete(photo.id)
                    setIsDeleteDialogOpen(false)
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
