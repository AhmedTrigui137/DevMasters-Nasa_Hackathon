from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# load .env if present
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

async_engine = None
async_session: sessionmaker | None = None

def init_db():
    """Initialize and return the async engine. Safe to call multiple times."""
    global async_engine, async_session
    if not DATABASE_URL:
        return None
    if async_engine is None:
        # Normalize common Postgres URL forms to use asyncpg driver so SQLAlchemy
        # doesn't try to import psycopg2 on environments where it's not installed.
        db_url = DATABASE_URL.strip()
        # If user provided a sync-style URL like 'postgres://' or 'postgresql://',
        # convert to the asyncpg form 'postgresql+asyncpg://'
        if db_url.startswith('postgres://'):
            db_url = db_url.replace('postgres://', 'postgresql+asyncpg://', 1)
        elif db_url.startswith('postgresql://') and '+asyncpg' not in db_url:
            db_url = db_url.replace('postgresql://', 'postgresql+asyncpg://', 1)
        async_engine = create_async_engine(db_url, echo=False, future=True)
        async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
    return async_engine

def get_session() -> AsyncSession:
    if async_session is None:
        raise RuntimeError('DB session is not initialized')
    return async_session()
