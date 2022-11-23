
const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ModalViewMatrix;\n' +
    'uniform mat4 u_ProjectionMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ProjectionMatrix * u_ModalViewMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'varying vec4 v_Color;\n'+
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);


    initShaders(gl,vShader,fShader);

    initVertexBuffers(gl);

    const u_ProjectionMatrix = gl.getUniformLocation(gl.program,'u_ProjectionMatrix');
    const projectMatrix = new Matrix4().setPerspective(30,canvasDom.width/canvasDom.height,1,1000)
    gl.uniformMatrix4fv(u_ProjectionMatrix,false,projectMatrix.elements)


    const viewMatrix = new Matrix4().setLookAt(3.06, 2.5, 10.0, 0, 0, -2, 0, 1, 0)
    const u_ModalViewMatrix = gl.getUniformLocation(gl.program,'u_ModalViewMatrix');
    gl.uniformMatrix4fv(u_ModalViewMatrix,false,viewMatrix.elements);


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.drawArrays(gl.TRIANGLES,0,3);
    gl.polygonOffset(1.0,1.0)
    gl.drawArrays(gl.TRIANGLES,3,3);

}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0,  2.5,  -5.0,  0.4,  1.0,  0.4, // The green triangle
        -2.5, -2.5,  -5.0,  0.4,  1.0,  0.4,
        2.5, -2.5,  -5.0,  1.0,  0.4,  0.4,

        0.0,  3.0,  -5.0,  1.0,  0.4,  0.4, // The yellow triagle
        -3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
        3.0, -3.0,  -5.0,  1.0,  1.0,  0.4,
    ]);

    const FSIZE = vertices.BYTES_PER_ELEMENT;

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color');

    const verticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE*6, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE*6, FSIZE*3);
    gl.enableVertexAttribArray(a_Color);

}


main()
