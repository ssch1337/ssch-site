export async function initRenderer(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false});
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.clearColor(0, 0, 0, 1);

    const program = gl.createProgram();

    {
        const shader = gl.createShader(gl.VERTEX_SHADER);
        const source = require('./glsl/vert.glsl');
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.attachShader(program, shader);
    }

    {
        const shader = gl.createShader(gl.FRAGMENT_SHADER);
        const source = require('./glsl/frag.glsl');
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        console.log(gl.getShaderInfoLog(shader));
        gl.attachShader(program, shader);
    }

    gl.linkProgram(program);

    gl.useProgram(program);

    {
        const attribLocation = gl.getAttribLocation(program, 'coord');
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(
            attribLocation, // index
            2, // size (X and Y)
            gl.FLOAT, // float32 each
            false, // normalized. Has no effect on float
            16, // stride
            0 // start index
        );
    }

    function render(data: Float32Array, count: number, width: number, height: number) {
        if (width !== canvas.width || height !== canvas.height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);

            {
                const attribLocation = gl.getAttribLocation(program, 'scale');
                gl.disableVertexAttribArray(attribLocation);
                gl.vertexAttrib2f(attribLocation, 2 / canvas.width, -2 / canvas.height);
            }
        }

        gl.bufferData(gl.ARRAY_BUFFER, data.subarray(0, count * 4), gl.DYNAMIC_DRAW);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, count);
    }

    return { render };

}