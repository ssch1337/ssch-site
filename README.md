# Getting started

## Download dependencies
`npm install`

You also need to install global dependencies: gulp-cli, typescript, ts-node

## Build
`npm run build`

## Start server
`npm run start`

# For development
## Download dependencies

You must additionally install global dependencies: ts-node-dev, live-reload.

## Build
You can build a project in developer mode using the command

`gulp dev`

You can also enable change tracking in all projects.

`gulp watch`

Or choose a separate

`gulp mainDevWatch`

`gulp experimentalDevWatch`

Full capabilities can be viewed using the command

`gulp --tasks`

## Live reload
To start automatic page refresh, you must run the command and, when starting the server, pass in the options "dev"

`npm run livereload`

## Starting the server and tracking its changes
In order to start the server and automatically restart it when changed, you need to enter this command

`npm run dev`