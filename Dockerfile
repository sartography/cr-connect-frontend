### STAGE 1: Build ###
FROM node AS builder

RUN mkdir /crc-frontend
WORKDIR /crc-frontend

ADD package.json /crc-frontend/
ADD package-lock.json /crc-frontend/

COPY . /crc-frontend/

ARG build_config=staging
RUN npm install && \
    npm run build:$build_config

### STAGE 2: Run ###
FROM nginx:alpine
COPY --from=builder /crc-frontend/dist/* /usr/share/nginx/html/
COPY --from=builder /crc-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Script for substituting environment variables
COPY ./docker/substitute-env-variables.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Substitute environment variables in nginx configuration and index.html
ENTRYPOINT ["./entrypoint.sh", "/usr/share/nginx/html/index.html,/etc/nginx/conf.d/default.conf"]

### STAGE 3: Profit! ###
CMD ["nginx", "-g", "daemon off;"]
