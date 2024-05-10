FROM node:20.11.0 as build

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY . .

# Install dependencies using pnpm
RUN pnpm install

WORKDIR /server/
