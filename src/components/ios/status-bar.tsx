import { useState } from "react"
import { Battery, Signal, Wifi, Play, Pause, SkipForward, Music } from "lucide-react"
import { formatTime } from "@/lib/utils"
import useAudioStore from "@/store/audio"
import { motion, AnimatePresence } from "framer-motion"

interface StatusBarProps {
  time: Date
  dark?: boolean
}

export function StatusBar({ time, dark = false }: StatusBarProps) {
  const { playlist, currentIndex, isPlaying, togglePlay, next } = useAudioStore()
  const currentSong = playlist?.[currentIndex]
  const [expanded, setExpanded] = useState(false)

  const showIsland = Boolean(currentSong && (isPlaying || expanded))

  return (
    <div
      className={`relative flex justify-between items-center px-6 pt-3 pb-1 text-sm font-medium select-none ${
        dark ? "text-white ios26-text-glow" : "text-black"
      }`}
    >
      {/* Time */}
      <div className="z-10">{formatTime(time, false)}</div>

      {/* Dynamic Island Music Pill */}
      {showIsland && (
        <div className="absolute left-1/2 -translate-x-1/2 top-2 z-20 pointer-events-auto">
          <motion.div
            layout
            onClick={() => setExpanded(!expanded)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`bg-black/90 backdrop-blur-xl text-white shadow-xl cursor-pointer overflow-hidden transition-all duration-300 border border-white/10 ${
              expanded
                ? "w-[300px] rounded-[24px] p-3"
                : "w-[170px] h-[30px] rounded-full px-2.5 flex items-center justify-between"
            }`}
          >
            {!expanded ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 min-w-0">
                  {currentSong?.cover ? (
                    <img
                      src={currentSong.cover}
                      alt={currentSong.title}
                      className="w-4 h-4 rounded-full object-cover animate-spin-slow"
                    />
                  ) : (
                    <Music className="w-3.5 h-3.5 text-pink-400" />
                  )}
                  <span className="text-[11px] font-medium truncate max-w-[85px]">
                    {currentSong?.title}
                  </span>
                </div>

                {/* Equalizer Wave Animation */}
                <div className="flex items-end gap-0.5 h-3">
                  <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? "animate-pulse h-3" : "h-1"}`} />
                  <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? "animate-bounce h-2.5" : "h-1.5"}`} />
                  <span className={`w-0.5 bg-green-400 rounded-full ${isPlaying ? "animate-pulse h-3.5" : "h-2"}`} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={currentSong?.cover || "/placeholder.svg"}
                    alt={currentSong?.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-white">
                      {currentSong?.title}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {currentSong?.author}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlay()
                    }}
                    className="p-1.5 bg-white/10 rounded-full hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      next()
                    }}
                    className="p-1.5 bg-white/10 rounded-full hover:bg-white/20"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* System Icons */}
      <div className="flex items-center gap-1.5 z-10">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <Battery className="h-4 w-4" />
      </div>
    </div>
  )
}
