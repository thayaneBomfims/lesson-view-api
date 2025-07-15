# Etapa 1: build da aplicação
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: imagem final
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
