.PHONY: build
build: setup
	bun run ./script/build.ts

.PHONY: lint
lint: lint-biome lint-tsc

.PHONY: lint-biome
lint-biome: setup
	bun x @biomejs/biome check

.PHONY: lint-tsc
lint-tsc: setup
	bun x tsc --noEmit --project ./tsconfig.json

.PHONY: format
format: setup
	bun x @biomejs/biome format --write

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: deploy
deploy: clean build upload purge-cache post-deploy

.PHONY: clean
clean:
	rm -rf ./dist ./package-lock.json

.PHONY: reset
reset: clean
	rm -rf ./node_modules

.PHONY: roll-cubing
roll-cubing: setup
	git pull
	bun x @lgarron-bin/repo dependencies --package-manager bun roll --commit-using git cubing
	git push
	make deploy

.PHONY: roll-@cubing/icons
roll-@cubing/icons:
	git pull
	bun x @lgarron-bin/repo dependencies --package-manager bun roll --commit-using git @cubing/icons
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

.PHONY: upload
upload: clean build
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
healthcheck-fastly-subdomain: setup
	bun run ./script/healthcheck/fastly-subdomain.ts

.PHONY: healthcheck-cdn
healthcheck-cdn: setup
	bun x playwright install
	bun run ./script/healthcheck/cdn.ts

.PHONY: healthcheck-success-ping
healthcheck-success-ping: setup
	bun run ./script/healthcheck/success-ping.ts

.PHONY: post-deploy
post-deploy: setup healthcheck-fastly-subdomain healthcheck-cdn
