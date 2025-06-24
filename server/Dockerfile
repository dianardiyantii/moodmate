# Gunakan base image Node.js yang ringan
FROM node:18-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json untuk menginstall dependencies
COPY package*.json ./
RUN npm install

# Salin sisa source code
COPY . .

# Ekspos port yang digunakan aplikasi
EXPOSE 9000

# Perintah untuk menjalankan server
CMD [ "npm", "start" ]