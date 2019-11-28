FROM node:10

RUN mkdir /crc-frontend
WORKDIR /crc-frontend

ADD package.json /crc-frontend/

COPY . /crc-frontend/

RUN npm install

RUN npm run-script build

CMD ["npm", "run-script", "start"]

EXPOSE 4200
