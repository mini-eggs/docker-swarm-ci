# CI for use with Docker Swarm + Git.

CI for (multiple) Docker swarm services.

#### Not production ready

Be careful. This hasn't been tested thoroughly.

#### Setup

`$ npm install -g docker-swarm-ci`

Within Github navigate to:

Settings > Webhooks > Add webhook

Payload URL: http(s)://YOUR_URL:LISTEN_PORT/api/git

Content Type: application/json

Secret: GIT_HOOK_PASSWORD

Which events would you like to trigger this webhook: Just the push event.

#### Example usage

SSH into your swarm leader

Start a screen seession, then run:

`$ docker-swarm-ci --git GIT_REPO --swarm SWARM_ID --registry REGISTRY_URL --name DESIRED_NAME_WITHIN_IMAGE --password GIT_HOOK_PASSWORD --port LISTEN_PORT`

or (and replace variables with your own)

`$ docker-swarm-ci --port 8080 --json '[ { "git": "https://github.com/username/project.git", "swarm": "swarm_name", "registry": "192.168.x.x:5000", "name": "image_name", "password": "webhook_password" } ]'`
