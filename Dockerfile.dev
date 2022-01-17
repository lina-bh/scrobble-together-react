FROM node:16-alpine

WORKDIR /app
COPY . ./
RUN npm install -g npm
RUN npm install --production --loglevel=error
USER node

CMD ["npm", "start"]