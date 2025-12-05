FROM node:22.12.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npm test

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]