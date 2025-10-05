from fastapi import FastAPI, WebSocket
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Support running as a package or as a script (python main.py).
try:
    # when run as a package (recommended): backend.main
    from . import schemas, crud
except ImportError:
    # when running `python main.py` from the backend/ folder
    import schemas
    import crud

app = FastAPI(title="Cosmic Health API")

# Simple in-memory set of connected websockets for broadcasts (dev only)
connected_websockets: set[WebSocket] = set()

# DB init (optional - uses DATABASE_URL env var for Supabase/Postgres)
try:
    from .db import init_db, DATABASE_URL, async_engine
    from .models import SQLModel as _SQLModel  # type: ignore
except Exception:
    init_db = None
    DATABASE_URL = None
    async_engine = None
    _SQLModel = None


async def broadcast_message(message: dict):
    text = jsonable_encoder(message)
    to_remove = []
    for ws in connected_websockets:
        try:
            await ws.send_json(text)
        except Exception:
            to_remove.append(ws)
    for ws in to_remove:
        try:
            connected_websockets.remove(ws)
        except KeyError:
            pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event('startup')
async def startup_event():
    if init_db and DATABASE_URL:
        engine = init_db()
        # create tables (sync helper via run_sync)
        try:
            from sqlmodel import SQLModel
            if async_engine is not None:
                async with async_engine.begin() as conn:
                    await conn.run_sync(SQLModel.metadata.create_all)
        except Exception:
            pass


@app.get("/api/v1/environmental-points", response_model=List[schemas.EnvironmentalDataSchema])
async def list_points():
    return await crud.list_points()


@app.post("/api/v1/environmental-points", response_model=schemas.EnvironmentalDataSchema)
async def ingest_point(point: schemas.EnvironmentalDataSchema):
    saved = await crud.create_point(point)
    # compute risk zone for the new point and broadcast to connected WS clients
    try:
        zones = crud.compute_risk_zones([saved], ageGroup='young-adults', severity='mild-persistent')
        if zones:
            await broadcast_message({"type": "new_point", "payload": jsonable_encoder(zones[0])})
    except Exception:
        pass
    return saved


@app.get("/api/v1/risk-zones", response_model=List[schemas.RiskZoneSchema])
async def get_risk_zones(ageGroup: str = 'young-adults', severity: str = 'mild-persistent'):
    points = await crud.list_points()
    return crud.compute_risk_zones(points, ageGroup, severity)


@app.websocket("/ws/updates")
async def ws_updates(ws: WebSocket):
    await ws.accept()
    connected_websockets.add(ws)
    try:
        while True:
            # keep the connection open; clients may send ping messages
            await ws.receive_text()
    except Exception:
        pass
    finally:
        try:
            connected_websockets.remove(ws)
        except KeyError:
            pass
        await ws.close()


if __name__ == '__main__':
    # Allow running the backend directly (convenience for local dev)
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=False)
