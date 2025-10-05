Missing / recommended items for backend and fullstack

1) Migrations (recommended)
- Alembic is added but needs configuration. Run `alembic init alembic` or use the provided `backend/alembic` as a starting point and run `alembic revision --autogenerate -m "initial"` then `alembic upgrade head`.

2) Authentication & Profiles
- No auth implemented. For Supabase, prefer Supabase Auth and pass JWT to backend; otherwise add FastAPI JWT auth.

3) WebSocket scaling
- Current in-memory broadcast set won't scale across multiple instances. Add Redis pub/sub or a message broker (Redis, NATS).

4) Tests & CI
- Add pytest tests for backend endpoints and simple frontend tests (Vitest).

5) Docker integration
- Ensure `alembic upgrade head` runs in the backend container startup or during deployment.

6) Data types & indexing
- Pollutants/weather use JSON column; consider adding GIN index on JSONB fields if you need fast queries.

7) Logging & Monitoring
- Add structured logging, Sentry or similar for errors in production.

8) Privacy & Secrets
- Do not commit `.env` with secrets. Use GitHub Secrets or environment variables in deployment.

If you'd like, I can:
- Fully scaffold Alembic migrations and generate an initial migration.
- Add Supabase Auth integration (verify JWT on backend).
- Add Redis-based pub/sub for WS broadcasting.
- Add a basic pytest test suite for backend endpoints.
