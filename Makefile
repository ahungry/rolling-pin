start:
	node ./server.js

test:
	node ./tests/all.js

test-int:
	./tests/integration.sh

test-all: test-int test
