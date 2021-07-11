import { initPhysics } from "./physics";
import { initRenderer } from "./renderer-webgl";

async function main() {
    const canvas = document.querySelector('canvas');
    const countInput: HTMLInputElement = document.querySelector('#count');
    const fpsInput: HTMLInputElement = document.querySelector('#fps');

    let particlesCount: number;
    let canvasWidth: number;
    let canvasHeight: number;

    const { getData, tick, fire } = await initPhysics();
    const { render } = await initRenderer(canvas);

    {
        const resizeHandler = () => {
            canvasWidth = canvas.clientWidth;
            canvasHeight = canvas.clientHeight;
        }
        window.addEventListener('resize', resizeHandler);
        resizeHandler();
    }

    {
        const inputHandler = () => {
            const inputValue = Math.trunc(Number(countInput.value));
            if (inputValue > 0) {
                particlesCount = inputValue;
            }
        }
        countInput.addEventListener('input', inputHandler);
        inputHandler();
    }

    {
        const clickHandler = (e: any) => {
            fire(e.offsetX - canvas.clientWidth / 2, e.offsetY - canvas.clientHeight / 2);
        }
        canvas.addEventListener('click', clickHandler);
    }

    {
        let lastTs = 0;
        let framesDrawn = 0;

        const frame = (timestamp: number) => {
            requestAnimationFrame(frame);

            tick(particlesCount);
            render(getData(), particlesCount, canvasWidth, canvasHeight);

            framesDrawn++;
            if (timestamp > lastTs + 2000) {
                fpsInput.value = (1000 * framesDrawn / (timestamp - lastTs)).toFixed(1) + ' FPS';
                lastTs = timestamp;
                framesDrawn = 0;
            }
        }
        frame(0);
    }

}

main()