import { useGameState } from "@/lib/stores/useGameState";
import { useEffect, useState } from "react";

const ghostMessages = {
  1: {
    title: "The First Secret",
    message: "You unknowingly used Ohm's Law...",
    explanation: "V = I × R",
    description: "Voltage equals Current multiplied by Resistance. You balanced the electrical forces by manipulating voltage and resistance to achieve the perfect current flow.",
    hint: "The Study Room awaits. There, parallel paths diverge..."
  },
  2: {
    title: "Parallel Paths",
    message: "You've mastered the branching currents...",
    explanation: "I_total = I₁ + I₂",
    description: "In parallel circuits, total current is the sum of all branch currents. Each device received exactly what it needed through separate pathways.",
    hint: "The Workshop holds greater complexity. Series and parallel forces intertwine..."
  },
  3: {
    title: "The Hybrid Circuit",
    message: "You've conquered the most complex arrangement...",
    explanation: "R_series = R₁ + R₂ | 1/R_parallel = 1/R₁ + 1/R₂",
    description: "You balanced series resistances that add directly, and parallel resistances that combine through reciprocals. True mastery of electrical flow.",
    hint: "You have proven worthy. The mansion's secrets are nearly revealed..."
  }
};

export function GhostDialog() {
  const { hideGhost, ghostDialogLevel } = useGameState();
  const [opacity, setOpacity] = useState(0);
  const [visible, setVisible] = useState(false);

  const message = ghostMessages[ghostDialogLevel as keyof typeof ghostMessages];

  useEffect(() => {
    // Fade in
    setVisible(true);
    setTimeout(() => setOpacity(100), 50);
  }, []);

  const handleContinue = () => {
    // Fade out
    setOpacity(0);
    setTimeout(() => {
      setVisible(false);
      hideGhost();
    }, 500);
  };

  if (!message) {
    handleContinue();
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-hidden">
      {/* Ethereal background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent animate-pulse" 
        style={{ animationDuration: '6s' }} />
      
      {/* Ghost apparition */}
      <div 
        className="relative max-w-3xl mx-8 transition-opacity duration-500"
        style={{ opacity: opacity / 100 }}
      >
        {/* Ghostly glow */}
        <div className="absolute -inset-8 bg-gradient-radial from-cyan-400/20 via-blue-500/10 to-transparent blur-3xl animate-pulse" 
          style={{ animationDuration: '4s' }} />
        
        {/* Ghost silhouette */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-cyan-400/30 blur-2xl rounded-full w-32 h-48 -mt-8" />
            
            {/* Ghost figure */}
            <svg className="w-24 h-32 relative z-10" viewBox="0 0 24 32" fill="none">
              <path
                d="M12 4 C8 4 5 7 5 11 L5 24 C5 26 6 28 8 28 L16 28 C18 28 19 26 19 24 L19 11 C19 7 16 4 12 4 Z"
                fill="url(#ghost-gradient)"
                opacity="0.8"
              />
              <circle cx="9" cy="10" r="1.5" fill="#0ff" opacity="0.9" />
              <circle cx="15" cy="10" r="1.5" fill="#0ff" opacity="0.9" />
              <defs>
                <linearGradient id="ghost-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Smoke particles */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400/40 to-transparent blur-sm animate-pulse" />
          </div>
        </div>

        {/* Dialog box */}
        <div className="relative bg-gradient-to-b from-slate-900/95 to-slate-800/95 border-2 border-cyan-500/50 p-8 backdrop-blur-sm">
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/70" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-500/70" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-500/70" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/70" />
          
          {/* Pulsing border effect */}
          <div className="absolute inset-0 border border-cyan-400/30 animate-pulse pointer-events-none" 
            style={{ animationDuration: '3s' }} />

          {/* Content */}
          <h2 className="text-3xl font-bold text-cyan-300 mb-4 text-center drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">
            {message.title}
          </h2>
          
          <p className="text-gray-300 text-lg mb-6 text-center italic">
            "{message.message}"
          </p>

          {/* Formula display */}
          <div className="bg-black/50 border border-cyan-700/50 p-4 mb-6 text-center">
            <div className="text-2xl font-mono text-cyan-300 mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
              {message.explanation}
            </div>
          </div>

          <p className="text-gray-400 mb-6 leading-relaxed">
            {message.description}
          </p>

          {/* Next hint */}
          <div className="border-t border-cyan-800/30 pt-4 mb-6">
            <p className="text-gray-500 text-sm italic text-center">
              {message.hint}
            </p>
          </div>

          {/* Continue button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-gradient-to-r from-cyan-900/50 to-cyan-800/50 border-2 border-cyan-500/70 text-cyan-300 font-bold hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
