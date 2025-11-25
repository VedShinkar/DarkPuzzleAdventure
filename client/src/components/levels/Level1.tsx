import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { ElectricalSimulation } from "@/lib/electrical";
import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";

export function Level1() {
  const { completeLevel } = useGameState();
  const { playSuccess } = useAudio();
  
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(10);
  const [sparkPositions, setSparkPositions] = useState<{ x: number; y: number; id: number }[]>([]);
  const [sparksFixed, setSparksFixed] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  // Calculate electrical values
  const current = ElectricalSimulation.calculateCurrent(voltage, resistance);
  const power = ElectricalSimulation.calculatePower(voltage, current);
  
  // Target range: 0.18A to 0.22A
  const targetMin = 0.18;
  const targetMax = 0.22;
  const inRange = current >= targetMin && current <= targetMax;
  
  // Brightness based on power (max ~2.4W for perfect range)
  const brightness = ElectricalSimulation.calculateBrightness(power, 3);

  useEffect(() => {
    if (inRange && !sparksFixed) {
      // Spawn spark after 1 second in correct range
      const timer = setTimeout(() => {
        setSparkPositions([{
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
          id: Date.now()
        }]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [inRange, sparksFixed]);

  const handleSparkClick = (id: number) => {
    setSparkPositions(prev => prev.filter(s => s.id !== id));
    setSparksFixed(true);
    playSuccess();
    
    // Complete level after fixing spark
    setTimeout(() => {
      setLevelComplete(true);
      setTimeout(() => completeLevel(1), 1000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black overflow-hidden">
      {/* Atmospheric effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Level title */}
      <div className="relative z-10 pt-8 px-8 text-center">
        <h2 className="text-3xl font-bold text-cyan-300 mb-1 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          LEVEL 1: ENTRY HALL
        </h2>
        <p className="text-gray-400 text-sm italic">Stabilize the flickering lamp</p>
      </div>

      {/* Main game area */}
      <div className="relative z-10 flex items-center justify-center h-full px-8 -mt-16">
        <div className="flex gap-16 items-start max-w-6xl w-full">
          {/* Control Panel */}
          <div className="flex-1 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-cyan-700/50 p-8 backdrop-blur-sm">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500/70" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-500/70" />
            
            <h3 className="text-xl font-bold text-cyan-300 mb-6 text-center">CIRCUIT CONTROLS</h3>
            
            {/* Voltage Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-gray-300 font-medium">Voltage (V)</label>
                <span className="text-cyan-400 font-mono font-bold">{voltage.toFixed(1)} V</span>
              </div>
              <Slider
                value={[voltage]}
                onValueChange={(v) => setVoltage(v[0])}
                min={0}
                max={12}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 V</span>
                <span>12 V</span>
              </div>
            </div>

            {/* Resistance Slider */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <label className="text-gray-300 font-medium">Resistance (Ω)</label>
                <span className="text-cyan-400 font-mono font-bold">{resistance.toFixed(1)} Ω</span>
              </div>
              <Slider
                value={[resistance]}
                onValueChange={(v) => setResistance(v[0])}
                min={1}
                max={20}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Ω</span>
                <span>20 Ω</span>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="border-t border-cyan-800/30 pt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current (I)</span>
                <span className={`font-mono font-bold ${inRange ? 'text-green-400' : 'text-gray-300'}`}>
                  {current.toFixed(3)} A
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Power (P)</span>
                <span className="font-mono text-gray-300">{power.toFixed(3)} W</span>
              </div>
            </div>

            {/* Target indicator */}
            <div className="mt-6 p-4 bg-black/50 border border-cyan-700/30">
              <p className="text-xs text-gray-400 mb-2">TARGET CURRENT RANGE:</p>
              <p className="text-cyan-300 font-mono font-bold">0.18 A - 0.22 A</p>
              {inRange && (
                <p className="text-green-400 text-sm mt-2 animate-pulse">✓ IN RANGE</p>
              )}
            </div>
          </div>

          {/* Visual Display */}
          <div className="flex-1 relative">
            {/* Lamp visualization */}
            <div className="bg-gradient-to-b from-slate-800/70 to-slate-900/70 border-2 border-cyan-700/30 p-12 backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center relative">
              <h3 className="text-lg text-gray-400 mb-8">LAMP STATUS</h3>
              
              {/* Lamp bulb */}
              <div className="relative mb-8">
                {/* Glow effect */}
                {brightness > 0.1 && (
                  <div 
                    className="absolute inset-0 rounded-full blur-3xl transition-all duration-300"
                    style={{
                      backgroundColor: inRange ? '#22d3ee' : '#fbbf24',
                      opacity: brightness * 0.6,
                      transform: `scale(${1 + brightness * 0.5})`
                    }}
                  />
                )}
                
                {/* Bulb */}
                <div 
                  className="relative w-32 h-32 rounded-full border-4 transition-all duration-300"
                  style={{
                    borderColor: inRange ? '#22d3ee' : '#94a3b8',
                    backgroundColor: `rgba(${inRange ? '34, 211, 238' : '251, 191, 36'}, ${brightness})`,
                    boxShadow: inRange && brightness > 0.5 
                      ? '0 0 60px rgba(34, 211, 238, 0.8)' 
                      : brightness > 0.3 
                      ? '0 0 40px rgba(251, 191, 36, 0.5)' 
                      : 'none'
                  }}
                >
                  {/* Filament effect */}
                  {brightness > 0.2 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-16 border-2 border-white/40 rounded-full" 
                        style={{ opacity: brightness }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Status text */}
              <p className={`text-lg font-bold transition-colors ${
                inRange ? 'text-green-400' : brightness > 0.3 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {levelComplete 
                  ? 'STABILIZED' 
                  : inRange 
                  ? 'STABLE' 
                  : brightness > 0.5 
                  ? 'FLICKERING' 
                  : 'UNSTABLE'}
              </p>

              {/* Sparks */}
              {sparkPositions.map(spark => (
                <button
                  key={spark.id}
                  onClick={() => handleSparkClick(spark.id)}
                  className="absolute w-6 h-6 cursor-pointer hover:scale-125 transition-transform"
                  style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping" />
                    <div className="relative w-6 h-6 bg-yellow-300 rounded-full border-2 border-yellow-500 animate-pulse" />
                  </div>
                </button>
              ))}
            </div>

            {sparksFixed && (
              <div className="mt-4 p-3 bg-green-900/50 border border-green-500/50 text-green-300 text-center">
                ✓ Spark repaired! Level complete.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hint */}
      {!inRange && (
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p className="text-gray-600 text-sm animate-pulse">
            Adjust voltage and resistance to achieve target current...
          </p>
        </div>
      )}
    </div>
  );
}
