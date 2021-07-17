import { preloadAnim } from './preloader-anim';

const preload = new preloadAnim();

preload.play();

preload.finished().then(() => {
    console.log("Preload animation start done");
});

// Loading an external script
const mainScript: HTMLScriptElement = document.createElement('script');
mainScript.src = '/main.min.js'
mainScript.async = true;
mainScript.defer = true;
document.getElementsByTagName('body')[0].appendChild(mainScript);

// Waiting for the page to load completely
const checkLoadPage = setInterval(() => {
    if(document.documentElement.classList[1] == 'loaded') {
        document.documentElement.classList.remove('loaded');
        preload.playEnd();
        clearInterval(checkLoadPage);
    }
}, 100);