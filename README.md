# Getting started

## Download dependencies
```shell
npm install
```

You also need to install global dependencies: gulp-cli, typescript, webpack

## Build
```shell
npm run build
```

## Start server
Start http server:
```shell 
npm run start
```

Start https server(also runs the http, which redirects to the https):
```shell
npm run start-https
```

# For development
## Download dependencies

You must additionally install global dependencies: ts-node-dev, live-reload.

## Build
You can build a project in developer mode using the command

```shell
gulp dev
```

You can also enable change tracking in all projects.

```shell
gulp watch
```

Or choose a separate

```shell 
gulp mainDevWatch
```

```shell
gulp experimentalDevWatch
```

Full capabilities can be viewed using the command

```shell
gulp --tasks
```

## Live reload
To start automatic page refresh, you must run the command and, when starting the server, pass in the options "dev"

```shell
npm run livereload
```
> :warning: **live reload does not work when https support is enabled.** Run live reload only on your local computer without https
## Starting the server and tracking its changes
In order to start the server and automatically restart it when changed, you need to enter this command

```shell
npm run dev
```

You can also enable change tracking with https
```shell
npm run dev-https
```