
const vShader =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'uniform float u_Width;\n'+
    'uniform float u_Height;\n'+
    'void main() {\n' +
    '  gl_FragColor = vec4(gl_FragCoord.x /u_Width,0.0,gl_FragCoord.y/u_Height,1.0);\n' +
    '}\n';

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const origin = [
        -0.5,-0.5,
        0.5,-0.5,
        0.0,0.5
    ]

    initVertexBuffers(origin,gl);


    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,3)

}

function initVertexBuffers(origin,gl) {
    const originData = new Float32Array(origin);
    const n = 3;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const u_Width = gl.getUniformLocation(gl.program, 'u_Width');
    const u_Height = gl.getUniformLocation(gl.program, 'u_Height');

    gl.uniform1f(u_Width,800.0)
    gl.uniform1f(u_Height,800.0)

    // 创建顶点缓冲区
    const verticesBuffer = gl.createBuffer();
    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, originData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);


    return n;

}


main()
