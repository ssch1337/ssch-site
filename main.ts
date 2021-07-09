import * as express from "express";
import { createHttpsServer, redirectToHttps } from './httpsServer';
import * as ports from './ports.json';
import * as morgan from 'morgan'; // For logs

const app = express(),
    httpsEnabled = (process.argv[2] == '--https'), // Checking by passed arguments
    productionMode = !(process.argv[2] == '--dev'); // Checking by passed arguments

// For development only
if(!productionMode){
	app.use(require('connect-livereload')({
		port: ports.livereload
	}))
}

app.disable('x-powered-by');


app.use(morgan("dev")); // For logs

app.use(redirectToHttps(httpsEnabled));

app.use(express.static(__dirname + '/dist'))


app.set('view engine', 'pug');


app.get('/', (req, res) => {
	res.render('index', {
        production: productionMode,
        project: "main"
    });
})

app.get('/experimental', (req, res) => {
    res.render('experimental', {
        production: productionMode,
        project: "experimental"
    })
})


// Listen server
if(httpsEnabled) {
    const httpsServer = new createHttpsServer(app, ports.https);
    httpsServer.listen();
}

app.listen(ports.http, () => {
	console.log(`Server listening on http, port: ${ports.http}`)
})