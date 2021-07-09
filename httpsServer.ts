import { readFileSync } from 'fs';
import { createServer } from 'https';

export class createHttpsServer {
    httpsPort: number;
    paths: {cert: string, key: string} = {
        cert: __dirname + '/certs/https.crt',
        key: __dirname + '/certs/https.key'
    }
    server: any;
    constructor(app, port: number) {
        this.httpsPort = port;
        try {
            const ssl = {
                cert: readFileSync(this.paths.cert),
                key: readFileSync(this.paths.key)
            }
            this.server = createServer(ssl, app);
        } catch(err) {
            console.error(err);
        }
    }

    listen() {
        this.server.listen(this.httpsPort, () => {
            console.log(`Server listening on https, port: ${this.httpsPort}`)
        });
    }
}

export function redirectToHttps(httpsEnabled:boolean) {
    if(httpsEnabled) {
        console.log("Enabling redirecting to https")
    }
    return (req, res, next) => {
            if(httpsEnabled && !req.secure) {
                return res.redirect("https://" + req.headers.host + req.url);
            }
            next();
    }
}