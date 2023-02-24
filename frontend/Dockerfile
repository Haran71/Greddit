FROM node:18.12.1 as build-stage

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

