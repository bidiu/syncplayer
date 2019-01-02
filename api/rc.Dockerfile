# specify the node base image with your desired version node:<version>
FROM node:8.9.1

# create app directory
WORKDIR /usr/src/app

# expose ports
EXPOSE 4010 9229 1113 1114

# From docker offical docs
# (https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/):
# 1. Put mutiple params to mutiples lines with backslash so that it's
#    version-contorl friendly
# 2. You should avoid RUN apt-get upgrade or dist-upgrade.
# 3. Always combine RUN apt-get update with apt-get install in the same 
#    RUN statement
RUN apt-get update && apt-get install -y
    # build-essential gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

RUN wget https://dl.google.com/linux/direct/google-chrome-unstable_current_amd64.deb
RUN dpkg -i google-chrome-unstable_current_amd64.deb; apt-get -fy install

# install global npm packages
RUN npm install -g nodemon

ENV THE_HOST_API_ENV=rc
# do not download bundled Chromium during installation step during `npm install`
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY . .

# for dev (tagged with 'the-host-api:dev')
CMD npm install && npm run start-rc
