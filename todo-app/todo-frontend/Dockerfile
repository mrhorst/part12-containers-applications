FROM node:20 AS base
WORKDIR /usr/src/app
ENV VITE_BACKEND_URL=http://localhost:3000

FROM base AS test
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run test

FROM base AS build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80