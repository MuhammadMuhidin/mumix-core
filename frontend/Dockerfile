# ---------- STAGE 1 : DEPEDENCIES ----------
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci

# ---------- STAGE 2 : BUILD ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build-time variable
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PRIVATE_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PRIVATE_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ---------- STAGE 3 : RUNTIME ----------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

RUN npm prune --omit=dev

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

CMD ["npm", "start"]