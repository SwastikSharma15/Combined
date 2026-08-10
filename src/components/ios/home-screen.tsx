"use client"

import { useState, useEffect, useRef } from "react"
import { StatusBar } from "@/components/ios/status-bar"
import { AppIcon } from "@/components/ios/app-icon"
import { Widget } from "@/components/ios/widget"
import { AppLibrary } from "@/components/ios/app-library"
import { motion, AnimatePresence } from "framer-motion"
import { useAppState } from "@/lib/app-state"

interface HomeScreenProps {
  time: Date
}

export function HomeScreen({ time }: HomeScreenProps) {
  const [showAppLibrary, setShowAppLibrary] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const edgeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isEdgeSwitchingRef = useRef(false)

  const dayOfMonth = time.getDate()
  const { openControlCenter } = useAppState()

  const defaultPage1Apps: { id: string; name: string; color: string; customIcon?: React.ReactNode }[] = [
    { id: "calendar", name: "Calendar", color: "" },
    { id: "photos", name: "Photos", color: "" },
    { id: "camera", name: "Camera", color: "" },
    { id: "contact", name: "Contact", color: "" },
    { id: "notes", name: "Notes", color: "" },
    { id: "games", name: "Games", color: "" },
    { id: "messages", name: "Messages", color: "" },
  ]

  const defaultPage2Apps = [
    { id: "settings", name: "Settings", color: "" },
    { id: "calculator", name: "Calculator", color: "", customIcon: <div className="text-2xl text-white flex items-center justify-center w-full h-full">±</div> },
    { id: "maps", name: "Maps", color: "" },
  ]

  const dedupe = (list: any[]) => {
    const seen = new Set()
    return list.filter((item) => {
      if (!item || !item.id || seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  }

  const [page1Apps, setPage1Apps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ios-page1-apps-v5')
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const mapped = parsed.map((app: any) => {
            const defaultApp = defaultPage1Apps.find(a => a.id === app.id);
            return { ...app, color: "", customIcon: defaultApp?.customIcon };
          });
          return dedupe(mapped);
        } catch (e) {
          return defaultPage1Apps;
        }
      }
    }
    return defaultPage1Apps
  })

  const [page2Apps, setPage2Apps] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ios-page2-apps-v5')
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const mapped = parsed.map((app: any) => {
            const defaultApp = defaultPage2Apps.find(a => a.id === app.id);
            return { ...app, color: "", customIcon: defaultApp?.customIcon };
          });
          return dedupe(mapped);
        } catch (e) {
          return defaultPage2Apps;
        }
      }
    }
    return defaultPage2Apps
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clean = dedupe(page1Apps);
      const toSave = clean.map(({ customIcon, ...rest }) => rest);
      localStorage.setItem('ios-page1-apps-v5', JSON.stringify(toSave))
    }
  }, [page1Apps])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const clean = dedupe(page2Apps);
      const toSave = clean.map(({ customIcon, ...rest }) => rest);
      localStorage.setItem('ios-page2-apps-v5', JSON.stringify(toSave))
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
    ]

    preloadIcons.forEach((icon) => {
      const img = new Image()
      img.src = `/iosicons/${icon}.svg`
    })
  }, [])

  const clearEdgeTimer = () => {
    if (edgeTimerRef.current) {
      clearTimeout(edgeTimerRef.current)
      edgeTimerRef.current = null
    }
  }

  const handleAppDrag = (appId: string, event: any, info: any) => {
    const pointerX = info.point.x
    const pointerY = info.point.y
    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 375

    // --- 1. Edge Screen Switching (Hovering within 22% of screen edge) ---
    const isRightEdge = pointerX > screenWidth * 0.78
    const isLeftEdge = pointerX < screenWidth * 0.22

    if (isRightEdge && currentPage === 0 && !isEdgeSwitchingRef.current) {
      if (!edgeTimerRef.current) {
        edgeTimerRef.current = setTimeout(() => {
          isEdgeSwitchingRef.current = true
          setPage1Apps((prev1) => {
            const draggedApp = prev1.find((a) => a.id === appId)
            if (!draggedApp) return prev1
            const new1 = prev1.filter((a) => a.id !== appId)
            setPage2Apps((prev2) => dedupe([...prev2.filter((a) => a.id !== appId), draggedApp]))
            return new1
          })
          setCurrentPage(1)
          setTimeout(() => {
            isEdgeSwitchingRef.current = false
          }, 400)
        }, 300)
      }
    } else if (isLeftEdge && currentPage === 1 && !isEdgeSwitchingRef.current) {
      if (!edgeTimerRef.current) {
        edgeTimerRef.current = setTimeout(() => {
          isEdgeSwitchingRef.current = true
          setPage2Apps((prev2) => {
            const draggedApp = prev2.find((a) => a.id === appId)
            if (!draggedApp) return prev2
            const new2 = prev2.filter((a) => a.id !== appId)
            setPage1Apps((prev1) => dedupe([...prev1.filter((a) => a.id !== appId), draggedApp]))
            return new2
          })
          setCurrentPage(0)
          setTimeout(() => {
            isEdgeSwitchingRef.current = false
          }, 400)
        }, 300)
      }
    } else {
      clearEdgeTimer()
    }

    // --- 2. 2D Fluid Grid Swap within Current Page ---
    const currentApps = currentPage === 0 ? page1Apps : page2Apps
    const setApps = currentPage === 0 ? setPage1Apps : setPage2Apps

    for (const item of currentApps) {
      if (item.id === appId) continue
      const el = document.getElementById(`app-slot-${item.id}`)
      if (!el) continue

      const rect = el.getBoundingClientRect()
      if (
        pointerX >= rect.left &&
        pointerX <= rect.right &&
        pointerY >= rect.top &&
        pointerY <= rect.bottom
      ) {
        setApps((prev) => {
          const clean = dedupe(prev)
          const fromIndex = clean.findIndex((a) => a.id === appId)
          const toIndex = clean.findIndex((a) => a.id === item.id)
          if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return clean

          const updated = [...clean]
          const [moved] = updated.splice(fromIndex, 1)
          updated.splice(toIndex, 0, moved)
          return updated
        })
        break
      }
    }
  }

  const handleAppDragEnd = () => {
    setActiveDragId(null)
    clearEdgeTimer()
  }

  const handlePageDragEnd = (event: any, info: any) => {
    if (activeDragId) return // Ignore page swipe when dragging an icon

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
      <div className="h-7" />

      {/* Pages Container */}
      <motion.div
        className="flex-1 relative"
        drag={activeDragId ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handlePageDragEnd}
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

              {/* First page app icons with 2D fluid grid layout */}
              <div className="grid grid-cols-4 gap-4 mb-6 relative z-10">
                {page1Apps.map((app) => (
                  <motion.div
                    key={app.id}
                    id={`app-slot-${app.id}`}
                    layout={activeDragId === app.id ? false : "position"}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    drag
                    dragSnapToOrigin
                    dragElastic={0.1}
                    onDragStart={() => setActiveDragId(app.id)}
                    onDrag={(e, info) => handleAppDrag(app.id, e, info)}
                    onDragEnd={handleAppDragEnd}
                    className="flex justify-center touch-none relative"
                    style={{ zIndex: activeDragId === app.id ? 50 : 1 }}
                  >
                    <AppIcon id={app.id} name={app.name} color={app.color} />
                  </motion.div>
                ))}
              </div>
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
              {/* Second page app icons with 2D fluid grid layout */}
              <div className="grid grid-cols-4 gap-4 mb-6 relative z-10">
                {page2Apps.map((app) => (
                  <motion.div
                    key={app.id}
                    id={`app-slot-${app.id}`}
                    layout={activeDragId === app.id ? false : "position"}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    drag
                    dragSnapToOrigin
                    dragElastic={0.1}
                    onDragStart={() => setActiveDragId(app.id)}
                    onDrag={(e, info) => handleAppDrag(app.id, e, info)}
                    onDragEnd={handleAppDragEnd}
                    className="flex justify-center touch-none relative"
                    style={{ zIndex: activeDragId === app.id ? 50 : 1 }}
                  >
                    <AppIcon id={app.id} name={app.name} color={app.color} />
                  </motion.div>
                ))}
              </div>
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
        <AppIcon id="finder" name="" color="" />
        <AppIcon id="music" name="" color="" />
      </div>

      {/* App Library */}
      <AppLibrary isVisible={showAppLibrary} onClose={() => setShowAppLibrary(false)} />
    </div>
  )
}
