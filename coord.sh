MODE="INIT" # INIT, REDEPLOY
# TODO: replace verdant-future-... with pawnse
# Add json auth whatever


if [ "$MODE" == "INIT" ]; then
    echo ">>>>> CREATING MACHINES <<<<<"
    docker-machine create main -d google --google-machine-type n1-standard-2 --google-tags pawnse-swarm --google-project pawnse --google-disk-size 200 

    echo ">>>>> INSTALLING DOCKER COMPOSE ON MANAGER <<<<<"
    gcloud compute ssh main --command="sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose"
    gcloud compute ssh main --command="sudo chmod +x /usr/local/bin/docker-compose"
    gcloud compute ssh main --command="sudo apt-get install unzip"

    echo ">>>>> CREATING SWARM <<<<<"
    MGR=$(gcloud compute instances describe main --format='get(networkInterfaces[0].networkIP)')
    gcloud compute ssh main --command="sudo docker swarm init --advertise-addr $MGR"
    
    #Not necessary since we only have one instance
    #echo ">>>>> JOINING SWARM <<<<<"
    #JOIN=$(gcloud compute ssh main --command="sudo docker swarm join-token worker | sed -n 3p")
    #gcloud compute ssh main --command="sudo $JOIN"

    echo ">>>>> CREATING NETWORK <<<<<"
    gcloud compute ssh main --command="sudo docker network create nwmain --driver overlay --attachable"
fi

echo ">>>>> FETCHING SOURCE <<<<<"
if [ "$MODE" == "INIT" ]; then
    gcloud compute ssh main --command="git clone https://github.com/spfrommer/pawn-structure-explorer.git"

    echo ">>>>> FETCHING DATA <<<<<"
    gcloud compute ssh main --command="cd pawn-structure-explorer/data/lichess-elite-database && curl https://database.nikonoel.fr/lichess_elite_2020-06.zip --output lichess_elite_2020-06.zip"
    gcloud compute ssh main --command="cd pawn-structure-explorer/data/lichess-elite-database && unzip lichess_elite_2020-06.zip && rm lichess_elite_2020-06.zip"
fi
if [ "$MODE" == "REDEPLOY" ]; then
    gcloud compute ssh main --command="cd pawn-structure-explorer && get pull"
fi
echo ">>>>> BUILDING IMAGES <<<<<"
gcloud compute ssh main --command="cd pawn-structure-explorer && sudo docker-compose build"
gcloud compute ssh main --command="sudo usermod -a -G docker ${USER}"

echo ">>>>> DEPLOYING <<<<<"
gcloud compute ssh main --command="cd pawn-structure-explorer && sudo docker stack deploy --compose-file swarm.yml pawnse"
# gcloud compute ssh main --command="cd webtrace && sudo docker service scale webtrace_queueworker=0 webtrace_fetchworker=0 webtrace_indexer=0"
# docker run --network nw1 -it gcr.io/verdant-future-312705/cli:latest 
