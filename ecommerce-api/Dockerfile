

# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json  ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

# Production
FROM node:20-alpine AS production
WORKDIR /app


COPY  --from=build app/dist ./dist
COPY  --from=build app/node_modules ./node_modules

EXPOSE 3000/tcp
CMD [ "node", "dist/main.js" ]