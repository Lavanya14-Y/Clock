from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="ChronoLux",
    version="4.0.0",
    description="Premium real-time clock engine"
)


# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# ROOT
# ==========================================================

@app.get("/")
async def root():

    return {
        "app": "ChronoLux",
        "version": "4.0.0",
        "status": "online",
        "message": "Premium Time Engine is running"
    }


# ==========================================================
# HEALTH
# ==========================================================

@app.get("/health")
async def health():

    return {
        "status": "healthy",
        "service": "ChronoLux",
        "engine": "Real-Time",
        "version": "4.0.0"
    }


# ==========================================================
# REAL TIME API
# ==========================================================

@app.get("/api/time")
async def get_time():

    now = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    return {
        "hour": now.hour,
        "minute": now.minute,
        "second": now.second,
        "millisecond": now.microsecond // 1000,

        "day": now.strftime("%A"),

        "date": now.strftime(
            "%d %B %Y"
        ),

        "timezone": "Asia/Kolkata",

        "timezone_name":
            "India Standard Time",

        "timestamp":
            now.isoformat()
    }


# ==========================================================
# RUN
# ==========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )