import * as anime from "animejs";
import { collapseTextChangeRangesAcrossMultipleVersions } from "../../../node_modules/typescript/lib/typescript";

export class preloadAnim {
    preloadAnimAuthor: anime.AnimeTimelineInstance;
    preloadAboutAnim: anime.AnimeTimelineInstance;
    constructor() {
        /*
         * Splitting into letters to animate each
         */
        const preloadNameWrapper: HTMLElement = document.querySelector(".preload-name");
        preloadNameWrapper.innerHTML = preloadNameWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class=\"preload-name-letter\">$&</span>");
        preloadNameWrapper.style.opacity = "1";

        const preloadAboutWrapper: HTMLElement = document.querySelector(".preload-about");
        preloadAboutWrapper.innerHTML = preloadAboutWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class=\"preload-about-letter\">$&</span>");
        preloadAboutWrapper.style.opacity = "1";

        document.documentElement.classList.add("has-preloader-no-scroll"); // Disable scrolling, included in the playEnd

        this.preloadAnimAuthor = anime.timeline({
            targets: ".preload-circle",
            loop: false,
            autoplay: false
        });

        this.preloadAboutAnim = anime.timeline({
            targets: ".preload-about .preload-about-letter",
            loop: false,
            autoplay: false,
        });


        // Name author animate initialize
        {
            this.preloadAnimAuthor
            .add({
                scale: {
                    value: [0, 1],
                    duration: 200
                },
                translateY: "0.1vw"
            })
            .add({
                translateX: [
                    { value: "38vw", duration: 780 },
                    { value: "-6vw", duration: 780 }
                ],
                scaleX: [
                    { value: 3, duration: 80, easing: "easeOutExpo" },
                    { value: 1, duration: 700 },
                    { value: 3, duration: 80, easing: "easeOutExpo" },
                    { value: 1, duration: 700 }
                ],
                easing: "easeOutElastic(1, .8)"
            })
            .add({
                translateX: {
                    value: "38vw",
                    duration: 780
                },
                scaleX: [
                    { value: 3, duration: 80, easing: "easeOutExpo" },
                    { value: 1, duration: 700 }
                ],
                easing: "easeOutElastic(1, .8)"
            })
            .add({
                targets: ".preload-name .preload-name-letter",
                opacity: [0,1],
                translateX: [-10, 0],
                translateY: [-10, 0],
                scale: [1.2, 1],
                easing: "easeOutElastic(1, .8)",
                duration: 800,
                delay: (el, i) => 18 * (i+1)
            }, "-=750")
            .add({
                width: "1vw",
                height: "1vw",
                duration: 200,
                easing: "easeOutElastic(1, .8)",
            }, "-=200")
            .add({
                translateY: {
                    value: "4vw",
                    duration: 300
                },
                background: {
                    value: "#111",
                    duration: 100
                },
                scaleY: [
                    { value: 3, duration: 100, easing: "easeOutExpo" },
                    { value: 1, duration: 200 }
                ],
                easing: "easeOutElastic(1, .8)",
            });
        }
        // About animate initialize
        {
            this.preloadAboutAnim
            .add({
                targets: ".preload-about .preload-about-letter",
                translateX: [20,0],
                translateZ: 0,
                opacity: [0,1],
                easing: "easeOutExpo",
                duration: 400,
                delay: (el, i) => 200 + 28 * i
            });
        }
    }
    play() {
        this.preloadAboutAnim.play();
        this.preloadAnimAuthor.play();
    }
    finished() {
        return this.preloadAnimAuthor.finished;
    }
    playEnd() {
        // Premature start-up protectiond
        this.preloadAnimAuthor.finished.then(() => {
            this.preloadAnimAuthor = anime.timeline({
                targets: ".preload-circle",
                loop: false,
                autoplay: false
            });
            // End animate
            {
                this.preloadAnimAuthor
                .add({
                    width: {
                        value: ["1vw", "7vw"],
                        duration: 300,
                        eeasing: "linear"
                    },
                    height: {
                        value: ["1vw","7vw"],
                        duration: 300,
                        eaesing: "linear"
                    },
                    translateX: {
                        value: ["38vw","48vw"],
                        duration: 600
                    },
                    translateY: {
                        value: ["4vw", "0"],
                        duration: 200
                    },
                    scaleX: [
                        { value: 2, duration: 100, easing: "easeOutExpo" },
                        { value: 1, duration: 500 }
                    ],
                    easing: "easeOutElastic(1, .8)"
                })
                .add({
                    translateX: {
                        value: ["48vw","-20vw"],
                        duration: 900
                    },
                    scaleX: [
                        { value: 3, duration: 100, easing: "easeOutExpo" },
                        { value: 1, duration: 800 }
                    ],
                    easing: "easeOutElastic(1, .8)",
                })
                .add({
                    targets: ".preload-name .preload-name-letter",
                    opacity: {
                        value: [1, 0],
                        duration: 50
                    },
                    translateX: [0, 10],
                    translateY: [0, 10],
                    delay: (el, i) => 16 * (14 / (i+2))
                }, "-=860")
                .add({
                    scaleX: [
                        { value: 3, duration: 400, easing: "easeOutExpo" },
                        { value: 1, duration: 400 }
                    ],
                    easing: "easeOutElastic(1, .8)",
                })
                .add({
                    targets: ".preload",
                    translateX: {
                        value: [0, "20vw"],
                        duration: 800
                    },
                    opacity: {
                        value: [1, 0],
                        duration: 800
                    },
                    easing: "easeOutElastic(1, .8)"
                }, "-=800");
            }
            this.preloadAnimAuthor.play();


            // Upon completion of the animation
            this.preloadAnimAuthor.finished.then(() => {
                document.documentElement.classList.remove("has-preloader-no-scroll"); // Enabling scrolling when the animation ends
                document.querySelector(".preload").remove(); // Removing the whole block because there will be no more
            });
        });
    }
}
