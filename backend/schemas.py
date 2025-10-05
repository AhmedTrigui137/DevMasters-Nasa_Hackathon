from pydantic import BaseModel
from typing import Dict, Any

class Pollutants(BaseModel):
    pm25: float
    pm10: float
    no2: float
    o3: float
    hcho: float


class Weather(BaseModel):
    temperature: float
    humidity: float
    windSpeed: float
    pressure: float


class EnvironmentalDataSchema(BaseModel):
    id: str
    lat: float
    lng: float
    name: str
    pollutants: Pollutants
    weather: Weather
    pollen: float
    aqi: float


class RiskZoneSchema(BaseModel):
    id: str
    lat: float
    lng: float
    name: str
    riskLevel: str
    riskScore: float
    data: EnvironmentalDataSchema
