"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { LockScreen } from "@/components/ios/lock-screen"
import { HomeScreen } from "@/components/ios/home-screen"
import { useAppState } from "@/lib/app-state"
import { ControlCenter } from "@/components/ios/control-center/control-center"
import { SwipeDetector } from "@/components/ios/swipe-detector"

import { Clock } from "@/components/ios/ios-clock"
import { Settings } from "@/components/ios/settings"
import { Weather } from "@/components/ios/weather"
import { Calendar } from "@/components/ios/calendar"
import { Camera } from "@/components/ios/camera"
import { Photos } from "@/components/ios/photos"
import { NotesApp } from "@/components/ios/notes/notes-app"
import { MessagesApp } from "@/components/ios/messages/messages-app"
import { SafariApp } from "@/components/ios/safari/safari-app"
import { MusicApp } from "@/components/ios/music/music-app"
import { PhoneApp } from "@/components/ios/phone/phone-app"
import { MapsApp } from "@/components/ios/maps"
import { GameApp } from "@/components/ios/game"
import { ContactApp } from "@/components/ios/contact"
import { FinderApp } from "@/components/ios/finder"
import { CalculatorApp } from "@/components/ios/calculator"
import { AppWrapper } from "@/components/ios/hoc/AppWrapper"

const Apps = {
  clock: AppWrapper(Clock, { title: "Clock" }),
  settings: AppWrapper(Settings, { title: "Settings" }),
  weather: AppWrapper(Weather, { title: "Weather" }),
  calendar: AppWrapper(Calendar, { title: "Calendar" }),
  camera: AppWrapper(Camera, { hideHeader: true }),
  photos: AppWrapper(Photos, { hideHeader: true }),
  notes: AppWrapper(NotesApp, { hideHeader: true }),
  messages: AppWrapper(MessagesApp, { hideHeader: true }),
  safari: AppWrapper(SafariApp, { hideHeader: true }),
  music: AppWrapper(MusicApp, { hideHeader: true }),
  phone: AppWrapper(PhoneApp, { hideHeader: true }),
  maps: AppWrapper(MapsApp, { hideHeader: true }),
  games: AppWrapper(GameApp, { hideHeader: true }),
  contact: AppWrapper(ContactApp, { title: "Contact" }),
  finder: AppWrapper(FinderApp, { hideHeader: true }),
  calculator: AppWrapper(CalculatorApp, { title: "Calculator", hideHeader: true }),
}

export default function IosLayout() {
  const { currentApp, isLocked } = useAppState()
  const [time, setTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const ActiveApp = currentApp ? Apps[currentApp as keyof typeof Apps] : null

  return (
    <div
      className={`
      flex flex-col items-center justify-center h-[100dvh] w-screen overflow-hidden transition-all duration-500 select-none relative bg-transparent
    `}
    >
      <SwipeDetector>
        <div className="relative h-full w-full overflow-hidden">
          <AnimatePresence mode="wait">
            {isLocked ? (
              <motion.div
                key="lock-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <LockScreen time={time} />
              </motion.div>
            ) : ActiveApp ? (
              <motion.div
                key={`app-${currentApp}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 pointer-events-auto z-10"
              >
                <ActiveApp />
              </motion.div>
            ) : (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <HomeScreen time={time} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control Center */}
          <ControlCenter />
        </div>
      </SwipeDetector>
    </div>
  )
}
