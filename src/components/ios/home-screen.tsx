"use client"

import { useState, useEffect } from "react"
import { StatusBar } from "@/components/ios/status-bar"
import { AppIcon } from "@/components/ios/app-icon"
import { Widget } from "@/components/ios/widget"
import { AppLibrary } from "@/components/ios/app-library"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { useAppState } from "@/lib/app-state"

interface HomeScreenProps {
  time: Date
}

export function HomeScreen({ time }: HomeScreenProps) {
  const [showAppLibrary, setShowAppLibrary] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const dayOfMonth = time.getDate()
  const { openControlCenter } = useAppState()

  const defaultPage1Apps = [
    { id: "calendar", name: "Calendar", color: "" },
    { id: "photos", name: "Photos", color: "bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400" },
    { id: "camera", name: "Camera", color: "bg-gray-800" },
    { id: "contact", name: "Contact", color: "bg-blue-500" },
    { id: "notes", name: "Notes", color: "bg-yellow-100" },
    { id: "games", name: "Games", color: "bg-purple-500" },
    { id: "finder", name: "Finder", color: "bg-blue-300", customIcon: <img src="/images/finder.png" className="w-full h-full object-contain p-1" alt="Finder" /> },
  ]

  const defaultPage2Apps = [
    { id: "settings", name: "Settings", color: "bg-gray-200" },
    { id: "calculator", name: "Calculator", color: "bg-[#ff9f0a]", customIcon: <div className="text-2xl text-white flex items-center justify-center w-full h-full">±</div> },
    { id: "maps", name: "Maps", color: "bg-white" },
    { id: "appstore", name: "App Store", color: "" },
  ]

  const [page1Apps, setPage1Apps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ios-page1-apps-v3')
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((app: any) => {
            const defaultApp = defaultPage1Apps.find(a => a.id === app.id);
            return { ...app, customIcon: defaultApp?.customIcon };
          });
        } catch (e) {
          return defaultPage1Apps;
        }
      }
    }
    return defaultPage1Apps
  })

  const [page2Apps, setPage2Apps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ios-page2-apps-v3')
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((app: any) => {
            const defaultApp = defaultPage2Apps.find(a => a.id === app.id);
            return { ...app, customIcon: defaultApp?.customIcon };
          });
        } catch (e) {
          return defaultPage2Apps;
        }
      }
    }
    return defaultPage2Apps
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const toSave = page1Apps.map(({ customIcon, ...rest }) => rest);
      localStorage.setItem('ios-page1-apps-v3', JSON.stringify(toSave))
    }
  }, [page1Apps])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const toSave = page2Apps.map(({ customIcon, ...rest }) => rest);
      localStorage.setItem('ios-page2-apps-v3', JSON.stringify(toSave))
    }
  }, [page2Apps])

  // Preload critical SVG icons
  useEffect(() => {
    const preloadIcons = [
      "calendar",
      "photos",
      "camera",
      "mail",
      "notes",
      "reminders",
      "clock",
      "phone",
      "safari",
      "messages",
      "music",
      "maps",
      "settings",
      "appstore",
    ]

    preloadIcons.forEach((icon) => {
      const img = new Image()
      img.src = `/iosicons/${icon}.svg`
    })
  }, [])

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -50 && currentPage < 1) {
      // Swipe left
      setCurrentPage(currentPage + 1)
    } else if (info.offset.x > 50 && currentPage > 0) {
      // Swipe right
      setCurrentPage(currentPage - 1)
    } else if (info.offset.x < -50 && currentPage === 1) {
      // Open App Library from last page
      setShowAppLibrary(true)
    }
  }

  // Add touch handler for swipe down from top
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      if (touchY < 30) {
        // Touch started near the top of the screen
        const handleTouchMove = (moveEvent: TouchEvent) => {
          const currentY = moveEvent.touches[0].clientY
          if (currentY - touchY > 30) {
            // Swiped down at least 30px
            openControlCenter()
            document.removeEventListener("touchmove", handleTouchMove)
          }
        }

        document.addEventListener("touchmove", handleTouchMove, { once: true })
      }
    }

    document.addEventListener("touchstart", handleTouchStart)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
    }
  }, [openControlCenter])

  return (
    <div
      className="h-full w-full flex flex-col relative select-none overflow-hidden"
      style={{
        backgroundImage: `url(/wallpaper.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <StatusBar time={time} dark={false} />

      {/* Pages Container */}
      <motion.div
        className="flex-1 relative"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {currentPage === 0 && (
            <motion.div
              key="page-0"
              className="absolute inset-0 px-6 pt-4 pb-6 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Widgets */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Widget
                  className="ios26-mesh-gradient-1 text-black"
                  title="Weather"
                  content={
                    <div className="text-black">
                      <div className="text-sm">Himachal Pradesh</div>
                      <div className="text-5xl font-light">56°</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-500 text-lg">☀️</span>
                        <span>Sunny</span>
                      </div>
                      <div className="text-xs mt-1">H:77° L:55°</div>
                    </div>
                  }
                />
                <Widget
                  className="ios26-mesh-gradient-2 text-black"
                  title="Calendar"
                  content={
                    <div className="text-black">
                      <div className="text-xs text-red-500 font-bold">MONDAY</div>
                      <div className="text-5xl font-light">{dayOfMonth}</div>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <span className="text-gray-600">🔒</span>
                        <span>2 birthdays</span>
                      </div>
                      <div className="text-xs mt-1 text-red-500 font-medium">
                        Portfolio work s...
                        <br />
                        10 - 10:30AM
                      </div>
                    </div>
                  }
                />
              </div>

              {/* First page app icons using Reorder for drag and drop */}
              <Reorder.Group 
                axis="y" 
                values={page1Apps} 
                onReorder={setPage1Apps} 
                className="grid grid-cols-4 gap-4 mb-6 relative z-10"
              >
                {page1Apps.map((app) => (
                  <Reorder.Item key={app.id} value={app} className="flex justify-center">
                    <AppIcon id={app.id} name={app.name} color={app.color} />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </motion.div>
          )}

          {currentPage === 1 && (
            <motion.div
              key="page-1"
              className="absolute inset-0 px-6 pt-4 pb-6 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {/* Second page app icons using Reorder for drag and drop */}
              <Reorder.Group 
                axis="y" 
                values={page2Apps} 
                onReorder={setPage2Apps} 
                className="grid grid-cols-4 gap-4 mb-6 relative z-10"
              >
                {page2Apps.map((app) => (
                  <Reorder.Item key={app.id} value={app} className="flex justify-center">
                    <AppIcon id={app.id} name={app.name} color={app.color} />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Page Indicators */}
      <div className="flex justify-center mb-2">
        <div className="flex gap-1.5">
          <button
            className={`w-2 h-1.5 rounded-full transition-all duration-300 ${currentPage === 0 ? "bg-white w-6 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/30"}`}
            onClick={() => setCurrentPage(0)}
          />
          <button
            className={`w-2 h-1.5 rounded-full transition-all duration-300 ${currentPage === 1 ? "bg-white w-6 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/30"}`}
            onClick={() => setCurrentPage(1)}
          />
          <button className={`w-2 h-1.5 rounded-full transition-all duration-300 ${showAppLibrary ? "bg-white w-6 shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "bg-white/30"}`} />
        </div>
      </div>

      <div className="ios26-dock mx-4 mb-6 flex justify-between">
        <AppIcon id="phone" name="" color="bg-green-500" />
        <AppIcon id="safari" name="" color="" />
        <AppIcon id="messages" name="" color="" />
        <AppIcon id="music" name="" color="" />
      </div>

      {/* App Library */}
      <AppLibrary isVisible={showAppLibrary} onClose={() => setShowAppLibrary(false)} />
    </div>
  )
}
