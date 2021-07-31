import * as React from "react";
import { useEffect, useState } from "react";

interface IPage {
    title: string,
    data: string
}

function getPage(path: string) {
    const [error, setError] = useState<number>(null!);
    const [isLoaded, setIsLoaded]  = useState<boolean>(false);
    const [page, setPage] = useState<IPage>({title: '', data: ''});
    const [updateWithError, setUpdate] = useState<number>(null!);

    useEffect(() => {
        fetch(`/api${path}`)
        .then(res => {
            if(!res.ok) {
                setError(res.status);
                if(res.status == 500) {
                    setPage({
                        title: "Loading",
                        data: `<div class="error">Error while fetching the page. Trying to get the component again. Attempt: ${updateWithError}</div>`
                    })
                    setTimeout(()=>{
                        setUpdate(updateWithError + 1);
                    }, 2000);
                }
            }
            return res.json();
        })
        .then(result => {
            setPage({
                title: result.title,
                data: result.data
            });
            setIsLoaded(true);
        })
        .catch(err => {
            if(err) {
                setError(err);
                if(!page.data) {
                    setPage({
                        title: "Error",
                        data: "<div class=\"error\">Error while fetching the page. Please reload the page.</div>"
                    });
                }
                setIsLoaded(true);
            }
        })
    }, [updateWithError, path])
    return {
        pageIsLoaded: isLoaded,
        pageError: error,
        pageTitle: page.title,
        pageData: (<div className="page-content" dangerouslySetInnerHTML={{__html: page.data}} />)
    };
}



export { getPage }