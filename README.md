# Minecraft Auto Stop

This is a serverless function that monitors Minecraft on EC2 and automatically stops it when there are no users.

## How to use

create .env file

```
touch .env
```

edit .env file

```.env
MC_SERVERS='[{"name":"mc_pokemon","host":"xxx.xx.xx.xx","port":25565,"instanceId":"i-xxxx"},{"name":"mc_pokemon","host":"xxx.xx.xx.xx","port":25565,"instanceId":"i-xxxx"}]'
```

login to serverless
※ Assumption that serverless configuration has been completed in advance

```
sls login
```

deploy

```
sls deploy
```
