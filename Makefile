NODE_OPTS=-w "/usr/src" --rm -v "$(realpath .):/usr/src" -e "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/src/node_modules/.bin" -e 'API=http://gep.localhost'

NODE_IMAGE=yarn:10
DOCKER=docker run $(NODE_OPTS) -ti $(NODE_IMAGE)

install:
	docker build -t yarn:10 docker-image
	$(DOCKER) yarn install

build:
	$(DOCKER) yarn build

dev-serve:
	docker run $(NODE_OPTS) -u www-data -ti -p 9000:9000 $(NODE_IMAGE) yarn serve

dev-bash:
	docker run $(NODE_OPTS) -u www-data -ti -p 9000:9000 $(NODE_IMAGE) bash
