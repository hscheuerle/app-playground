FROM ruby:3.0.0 as build

WORKDIR /app

COPY . /app

RUN bash ./compile.sh

FROM nginx:1.23.3

COPY nginx.conf /etc/nginx/nginx.conf

COPY conf /etc/nginx/conf.d

COPY --from=build /app/build/ /etc/nginx/conf.d

COPY static-html /usr/share/nginx/html

COPY static-assets /usr/share/nginx/assets

RUN mkdir -p /usr/share/GeoIP

COPY GeoIP /usr/share/GeoIP

# Cache path
RUN mkdir /cache && chown nginx /cache

# Daemon off for heroku, on for others
CMD nginx -g 'daemon off;' 
