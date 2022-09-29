
const vShader =
    'attribute vec4 a_Position;\n'+
    'void main() {\n'+
    '  gl_Position = a_Position;\n'+
    '  gl_PointSize = 10.0;\n'+
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'uniform vec4 u_Color;\n'+
    'void main() {\n'+
    '  gl_FragColor = u_Color;\n'+
    '}\n';

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const origin = [
        1,0,1,1,3,3,4,5
    ]

    const normalise = origin.map(i=>i/10)

    const vertices = new Float32Array(normalise);

    const a_Position = gl.getAttribLocation(gl.program,'a_Position');

    const n = vertices.length / 2;

    // 创建顶点缓冲区
    const verticesBuffer = gl.createBuffer();

    // 绑定buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,verticesBuffer);

    // 写入缓冲区
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    // 分配给 Attribute
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0)

    // 启用 Attribute
    gl.enableVertexAttribArray(a_Position)



    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS,0,n);

}


main()