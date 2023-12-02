FROM node:21-alpine3.17

WORKDIR /app

COPY . .

RUN npm install --only=prod

RUN npm run build

CMD ["npm", "start"]