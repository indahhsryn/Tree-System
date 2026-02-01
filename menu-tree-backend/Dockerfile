# ============ DEVELOPMENT ============
FROM node:18-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 30000
CMD ["npm", "run", "start:dev"]


# ============ BUILD ============
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ============ PRODUCTION ============
FROM node:18-alpine AS prod

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package.json .

EXPOSE 30000
CMD ["npm", "run", "start:prod"]
