git pull
docker image prune -f
docker image rm -f gameruleta-game_app gameruleta-nginx_proxy gameruleta-fastapi_app
docker container rm -f gameruleta-game_app-1 gameruleta-nginx_proxy-1 gameruleta-fastapi_app-1
docker comose build --no-cache
docker compose up