FROM node

WORKDIR /home/app

COPY ./package.json ./

RUN npm install --legacy-peer-deps

COPY . .

CMD node app.js
