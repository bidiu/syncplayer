# specify the node base image with your desired version node:<version>
FROM node:8.9.1

# create app directory
WORKDIR /usr/src/app

# expose ports
EXPOSE 4010 9229 1113 1114

# install global npm packages
RUN npm install -g nodemon

ENV THE_HOST_API_ENV=dev

# for dev (tagged with 'the-host-api:dev')
CMD npm install && npm start
