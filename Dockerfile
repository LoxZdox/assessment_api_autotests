FROM node:19

WORKDIR .

COPY package*.json ./
RUN npm install

COPY . .

CMD [ "node", "index.js", "../feeds/feed.json" ]