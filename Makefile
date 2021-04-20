NODE_OPTS=--rm -v "$(realpath .):/usr/src" 

NODE_IMAGE=yarn:10
DOCKER=docker run -u $(shell id -u)  $(NODE_OPTS) -ti $(NODE_IMAGE)

install:
	docker build -t yarn:10 docker-image
	$(DOCKER) yarn install

build:
	$(DOCKER) yarn build

upload: build
	cd dist && ../../vpy-gep/bin/aws s3 sync . s3://gep-explorer-public

dev-serve:
	docker run $(NODE_OPTS) -e 'API=http://gep.localhost' -u www-data -ti -p 9000:9000 $(NODE_IMAGE) yarn serve

dev-bash:
	docker run $(NODE_OPTS) -u www-data -ti -p 9000:9000 $(NODE_IMAGE) bash

serve:
	cd dist && python -mSimpleHTTPServer 9000 .
