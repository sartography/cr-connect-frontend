### STAGE 1: Build ###
FROM node:alpine AS builder

RUN mkdir /crc-frontend
WORKDIR /crc-frontend

ADD package.json /crc-frontend/

COPY . /crc-frontend/

RUN npm install && \
    npm run build:staging

### STAGE 2: Run ###
FROM nginx:alpine
COPY --from=builder /crc-frontend/dist/* /usr/share/nginx/html/
