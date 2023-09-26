FROM node:18-alpine as BUILD_IMAGE

WORKDIR /app/frontend

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

