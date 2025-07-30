FROM node:21

WORKDIR /user/src/app

COPY . .

RUN npm install 

EXPOSE 3000

#npm run start:dev
CMD ["npm","run","start:dev"]

