FROM node:22.17.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["sh", "-c", "npm run migration:run && node dist/main.js"]
