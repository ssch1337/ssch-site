import { createWriteStream, existsSync, mkdirSync } from 'fs';

const logsDir = './logs';

if (!existsSync(logsDir)){
    mkdirSync(logsDir);
}


const errorStream = createWriteStream('./logs/errors.log', { flags: 'a' });

function _errorAlert(err) {
    console.error(err);
    errorStream.write(`${new Date().toISOString()} — ${err}\n`);
    // TODO: Make normal error logging
}

function errorHandler(err, res) {
    if(err) {
        _errorAlert(err);
        res.sendStatus(500);
    }
}

function errorHandlerMiddleware(err, req, res, next) {
    if(err) {
        _errorAlert(err);
        res.sendStatus(500);
    } else {
        next();
    }
}

export { errorHandler, errorHandlerMiddleware };