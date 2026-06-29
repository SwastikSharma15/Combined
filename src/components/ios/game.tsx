import { useState, useRef } from "react"
import { ArrowLeft, Gamepad2, Play } from "lucide-react"

const games = [
  {
    id: "slapner",
    name: "SlapNer",
    icon: "/images/slapner.png",
    url: "https://slapner.vercel.app",
    description: "Wake Ner Up",
    category: "arcade",
  },
  {
    id: "chess",
    name: "Chess",
    icon: "/images/chess.jpg",
    url: "https://chessnubot.vercel.app/",
    description: "Play chess online",
    category: "strategy",
  },
  {
    id: "pentagoo",
    name: "PentaGo Online",
    icon: "/images/pEntaggo.png",
    url: "https://pentagoonline.vercel.app/",
    description: "Strategic Game",
    category: "strategy",
  },
]

export function GameApp() {
  const [selectedGame, setSelectedGame] = useState<any>(null)

  return (
    <div className="h-full w-full bg-white flex flex-col text-black pb-10">
      {selectedGame ? (
        <div className="flex-1 flex flex-col w-full h-full relative">
          <div className="absolute top-4 left-4 z-50">
            <button 
              onClick={() => setSelectedGame(null)}
              className="bg-black/50 backdrop-blur p-2 rounded-full text-white shadow-lg"
            >
              <ArrowLeft size={24} />
            </button>
          </div>
          <iframe
            src={selectedGame.url}
            className="w-full h-full border-none flex-1"
            title={selectedGame.name}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4 pt-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <Gamepad2 className="text-blue-600 size-8" />
            </div>
            <h1 className="text-3xl font-bold">Games</h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 px-1">Featured</h2>
            {games.map((game) => (
              <div 
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl cursor-pointer active:scale-95 transition-transform border border-gray-100 shadow-sm"
              >
                <img 
                  src={game.icon} 
                  alt={game.name} 
                  className="w-20 h-20 rounded-xl object-cover shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{game.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{game.description}</p>
                </div>
                <button className="bg-gray-200 text-blue-600 font-bold px-5 py-2 rounded-full text-sm">
                  PLAY
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
