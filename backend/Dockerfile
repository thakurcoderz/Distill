FROM python:3.12-slim

WORKDIR /app

# Install dependencies in a separate layer so it's cached on re-builds
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

EXPOSE 8000

# Bind to 0.0.0.0 so Docker can route to it from other containers
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
