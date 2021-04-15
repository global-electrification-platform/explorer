FROM node:10
RUN if [ ! -f '/usr/local/bin/yarn' ]; then npm install -g yarn; fi;
RUN mkdir --parents /var/www/.yarn && mkdir --parents /var/www/.cache && chown -R www-data:www-data /var/www/
