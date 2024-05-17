FROM node:16-alpine3.18 as builder

RUN apk add --no-cache --virtual .build-deps git && \
    git clone https://github.com/journey-ad/Moe-Counter.git /usr/local/Moe-Counter && \
    cd /usr/local/Moe-Counter && \
    yarn install && \
    apk del .build-deps 

FROM node:16-alpine3.18
LABEL MAINTAINER="ilkeiii"
WORKDIR /usr/local/Moe-Counter
COPY --from=builder /usr/local/Moe-Counter ./
ENTRYPOINT ["yarn", "start"]