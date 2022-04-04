API
docker build --platform linux/amd64 -f Dockerfile.prod -t iampetrovpavel/english-api:latest .
docker push iampetrovpavel/english-api:latest

CLIENT
docker build --platform linux/amd64 -f Dockerfile.prod -t iampetrovpavel/english-client:latest .
docker push iampetrovpavel/english-client:latest