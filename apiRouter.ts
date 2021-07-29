import { Router } from "express";
import { errorHandler } from "./logger/errorHandler";
import * as store from "./storePages.json"; // The database is not used due to the triviality of the application

const apiRouter = Router();

apiRouter.get("/menu", (req,res) => {
    res.json(store);
});

apiRouter.get("/:page?", (req, res) => {
    let page = req.params.page;
    if(!page) page = "home";
    if(store[page]) {
        res.render(`main/${page}`, {}, (err, html) => {
            if(err) errorHandler(err, res);

            res.json({ title: store[page].title, data: html });
        });
    } else {
        res.status(404).render('main/notfound', {}, (err, html) => {
            if(err) errorHandler(err, res);
            
            res.json({ title: "Page not found", data: html});
        });
    }
});

export { apiRouter }