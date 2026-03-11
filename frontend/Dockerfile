# Stage 1: Build
FROM node:20-alpine AS build

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file di dipendenza e le installa (sfrutta la cache del layer di Docker)
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copia il resto dell'applicazione ed effettua la build
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copia il nostro file di configurazione custom per NGINX (gestione SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Rimuovi i file di default di nginx e copia quelli creati dallo stage di build
RUN rm -rf /usr/share/nginx/html/*
# La directory "frontend" corrisponde al nome del progetto specificato nel tuo angular.json o package.json.
# Tipicamente Angular >= 17 crea i build in "dist/<nome-progetto>/browser". Adjusta il path se necessario.
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Esponi la porta 80 standard di NGINX
EXPOSE 80

# Avvia NGINX (default da container entrypoint)
CMD ["nginx", "-g", "daemon off;"]
