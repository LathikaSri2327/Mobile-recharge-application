# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
RUN cd backend && npm install

COPY backend/ ./backend/

# Copy frontend files
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 10000

CMD ["node", "backend/server.js"]