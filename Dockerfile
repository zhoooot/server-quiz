FROM node:18-alpine AS build

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json .

RUN npm install --production

ENV DATABASE_URL=
ENV JWT_SECRET=

RUN echo "#!/bin/sh" > /app/entrypoint.sh
RUN echo "set -e" >> /app/entrypoint.sh
RUN echo "npm run mikro-orm:migration:up" >> /app/entrypoint.sh
RUN echo "npm run start:prod" >> /app/entrypoint.sh

EXPOSE 4000
CMD [ "/bin/sh", "./entrypoint.sh" ]
