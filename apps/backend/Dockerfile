FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
RUN npm install

COPY . .
RUN npm --workspace @apps/backend run prisma:generate
RUN npm --workspace @apps/backend run build

EXPOSE 3001
CMD ["sh", "-c", "npm --workspace @apps/backend run prisma:generate && npm --workspace @apps/backend run start"]
