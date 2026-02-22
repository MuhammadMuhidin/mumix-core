# ---------- STAGE 1 : DEPEDENCIES ----------
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ---------- STAGE 2 : RUNTIME ----------
FROM node:20-alpine

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 4000

CMD ["node", "src/server.js"]