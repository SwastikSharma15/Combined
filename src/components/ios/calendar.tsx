"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]
  
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const renderDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear()
      days.push(
        <div key={i} className="h-10 flex items-center justify-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${isToday ? "bg-red-500 text-white" : "text-black"}`}>
            {i}
          </div>
        </div>
      )
    }
    return days
  }

  return (
    <div className="h-full w-full bg-white flex flex-col pt-10">
      <div className="flex justify-between items-center px-4 mb-4 text-red-500">
        <div className="flex gap-4">
          <Search className="w-6 h-6" />
        </div>
        <Plus className="w-6 h-6" />
      </div>
      
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-black">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1"><ChevronLeft className="text-red-500" /></button>
            <button onClick={nextMonth} className="p-1"><ChevronRight className="text-red-500" /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
          {dayNames.map((day, idx) => <div key={idx}>{day}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-y-2">
          {renderDays()}
        </div>
      </div>
      
      <div className="mt-4 flex-1 border-t border-gray-200">
        <div className="p-4 flex gap-4">
          <div className="text-right w-16">
            <div className="text-2xl font-semibold text-black">{new Date().getDate()}</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>
          <div className="flex-1">
            <div className="bg-red-50 border-l-4 border-red-500 p-2 rounded">
              <div className="font-semibold text-red-700 text-sm">Portfolio work session</div>
              <div className="text-xs text-red-600">10:00 AM - 10:30 AM</div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded mt-2">
              <div className="font-semibold text-blue-700 text-sm">Lunch with team</div>
              <div className="text-xs text-blue-600">12:30 PM - 1:30 PM</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50 text-red-500 text-sm">
        <button>Today</button>
        <button>Calendars</button>
        <button>Inbox</button>
      </div>
    </div>
  )
}
