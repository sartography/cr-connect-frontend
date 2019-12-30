FROM node:10

RUN mkdir /crc-frontend
WORKDIR /crc-frontend

ADD package.json /crc-frontend/

COPY . /crc-frontend/

RUN npm install
RUN npm install -g @angular/cli@8.3.21

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0
