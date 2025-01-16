FROM node:16-alpine as development

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

# Run Prisma generate
RUN npx prisma generate

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/dist ./dist
COPY .env .env

CMD ["node", "dist/index.js"]

#  docker build -t comsec-backend .
#  docker run --name comsec-backend -p 5001:5001 comsec-backend