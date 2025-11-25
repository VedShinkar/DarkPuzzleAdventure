import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { ElectricalSimulation } from "@/lib/electrical";
import { useGameState } from "@/lib/stores/useGameState";
import { useAudio } from "@/lib/stores/useAudio";

export function Level3() {
  const { completeLevel } = useGameState();
  const { playSuccess } = useAudio();
  
  const [voltage] = useState(9);
  // Series-parallel hybrid: Branch 1 has series resistors R1a and R1b
  // Branch 2 has series resistors R2a and R2b
  // Branch 3 has series resistors R3a and R3b
  // All three branches are in parallel with each other
  const [r1a, setR1a] = useState(15);
  const [r1b, setR1b] = useState(15);
  const [r2a, setR2a] = useState(15);
  const [r2b, setR2b] = useState(15);
  const [r3a, setR3a] = useState(15);
  const [r3b, setR3b] = useState(15);
  
  const [hotNodes, setHotNodes] = useState<{ x: number; y: number; id: number; scanned: boolean }[]>([]);
  const [scanMode, setScanMode] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  // Calculate series-parallel hybrid circuit
  // Each branch has series resistors
  const r1Total = ElectricalSimulation.calculateSeriesResistance([r1a, r1b]);
  const r2Total = ElectricalSimulation.calculateSeriesResistance([r2a, r2b]);
  const r3Total = ElectricalSimulation.calculateSeriesResistance([r3a, r3b]);
  
  // Calculate current for each parallel branch
  const i1 = ElectricalSimulation.calculateCurrent(voltage, r1Total);
  const i2 = ElectricalSimulation.calculateCurrent(voltage, r2Total);
  const i3 = ElectricalSimulation.calculateCurrent(voltage, r3Total);
  const totalCurrent = i1 + i2 + i3;
  
  // Target: 0.75A ± 0.10 (with 9V and ~12Ω per branch = ~0.75A total)
  const targetCurrent = 0.75;
  const currentInRange = Math.abs(totalCurrent - targetCurrent) <= 0.10;
  
  // Check 15% balance tolerance (relaxed for playability)
  const avgCurrent = totalCurrent / 3;
  const tolerance = avgCurrent * 0.15;
  const branch1Balanced = Math.abs(i1 - avgCurrent) <= tolerance;
  const branch2Balanced = Math.abs(i2 - avgCurrent) <= tolerance;
  const branch3Balanced = Math.abs(i3 - avgCurrent) <= tolerance;
  const allBalanced = branch1Balanced && branch2Balanced && branch3Balanced;
  
  const puzzleSolved = currentInRange && allBalanced;

  // Calculate power for fan visualization
  const fanPower = ElectricalSimulation.calculatePower(voltage, totalCurrent);
  const fanSpeed = ElectricalSimulation.calculateFanSpeed(totalCurrent, 100);

  useEffect(() => {
    if (puzzleSolved && hotNodes.length === 0 && !levelComplete) {
      const timer = setTimeout(() => {
        setHotNodes([
          { x: 20, y: 30, id: 1, scanned: false },
          { x: 50, y: 45, id: 2, scanned: false },
          { x: 75, y: 35, id: 3, scanned: false },
          { x: 35, y: 70, id: 4, scanned: false }
        ]);
        setScanMode(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [puzzleSolved, hotNodes.length, levelComplete]);

  const handleNodeClick = (id: number) => {
    if (!scanMode) return;
    
    setHotNodes(prev => prev.map(node => 
      node.id === id ? { ...node, scanned: true } : node
    ));
    playSuccess();
    
    // Check if all nodes scanned
    const allScanned = hotNodes.every(node => node.id === id || node.scanned);
    if (allScanned) {
      setLevelComplete(true);
      setScanMode(false);
      setTimeout(() => completeLevel(3), 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Level title */}
      <div className="relative z-10 pt-6 px-8 text-center">
        <h2 className="text-3xl font-bold text-cyan-300 mb-1 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">
          LEVEL 3: WORKSHOP
        </h2>
        <p className="text-gray-400 text-sm italic">Balance series-parallel hybrid circuit</p>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-4 -mt-8">
        <div className="flex gap-6 items-start max-w-7xl w-full">
          {/* Control Panel */}
          <div className="flex-1 bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-cyan-700/50 p-4 backdrop-blur-sm max-h-[650px] overflow-y-auto">
            <h3 className="text-lg font-bold text-cyan-300 mb-3 text-center">HYBRID CIRCUIT</h3>
            
            {/* Circuit description */}
            <div className="mb-3 p-2 bg-black/50 border border-cyan-700/30 text-xs">
              <p className="text-gray-400 mb-1">Each branch has 2 resistors in <span className="text-cyan-400">series</span></p>
              <p className="text-gray-400">All 3 branches are in <span className="text-orange-400">parallel</span></p>
            </div>
            
            {/* Voltage */}
            <div className="mb-3 p-2 bg-black/50 border border-cyan-700/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Supply Voltage</span>
                <span className="text-cyan-400 font-mono font-bold">{voltage} V</span>
              </div>
            </div>

            {/* Branch 1 - Series */}
            <div className="mb-3 p-3 border border-purple-700/30 bg-purple-900/10">
              <h4 className="text-purple-300 font-bold mb-2 text-sm">BRANCH 1 (Series)</h4>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-gray-300 text-xs">R1a</label>
                  <span className="text-purple-400 font-mono text-xs">{r1a.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[r1a]}
                  onValueChange={(v) => setR1a(v[0])}
                  min={5}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-gray-300 text-xs">R1b</label>
                  <span className="text-purple-400 font-mono text-xs">{r1b.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[r1b]}
                  onValueChange={(v) => setR1b(v[0])}
                  min={5}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between text-xs border-t border-purple-700/30 pt-2">
                <span className="text-gray-400">Total R:</span>
                <span className="font-mono text-purple-300">{r1Total.toFixed(1)} Ω</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current:</span>
                <span className={`font-mono ${branch1Balanced ? 'text-green-400' : 'text-gray-300'}`}>
                  {i1.toFixed(3)} A
                </span>
              </div>
            </div>

            {/* Branch 2 - Series */}
            <div className="mb-3 p-3 border border-blue-700/30 bg-blue-900/10">
              <h4 className="text-blue-300 font-bold mb-2 text-sm">BRANCH 2 (Series)</h4>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-gray-300 text-xs">R2a</label>
                  <span className="text-blue-400 font-mono text-xs">{r2a.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[r2a]}
                  onValueChange={(v) => setR2a(v[0])}
                  min={5}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-gray-300 text-xs">R2b</label>
                  <span className="text-blue-400 font-mono text-xs">{r2b.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[r2b]}
                  onValueChange={(v) => setR2b(v[0])}
                  min={5}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between text-xs border-t border-blue-700/30 pt-2">
                <span className="text-gray-400">Total R:</span>
                <span className="font-mono text-blue-300">{r2Total.toFixed(1)} Ω</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current:</span>
                <span className={`font-mono ${branch2Balanced ? 'text-green-400' : 'text-gray-300'}`}>
                  {i2.toFixed(3)} A
                </span>
              </div>
            </div>

            {/* Branch 3 - Series */}
            <div className="mb-3 p-3 border border-green-700/30 bg-green-900/10">
              <h4 className="text-green-300 font-bold mb-2 text-sm">BRANCH 3 (Series)</h4>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-gray-300 text-xs">R3a</label>
                  <span className="text-green-400 font-mono text-xs">{r3a.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[r3a]}
                  onValueChange={(v) => setR3a(v[0])}
                  min={5}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <label className="text-gray-300 text-xs">R3b</label>
                  <span className="text-green-400 font-mono text-xs">{r3b.toFixed(1)} Ω</span>
                </div>
                <Slider
                  value={[r3b]}
                  onValueChange={(v) => setR3b(v[0])}
                  min={5}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-between text-xs border-t border-green-700/30 pt-2">
                <span className="text-gray-400">Total R:</span>
                <span className="font-mono text-green-300">{r3Total.toFixed(1)} Ω</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current:</span>
                <span className={`font-mono ${branch3Balanced ? 'text-green-400' : 'text-gray-300'}`}>
                  {i3.toFixed(3)} A
                </span>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-cyan-800/30 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Current</span>
                <span className={`font-mono font-bold ${currentInRange ? 'text-green-400' : 'text-cyan-300'}`}>
                  {totalCurrent.toFixed(3)} A
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Target: 0.75 A (± 0.10)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Power</span>
                <span className="font-mono text-cyan-300">{fanPower.toFixed(2)} W</span>
              </div>
            </div>

            {/* Status */}
            <div className="mt-3 space-y-2">
              <div className={`p-2 text-xs text-center border ${
                currentInRange 
                  ? 'bg-green-900/30 border-green-500/50 text-green-300' 
                  : 'bg-gray-900/30 border-gray-700/50 text-gray-400'
              }`}>
                {currentInRange ? '✓' : '○'} Current in range
              </div>
              <div className={`p-2 text-xs text-center border ${
                allBalanced 
                  ? 'bg-green-900/30 border-green-500/50 text-green-300' 
                  : 'bg-gray-900/30 border-gray-700/50 text-gray-400'
              }`}>
                {allBalanced ? '✓' : '○'} Branches balanced (±10%)
              </div>
            </div>

            {scanMode && (
              <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 text-xs text-center animate-pulse">
                THERMAL SCAN: Click hot nodes!
              </div>
            )}
          </div>

          {/* Visual Display */}
          <div className="flex-1 space-y-4">
            {/* Fan motor with power */}
            <div className="bg-gradient-to-b from-slate-800/70 to-slate-900/70 border-2 border-cyan-700/30 p-8 backdrop-blur-sm relative min-h-[500px]">
              <h3 className="text-lg text-cyan-300 mb-6 text-center">MOTOR STATUS</h3>
              
              <div className="flex flex-col items-center">
                {/* Rotating motor */}
                <div className="relative w-40 h-40 mb-6">
                  {puzzleSolved && (
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                  )}
                  <div 
                    className="absolute inset-0 transition-all duration-100"
                    style={{
                      transform: `rotate(${Date.now() / (100 - fanSpeed * 0.5)}deg)`
                    }}
                  >
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <div
                        key={angle}
                        className="absolute top-1/2 left-1/2 w-16 h-3 rounded-full origin-left"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                          backgroundColor: puzzleSolved ? '#22d3ee' : '#6b7280',
                          opacity: puzzleSolved ? 0.8 : 0.4
                        }}
                      />
                    ))}
                  </div>
                  <div className={`absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                    puzzleSolved ? 'bg-cyan-400 border-cyan-500' : 'bg-gray-600 border-gray-700'
                  }`} />
                </div>

                <div className="text-center space-y-2">
                  <p className={`font-bold ${puzzleSolved ? 'text-green-400' : 'text-gray-400'}`}>
                    {puzzleSolved ? 'BALANCED' : 'CALIBRATING'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Speed: {fanSpeed.toFixed(0)} RPM
                  </p>
                  <p className="text-sm text-gray-400">
                    Power: {fanPower.toFixed(2)} W
                  </p>
                </div>
              </div>

              {/* Hot nodes for thermal scanning */}
              {hotNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  disabled={node.scanned}
                  className="absolute w-8 h-8 cursor-pointer hover:scale-125 transition-transform z-20"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {node.scanned ? (
                    <div className="relative w-8 h-8 bg-green-500/50 rounded-full border-2 border-green-400">
                      <div className="absolute inset-0 flex items-center justify-center text-green-300 text-xs font-bold">
                        ✓
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
                      <div className="relative w-8 h-8 bg-red-400 rounded-full border-2 border-red-600 animate-pulse">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Branch visualization */}
            <div className="bg-gradient-to-b from-slate-800/70 to-slate-900/70 border-2 border-cyan-700/30 p-4 backdrop-blur-sm">
              <h4 className="text-sm text-gray-400 mb-3 text-center">BRANCH CURRENTS</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full" />
                  <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                    <div 
                      className="h-full bg-purple-400 transition-all duration-300"
                      style={{ width: `${(i1 / 0.4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 w-16">{i1.toFixed(3)}A</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full" />
                  <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 transition-all duration-300"
                      style={{ width: `${(i2 / 0.4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 w-16">{i2.toFixed(3)}A</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <div className="flex-1 h-4 bg-gray-800 rounded overflow-hidden">
                    <div 
                      className="h-full bg-green-400 transition-all duration-300"
                      style={{ width: `${(i3 / 0.4) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-400 w-16">{i3.toFixed(3)}A</span>
                </div>
              </div>
            </div>

            {levelComplete && (
              <div className="p-3 bg-green-900/50 border border-green-500/50 text-green-300 text-center">
                ✓ All nodes scanned! Level complete.
              </div>
            )}
          </div>
        </div>
      </div>

      {!puzzleSolved && (
        <div className="absolute bottom-8 left-0 right-0 text-center z-10">
          <p className="text-gray-600 text-sm animate-pulse">
            Balance series resistors in each branch...
          </p>
        </div>
      )}
    </div>
  );
}
