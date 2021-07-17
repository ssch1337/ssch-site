function _errorAlert(err) {
    console.error(err);
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