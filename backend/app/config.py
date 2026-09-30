import os


DEFAULT_FRONTEND_ORIGINS = (
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
)


def get_frontend_origins() -> list[str]:
    configured_origins = os.getenv("FRONTEND_ORIGIN", "")
    origins = [origin.strip() for origin in configured_origins.split(",") if origin.strip()]

    for default_origin in DEFAULT_FRONTEND_ORIGINS:
        if default_origin not in origins:
            origins.append(default_origin)

    return origins


def get_leetcode_timeout() -> float:
    configured_timeout = os.getenv("LEETCODE_TIMEOUT_SECONDS", "10")
    try:
        timeout = float(configured_timeout)
    except ValueError:
        return 10.0

    return max(timeout, 1.0)
