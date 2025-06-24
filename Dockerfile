# Dockerfile - Final Version for Frontend

### TAHAP 1: BUILD ASET FRONTEND

# Menggunakan base image Node.js yang ringan

FROM node:18-alpine as builder

# Menentukan direktori kerja di dalam container

WORKDIR /app

# Salin file-file konfigurasi dan package manager terlebih dahulu

COPY package\*.json ./
COPY webpack.\*.js ./
COPY tailwind.config.js .
COPY postcss.config.js .

# Salin index.html dan seluruh folder public ke dalam image

COPY index.html .
COPY public ./public

# Install semua dependencies dari package.json

RUN npm install

# Salin seluruh isi folder src (source code)

COPY ./src ./src

# Jalankan perintah build untuk production

RUN npm run build

### TAHAP 2: SAJIKAN DENGAN NGINX

# Menggunakan base image Nginx yang sangat ringan

FROM nginx:stable-alpine

# Salin HANYA hasil build (folder 'dist') dari tahap sebelumnya ke folder web Nginx

COPY --from=builder /app/dist /usr/share/nginx/html

# Ekspos port 80 (port default Nginx)

EXPOSE 80

# Perintah untuk menjalankan server Nginx

CMD ["nginx", "-g", "daemon off;"]