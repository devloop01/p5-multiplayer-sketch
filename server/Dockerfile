FROM node:20.11.0 as build

RUN npm install -g pnpm
RUN npm install -g turbo

WORKDIR /app

COPY . .

RUN pnpm install

RUN turbo build

WORKDIR /app/server/
