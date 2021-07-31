import { useState, useEffect } from 'react';

interface IMenu {
    [page: string]: { title: string }
}

function getMenu() {
    const [error, setError] = useState<number>(null!);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [menu, setMenu] = useState<IMenu>({});
    const [updateWithError, setUpdate] = useState<number>(null!);
    useEffect(() => {
        fetch(`/api/menu`)
        .then(res => {
            if(!res.ok) {
                setError(res.status);
                if(res.status === 500) {
                    setTimeout(() => {
                        setUpdate(updateWithError + 1);
                    }, 2000);
                }
            }
            return res.json();
        })
        .then(result => {
            setMenu(result);
            setError(null!);
            setIsLoaded(true);
        })
        .catch(err => {
            if(err) {
                setIsLoaded(true);
            }
        })
    }, [updateWithError])

    if(error == 500) {
        return (
            <div className="error">Error while fetching the menu. Trying to get the component again. Attempt: {updateWithError}</div>
        )
    } else if(error) {
        return (
            <div className="error">Error while fetching the menu. Please reload the page</div>
        )
    } else if(!isLoaded) {
        return;
    } else {
        return (
            <div className="menu">
                <div className="menu-content">
                    <div className="menu-author">Sergey Scheglov</div>
                    <div className="menu-links">
                        {Object.keys(menu).map((element, index) => {
                            console.log(element)
                            return (<a key={index} className="menu-element" href={element}>{menu[element].title}</a>)
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export { getMenu }