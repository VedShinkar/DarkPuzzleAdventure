import { useGameState } from "@/lib/stores/useGameState";
import { useEffect, useState } from "react";

export function MainMenu() {
  const { setScreen } = useGameState();
  const [lightning, setLightning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setLightning(true);
        setTimeout(() => setLightning(false), 100);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-slate-900 to-black overflow-hidden">
      {/* Lightning flash effect */}
      {lightning && (
        <div className="absolute inset-0 bg-cyan-200 opacity-30 pointer-events-none animate-pulse" />
      )}

      {/* Fog layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none animate-pulse" 
        style={{ animationDuration: '8s' }} />

      {/* Electric glow effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30 animate-pulse" 
        style={{ animationDuration: '3s' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-blue-200 to-cyan-500 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)] animate-pulse"
            style={{ animationDuration: '4s' }}>
            THE PHANTOM
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-gray-300 tracking-widest mb-2">
            OF THE
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 via-orange-300 to-red-500 drop-shadow-[0_0_20px_rgba(248,113,113,0.4)]">
            POWERBOUND MANOR
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-12 max-w-2xl text-center italic border-t border-b border-cyan-800/30 py-4 backdrop-blur-sm">
          A haunted Victorian mansion charged with unstable electrical energy awaits...
        </p>

        {/* Start button */}
        <button
          onClick={() => setScreen("character_select")}
          className="group relative px-12 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-300 font-bold text-xl tracking-wider border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-300 overflow-hidden"
        >
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 border border-red-500/20 animate-pulse" style={{ animationDuration: '2s' }} />
          
          <span className="relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            ENTER THE MANOR
          </span>
          
          {/* Electric sparks on corners */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" style={{ animationDelay: '0.25s' }} />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse" style={{ animationDelay: '0.75s' }} />
        </button>

        {/* Footer hint */}
        <div className="absolute bottom-8 text-center">
          <p className="text-gray-600 text-sm">
            Master the laws of electricity to survive...
          </p>
        </div>
      </div>
    </div>
  );
}
