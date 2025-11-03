FROM node:20

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .


# dont forget -- --host so we can access it from our machine
CMD ["npm", "run", "dev", "--", "--host"]