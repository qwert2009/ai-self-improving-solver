from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import create_engine
from backend.config import settings
from backend.models import Base

async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

async_session_maker = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

sync_engine = create_engine(
    settings.DATABASE_URL.replace("+aiosqlite", ""),
    echo=settings.DEBUG,
    future=True
)

sync_session_maker = sessionmaker(
    bind=sync_engine,
    class_=Session,
    expire_on_commit=False
)


async def get_db() -> AsyncSession:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def get_sync_db() -> Session:
    db = sync_session_maker()
    try:
        yield db
    finally:
        db.close()
