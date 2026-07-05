"use client"

import useAudioStore from "@/store/audio"
import { Play, Pause, SkipBack, SkipForward, List } from "lucide-react"
import { useState } from "react"
import { QueueView } from "./queue-view"
import { FullScreenPlayer } from "./full-screen-player"

export function MusicPlayer() {
  const [showQueue, setShowQueue] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { 
    playlist, 
    currentIndex, 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlay, 
    next, 
    prev, 
    seek 
  } = useAudioStore()

  const currentSong = playlist?.[currentIndex]

  if (!currentSong) return null

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const progressBarWidth = progressBar.clientWidth
    const percentage = clickPosition / progressBarWidth

    seek(percentage * duration)
  }

  return (
    <>
      <div 
        className="border-t bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsFullScreen(true)}
      >
        <div className="flex items-center gap-4">
          <img
            src={currentSong.cover || "/placeholder.svg?height=48&width=48"}
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=48&width=48"
            }}
          />

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{currentSong.title}</div>
            <div className="text-xs text-gray-500 truncate">{currentSong.author}</div>
          </div>

          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button className="text-gray-400" onClick={() => setShowQueue(true)}>
              <List className="h-5 w-5" />
            </button>
            <button className="text-gray-400" onClick={prev}>
              <SkipBack className="h-6 w-6" />
            </button>
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center`}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <button className="text-gray-400" onClick={next}>
              <SkipForward className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer" onClick={handleProgressClick}>
          <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Queue View */}
      <QueueView isOpen={showQueue} onClose={() => setShowQueue(false)} />

      {/* Full Screen Player */}
      <FullScreenPlayer isOpen={isFullScreen} onClose={() => setIsFullScreen(false)} />
    </>
  )
}
