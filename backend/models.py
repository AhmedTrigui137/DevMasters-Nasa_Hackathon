from sqlmodel import SQLModel, Field, Column
from typing import Optional
from pydantic import BaseModel
from sqlalchemy import JSON


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


class EnvironmentalPoint(SQLModel, table=True):
    id: Optional[str] = Field(default=None, primary_key=True)
    lat: float
    lng: float
    name: str
    # Persist structured JSON to the DB (Postgres JSONB when available)
    pollutants: Optional[dict] = Field(sa_column=Column(JSON), default=None)
    weather: Optional[dict] = Field(sa_column=Column(JSON), default=None)
    pollen: Optional[float] = None
    aqi: Optional[float] = None


class UserProfile(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    age_group: Optional[str] = None
    asthma_severity: Optional[str] = None
