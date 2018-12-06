# specify the node base image with your desired version node:<version>
FROM node:8.9.1

# create app directory
WORKDIR /usr/src/app

# expose ports
EXPOSE 4010

# install global npm packages
RUN npm install -g nodemon

ENV THE_HOST_API_ENV=rc

COPY . .

# for dev (tagged with 'the-host-api:dev')
CMD npm install && npm run start-rc
