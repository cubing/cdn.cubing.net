# This Makefile is a wrapper around the scripts from `package.json`.
# https://github.com/lgarron/Makefile-scripts

# Note: the first command becomes the default `make` target.
NPM_COMMANDS = build build-js clean

.PHONY: $(NPM_COMMANDS)
$(NPM_COMMANDS):
	npm run $@

# We write the npm commands to the top of the file above to make shell autocompletion work in more places.
DYNAMIC_NPM_COMMANDS = $(shell node -e 'console.log(Object.keys(require("./package.json").scripts).join(" "))')
UPDATE_MAKEFILE_SED_ARGS = "s/^NPM_COMMANDS = .*$$/NPM_COMMANDS = ${DYNAMIC_NPM_COMMANDS}/" Makefile
.PHONY: update-Makefile
update-Makefile:
	if [ "$(shell uname -s)" = "Darwin" ] ; then sed -i "" ${UPDATE_MAKEFILE_SED_ARGS} ; fi
	if [ "$(shell uname -s)" != "Darwin" ] ; then sed -i"" ${UPDATE_MAKEFILE_SED_ARGS} ; fi

.PHONY: deploy
deploy: clean build upload purge-cache

SFTP_PATH = "cubing_deploy@towns.dreamhost.com:~/cdn.cubing.net/"
URL       = "https://cdn.cubing.net/js/"

.PHONY: upload
upload:
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		./dist/ \
		${SFTP_PATH}
	echo "\nDone deploying. Go to ${URL}\n"

.PHONY: purge-cache
purge-cache:
	@echo ""
	@echo "To enable dev mode (Cloudflare cache disabled), use:"
	@echo "https://dash.cloudflare.com/208031631d4ac31c91e4bd4d0442d15d/cubing.net/caching/configuration"
	@echo ""
	@echo "To purge the cache once, touch your YubiKey now. (May need to enter a PIN first.)"
	@echo "Ctrl-C to cancel"
	@echo ""
# We have to put this in a separate target so that the shell command doesn't hold up the echo statements:
	@make purge-cache-curl

.PHONY: purge-cache-curl
purge-cache-curl:
	curl -X POST \
		"https://api.cloudflare.com/client/v4/zones/7b91bf928f250f49db1f4dcdff946304/purge_cache" \
		-H "Authorization: Bearer "$(shell env PINENTRY_USER_DATA=USE_CURSES=1 gpg --decrypt ${HOME}/.ssh/env/CLOUDFLARE_CUBING_NET_CACHE_TOKEN.gpg) \
		-H "Content-Type:application/json" \
		--data '{"purge_everything":true}' # purge cubing.net cache
