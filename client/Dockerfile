FROM node:alpine

WORKDIR /app
COPY package.json .
RUN apk add git
RUN npm install --loglevel verbose
COPY . .

# RUN npm run build

CMD ["npm", "start"]