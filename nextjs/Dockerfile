FROM node:21-alpine3.18

ADD . /app
WORKDIR /app


# Install any needed packages specified in package.json
RUN npm cache clean --force
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
