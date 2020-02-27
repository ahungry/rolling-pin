start:
	node ./server.js

test:
	node ./tests/all.js

test-mw:
	node ./tests/mw.js

test-int:
	./tests/integration.sh

test-all: test-int test-mw test
