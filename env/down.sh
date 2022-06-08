docker-compose -f $(pwd)/docker-compose.yaml down --remove-orphans --rmi all

docker-compose -f $(pwd)/docker-compose.schedule.yaml down --remove-orphans --rmi all

sudo rm -rf $(pwd)/data/*
