FROM node:20 AS base
WORKDIR /usr/src/app

FROM base AS build
COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm ci --include=dev
COPY . .
RUN npm run build
FROM nginx:1.25-alpine AS prod
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
