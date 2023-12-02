FROM node:21-alpine3.17

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /app/package.json

RUN npm install --only=prod

COPY . .

RUN npm run build

CMD ["npm", "start"]


