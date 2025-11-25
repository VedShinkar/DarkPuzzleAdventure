// Electrical simulation core logic for "The Phantom of the Powerbound Manor"

export class ElectricalSimulation {
  // Ohm's Law: I = V / R
  static calculateCurrent(voltage: number, resistance: number): number {
    if (resistance === 0) return 0;
    return voltage / resistance;
  }

  // Power Law: P = V * I
  static calculatePower(voltage: number, current: number): number {
    return voltage * current;
  }

  // Power from V and R: P = V * (V / R) = V^2 / R
  static calculatePowerFromVR(voltage: number, resistance: number): number {
    if (resistance === 0) return 0;
    return (voltage * voltage) / resistance;
  }

  // Series Resistance: R_total = R1 + R2 + R3...
  static calculateSeriesResistance(resistances: number[]): number {
    return resistances.reduce((sum, r) => sum + r, 0);
  }

  // Parallel Resistance: 1/R_total = 1/R1 + 1/R2 + 1/R3
  static calculateParallelResistance(resistances: number[]): number {
    if (resistances.length === 0) return 0;
    const reciprocalSum = resistances.reduce((sum, r) => {
      if (r === 0) return sum;
      return sum + 1 / r;
    }, 0);
    if (reciprocalSum === 0) return 0;
    return 1 / reciprocalSum;
  }

  // Brightness Mapping: brightness = clamp(P / P_max, 0, 1)
  static calculateBrightness(power: number, maxPower: number): number {
    return this.clamp(power / maxPower, 0, 1);
  }

  // Fan Speed Mapping: speed = k * I
  static calculateFanSpeed(current: number, speedConstant: number = 100): number {
    return current * speedConstant;
  }

  // Beacon/Glow Mapping: glow = P / targetPower
  static calculateGlow(power: number, targetPower: number): number {
    if (targetPower === 0) return 0;
    return power / targetPower;
  }

  // Utility: Clamp value between min and max
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // Check if value is within range
  static isInRange(value: number, target: number, tolerance: number): boolean {
    return Math.abs(value - target) <= tolerance;
  }

  // Check if value is within percentage tolerance
  static isWithinPercentage(value: number, target: number, percentage: number): boolean {
    const tolerance = target * (percentage / 100);
    return this.isInRange(value, target, tolerance);
  }
}
