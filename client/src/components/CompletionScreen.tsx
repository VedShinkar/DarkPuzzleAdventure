import { useGameState } from "@/lib/stores/useGameState";
import { useEffect, useState } from "react";

export function CompletionScreen() {
  const { resetGame } = useGameState();
  const [opacity, setOpacity] = useState(0);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    setTimeout(() => setOpacity(100), 100);
    setTimeout(() => setShowCredits(true), 2000);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Atmospheric effects */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/30 via-transparent to-transparent animate-pulse" 
        style={{ animationDuration: '8s' }} />
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent animate-pulse" 
        style={{ animationDuration: '6s', animationDelay: '1s' }} />

      {/* Content */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center h-full px-8 transition-opacity duration-1000"
        style={{ opacity: opacity / 100 }}
      >
        {/* Ghost fully restored */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-cyan-400/30 blur-3xl rounded-full w-48 h-64 -mt-12 animate-pulse" 
            style={{ animationDuration: '4s' }} />
          
          <svg className="w-32 h-44 relative z-10" viewBox="0 0 24 40" fill="none">
            <path
              d="M12 4 C8 4 5 7 5 11 L5 32 C5 34 6 36 8 36 L16 36 C18 36 19 34 19 32 L19 11 C19 7 16 4 12 4 Z"
              fill="url(#ghost-gradient-complete)"
              opacity="0.9"
            />
            <circle cx="9" cy="12" r="2" fill="#0ff" opacity="1" />
            <circle cx="15" cy="12" r="2" fill="#0ff" opacity="1" />
            <path
              d="M9 18 Q12 20 15 18"
              stroke="#0ff"
              strokeWidth="1.5"
              fill="none"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="ghost-gradient-complete" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-blue-200 to-cyan-500 mb-8 text-center drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">
          THE PHANTOM IS FREE
        </h1>

        {/* Message */}
        <div className="max-w-2xl text-center mb-12 space-y-4">
          <p className="text-gray-300 text-xl italic">
            "You have mastered the electrical forces that bound me here..."
          </p>
          <p className="text-gray-400 text-lg">
            Through your understanding of Ohm's Law, parallel circuits, and series-parallel hybrids, 
            you've restored balance to the Powerbound Manor.
          </p>
          <p className="text-cyan-400 text-lg font-bold">
            Elias Verdan can finally rest.
          </p>
        </div>

        {/* Mansion stabilization effect */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
          </div>
          <p className="text-gray-500 text-sm mt-4">The lights glow bright once more...</p>
        </div>

        {/* Credits */}
        {showCredits && (
          <div className="absolute bottom-0 left-0 right-0 pb-12 text-center animate-pulse">
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                You've completed all levels
              </p>
              <p className="text-gray-500 text-xs">
                A horror puzzle adventure about electrical engineering
              </p>
            </div>

            <button
              onClick={resetGame}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-900/50 to-cyan-800/50 border-2 border-cyan-500/70 text-cyan-300 font-bold hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
            >
              RETURN TO MENU
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
