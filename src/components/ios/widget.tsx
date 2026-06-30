import type { ReactNode } from "react"

interface WidgetProps {
  title: string
  content: ReactNode
  className?: string
}

export function Widget({ title, content, className = "" }: WidgetProps) {
  return (
    <div className="flex flex-col select-none group cursor-pointer">
      <div className={`ios26-widget p-4 ${className}`}>{content}</div>
      <div className="text-[13px] text-white mt-1.5 text-center ios26-text-glow font-medium drop-shadow-md">{title}</div>
    </div>
  )
}
