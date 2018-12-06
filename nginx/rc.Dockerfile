FROM nginx:1.13.5

# copy `the-host` config file into image
WORKDIR /etc/nginx/conf.d
COPY the-host.conf .

# copy nginx config file into image
WORKDIR /etc/nginx
COPY nginx.conf .
