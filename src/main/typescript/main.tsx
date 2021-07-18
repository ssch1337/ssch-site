import * as React from 'react';
import * as rxjs from 'rx';
declare global {
    const anime: typeof import('animejs');
};

console.log("External script loaded");

// Simulate waiting for the page to load
setTimeout(() => {
    console.log("Page loaded");
    document.documentElement.classList.add('loaded');
}, 7000);