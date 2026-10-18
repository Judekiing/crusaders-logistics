/**
 * Rate Calculation Engine for Freight & Courier Logistics
 */

const SERVICE_TIERS = {
  express_air: {
    id: "express_air",
    name: "Apex Priority Air Express",
    baseFee: 95.0,
    ratePerKg: 11.80,
    transitTime: "1-2 Business Days",
    icon: "Plane",
    description: "Time-critical air courier with guaranteed delivery slot and next-day arrival."
  },
  standard_ground: {
    id: "standard_ground",
    name: "Apex Intermodal Ground Freight",
    baseFee: 45.0,
    ratePerKg: 2.85,
    transitTime: "3-5 Business Days",
    icon: "Truck",
    description: "Cost-effective nationwide road and rail network for commercial palletized cargo."
  },
  ocean_cargo: {
    id: "ocean_cargo",
    name: "Apex Ocean Maritime FCL/LCL",
    baseFee: 180.0,
    ratePerKg: 0.85,
    transitTime: "14-22 Business Days",
    icon: "Ship",
    description: "Maximum efficiency for large-scale container loads and bulk international freight."
  },
  cold_chain: {
    id: "cold_chain",
    name: "Apex BioPharma Active Cold-Chain",
    baseFee: 150.0,
    ratePerKg: 8.40,
    transitTime: "2-4 Business Days",
    icon: "ThermometerSnowflake",
    description: "Certified GDP temperature-controlled transit (2°C-8°C / -20°C) with continuous IoT telemetry."
  },
  last_mile: {
    id: "last_mile",
    name: "Apex Urban Last-Mile Express",
    baseFee: 30.0,
    ratePerKg: 4.50,
    transitTime: "Same-Day / Next-Day",
    icon: "PackageCheck",
    description: "Dedicated electric courier fleet for rapid metropolitan and direct-to-door delivery."
  }
};

export function calculateFreightRates({
  originCountry = "US",
  destCountry = "US",
  weightKg = 10,
  lengthCm = 40,
  widthCm = 30,
  heightCm = 25,
  pieces = 1,
  declaredValue = 0,
  insuranceRequired = false,
  signatureRequired = false,
  selectedService = null
}) {
  const actualWeight = Math.max(1, parseFloat(weightKg) || 1);
  const l = Math.max(10, parseFloat(lengthCm) || 10);
  const w = Math.max(10, parseFloat(widthCm) || 10);
  const h = Math.max(10, parseFloat(heightCm) || 10);
  const qty = Math.max(1, parseInt(pieces) || 1);

  // Volumetric weight (IATA formula: L x W x H in cm / 5000) per piece * qty
  const volumetricWeightPerPiece = (l * w * h) / 5000;
  const totalVolumetricWeight = volumetricWeightPerPiece * qty;
  const chargeableWeight = Math.max(actualWeight, totalVolumetricWeight);

  // International crossing multiplier
  const isInternational = (originCountry || '').toUpperCase() !== (destCountry || '').toUpperCase();
  const intlMultiplier = isInternational ? 1.45 : 1.0;

  // Add-on fees
  const insuranceFee = insuranceRequired && declaredValue > 0 ? Math.max(25, declaredValue * 0.0075) : 0;
  const signatureFee = signatureRequired ? 15.0 : 0.0;

  const results = Object.values(SERVICE_TIERS).map(service => {
    const baseCargoCost = (service.baseFee + (service.ratePerKg * chargeableWeight)) * intlMultiplier;
    const fuelSurcharge = baseCargoCost * 0.12; // 12% standard aviation/diesel fuel index
    const customsClearanceFee = isInternational ? 65.0 : 0.0;
    const subtotal = baseCargoCost + fuelSurcharge + customsClearanceFee + insuranceFee + signatureFee;
    const total = Math.round(subtotal * 100) / 100;

    return {
      serviceId: service.id,
      name: service.name,
      transitTime: service.transitTime,
      icon: service.icon,
      description: service.description,
      breakdown: {
        baseFee: Math.round(service.baseFee * intlMultiplier * 100) / 100,
        weightCharge: Math.round(service.ratePerKg * chargeableWeight * intlMultiplier * 100) / 100,
        chargeableWeightKg: Math.round(chargeableWeight * 10) / 10,
        volumetricWeightKg: Math.round(totalVolumetricWeight * 10) / 10,
        actualWeightKg: actualWeight,
        fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
        customsClearanceFee: Math.round(customsClearanceFee * 100) / 100,
        insuranceFee: Math.round(insuranceFee * 100) / 100,
        signatureFee: Math.round(signatureFee * 100) / 100,
      },
      currency: "USD",
      totalPrice: total
    };
  });

  return {
    chargeableWeight: Math.round(chargeableWeight * 10) / 10,
    volumetricWeight: Math.round(totalVolumetricWeight * 10) / 10,
    actualWeight,
    isInternational,
    options: results,
    recommendedService: results[0]
  };
}
