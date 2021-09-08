FROM node:12

RUN if [ ! -f '/usr/local/bin/yarn' ]; then npm install -g yarn; fi;
RUN mkdir --parents /var/www/.yarn && mkdir --parents /var/www/.cache && chown -R www-data:www-data /var/www/

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/src/node_modules/.bin
WORKDIR /usr/src

run mkdir /.yarn && touch /.yarnrc && chmod 666 /.yarnrc && chmod 777 /.yarn

CMD ["yarn", "serve"]
