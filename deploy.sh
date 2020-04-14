#!/bin/bash

# Install AWS CLI
pip install --user awscli;
export PATH=$PATH:$HOME/.local/bin;

# Build and push Docker image to Docker Hub
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin;
docker build \
  --build-arg build_config="$DEPLOY_BUILD_CONFIG" \
  --no-cache -t sartography/cr-connect-frontend:latest . \
  || exit 1;
docker push sartography/cr-connect-frontend:latest || exit 1;

# Notify UVA DCOS that Docker image has been updated
aws sqs send-message --queue-url 'https://queue.amazonaws.com/474683445819/dcos-refresh' --message-body 'crconnect/frontend' || exit 1;
