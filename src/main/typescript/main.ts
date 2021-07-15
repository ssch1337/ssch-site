import * as anime from 'animejs';
import { preloadAnim } from './preloader-anim';

const preload = new preloadAnim();

preload.play();
preload.playEnd();

preload.finished().then(() => {
    console.log("Preload animation start done");
    preload.finished().then(() => {
        console.log("Preload animation complete");
    });
});