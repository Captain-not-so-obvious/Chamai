# Build do frontend
FROM node:20 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Backend + frontend juntos
FROM node:20

WORKDIR /app

# Copia backend package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o backend
COPY . .

# Copia o frontend buildado para a pasta frontend/dist no backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expõe a porta do backend
EXPOSE 3000

CMD ["node", "app.js"]
