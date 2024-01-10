FROM node:18.19.0-alpine3.19 AS builder

RUN npm --version

WORKDIR /app/back

COPY ./back/package.json .
COPY ./back/package-lock.json .
COPY ./back/knexfile.js .
COPY ./back/migrations ./migrations
COPY ./back/src ./src
COPY ./back/tsconfig.json .

RUN npm ci 
RUN npm run build

WORKDIR /app/front

COPY ./front/package.json .
COPY ./front/package-lock.json .
COPY ./front/postcss.config.js .
COPY ./front/svelte.config.js .
COPY ./front/tailwind.config.js .
COPY ./front/tsconfig.json .
COPY ./front/vite.config.ts .
COPY ./front/src ./src
COPY ./front/static ./static

RUN npm ci
RUN npm run build

FROM node:18.19.0-alpine3.19

USER root
RUN apk add --no-cache postgresql postgresql-contrib

RUN mkdir /var/lib/postgresql/data
RUN chown -R postgres: /var/lib/postgresql
RUN mkdir /run/postgresql
RUN chown -R postgres: /run/postgresql
USER postgres

RUN initdb -D /var/lib/postgresql/data
VOLUME /var/lib/postgresql/data


USER root
RUN apk add --no-cache supervisor

RUN adduser -D microeye
USER microeye

WORKDIR /app/back

COPY --from=builder /app/back/dist ./dist
COPY --from=builder /app/back/package.json ./
COPY --from=builder /app/back/package-lock.json ./
COPY --from=builder /app/back/knexfile.js ./
COPY --from=builder /app/back/migrations ./migrations

RUN npm ci --only=production

WORKDIR /app/front
COPY --from=builder /app/front/build ./build
COPY --from=builder /app/front/package.json ./

ENV MICROEYE_FRONT_HANDLER_PATH=/app/front/build/handler.js
ENV MICROEYE_DB_NAME=postgres
ENV MICROEYE_MUST_START_FRONT=true

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 3000
STOPSIGNAL SIGINT

USER root
WORKDIR /app
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
