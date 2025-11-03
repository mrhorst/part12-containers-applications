FROM node:20

WORKDIR /usr/src/app

COPY . .

RUN npm install

# dont forget -- --host so we can access it from our machine
CMD ["npm", "run", "dev", "--", "--host"]