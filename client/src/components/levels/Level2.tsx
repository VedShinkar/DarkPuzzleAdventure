import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { ElectricalSimulation } from "@/lib/electrical";
import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";

export function Level2() {
  const { completeLevel } = useGameState();
  const { playSuccess } = useAudio();
  
  const [voltage] = useState(12); // Fixed voltage for parallel circuit
  const [fanResistance, setFanResistance] = useState(40);
  const [lampResistance, setLampResistance] = useState(100);
  const [sparkPositions, setSparkPositions] = useState<{ x: number; y: number; id: number }[]>([]);
  const [levelComplete, setLevelComplete] = useState(false);

  // Calculate currents for each branch
  const fanCurrent = ElectricalSimulation.calculateCurrent(voltage, fanResistance);
  const lampCurrent = ElectricalSimulation.calculateCurrent(voltage, lampResistance);
  const totalCurrent = fanCurrent + lampCurrent;
  
  // Target ranges
  const fanTarget = 0.3; // ± 0.05
  const fanInRange = Math.abs(fanCurrent - fanTarget) <= 0.05;
  
  const lampTarget = 0.12; // ± 0.03
  const lampInRange = Math.abs(lampCurrent - lampTarget) <= 0.03;
  
  const bothInRange = fanInRange && lampInRange;

  // Fan speed and lamp brightness
  const fanSpeed = ElectricalSimulation.calculateFanSpeed(fanCurrent, 120);
  const lampPower = ElectricalSimulation.calculatePower(voltage, lampCurrent);
  const lampBrightness = ElectricalSimulation.calculateBrightness(lampPower, 2);

  useEffect(() => {
    if (bothInRange && sparkPositions.length === 0 && !levelComplete) {
      // Spawn sparks after both in range
      const timer = setTimeout(() => {
        setSparkPositions([
          { x: 15, y: 25, id: 1 },
          { x: 75, y: 30, id: 2 },
          { x: 45, y: 65, id: 3 }
        ]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [bothInRange, sparkPositions.length, levelComplete]);

  const handleSparkClick = (id: number) => {
    setSparkPositions(prev => prev.filter(s => s.id !== id));
    playSuccess();
    
    // Check if all sparks fixed
    if (sparkPositions.length === 1) {
      setLevelComplete(true);
      setTimeout(() => completeLevel(2), 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Level title */}
      <div className="relative z-10 pt-8 px-8 text-center">
        <h2 className="text-3xl font-bold text-cyan-300 mb-1 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          LEVEL 2: STUDY ROOM
        </h2>
        <p className="text-gray-400 text-sm italic">Balance parallel circuit currents</p>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-8 -mt-16">
        <div className="flex gap-8 items-start max-w-6xl w-full">
          {/* Control Panel */}
          <div className="flex-1 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-cyan-700/50 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-cyan-300 mb-6 text-center">PARALLEL CIRCUIT</h3>
            
            {/* Fixed Voltage Display */}
            <div className="mb-6 p-3 bg-black/50 border border-cyan-700/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Supply Voltage</span>
                <span className="text-cyan-400 font-mono font-bold">{voltage} V</span>
              </div>
            </div>

            {/* Fan Branch */}
            <div className="mb-6 p-4 border border-orange-700/30 bg-orange-900/10">
              <h4 className="text-orange-300 font-bold mb-3">FAN BRANCH</h4>
              <div className="mb-3">
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 text-sm">Resistance (Ω)</label>
                  <span className="text-orange-400 font-mono">{fanResistance.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[fanResistance]}
                  onValueChange={(v) => setFanResistance(v[0])}
                  min={20}
                  max={60}
                  step={0.5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current:</span>
                <span className={`font-mono font-bold ${fanInRange ? 'text-green-400' : 'text-gray-300'}`}>
                  {fanCurrent.toFixed(3)} A
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Target: 0.30 A (± 0.05)
              </div>
            </div>

            {/* Lamp Branch */}
            <div className="mb-6 p-4 border border-cyan-700/30 bg-cyan-900/10">
              <h4 className="text-cyan-300 font-bold mb-3">LAMP BRANCH</h4>
              <div className="mb-3">
                <div className="flex justify-between mb-2">
                  <label className="text-gray-300 text-sm">Resistance (Ω)</label>
                  <span className="text-cyan-400 font-mono">{lampResistance.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[lampResistance]}
                  onValueChange={(v) => setLampResistance(v[0])}
                  min={80}
                  max={150}
                  step={0.5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Current:</span>
                <span className={`font-mono font-bold ${lampInRange ? 'text-green-400' : 'text-gray-300'}`}>
                  {lampCurrent.toFixed(3)} A
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Target: 0.12 A (± 0.03)
              </div>
            </div>

            {/* Total Current */}
            <div className="border-t border-cyan-800/30 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Current (I₁ + I₂)</span>
                <span className="font-mono font-bold text-cyan-300">{totalCurrent.toFixed(3)} A</span>
              </div>
            </div>

            {bothInRange && (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-500/50 text-green-300 text-sm text-center">
                ✓ Both currents balanced!
              </div>
            )}
          </div>

          {/* Visual Display */}
          <div className="flex-1 space-y-4">
            {/* Fan Display */}
            <div className="bg-gradient-to-b from-slate-800/70 to-slate-900/70 border-2 border-orange-700/30 p-6 backdrop-blur-sm relative">
              <h3 className="text-lg text-orange-300 mb-4 text-center">FAN STATUS</h3>
              <div className="flex flex-col items-center">
                {/* Fan blades */}
                <div className="relative w-32 h-32">
                  <div 
                    className="absolute inset-0 transition-all duration-100"
                    style={{
                      transform: `rotate(${Date.now() / (100 - fanSpeed * 0.8)}deg)`
                    }}
                  >
                    {[0, 120, 240].map((angle) => (
                      <div
                        key={angle}
                        className="absolute top-1/2 left-1/2 w-12 h-2 bg-orange-400 rounded-full origin-left"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                          opacity: fanInRange ? 0.9 : 0.5
                        }}
                      />
                    ))}
                  </div>
                  {/* Center hub */}
                  <div className={`absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                    fanInRange ? 'bg-orange-400 border-orange-500' : 'bg-gray-600 border-gray-700'
                  }`} />
                </div>
                <p className={`mt-4 font-bold ${fanInRange ? 'text-green-400' : 'text-gray-400'}`}>
                  Speed: {fanSpeed.toFixed(0)} RPM
                </p>
              </div>

              {/* Sparks on fan area */}
              {sparkPositions.filter(s => s.id === 1 || s.id === 2).map(spark => (
                <button
                  key={spark.id}
                  onClick={() => handleSparkClick(spark.id)}
                  className="absolute w-6 h-6 cursor-pointer hover:scale-125 transition-transform z-20"
                  style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping" />
                    <div className="relative w-6 h-6 bg-yellow-300 rounded-full border-2 border-yellow-500 animate-pulse" />
                  </div>
                </button>
              ))}
            </div>

            {/* Lamp Display */}
            <div className="bg-gradient-to-b from-slate-800/70 to-slate-900/70 border-2 border-cyan-700/30 p-6 backdrop-blur-sm relative">
              <h3 className="text-lg text-cyan-300 mb-4 text-center">LAMP STATUS</h3>
              <div className="flex flex-col items-center">
                {/* Lamp bulb */}
                <div className="relative">
                  {lampBrightness > 0.1 && (
                    <div 
                      className="absolute inset-0 rounded-full blur-2xl transition-all duration-300"
                      style={{
                        backgroundColor: '#22d3ee',
                        opacity: lampBrightness * 0.5,
                        transform: `scale(${1 + lampBrightness * 0.4})`
                      }}
                    />
                  )}
                  <div 
                    className="relative w-24 h-24 rounded-full border-4 transition-all duration-300"
                    style={{
                      borderColor: lampInRange ? '#22d3ee' : '#94a3b8',
                      backgroundColor: `rgba(34, 211, 238, ${lampBrightness * 0.8})`,
                      boxShadow: lampInRange ? '0 0 40px rgba(34, 211, 238, 0.6)' : 'none'
                    }}
                  />
                </div>
                <p className={`mt-4 font-bold ${lampInRange ? 'text-green-400' : 'text-gray-400'}`}>
                  {lampInRange ? 'OPTIMAL' : 'ADJUSTING'}
                </p>
              </div>

              {/* Sparks on lamp area */}
              {sparkPositions.filter(s => s.id === 3).map(spark => (
                <button
                  key={spark.id}
                  onClick={() => handleSparkClick(spark.id)}
                  className="absolute w-6 h-6 cursor-pointer hover:scale-125 transition-transform z-20"
                  style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping" />
                    <div className="relative w-6 h-6 bg-yellow-300 rounded-full border-2 border-yellow-500 animate-pulse" />
                  </div>
                </button>
              ))}
            </div>

            {levelComplete && (
              <div className="p-3 bg-green-900/50 border border-green-500/50 text-green-300 text-center">
                ✓ All sparks repaired! Level complete.
              </div>
            )}
          </div>
        </div>
      </div>

      {!bothInRange && (
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p className="text-gray-600 text-sm animate-pulse">
            Balance both currents to their target ranges...
          </p>
        </div>
      )}
    </div>
  );
}
