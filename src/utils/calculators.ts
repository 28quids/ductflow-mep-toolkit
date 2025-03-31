
// Duct Sizing Functions
export const calculateDuctSize = (
  flowRate: number,
  velocity: number,
  ductType: 'round' | 'rectangular' = 'round',
  aspectRatio: number = 1
): {
  area: number;
  diameter?: number;
  width?: number;
  height?: number;
  equivalentDiameter?: number;
  frictionLoss: number;
} => {
  // Convert flow rate from m³/s to m³/h if needed
  const flowRateM3S = flowRate / 3600;
  
  // Calculate duct area (m²)
  const area = flowRateM3S / velocity;
  
  // Calculate friction loss using approximate formula (Pa/m)
  // Using a simplified version of the Colebrook-White equation
  const frictionLoss = (0.025 * velocity * velocity * 1.2) / (2 * Math.sqrt(area / Math.PI) * 2);
  
  if (ductType === 'round') {
    // Calculate diameter for circular duct
    const diameter = 2 * Math.sqrt(area / Math.PI);
    return {
      area,
      diameter,
      frictionLoss
    };
  } else {
    // Calculate dimensions for rectangular duct
    const width = Math.sqrt(area * aspectRatio);
    const height = width / aspectRatio;
    
    // Calculate equivalent diameter for rectangular duct
    const equivalentDiameter = 1.3 * Math.pow((width * height), 0.625) / Math.pow((width + height), 0.25);
    
    return {
      area,
      width,
      height,
      equivalentDiameter,
      frictionLoss
    };
  }
};

// Pipe Sizing Functions
export const calculatePipeSize = (
  flowRate: number, // L/s
  velocity: number, // m/s
  material: string
): {
  diameter: number;
  pressureLoss: number;
  reynoldsNumber: number;
  recommendedSize: number;
} => {
  // Convert flow rate from L/s to m³/s
  const flowRateM3S = flowRate / 1000;
  
  // Calculate pipe area (m²)
  const area = flowRateM3S / velocity;
  
  // Calculate diameter (m)
  const diameter = 2 * Math.sqrt(area / Math.PI);
  
  // Roughness factor based on material (mm)
  const roughnessFactor = materialRoughness(material);
  
  // Calculate Reynolds number
  const viscosity = 0.000001; // kinematic viscosity of water at 20°C (m²/s)
  const reynoldsNumber = (velocity * diameter) / viscosity;
  
  // Calculate friction factor using Colebrook-White approximation
  const frictionFactor = 0.25 / Math.pow(Math.log10((roughnessFactor/1000)/(3.7 * diameter) + 5.74/Math.pow(reynoldsNumber, 0.9)), 2);
  
  // Calculate pressure loss using Darcy-Weisbach equation (Pa/m)
  const density = 1000; // water density (kg/m³)
  const pressureLoss = frictionFactor * (density * velocity * velocity) / (2 * diameter);
  
  // Find closest standard pipe size (in mm)
  const recommendedSize = findStandardPipeSize(diameter * 1000);
  
  return {
    diameter: diameter * 1000, // Convert to mm
    pressureLoss,
    reynoldsNumber,
    recommendedSize
  };
};

// Helper function to get material roughness (mm)
const materialRoughness = (material: string): number => {
  const roughnessValues: Record<string, number> = {
    'copper': 0.0015,
    'pvc': 0.0015,
    'steel': 0.045,
    'cast_iron': 0.26,
    'concrete': 1.0,
    'galvanized_steel': 0.15
  };
  
  return roughnessValues[material] || 0.0015;
};

// Helper function to find closest standard pipe size (mm)
const findStandardPipeSize = (diameter: number): number => {
  // Common standard pipe sizes in mm
  const standardSizes = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300];
  
  let closestSize = standardSizes[0];
  let minDifference = Math.abs(diameter - closestSize);
  
  for (const size of standardSizes) {
    const difference = Math.abs(diameter - size);
    if (difference < minDifference) {
      minDifference = difference;
      closestSize = size;
    }
  }
  
  return closestSize;
};

// VAV Box Sizing Functions
export const calculateVAVBoxSize = (
  designAirflow: number,
  minAirflow: number,
  staticPressure: number
): {
  recommendedSize: string;
  pressureDrop: number;
  neckVelocity: number;
  soundLevel: string;
} => {
  // Standard VAV box sizes (inch)
  const standardSizes = [6, 8, 10, 12, 14, 16, 18, 24];
  
  // Find appropriate VAV box size based on airflow
  let boxSize = 6; // Default minimum size
  
  for (const size of standardSizes) {
    const maxAirflow = size * size * 25; // Approximate maximum airflow for this box size (cfm)
    if (designAirflow <= maxAirflow) {
      boxSize = size;
      break;
    }
  }
  
  // Calculate neck velocity (fpm)
  const neckArea = Math.PI * Math.pow(boxSize / 24, 2); // Convert to feet
  const neckVelocity = designAirflow / neckArea;
  
  // Calculate pressure drop (approximate formula)
  const pressureDrop = 0.07 * Math.pow(neckVelocity / 1000, 2);
  
  // Determine sound level (approximation)
  let soundLevel = "Low";
  if (neckVelocity > 1800) {
    soundLevel = "High";
  } else if (neckVelocity > 1200) {
    soundLevel = "Medium";
  }
  
  return {
    recommendedSize: `${boxSize}"`,
    pressureDrop: pressureDrop * staticPressure,
    neckVelocity,
    soundLevel
  };
};

// Pump Head Loss Functions
export const calculatePumpHead = (
  flowRate: number, // L/s
  pipeLength: number, // m
  pipeSize: number, // mm
  fittingsCount: Record<string, number>, // count of each fitting type
  material: string
): {
  frictionLoss: number; // m
  fittingsLoss: number; // m
  totalHead: number; // m
  pumpPower: number; // kW
} => {
  // Convert pipe size from mm to m
  const pipeDiameter = pipeSize / 1000;
  
  // Calculate velocity (m/s)
  const velocity = (flowRate / 1000) / (Math.PI * Math.pow(pipeDiameter / 2, 2));
  
  // Calculate friction loss using Darcy-Weisbach
  const roughness = materialRoughness(material) / 1000; // Convert to m
  const reynoldsNumber = (velocity * pipeDiameter) / 0.000001; // kinematic viscosity of water
  
  // Calculate friction factor using simplified Colebrook-White equation
  const frictionFactor = 0.25 / Math.pow(Math.log10(roughness/(3.7 * pipeDiameter) + 5.74/Math.pow(reynoldsNumber, 0.9)), 2);
  
  // Calculate pipe friction loss (m)
  const frictionLoss = frictionFactor * (pipeLength / pipeDiameter) * (velocity * velocity) / (2 * 9.81);
  
  // Calculate fittings loss
  let fittingsLoss = 0;
  const kValues: Record<string, number> = {
    'elbow_90': 0.75,
    'elbow_45': 0.4,
    'tee': 1.0,
    'gate_valve': 0.2,
    'globe_valve': 10.0,
    'check_valve': 2.5,
    'entrance': 0.5,
    'exit': 1.0
  };
  
  for (const [fitting, count] of Object.entries(fittingsCount)) {
    const kValue = kValues[fitting] || 0;
    fittingsLoss += count * kValue * (velocity * velocity) / (2 * 9.81);
  }
  
  // Calculate total head (m)
  const totalHead = frictionLoss + fittingsLoss;
  
  // Calculate pump power (kW)
  // P = ρ × g × Q × H / (η × 1000)
  // Where:
  // - ρ = water density (1000 kg/m³)
  // - g = acceleration due to gravity (9.81 m/s²)
  // - Q = flow rate (m³/s)
  // - H = total head (m)
  // - η = pump efficiency (assuming 0.7)
  const pumpPower = (1000 * 9.81 * (flowRate / 1000) * totalHead) / (0.7 * 1000);
  
  return {
    frictionLoss,
    fittingsLoss,
    totalHead,
    pumpPower
  };
};
