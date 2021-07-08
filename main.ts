const express = require('express'),
    fs = require('fs'),
    app = express();

const port = 80;

// For development only
const productionMode = (process.argv[2] == 'dev' ? false : true);
if(!productionMode){
	app.use(require('connect-livereload')({
		port: 1337
	}))
}

app.disable('x-powered-by');

app.use((req, res, next) => {
	console.log('%s %s %s %s', req.method, req.url, (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress, req.headers["user-agent"]);
	next();
})

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

app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}/`)
})