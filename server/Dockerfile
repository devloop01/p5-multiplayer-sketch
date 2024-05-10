FROM node:20.11.0 as build

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm build:server

WORKDIR /app/server/
