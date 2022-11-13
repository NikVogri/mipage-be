FROM node:16-alpine3.14

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --only=prod

COPY  . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]