
const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute float a_PointSize;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'uniform vec4 u_Color;\n'+
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0,1.0,0.0,1.0);\n' +
    '}\n';

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const origin = [
        -0.2,-0.2,0.2,-0.2,0.0,0.2
    ]

    const pointSize = [10.0,20.0,30.0]
    const n = initVertexBuffers(origin,pointSize,gl);


    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS,0,n)

}

function initVertexBuffers(origin,pointSize,gl) {
    const vertices = new Float32Array(origin);
    const size = new Float32Array(pointSize);
    const n = vertices.length / 2;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');

    // 创建顶点缓冲区
    const verticesBuffer = gl.createBuffer();
    const sizeBuffer = gl.createBuffer();
    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position);


    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,size,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_PointSize);


    return n;

}


main()
