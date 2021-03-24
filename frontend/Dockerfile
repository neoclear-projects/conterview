FROM node

ENV REACT_APP_SERVER https://www.conterview.com

RUN npm install -g serve

WORKDIR /home/app

COPY ./package.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD ["serve", "-s", "build"]