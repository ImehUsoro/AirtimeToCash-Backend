FROM node:14-alpine AS compilation

ENV NODE_ENV=development

USER node

WORKDIR /home/node/app

COPY ./package.json .

RUN yarn

COPY . .

RUN yarn tsc

EXPOSE 3000

VOLUME [ "$(pwd)/node_modules:/home/node/app/node_modules" ];

CMD ["yarn", "dev:start"]
