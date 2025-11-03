FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build --chown=node:node /usr/src/app /usr/src/app
RUN npm ci --only=production
USER node
CMD ["npm", "start"]