import { NextResponse } from "next/server";

// Hardcoded flight details database
const flightSchedules = {
  CA840: {
    number: "CA840",
    airline: "Air China",
    aircraft: "Airbus A350-900 (B-307A)",
    origin: "Barcelona El Prat",
    originCode: "BCN",
    originTerminal: "T1",
    destination: "Shanghai Pudong",
    destinationCode: "PVG",
    destinationTerminal: "T2",
    durationMinutes: 755, // 12h 35m
    depHour: 12,
    depMin: 10,
    arrHour: 6,
    arrMin: 45,
    gateDep: "Gate B26",
    gateArr: "Gate D84",
    baggageBelt: "Belt 5"
  },
  CA571: {
    number: "CA571",
    airline: "Air China",
    aircraft: "Airbus A350-900 (B-308C)",
    origin: "Beijing Capital",
    originCode: "PEK",
    originTerminal: "T3",
    destination: "Barcelona El Prat",
    destinationCode: "BCN",
    destinationTerminal: "T1",
    durationMinutes: 750, // 12h 30m
    depHour: 11,
    depMin: 50,
    arrHour: 18,
    arrMin: 20,
    gateDep: "Gate E19",
    gateArr: "Gate C12",
    baggageBelt: "Belt 14"
  },
  "3U8974": {
    number: "3U8974",
    airline: "Sichuan Airlines",
    aircraft: "Airbus A321-200 (B-8645)",
    origin: "Shanghai Hongqiao",
    originCode: "SHA",
    originTerminal: "T2",
    destination: "Chongqing Jiangbei",
    destinationCode: "CKG",
    destinationTerminal: "T3",
    durationMinutes: 165, // 2h 45m
    depHour: 12,
    depMin: 40,
    arrHour: 15,
    arrMin: 25,
    gateDep: "Gate 48",
    gateArr: "Gate F12",
    baggageBelt: "Belt 3"
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get("code") || "").toUpperCase().replace(/\s/g, "");

  if (!code) {
    return NextResponse.json({ success: false, error: "Flight code is required" }, { status: 400 });
  }

  // Get flight config, fallback to simulated custom flight details if not preset
  let flight = flightSchedules[code];
  if (!flight) {
    // Generate a beautiful simulated flight for any code the user searches
    flight = {
      number: code,
      airline: code.startsWith("IB") ? "Iberia" : code.startsWith("LH") ? "Lufthansa" : "Línea Aérea",
      aircraft: "Boeing 787-9 Dreamliner",
      origin: "Madrid Barajas",
      originCode: "MAD",
      originTerminal: "T4",
      destination: "Pekín Capital",
      destinationCode: "PEK",
      destinationTerminal: "T3",
      durationMinutes: 690, // 11h 30m
      depHour: 10,
      depMin: 0,
      arrHour: 4,
      arrMin: 30,
      gateDep: "Gate A18",
      gateArr: "Gate E04",
      baggageBelt: "Belt 8"
    };
  }

  // Live status simulation based on current time
  const now = new Date();
  const currentHour = now.getHours();
  
  let status = "PROGRAMADO";
  let progress = 0;
  let altitude = 0;
  let speed = 0;
  let location = "En terminal";
  let minutesRemaining = flight.durationMinutes;

  // Let's create an immersive live flight simulator
  // Since we want this to show live status when tested at any time, we will also simulate
  // that the flight is currently flying if the current hour is between 12:00 and 20:00 (for demonstration)
  // or use the actual schedule if we are on the flight dates.
  
  const isDemoActive = currentHour >= 10 && currentHour <= 22;
  
  if (isDemoActive) {
    status = "EN EL AIRE";
    const elapsedMinutes = ((currentHour - 10) * 60) + now.getMinutes();
    progress = Math.min(Math.round((elapsedMinutes / flight.durationMinutes) * 100), 99);
    
    if (progress > 5 && progress < 95) {
      altitude = 38000;
      speed = 885;
      
      // Select simulated waypoint
      if (progress < 25) location = "Cruzando espacio aéreo Europeo";
      else if (progress < 50) location = "Sobrevolando Europa Oriental";
      else if (progress < 75) location = "Sobrevolando Asia Central";
      else location = "Iniciando aproximación al destino";
      
      minutesRemaining = Math.max(flight.durationMinutes - elapsedMinutes, 10);
    } else if (progress >= 95) {
      status = "ATERRIZADO";
      progress = 100;
      altitude = 0;
      speed = 0;
      location = "Puerta de embarque asignada";
      minutesRemaining = 0;
    } else {
      altitude = 12000;
      speed = 450;
      location = "Ascendiendo a altitud de crucero";
      minutesRemaining = flight.durationMinutes - elapsedMinutes;
    }
  } else {
    // If night time, we simulate it has landed successfully or scheduled
    if (currentHour > 22 || currentHour < 6) {
      status = "ATERRIZADO";
      progress = 100;
      altitude = 0;
      speed = 0;
      location = "Vuelo completado - Equipaje en cinta";
      minutesRemaining = 0;
    } else {
      status = "PROGRAMADO";
      progress = 0;
      altitude = 0;
      speed = 0;
      location = "Puerta Cerrada - Preparación de cabina";
      minutesRemaining = flight.durationMinutes;
    }
  }

  const hoursLeft = Math.floor(minutesRemaining / 60);
  const minsLeft = minutesRemaining % 60;
  const timeRemainingStr = status === "EN EL AIRE" ? `${hoursLeft}h ${minsLeft}m` : status === "ATERRIZADO" ? "Llegado" : "Pendiente";

  return NextResponse.json({
    success: true,
    data: {
      ...flight,
      status,
      progress,
      altitude,
      speed,
      location,
      timeRemainingStr,
      lastUpdated: now.toISOString()
    }
  });
}
