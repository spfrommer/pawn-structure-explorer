#!/usr/bin/env python3

import click
import json

import subprocess
import os

@click.group()
def main():
    pass


CORE = ['dns', 'mongodb']
WEBAPP = ['server', 'web', 'proxy']


@main.command()
@click.argument('action', type=click.Choice(['up', 'down']))
def core(action):
    if action == 'up':
        subprocess.run(['docker-compose', 'up', '-d'] + CORE)
    if action == 'down':
        subprocess.run(['docker-compose', 'stop'] + CORE)


@main.command()
def webapp():
    subprocess.run(['docker-compose', 'build'] + WEBAPP)
    subprocess.run(['docker-compose', 'up', 'proxy'])
    subprocess.run(['docker-compose', 'stop'] + WEBAPP)


@main.command()
def server():
    subprocess.run(['docker-compose', 'build', 'server'])
    subprocess.run(['docker-compose', 'up', '--force-recreate', 'server'])
    subprocess.run(['docker-compose', 'stop', 'server'])


@main.command()
def clean():
    os.system('docker stop $(docker ps -q)')
    os.system('docker rm $(docker ps -q -a)')
    os.system('docker rmi $(docker images --filter "dangling=true" -q --no-trunc)')


if __name__ == '__main__':
    main()
