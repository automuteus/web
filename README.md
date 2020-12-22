# AutoMute.us Web Application

## Getting Started
To run this application in development:
```bash
yarn install
yarn dev
```

To run this application in production:
```bash
yarn install
yarn build
yarn start <PORT> # e.g. yarn start 8080
```

## Deployment
This application is deployed using Docker. To build and run this application:

```bash
docker build -t automuteus .
docker run --name automuteus -dp <PORT>:3000 automuteus:latest
```

You can stop and remove this application container with

```bash
docker stop automuteus
docker rm automuteus
```

**Note:** The name `automuteus` in the above commands can be substituted with any name you prefer.