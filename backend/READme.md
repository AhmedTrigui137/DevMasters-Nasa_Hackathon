
Database (Supabase/Postgres) setup
----------------------------------

This project supports using a Postgres database hosted on Supabase. Set the `DATABASE_URL` environment variable before starting the backend. Example (in the repo root):

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Supabase connection string.
2. Start the backend (it will create tables at startup if `DATABASE_URL` is set):

	```bash
	python main.py
	```

Notes:
- We use `sqlmodel` + `asyncpg` for async DB access.
- For production you should run migrations (alembic) instead of `create_all`.
Getting started (local)
-----------------------

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your Postgres/Supabase connection string.
2. Install Python deps (prefer a venv):

```bash
pip install -r requirements.txt
```

3. Create DB tables (development):

```bash
python -c "from db import init_db, async_engine; init_db(); import asyncio; async def _():
	from sqlmodel import SQLModel
	async with async_engine.begin() as conn:
		await conn.run_sync(SQLModel.metadata.create_all)
asyncio.run(_)"
```

4. Run the backend:

```bash
python main.py
```

Migrations (recommended)
------------------------

This project adds `alembic` to `requirements.txt` but does not include a generated migration folder. To scaffold migrations:

```bash
alembic init alembic
# then edit alembic/env.py to configure the async engine and import your models
# and run:
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

If you want, I can scaffold a minimal `alembic/` folder configured for `sqlmodel` + `asyncpg` in this repo.

