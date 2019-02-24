docker build -t docker-node-front -f node.Dockerfile .
docker run  -ti  -v "$(pwd):/app" -p 3000:3000 -p 3001:3001 docker-node-front 
