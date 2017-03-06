start:
	./start.sh

install:
	go get -u github.com/kardianos/govendor

# Update external dependency versions to latest.
update:
	govendor update +external

# Copy versions of Golang dependencies into the vendor folder.
sync:
	rm -rf vendor/*/
	govendor sync
