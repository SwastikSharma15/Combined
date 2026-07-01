"use client"

import { motion } from "framer-motion"
import { useAppState } from "@/lib/app-state"
import Image from "next/image"
import type { ReactNode } from "react"

interface AppIconProps {
  id: string
  name: string
  color: string
  icon?: string | ReactNode
  customIcon?: ReactNode
  size?: "normal" | "small"
}

export function AppIcon({ id, name, color, icon, customIcon, size = "normal" }: AppIconProps) {
  const { openApp } = useAppState()

  const renderIcon = () => {
    const svgIcons = [
      "facetime",
      "appstore",
      "music",
      "messages",
      "podcasts",
      "safari",
      "maps",
      "health",
      "camera",
      "reminders",
      "phone",
      "mail",
      "clock",
      "settings",
      "wallet",
      "photos",
      "news",
      "tv",
      "notes",
    ]

    if (svgIcons.includes(id)) {
      return (
        <Image
          src={`/iosicons/${id}.svg`}
          alt={`${name}`}
          width={size === "small" ? 28 : 56}
          height={size === "small" ? 28 : 56}
          className="w-full h-full"
          priority={true}
          onError={(e) => {
            console.error(`Failed to load icon: ${id}`)
            // Fallback to a colored div with text initial
            const target = e.target as HTMLImageElement
            target.style.display = "none"
            const parent = target.parentElement
            if (parent) {
              const fallback = document.createElement("div")
              fallback.className = "w-full h-full flex items-center justify-center"
              fallback.textContent = name[0].toUpperCase()
              parent.appendChild(fallback)
            }
          }}
        />
      )
    }

    if (id === "contact") return <img src="/images/contact.webp" className="w-full h-full object-cover rounded-[inherit]" alt="Contact" />
    if (id === "games") return <img src="/images/game.webp" className="w-full h-full object-cover rounded-[inherit]" alt="Games" />
    if (id === "finder") return <img src="/images/finder.png" className="w-full h-full object-contain p-1 bg-white rounded-[inherit]" alt="Finder" />
    if (id === "calculator") return <img src="/icons/ios-calculator-app-icon.svg" className="w-full h-full object-cover rounded-[inherit]" alt="Calculator" />

    if (id === "calendar") {
      const date = new Date()
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
      const dayNumber = date.getDate()
      
      return (
        <div className="relative w-full h-full flex flex-col items-center shadow-inner rounded-[inherit]">
          {/* iOS squircle background imported from user's SVG */}
          <img src="/icons/ios-calendar-app-icon.svg" className="absolute inset-0 z-0 w-full h-full object-cover rounded-[inherit]" alt="" />
          {/* Dynamic text overlay */}
          <div className="z-10 flex flex-col items-center justify-center w-full h-full pb-[2%] pt-[10%]">
            <span className={`text-[#FF3B30] font-bold ${size === 'small' ? 'text-[7px]' : 'text-[12px]'}`}>
              {dayName}
            </span>
            <span className={`text-black font-light tracking-tighter ${size === 'small' ? 'text-[18px] mt-[-3px]' : 'text-[36px] mt-[-5px]'}`}>
              {dayNumber}
            </span>
          </div>
        </div>
      )
    }

    if (customIcon) return customIcon
    if (icon) return <div className="text-2xl">{icon}</div>
    return <div className="flex items-center justify-center w-full h-full text-white">{name[0].toUpperCase()}</div>
  }

  return (
    <div className="flex flex-col items-center select-none">
      <motion.div
        className={`app-icon ios26-app-icon ${color}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.85 }}
        onClick={() => openApp(id)}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          width: size === "small" ? "100%" : "60px",
          height: size === "small" ? "100%" : "60px",
        }}
      >
        {renderIcon()}
      </motion.div>
      {size === "normal" && <div className="text-[10px] text-white mt-1.5 ios26-text-glow font-medium drop-shadow-md">{name}</div>}
    </div>
  )
}
