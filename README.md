# CI for use with Docker Swarm + Git.

#### Not production ready

Be careful. This hasn't been tested thoroughly.

#### Setup

`$ npm install -g docker-swarm-ci`

Withing Github navigate to:

Settings > Webhooks > Add webhook

Payload URL: http(s)://YOUR_URL:LISTEN_PORT/api/git

Content Type: application/json

Secret: GIT_HOOK_PASSWORD

Which events would you like to trigger this webhook: Just the push event.

#### Example usage

`$ docker-swarm-ci --git GIT_REPO --swarm SWARM_ID --registry REGISTRY_URL --name DESIRED_NAME_WITHIN_IMAGE --password GIT_HOOK_PASSWORD --port LISTEN_PORT`
