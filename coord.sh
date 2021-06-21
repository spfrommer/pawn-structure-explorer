MODE="INIT" # INIT, REDEPLOY
# TODO: replace verdant-future-... with pawnse
# Add json auth whatever


if [ "$MODE" == "INIT" ]; then
    echo ">>>>> CREATING MACHINES <<<<<"
    docker-machine create main -d google --google-machine-type n1-standard-2 --google-tags pawnse-swarm --google-project pawnse --google-disk-size 200 

    echo ">>>>> INSTALLING DOCKER COMPOSE ON MANAGER <<<<<"
    gcloud compute ssh main --command="sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose"
    gcloud compute ssh main --command="sudo chmod +x /usr/local/bin/docker-compose"

    echo ">>>>> CREATING SWARM <<<<<"
    MGR=$(gcloud compute instances describe main --format='get(networkInterfaces[0].networkIP)')
    gcloud compute ssh main --command="sudo docker swarm init --advertise-addr $MGR"

    echo ">>>>> JOINING SWARM <<<<<"
    JOIN=$(gcloud compute ssh main --command="sudo docker swarm join-token worker | sed -n 3p")
    gcloud compute ssh main --command="sudo $JOIN"

    echo ">>>>> CREATING NETWORK <<<<<"
    gcloud compute ssh main --command="sudo docker network create nwmain --driver overlay --attachable"
fi

echo ">>>>> SETTING UP MANAGER AND BUILDING IMAGES <<<<<"
gcloud compute ssh main --command="sudo rm -rf ~/pawn-structure-explorer"
gcloud compute ssh main --command="git clone https://github.com/spfrommer/pawn-structure-explorer.git"
gcloud compute ssh main --command="cd pawn-structure-explorer && sudo docker-compose build"
gcloud compute ssh main --command="sudo usermod -a -G docker ${USER}"
gcloud compute ssh main --command="cd pawn-structure-explorer && cat verdant-future-312705-c80a06677b03.json | sudo docker login -u _json_key --password-stdin https://gcr.io"


echo ">>>>> REMOVING OLD IMAGES <<<<<"
IMAGES="server web proxy"
if [ "$MODE" == "REDEPLOY" ]; then
    for image in $IMAGES
    do
        gcloud compute ssh main --command="sudo docker rmi gcr.io/verdant-future-312705/${image}:latest"
    done
fi

echo ">>>>> PUSHING IMAGES TO REPO <<<<<"
for image in $IMAGES
do
    gcloud compute ssh main --command="sudo docker tag pawnse_${image} gcr.io/verdant-future-312705/${image}:latest"
    gcloud compute ssh main --command="sudo docker push gcr.io/verdant-future-312705/${image}:latest"
done

# Pulling images onto machine
gcloud compute ssh main --command="mkdir ~/pawn-structure-explorer/data/lichess-elite-database && mkdir ~/pawn-structure-explorer/data/mongodb"
gcloud compute ssh main --command="sudo docker pull gcr.io/verdant-future-312705/server:latest"
gcloud compute ssh main --command="sudo docker pull gcr.io/verdant-future-312705/web:latest"
gcloud compute ssh main --command="sudo docker pull gcr.io/verdant-future-312705/proxy:latest"

echo ">>>>> DEPLOYING <<<<<"
gcloud compute ssh main --command="cd webtrace && sudo docker stack deploy --compose-file swarm.yml pawnse"
# gcloud compute ssh main --command="cd webtrace && sudo docker service scale webtrace_queueworker=0 webtrace_fetchworker=0 webtrace_indexer=0"
# docker run --network nw1 -it gcr.io/verdant-future-312705/cli:latest 