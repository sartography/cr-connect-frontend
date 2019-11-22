FROM node:10

RUN mkdir /crc-frontend
WORKDIR /crc-frontend

ADD package.json /crc-frontend/

COPY . /crc-frontend/

RUN npm install

CMD ["ng", "serve"]

EXPOSE 4200
