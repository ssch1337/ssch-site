export function externalLoad() {
    // Loading an external script
    const mainScript: HTMLScriptElement = document.createElement('script');
    mainScript.src = '/main.min.js'
    mainScript.async = true;
    mainScript.defer = true;
    document.getElementsByTagName('body')[0].appendChild(mainScript);

    // Loading an external styles
    const mainCss: HTMLLinkElement = document.createElement('link');
    mainCss.rel = 'stylesheet';
    mainCss.href = '/main.min.css';
    document.getElementsByTagName('head')[0].appendChild(mainCss);
}