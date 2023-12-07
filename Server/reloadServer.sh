git pull
docker builder prune
docker image prune -f
docker image rm -f gameruleta-game_app nginx gameruleta-fastapi_app
docker container rm -f gameruleta-game_app-1 gameruleta-nginx_proxy-1 gameruleta-fastapi_app-1
docker compose build --no-cache
docker compose up