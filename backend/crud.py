from typing import List
from pathlib import Path
import os

try:
    # package context
    from . import schemas
    from .db import get_session, init_db, DATABASE_URL
    from .models import EnvironmentalPoint
    from sqlmodel import select
    ASYNC_DB = True if DATABASE_URL else False
except Exception:
    # script context
    import schemas  # type: ignore
    ASYNC_DB = False

BASE = Path(__file__).resolve().parents[1]


def _mock_data():
    return [
        {
            'id': 'central-park',
            'lat': 40.7829,
            'lng': -73.9654,
            'name': 'Central Park Area',
            'pollutants': {'pm25': 8, 'pm10': 15, 'no2': 25, 'o3': 45, 'hcho': 2},
            'weather': {'temperature': 22, 'humidity': 55, 'windSpeed': 8, 'pressure': 1015},
            'pollen': 35,
            'aqi': 42,
        }
    ]


async def list_points() -> List[schemas.EnvironmentalDataSchema]:
    if ASYNC_DB:
        session = get_session()
        async with session as s:
            q = select(EnvironmentalPoint)
            res = await s.exec(q)
            rows = res.all()
            out = []
            for r in rows:
                out.append(schemas.EnvironmentalDataSchema(
                    id=r.id, lat=r.lat, lng=r.lng, name=r.name,
                    pollutants=r.pollutants or {}, weather=r.weather or {}, pollen=r.pollen or 0, aqi=r.aqi or 0
                ))
            return out
    else:
        return [schemas.EnvironmentalDataSchema(**r) for r in _mock_data()]


async def create_point(point: schemas.EnvironmentalDataSchema) -> schemas.EnvironmentalDataSchema:
    if ASYNC_DB:
        session = get_session()
        async with session as s:
            db_item = EnvironmentalPoint(
                id=point.id,
                lat=point.lat,
                lng=point.lng,
                name=point.name,
                pollutants=point.pollutants if isinstance(point.pollutants, dict) else (point.pollutants.dict() if hasattr(point.pollutants, 'dict') else {}),
                weather=point.weather if isinstance(point.weather, dict) else (point.weather.dict() if hasattr(point.weather, 'dict') else {}),
                pollen=point.pollen,
                aqi=point.aqi
            )
            s.add(db_item)
            await s.commit()
            return point
    else:
        return point


def compute_risk_zones(points: List[schemas.EnvironmentalDataSchema], ageGroup: str, severity: str) -> List[schemas.RiskZoneSchema]:
    zones = []
    for p in points:
        score = 0.0
        factors = 0
        try:
            for key in ['pm25', 'pm10', 'no2', 'o3', 'hcho']:
                val = None
                try:
                    val = getattr(p.pollutants, key) if hasattr(p.pollutants, key) else p.pollutants.get(key)
                except Exception:
                    val = p.pollutants.get(key) if isinstance(p.pollutants, dict) else None
                if val is None:
                    continue
                factors += 1
                norm = min(100.0, (val / (20.0 if key == 'pm25' else 50.0)) * 100.0)
                score += norm
        except Exception:
            pass
        score = score / max(1, factors)
        if score < 30:
            level = 'low'
        elif score < 65:
            level = 'medium'
        else:
            level = 'high'
        zones.append(schemas.RiskZoneSchema(
            id=p.id,
            lat=p.lat,
            lng=p.lng,
            name=p.name,
            riskLevel=level,
            riskScore=score,
            data=p
        ))
    return zones
from typing import List
import json
from pathlib import Path

try:
    from . import schemas
    from .db import get_session, init_db, DATABASE_URL
    from .models import EnvironmentalPoint
    from sqlmodel import select
    ASYNC_DB = True if DATABASE_URL else False
except Exception:
    from . import schemas
    ASYNC_DB = False

BASE = Path(__file__).resolve().parents[1]


def _mock_data():
    return [
        {
            'id': 'central-park',
            'lat': 40.7829,
            'lng': -73.9654,
            'name': 'Central Park Area',
            'pollutants': {'pm25': 8, 'pm10': 15, 'no2': 25, 'o3': 45, 'hcho': 2},
            'weather': {'temperature': 22, 'humidity': 55, 'windSpeed': 8, 'pressure': 1015},
            'pollen': 35,
            'aqi': 42,
        }
    ]


async def list_points() -> List[schemas.EnvironmentalDataSchema]:
    if ASYNC_DB:
        session = get_session()
        async with session as s:
            q = select(EnvironmentalPoint)
            res = await s.exec(q)
            rows = res.all()
            out = []
            for r in rows:
                pollutants = json.loads(r.pollutants)
                weather = json.loads(r.weather)
                out.append(schemas.EnvironmentalDataSchema(
                    id=r.id, lat=r.lat, lng=r.lng, name=r.name,
                    pollutants=pollutants, weather=weather, pollen=r.pollen, aqi=r.aqi
                ))
            return out
    else:
        return [schemas.EnvironmentalDataSchema(**r) for r in _mock_data()]


async def create_point(point: schemas.EnvironmentalDataSchema) -> schemas.EnvironmentalDataSchema:
    if ASYNC_DB:
        session = get_session()
        async with session as s:
            db_item = EnvironmentalPoint(
                id=point.id,
                lat=point.lat,
                lng=point.lng,
                name=point.name,
                pollutants=json.dumps(point.pollutants.dict() if hasattr(point.pollutants, 'dict') else point.pollutants),
                weather=json.dumps(point.weather.dict() if hasattr(point.weather, 'dict') else point.weather),
                pollen=point.pollen,
                aqi=point.aqi
            )
            s.add(db_item)
            await s.commit()
            return point
    else:
        return point


def compute_risk_zones(points: List[schemas.EnvironmentalDataSchema], ageGroup: str, severity: str) -> List[schemas.RiskZoneSchema]:
    zones = []
    for p in points:
        score = 0.0
        factors = 0
        try:
            for key in ['pm25', 'pm10', 'no2', 'o3', 'hcho']:
                val = None
                try:
                    val = getattr(p.pollutants, key) if hasattr(p.pollutants, key) else p.pollutants.get(key)
                except Exception:
                    val = p.pollutants.get(key) if isinstance(p.pollutants, dict) else None
                if val is None:
                    continue
                factors += 1
                norm = min(100.0, (val / (20.0 if key == 'pm25' else 50.0)) * 100.0)
                score += norm
        except Exception:
            pass
        score = score / max(1, factors)
        if score < 30:
            level = 'low'
        elif score < 65:
            level = 'medium'
        else:
            level = 'high'
        zones.append(schemas.RiskZoneSchema(
            id=p.id,
            lat=p.lat,
            lng=p.lng,
            name=p.name,
            riskLevel=level,
            riskScore=score,
            data=p
        ))
    return zones
from typing import List

# Support running as a package or as a script
try:
    from . import schemas
except ImportError:
    import schemas
import json
import os
from pathlib import Path

# Load mock data from frontend (fallback)
BASE = Path(__file__).resolve().parents[1]
FRONTEND_MOCK = BASE / 'frontend' / 'src' / 'data' / 'mockData.ts'


def _load_mock():
    # crude extraction: this file is TypeScript, so we'll embed a tiny static fallback
    # In production replace with DB
    return [
        {
            'id': 'central-park',
            'lat': 40.7829,
            'lng': -73.9654,
            'name': 'Central Park Area',
            'pollutants': {'pm25': 8, 'pm10': 15, 'no2': 25, 'o3': 45, 'hcho': 2},
            'weather': {'temperature': 22, 'humidity': 55, 'windSpeed': 8, 'pressure': 1015},
            'pollen': 35,
            'aqi': 42,
        }
    ]


def list_points() -> List[schemas.EnvironmentalDataSchema]:
    raw = _load_mock()
    return [schemas.EnvironmentalDataSchema(**r) for r in raw]


def create_point(point: schemas.EnvironmentalDataSchema) -> schemas.EnvironmentalDataSchema:
    # In prod: persist to DB. Here: echo
    return point


def compute_risk_zones(points: List[schemas.EnvironmentalDataSchema], ageGroup: str, severity: str) -> List[schemas.RiskZoneSchema]:
    # Very small port of frontend risk calculation - simple average of pollutant ratios
    zones = []
    for p in points:
        score = 0.0
        factors = 0
        try:
            # use pm25, pm10, no2, o3, hcho
            for key in ['pm25', 'pm10', 'no2', 'o3', 'hcho']:
                val = getattr(p.pollutants, key) if hasattr(p.pollutants, key) else p.pollutants.get(key)
                if val is None:
                    continue
                factors += 1
                # naive normalization
                norm = min(100.0, (val / (20.0 if key=='pm25' else 50.0)) * 100.0)
                score += norm
        except Exception:
            pass
        score = score / max(1, factors)
        if score < 30:
            level = 'low'
        elif score < 65:
            level = 'medium'
        else:
            level = 'high'
        zones.append(schemas.RiskZoneSchema(
            id=p.id,
            lat=p.lat,
            lng=p.lng,
            name=p.name,
            riskLevel=level,
            riskScore=score,
            data=p
        ))
    return zones
