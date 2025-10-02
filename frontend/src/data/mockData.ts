import { AgeGroup, AsthmaSeverity, EnvironmentalData } from '../types';

export const ageGroups: AgeGroup[] = [
  {
    id: 'children',
    name: 'Children',
    range: '< 12 years',
    description: 'Very sensitive to PM₂.₅, NO₂, O₃, humidity, pollen',
    sensitivities: ['pm25', 'no2', 'o3', 'humidity', 'pollen']
  },
  {
    id: 'teenagers',
    name: 'Teenagers',
    range: '12-18 years',
    description: 'Vulnerable to O₃, PM₂.₅, extreme temperatures',
    sensitivities: ['o3', 'pm25', 'temperature']
  },
  {
    id: 'young-adults',
    name: 'Young Adults',
    range: '19-40 years',
    description: 'Affected by urban/chemical pollution (NO₂, HCHO, PM₂.₅)',
    sensitivities: ['no2', 'hcho', 'pm25']
  },
  {
    id: 'adults',
    name: 'Adults',
    range: '41-65 years',
    description: 'Cumulative effects of pollution + climate (PM₂.₅, NO₂, heat/cold)',
    sensitivities: ['pm25', 'no2', 'temperature', 'humidity']
  },
  {
    id: 'seniors',
    name: 'Seniors',
    range: '> 65 years',
    description: 'Generalized hypersensitivity → all parameters critical',
    sensitivities: ['pm25', 'pm10', 'no2', 'o3', 'hcho', 'temperature', 'humidity', 'pollen']
  }
];

export const asthmaSeverities: AsthmaSeverity[] = [
  {
    id: 'mild-intermittent',
    name: 'Mild Intermittent',
    level: 1,
    description: 'Symptoms < 2 times/week',
    triggers: ['o3', 'no2', 'wind', 'temperature']
  },
  {
    id: 'mild-persistent',
    name: 'Mild Persistent',
    level: 2,
    description: 'Symptoms 2-6 times/week',
    triggers: ['o3', 'no2', 'wind', 'temperature', 'pm25', 'pm10', 'hcho', 'humidity']
  },
  {
    id: 'moderate-persistent',
    name: 'Moderate Persistent',
    level: 3,
    description: 'Daily symptoms',
    triggers: ['o3', 'no2', 'pm25', 'pm10', 'hcho', 'humidity', 'temperature', 'pressure']
  },
  {
    id: 'severe-persistent',
    name: 'Severe Persistent',
    level: 4,
    description: 'Continuous symptoms',
    triggers: ['pm25', 'pm10', 'no2', 'o3', 'hcho', 'temperature', 'humidity', 'pollen', 'pressure', 'wind']
  }
];

export const environmentalData: EnvironmentalData[] = [
  {
    id: 'central-park',
    lat: 40.7829,
    lng: -73.9654,
    name: 'Central Park Area',
    pollutants: { pm25: 8, pm10: 15, no2: 25, o3: 45, hcho: 2 },
    weather: { temperature: 22, humidity: 55, windSpeed: 8, pressure: 1015 },
    pollen: 35,
    aqi: 42
  },
  {
    id: 'times-square',
    lat: 40.7580,
    lng: -73.9855,
    name: 'Times Square',
    pollutants: { pm25: 18, pm10: 32, no2: 55, o3: 65, hcho: 8 },
    weather: { temperature: 24, humidity: 65, windSpeed: 5, pressure: 1012 },
    pollen: 55,
    aqi: 78
  },
  {
    id: 'brooklyn-bridge',
    lat: 40.7061,
    lng: -73.9969,
    name: 'Brooklyn Bridge Area',
    pollutants: { pm25: 15, pm10: 28, no2: 45, o3: 55, hcho: 6 },
    weather: { temperature: 23, humidity: 60, windSpeed: 12, pressure: 1018 },
    pollen: 45,
    aqi: 65
  },
  {
    id: 'battery-park',
    lat: 40.7033,
    lng: -74.0170,
    name: 'Battery Park',
    pollutants: { pm25: 12, pm10: 22, no2: 35, o3: 50, hcho: 4 },
    weather: { temperature: 21, humidity: 70, windSpeed: 15, pressure: 1020 },
    pollen: 40,
    aqi: 55
  },
  {
    id: 'high-line',
    lat: 40.7480,
    lng: -74.0048,
    name: 'High Line Park',
    pollutants: { pm25: 10, pm10: 18, no2: 30, o3: 40, hcho: 3 },
    weather: { temperature: 20, humidity: 50, windSpeed: 10, pressure: 1017 },
    pollen: 30,
    aqi: 48
  },
  {
    id: 'prospect-park',
    lat: 40.6602,
    lng: -73.9690,
    name: 'Prospect Park',
    pollutants: { pm25: 9, pm10: 16, no2: 28, o3: 38, hcho: 2 },
    weather: { temperature: 19, humidity: 48, windSpeed: 12, pressure: 1019 },
    pollen: 32,
    aqi: 45
  },
  {
    id: 'industrial-zone',
    lat: 40.7282,
    lng: -73.9942,
    name: 'Industrial Area',
    pollutants: { pm25: 25, pm10: 45, no2: 75, o3: 85, hcho: 12 },
    weather: { temperature: 26, humidity: 75, windSpeed: 3, pressure: 1008 },
    pollen: 65,
    aqi: 95
  },
  {
    id: 'midtown-east',
    lat: 40.7547,
    lng: -73.9707,
    name: 'Midtown East',
    pollutants: { pm25: 16, pm10: 30, no2: 50, o3: 60, hcho: 7 },
    weather: { temperature: 25, humidity: 62, windSpeed: 6, pressure: 1013 },
    pollen: 50,
    aqi: 72
  }
];