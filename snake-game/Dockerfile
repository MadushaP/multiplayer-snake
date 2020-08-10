# stage: 1
FROM node:8 as react-build

# set working directory
WORKDIR '/app'

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start2"]
