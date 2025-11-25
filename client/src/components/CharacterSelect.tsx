import { useGameState } from "@/lib/stores/useGameState";
import { useState } from "react";

export function CharacterSelect() {
  const { selectCharacter } = useGameState();
  const [hoveredChar, setHoveredChar] = useState<"male" | "female" | null>(null);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-slate-900 to-black overflow-hidden">
      {/* Atmospheric effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      
      {/* Title */}
      <div className="relative z-10 pt-12 text-center">
        <h2 className="text-4xl font-bold text-cyan-300 mb-2 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          CHOOSE YOUR EXPLORER
        </h2>
        <p className="text-gray-400 italic">Who will brave the haunted manor?</p>
      </div>

      {/* Character selection */}
      <div className="relative z-10 flex items-center justify-center h-full gap-16 px-8 -mt-16">
        {/* Male Explorer */}
        <button
          onClick={() => selectCharacter("male")}
          onMouseEnter={() => setHoveredChar("male")}
          onMouseLeave={() => setHoveredChar(null)}
          className="group relative flex flex-col items-center"
        >
          {/* Character icon/silhouette */}
          <div className={`w-48 h-48 mb-6 rounded-lg border-4 transition-all duration-300 flex items-center justify-center
            ${hoveredChar === "male" 
              ? "border-cyan-400 bg-cyan-900/30 shadow-[0_0_40px_rgba(34,211,238,0.6)]" 
              : "border-cyan-700/50 bg-slate-800/50"}`}>
            <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path 
                className={hoveredChar === "male" ? "text-cyan-300" : "text-cyan-600"}
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" 
              />
            </svg>
            {hoveredChar === "male" && (
              <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg animate-pulse" />
            )}
          </div>
          
          <h3 className={`text-2xl font-bold mb-2 transition-colors ${
            hoveredChar === "male" ? "text-cyan-300" : "text-gray-400"
          }`}>
            MALE EXPLORER
          </h3>
          <p className="text-gray-500 text-sm max-w-xs text-center">
            A seasoned investigator of the paranormal
          </p>
        </button>

        {/* Female Explorer */}
        <button
          onClick={() => selectCharacter("female")}
          onMouseEnter={() => setHoveredChar("female")}
          onMouseLeave={() => setHoveredChar(null)}
          className="group relative flex flex-col items-center"
        >
          {/* Character icon/silhouette */}
          <div className={`w-48 h-48 mb-6 rounded-lg border-4 transition-all duration-300 flex items-center justify-center
            ${hoveredChar === "female" 
              ? "border-red-400 bg-red-900/30 shadow-[0_0_40px_rgba(248,113,113,0.6)]" 
              : "border-red-700/50 bg-slate-800/50"}`}>
            <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path 
                className={hoveredChar === "female" ? "text-red-300" : "text-red-600"}
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" 
              />
            </svg>
            {hoveredChar === "female" && (
              <div className="absolute inset-0 border-2 border-red-400 rounded-lg animate-pulse" />
            )}
          </div>
          
          <h3 className={`text-2xl font-bold mb-2 transition-colors ${
            hoveredChar === "female" ? "text-red-300" : "text-gray-400"
          }`}>
            FEMALE EXPLORER
          </h3>
          <p className="text-gray-500 text-sm max-w-xs text-center">
            An electrical engineer seeking answers
          </p>
        </button>
      </div>

      {/* Hint */}
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-gray-600 text-sm animate-pulse">
          Click to select your character
        </p>
      </div>
    </div>
  );
}
