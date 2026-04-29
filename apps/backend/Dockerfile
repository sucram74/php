FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
RUN npm install

COPY . .
RUN npm --workspace @apps/backend run prisma:generate
RUN npm --workspace @apps/backend run build

EXPOSE 3001
CMD ["sh", "-c", "npm --workspace @apps/backend run prisma:generate && npm --workspace @apps/backend run start"]
