# Gunakan base image Python yang ringan
FROM python:3.9-slim

# Tentukan direktori kerja
WORKDIR /app

# Salin file requirements.txt dan install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Salin kode aplikasi (tanpa folder model)
COPY ./app/ ./app/

# Ekspos port yang digunakan FastAPI
EXPOSE 8000

# Perintah untuk menjalankan FastAPI dengan uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]