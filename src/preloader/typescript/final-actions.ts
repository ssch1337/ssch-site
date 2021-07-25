function afterPreloader() {
    document.documentElement.classList.remove("has-preloader-no-scroll"); // Enabling scrolling when the animation ends
    document.querySelector(".preload").remove(); // Removing the whole block because there will be no more
    document.scripts[1].remove(); // Removing the script because it will no longer be used
}


function mainScriptLoaded() {
    /*/
     * We pass the information to the main script that the preloader did not start
     * and we need to start the interstitial animation
    /*/
    document.documentElement.classList.add('main-loaded');

    document.querySelector(".preload").remove(); // Removing the entire block because it is no longer needed
    document.scripts[1].remove(); // Removing the script because it will no longer be used
}

export { afterPreloader, mainScriptLoaded };