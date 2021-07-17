import { Router } from "express";
import { errorHandler } from "./errorHandler";

let apiRouter = Router();

// The database is not used due to the triviality of the application
const store = {
    home: {
        title: "Home"
    },
    about: {
        title: "About me"
    }
}

const _pages = Object.keys(store);


apiRouter.get("/menu", (req,res) => {
    res.render("main/menu", { links: _pages }, (err, html) => {
        if(err) errorHandler(err, res);
        res.json({ pages: _pages, data: html });
    });
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
        res.sendStatus(404);
    }
});

export { apiRouter }