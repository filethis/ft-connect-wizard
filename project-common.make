#
# Copyright 2018 FileThis, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

SHELL := /bin/bash


#------------------------------------------------------------------------------
# Project
#------------------------------------------------------------------------------


# Initialize

.PHONY: project-init-github
project-init-github:  ## Initialize GitHub project
	@repo_url="https://github.com/${GITHUB_USER}/${NAME}"; \
	if curl -s --head  --request GET $$repo_url | grep "200 OK" > /dev/null; then \
		echo GitHub project already exists; \
	else \
		echo Cannot reach GitHub repo: $$repo_url Do you need to create it?; \
		exit 1; \
	fi; \
	git init; \
	git add .; \
	git commit -m "First commit"; \
	git remote add origin $$repo_url; \
	git push -u origin master



# Serve

.PHONY: project-serve-polymer
project-serve-polymer:  ## Serve element demo locally using the Polymer server
	@echo http:localhost:${LOCAL_PORT}; \
	polymer serve --port ${LOCAL_PORT}


# Browse

.PHONY: browse
browse: project-browse  ## Shortcut for project-browse
	@echo Browser opened;


# Test

.PHONY: project-test-all
project-test-all:  ## Run tests on all browsers
	@polymer test

.PHONY: project-test-chrome
project-test-chrome:  ## Run tests on Chrome only
	@polymer test -l chrome

.PHONY: project-test-firefox
project-test-firefox:  ## Run tests on Firefox only
	@polymer test -l firefox

.PHONY: project-test-safari
project-test-safari:  ## Run tests on Safari only
	@polymer test -l safari


#------------------------------------------------------------------------------
# Distribution
#------------------------------------------------------------------------------


.PHONY: dist-clean
dist-clean:  ## Clean distribution
	@rm -rf ./build/; \
	rm -rf ./dist/;


# Build

# polymer-bundler: https://github.com/Polymer/tools/tree/master/packages/bundler
# crisper: https://github.com/PolymerLabs/crisper
# babel: https://babeljs.io/
# uglifyjs: https://github.com/mishoo/UglifyJS2
# WebPack: https://webpack.js.org/

.PHONY: dist-build
dist-build:  ## Build distribution
	@mkdir ./build/; \
	mkdir ./dist/; \
	echo Dependencies...; \
	rsync -rP \
	    --exclude=bower_components \
	    --exclude=build \
	    --exclude=dist \
	    --exclude=test \
	    ./ ./build; \
	[ -z "${SRC_DIR}" ] && rsync -rP --copy-links ../bower_components ./build; \
    pushd ./build > /dev/null; \
	echo Vulcanizing...; \
	polymer-bundler \
	    ${SRC_DIR}${NAME}.html \
	    --rewrite-urls-in-templates \
	    --inline-scripts \
	    --inline-css \
	    --out-file ${NAME}.vulcanized.html; \
	echo Splitting...; \
	crisper \
	    --source ${NAME}.vulcanized.html \
	    --html ${NAME}.split.html \
	    --js ${NAME}.js; \
	echo Transpiling...; \
	babel \
	    ${NAME}.js \
	    --out-file ${NAME}.es5.js; \
	echo Minifying...; \
	cp \
	    ${NAME}.es5.js \
	    ${NAME}.minified.js; \
    popd > /dev/null; \
	echo Distribution...; \
	[ ! -z "${SRC_DIR}" ] && mkdir ./dist/${SRC_DIR}; \
    cp ./build/${NAME}.split.html ./dist/${SRC_DIR}${NAME}.html; \
    cp ./build/${NAME}.minified.js ./dist/${SRC_DIR}${NAME}.js; \
    cp index.html ./dist/index.html;


#	polymer-bundler \
#	    ${NAME}.html \
#	    --rewrite-urls-in-templates \
#	    --inline-scripts \
#	    --inline-css \
#	    --exclude ../ \
#	    --out-file ./build/${NAME}.vulcanized.html; \

#	polymer-bundler \
#	    ${NAME}.html \
#	    --rewrite-urls-in-templates \
#	    --inline-scripts \
#	    --inline-css \
#	    --out-file ./build/${NAME}.vulcanized.html; \

#	echo Transpiling...; \
#	babel \
#	    ${NAME}.js \
#	    --presets /usr/local/lib/node_modules/babel-preset-es2015 \
#	    --out-file ${NAME}.es5.js; \

#	echo Transpiling...; \
#	cp \
#	    ${NAME}.js \
#	    ${NAME}.es5.js; \

#	echo Minifying...; \
#	uglifyjs \
#	    ${NAME}.es5.js \
#	    --compress \
#	    --output ${NAME}.minified.js; \

#	echo Minifying...; \
#	cp \
#	    ${NAME}.es5.js \
#	    ${NAME}.minified.js; \


#.PHONY: dist-build
#dist-build:  ## Build distribution
#	polymer build;

.PHONY: dist-merge
dist-merge:  ## Merge distribution into parent
	@python ../../bin/merge.py --project-name=${NAME} --src-dir-path=./dist --dst-dir-path=../../dist/

.PHONY: clean
clean: dist-clean  ## Shortcut for dist-clean
	@echo Cleaned distribution;

.PHONY: build
build: dist-build  ## Shortcut for dist-build
	@echo Built distribution;

.PHONY: merge
merge: dist-merge  ## Shortcut for dist-merge
	@echo Merged distribution;


# Publish docs

.PHONY: artifact-publish-docs
artifact-publish-docs: artifact-publish-docs-versioned artifact-publish-docs-latest  ## Release both the versioned and latest element docs
	@echo Pubished both versioned and latest element docs

.PHONY: artifact-publish-docs-versioned
artifact-publish-docs-versioned:  ## Release versioned element docs
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync ./build/docs s3://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/docs/;

.PHONY: artifact-publish-docs-latest
artifact-publish-docs-latest:  ## Release latest element docs
	@aws-vault exec ${AWS_VAULT_PROFILE} -- aws s3 sync ./build/docs s3://${PUBLICATION_DOMAIN}/${NAME}/latest/docs/

.PHONY: artifact-invalidate-docs-latest
artifact-invalidate-docs-latest:  ## Invalidate CDN distribution of latest element docs
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; else aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/latest/docs/*"; fi


#------------------------------------------------------------------------------
# Publications
#------------------------------------------------------------------------------


# Browse published docs

.PHONY: publication-browse-docs-versioned
publication-browse-docs-versioned:  ## Open the published, versioned docs in browser
	@open https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/docs/index.html;

.PHONY: publication-browse-docs-latest
publication-browse-docs-latest:  ## Open the published, latest docs in browser
	@open https://${PUBLICATION_DOMAIN}/${NAME}/latest/docs/index.html;


# Print URL of published docs

.PHONY: publication-url-docs-versioned
publication-url-docs-versioned:  ## Print the published, versioned docs url
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/${VERSION}/docs/index.html;

.PHONY: publication-url-docs-latest
publication-url-docs-latest:  ## Print the published, latest docs url
	@echo https://${PUBLICATION_DOMAIN}/${NAME}/latest/docs/index.html;


#------------------------------------------------------------------------------
# Git
#------------------------------------------------------------------------------

.PHONY: git-add
git-add:  ## Add all git changes, interactively
	git add -A --interactive

.PHONY: git-add-dry-run
git-add-dry-run:  ## Do a "dry run" of adding all changes so they will be printed out
	git add -A -n;

.PHONY: git-add-fast
git-add-fast:  ## Add all git changes non-interactively
	git add -A

.PHONY: git-commit
git-commit:  ## Commit all git changes, prompting for a checkin message
	git commit || echo nothing to commit

.PHONY: git-commit-fast
git-commit-fast:  ## Commit all git changes with a worthless message
	git commit -m "WIP" || echo nothing to commit

.PHONY: git-push
git-push:  ## Push from Git repository
	git push

.PHONY: git-pull
git-pull:  ## Pull from Git repository
	git pull

.PHONY: git-status
git-status:  ## Print git status
	@git status -s


#------------------------------------------------------------------------------
# GitHub
#------------------------------------------------------------------------------

.PHONY: github-browse-repo
github-browse-repo:  ## Open URL of project GitHub repository page
	@open https://github.com/${GITHUB_USER}/${NAME}

.PHONY: github-url-repo
github-url-repo:  ## Print URL of project GitHub repository page
	@echo https://github.com/${GITHUB_USER}/${NAME}


#------------------------------------------------------------------------------
# Bower
#------------------------------------------------------------------------------

.PHONY: bower-info
bower-info:  ## Print information about published Bower package
	@echo Current: ${VERSION}; \
	bower info ${NAME};

.PHONY: bower-install-packages
bower-install-packages:  ## Install all Bower packages specified in bower.json file, using symlinks for FileThis projects.
	@mkdir -p ./bower_components; \
	python ../../bin/bower-install.py True ${GITHUB_USER_ABBREV}

.PHONY: bower-install-packages-prod
bower-install-packages-prod:  ## Install all Bower packages specified in bower.json file
	@mkdir -p ./bower_components; \
	python ../../bin/bower-install.py False ${GITHUB_USER_ABBREV}

.PHONY: bower-clean-packages
bower-clean-packages:  ## Clean all installed bower packages.
	@cd ./bower_components; \
	find . -mindepth 1 -maxdepth 1 -exec rm -rf {} +;

.PHONY: bower-reinstall-packages
bower-reinstall-packages: bower-clean-packages bower-install-packages  ## Clean and reinstall all bower packages using symlinks for FileThis projects.

.PHONY: bower-reinstall-packages-prod
bower-reinstall-packages-prod: bower-clean-packages bower-install-packages-prod  ## Clean and reinstall all bower packages.


#------------------------------------------------------------------------------
# Source
#------------------------------------------------------------------------------

.PHONY: source-find-version-everywhere
source-find-version-everywhere:  ## Find and print versions of this project in use by all peer projects
	@echo Current: ${VERSION}; \
	find ../.. -name bower.json -print | xargs grep "${GITHUB_USER}/${NAME}#^[0-9]\+.[0-9]\+.[0-9]\+" || echo Not used;

.PHONY: source-set-version-everywhere
source-set-version-everywhere:
	python ../../bin/set-version-everywhere.py ${NAME} ${VERSION} ../..; \
	echo Set version in all projects that depend on this one

.PHONY: source-git-tag-version-and-push
source-git-tag-version-and-push:  ## Tag with current version and push tags to remote for the git project. Usually invoked as part of a release via 'release' target.
	@if [[ $$(git tag --list v${VERSION}) ]]; then \
		echo Tag v${VERSION} already applied; \
	else \
		git tag -a v${VERSION} -m '${VERSION}'; \
	fi; \
	git push --tags;

.PHONY: source-bump-version
source-bump-version:  ## Increment the patch version number.
	@NEW_VERSION=`../../bin/increment_version.sh -p ${VERSION}`; \
	COMMAND=s/VERSION=[0-9][0-9]*.[0-9][0-9]*.[0-9][0-9]*/VERSION=$$NEW_VERSION/g; \
	sed -i .bak $$COMMAND ./Makefile && rm ./Makefile.bak; \
	echo "Bumped ${VERSION} ---> $$NEW_VERSION"; \
	python ../../bin/set-version-everywhere.py  ${NAME} $$NEW_VERSION ../..; \
	echo Set version in all projects that depend on this one

.PHONY: source-release
source-release: source-set-version-everywhere git-add-fast git-commit-fast git-push source-git-tag-version-and-push  ## Release source version of project.
	@echo Released version ${VERSION} of \"${NAME}\" project
#source-release: source-set-version-everywhere git-add-fast git-commit-fast git-push source-git-tag-version-and-push bower-register publish-github-pages  ## Release source version of project.
#	@echo Released version ${VERSION} of \"${NAME}\" project


#------------------------------------------------------------------------------
# Help
#------------------------------------------------------------------------------

.PHONY: help
help:  ## Print Makefile usage. See: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -h -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-38s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help