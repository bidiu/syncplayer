# specify the node base image with your desired version node:<version>
FROM node:8.9.1

# Create app directory
WORKDIR /usr/src/app

# By default, node api server will listen on 3000.
# Note that by chaning the follow port won't change the ports the API server is listening.
# Instead, you also need to change the source code accordingly (./app.js)
# But it's not recommanded to change the port (you might break some CORS features).
EXPOSE 3000

# From docker offical docs
# (https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/):
# 1. Put mutiple params to mutiples lines with backslash so that it's
#    version-contorl friendly
# 2. You should avoid RUN apt-get upgrade or dist-upgrade.
# 3. Always combine RUN apt-get update with apt-get install in the same 
#    RUN statement
RUN apt-get update && apt-get install -y \
    build-essential \
    ruby-full

RUN gem install sass

# global npm packages
RUN npm install -g serve@6.5.8

# set up environment variables
ENV REACT_APP_ENV=production

COPY . .

# for release candidate environment (tagged with 'scanner-app:rc')
CMD npm install && npm run start-production
