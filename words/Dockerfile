FROM node:current-alpine

# ENV NODE_ENV=production

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

# RUN npm install --production
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
