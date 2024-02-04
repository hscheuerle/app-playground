start all apps

`docker compose up --build`

localhost - nginx

localhost:5000 - directly to express app

localhost:6000 - directly to nextjs app

cd into nginx container

`docker exec -t -i nginx-app /bin/bash`
or
`docker-compose exec nginx-app bash`

cd into postgres database

`docker exec -ti database psql -U user -d postgres`

cd into redis cache

`docker exec -ti cache redis-cli`
