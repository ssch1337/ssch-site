import { preloadAnim } from './preloader-anim';
import { mainScriptLoaded } from './final-actions';
import { externalLoad } from './connect-external';

export function noSupportServiceWorker() {
    /*/
     * After the first launch, all heavy scripts are cached, so we can no longer show the preloader
    /*/
    fetch("/main.min.js",{method:'Head',cache:'only-if-cached',mode:'same-origin'})
    .then(res => {console.log(res.status); return res})
    .then(externalLoad)
    .then(mainScriptLoaded)
    .catch((err) => {
        if(err) {
            // Executed on first startup or after clearing the cache
            const preload = new preloadAnim();
            preload.play();
            externalLoad();
            // Waiting for the page to load completely
            const checkLoadPage = setInterval(() => {
                if(document.documentElement.classList[1] == 'loaded') {
                    document.documentElement.classList.remove('loaded');
                    preload.playEnd();
                    clearInterval(checkLoadPage);
                }
            }, 100);
        }
    });
}