export async function initPhysics() {
    let f32a = new Float32Array(0);

    function getData() {
        return f32a;
    }

    function tick(count: number) {
        f32a = resizeArray(f32a, count * 4);
        for (let ptr = 0; ptr < f32a.length; ptr += 4) {
            f32a[ptr + 0] += f32a[ptr + 2];
            f32a[ptr + 1] += f32a[ptr + 3];
            f32a[ptr + 3] += 0.25;
        }
    }

    function fire(x:number, y:number) {
        for (let ptr = 0; ptr < f32a.length; ptr += 4) {
            f32a[ptr + 0] = x;
            f32a[ptr + 1] = y;
            const amplitude = Math.sqrt(Math.random()) * 20;
            const angle = Math.random() * Math.PI * 2;
            f32a[ptr + 2] = Math.cos(angle) * amplitude;
            f32a[ptr + 3] = Math.sin(angle) * amplitude;
        }
    }
    return { getData, tick, fire }
}

function resizeArray(sourceArray: Float32Array, targetLength: number) {
    if (sourceArray.length === targetLength) {
        return sourceArray;
    }
    if (sourceArray.length > targetLength) {
        return sourceArray.slice(0, targetLength);
    }
    const newArray = new Float32Array(targetLength);
    newArray.set(sourceArray);
    return newArray;
}