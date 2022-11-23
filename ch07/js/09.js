const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_mvpMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_mvpMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'varying vec4 v_Color;\n'+
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

main();

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const n = initVertexBuffers(gl);

    const projectionMatrix = new Matrix4().setPerspective(30,canvasDom.width/canvasDom.height,1,100);
    const viewMatrix = new Matrix4().lookAt(3,3,7,0,0,0,0,1,0);
    const modalMatrix = new Matrix4().scale(1,1,1).rotate(0,0,1,0).translate(0,0,0);
    const mvpMatrix = projectionMatrix.multiply(viewMatrix).multiply(modalMatrix);

    const u_mvpMatrix = gl.getUniformLocation(gl.program,'u_mvpMatrix');
    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.POLYGON_OFFSET_FILL);

    gl.polygonOffset(1.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

}

// Create a cube
//    v6----- v5
//   /|      /|
//  v1------v0|
//  | |     | |
//  | |v7---|-|v4
//  |/      |/
//  v2------v3

function initVertexBuffers(gl) {
    const vertex = new Float32Array([
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ])

    const index = new Uint8Array([
        0,1,2,0,2,3,
        0,3,4,0,4,5,
        0,5,6,0,6,1,
        1,6,7,1,7,2,
        7,4,3,7,3,2,
        4,7,6,4,6,5
    ])

    const a_Position = gl.getAttribLocation(gl.program,'a_Position');
    const a_Color = gl.getAttribLocation(gl.program,'a_Color');
    const FSIZE = vertex.BYTES_PER_ELEMENT;

    const vertexBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertex,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSIZE *6,0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE *6 ,FSIZE *3);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,index,gl.STATIC_DRAW);


    return index.length;


}

