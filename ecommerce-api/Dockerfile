FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --legacy-peer-deps
COPY . .

RUN npx prisma generate
RUN npm run build

# Production ---
FROM node:20-alpine AS production
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --production --legacy-peer-deps

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/src/main.js"]