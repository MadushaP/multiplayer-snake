# build environment
FROM node:13.12.0-alpine as build
RUN mkdir -p app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./


CMD ["npm" ,"start"]
