# This Makefile is a wrapper around the scripts from `package.json`.
# https://github.com/lgarron/Makefile-scripts

# Note: the first command becomes the default `make` target.
NPM_COMMANDS = build clean lint format

.PHONY: $(NPM_COMMANDS)
$(NPM_COMMANDS):
	bun run $@

# We write the npm commands to the top of the file above to make shell autocompletion work in more places.
DYNAMIC_NPM_COMMANDS = $(shell node -e 'console.log(Object.keys(require("./package.json").scripts).join(" "))')
UPDATE_MAKEFILE_SED_ARGS = "s/^NPM_COMMANDS = .*$$/NPM_COMMANDS = ${DYNAMIC_NPM_COMMANDS}/" Makefile
.PHONY: update-Makefile
update-Makefile:
	if [ "$(shell uname -s)" = "Darwin" ] ; then sed -i "" ${UPDATE_MAKEFILE_SED_ARGS} ; fi
	if [ "$(shell uname -s)" != "Darwin" ] ; then sed -i"" ${UPDATE_MAKEFILE_SED_ARGS} ; fi

.PHONY: setup
setup:
	bun install

.PHONY: deploy
deploy: clean build upload purge-cache test-fastly-access

.PHONY: roll-cubing
roll-cubing:
	git pull
	make roll-cubing-commit
	git push
	make deploy

# NOT `.PHONY`!
../cubing.js:
	$(error `cubing.js` is not available in the parent folder of this repo)

.PHONY: link-cubing.js
link-cubing.js: ../cubing.js
	cd ../cubing.js && make link
	bun link cubing

.PHONY: unlink-cubing.js
unlink-cubing.js:
	bun install cubing

.PHONY: deploy-with-linked-cubing.js
deploy-with-linked-cubing.js: link-cubing.js deploy unlink-cubing.js

.PHONY: serve-locally
serve-locally: build
	@echo "-------------------------"
	@echo "🌐 http://localhost:3336"
	@echo "-------------------------"
	caddy run --adapter caddyfile --config script/dev.Caddyfile

# TODO: dev mode with automatic rebuild.
.PHONY: serve-locally-with-linked-cubing.js
serve-locally-with-linked-cubing.js: link-cubing.js serve-locally

.PHONY: roll-cubing-commit
roll-cubing-commit:
	bash script/roll-cubing-commit.bash

.PHONY: upload
upload:
	bun x @cubing/deploy

.PHONY: purge-cache
purge-cache: purge-cache-curl

# `make` tries to evaluate the subshell for `purge-cache-curl` before running
# any commands, so we have run this in a separate target to ensure it prints
# first.
.PHONY: purge-cache-curl-notification
purge-cache-curl-notification:
	@echo "Purging Fastly cache…"

.PHONY: purge-cache-curl
purge-cache-curl: purge-cache-curl-notification
	@curl -i -X POST \
		"https://api.fastly.com/service/UO1y1jdgzMdkTqbTp7oT23/purge_all" \
		-H "Fastly-Key: $(shell cat ~/.ssh/secrets/FASTLY_CUBING_NET_API_TOKEN.txt)" \
		-H "Accept: application/json"
	@echo ""

.PHONY: healthcheck-fastly-subdomain
healthcheck-fastly-subdomain:
	bun run ./script/healthcheck/fastly-subdomain.ts

.PHONY: healthcheck-cdn
healthcheck-cdn:
	bun run ./script/healthcheck/cdn.ts
