# LeetLens Backend

FastAPI backend for LeetLens.

## Local development

```bash
python -m venv .venv
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

The Phase 1 health endpoint is available at `http://localhost:8000/health`.
