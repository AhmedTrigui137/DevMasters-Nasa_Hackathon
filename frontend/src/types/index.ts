export interface AgeGroup {
  id: string;
  name: string;
  range: string;
  sensitivities: string[];
  description: string;
}

export interface AsthmaSeverity {
  id: string;
  name: string;
  level: number;
  description: string;
  triggers: string[];
}

export interface EnvironmentalData {
  id: string;
  lat: number;
  lng: number;
  name: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
    hcho: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
  };
  pollen: number;
  aqi: number;
}

export interface RiskZone {
  id: string;
  lat: number;
  lng: number;
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  data: EnvironmentalData;
}

export interface FilterState {
  ageGroup: string;
  asthmaSeverity: string;
}