"use client"
import { useState } from "react"
import { MapPin, Search, Navigation } from "lucide-react"

export function MapsApp() {
  return (
    <div className="h-full w-full bg-white flex flex-col pt-10">
      <div className="px-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a place or address"
            className="w-full h-10 bg-gray-100 rounded-lg pl-10 pr-4 text-black placeholder-gray-500 outline-none text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>
      
      <div className="flex-1 relative">
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src="https://www.openstreetmap.org/export/embed.html?bbox=-122.50854492187501%2C37.701140084792684%2C-122.36846923828126%2C37.80164478332158&amp;layer=mapnik" 
          style={{ border: 0 }}
        />
        <div className="absolute bottom-6 right-4 flex flex-col gap-3">
          <button className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500">
            <Navigation className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
