import * as express from "express";
import { createHttpsServer, redirectToHttps } from './httpsServer';
import * as ports from './ports.json';
import * as morgan from 'morgan'; // For logs
import * as helmet from 'helmet'; // Sets custom http headers for security
import { apiRouter } from './apiRouter';
import { errorHandlerMiddleware } from "./logger/errorHandler";
import { visitors } from "./logger/visitors";

const app = express(),
    httpsEnabled = (process.argv[2] == '--https'), // Checking by passed arguments
    productionMode = !(process.argv[2] == '--dev'); // Checking by passed arguments

// For development only
if(!productionMode){
    console.log("Developer mode enable");
	app.use(require('connect-livereload')({
		port: ports.livereload
	}));
    app.use(morgan("dev")); // For logs
    app.get('/main.min.js', (req, res) => {
        res.sendFile(__dirname + "/dist/main.js");
    });
    app.get('/main.min.css', (req, res) => {
        res.sendFile(__dirname + "/dist/main.css");
    })
} else {
    app.use(helmet()); // For protection
    app.use(morgan("combined", { stream: visitors() })); // For logs
}




app.use(redirectToHttps(httpsEnabled));

app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/images'));

app.use('/anime.min.js', express.static(__dirname + '/node_modules/animejs/lib/anime.min.js'));


app.set('view engine', 'pug');


app.use('/api', apiRouter);

app.get('/experimental', (req, res) => {
    res.render('experimental', {
        title: "experimental",
        production: productionMode,
        project: "experimental"
    });
});

app.get('/*', (req, res) => {
	res.render('main-preloader', {
        title: "Sergey Scheglov",
        production: productionMode,
        project: "preloader"
    });
});


app.use(errorHandlerMiddleware);

// Listen server
if(httpsEnabled) {
    const httpsServer = new createHttpsServer(app, ports.https);
    httpsServer.listen();
}

app.listen(ports.http, () => {
	console.log(`Server listening on http, port: ${ports.http}`);
});