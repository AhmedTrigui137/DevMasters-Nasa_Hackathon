import asyncio
import db
from sqlmodel import SQLModel
import socket
from urllib.parse import urlparse


def _mask_url(url: str) -> str:
    try:
        p = urlparse(url)
        userinfo = p.username or ''
        if p.password:
            userinfo += ':***'
        host = p.hostname or ''
        port = f":{p.port}" if p.port else ''
        return f"{p.scheme}://{userinfo}@{host}{port}/{p.path.lstrip('/')}"
    except Exception:
        return '(<invalid url>)'


async def main():
    engine = db.init_db()
    if engine is None:
        print('DATABASE_URL not set; skipping DB test')
        return
    # diagnostics: print masked normalized URL and DNS lookup
    raw = db.DATABASE_URL or ''
    print('Detected DATABASE_URL (masked):', _mask_url(raw))
    try:
        parsed = urlparse(raw)
        host = parsed.hostname
        port = parsed.port or 5432
        if host:
            print(f'Checking DNS for {host}:{port} ...')
            try:
                infos = socket.getaddrinfo(host, port)
                print('DNS lookup OK, resolved addresses:', {i[4][0] for i in infos})
            except socket.gaierror as e:
                print('DNS resolution failed:', e)
                print('This typically means the DB host is unreachable or the hostname is invalid.')
                print('Check your DATABASE_URL in backend/.env or use a local Postgres (docker-compose) for dev.')
                return
    except Exception:
        pass

    # use the module-level async_engine after initialization
    try:
        async with db.async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
        print('Tables created (or already exist)')
    except Exception as exc:
        print('Failed to connect to DB engine:')
        print(repr(exc))


if __name__ == '__main__':
    asyncio.run(main())
