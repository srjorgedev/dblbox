FROM node:22.13.1

WORKDIR /src

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 1234

CMD ["npm", "run", "start"]