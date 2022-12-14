const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute vec4 a_Normal;\n' +
    'uniform mat4 u_MVPMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec4 v_Normal;\n' +
    'varying vec4 v_Position;\n' +
    'void main() {\n' +
    '  gl_Position = u_MVPMatrix * a_Position;\n' +
    '  v_Color = a_Color ;\n' +
    '  v_Normal = a_Normal ;\n' +
    '  v_Position = a_Position ;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'uniform vec3 u_LightColor;\n' +
    'uniform vec3 u_Ambient;\n' +
    'varying vec4 v_Color;\n' +
    'varying vec4 v_Normal;\n' +
    'varying vec4 v_Position;\n' +
    'uniform mat4 u_ModalMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'uniform vec3 u_LightPosition;\n' +
    'void main() {\n' +
    '  vec4 vertexPosition = u_ModalMatrix * v_Position;\n' +
    '  vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
    '  vec3 normal = normalize(vec3(u_NormalMatrix * v_Normal));\n' +
    '  float nDotLd = max(dot(normal, lightDirection), 0.0);\n' +
    '  vec3 diffuse = u_LightColor * vec3(v_Color) * nDotLd;\n' +
    '  vec3 ambient = u_Ambient * vec3(v_Color);\n' +
    '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
    '}\n';

main();

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const n = initVertexBuffers(gl);

    const projectionMatrix = new Matrix4().setPerspective(30,canvasDom.width/canvasDom.height,1,100);
    const viewMatrix = new Matrix4().lookAt(6, 6, 14, 0, 0, 0, 0, 1, 0);
    const modalMatrix = new Matrix4().scale(1,1,1).rotate(90,0,1,0).translate(0,0,0);

    const normalMatrix = new Matrix4().setInverseOf(modalMatrix).transpose();
    const MVPMatrix = projectionMatrix.multiply(viewMatrix).multiply(modalMatrix);

    const lightColor = new Vector3([1.0,1.0,1.0]);
    const lightPosition = new Vector3([2.3,4.0,3.5]);
    const ambient = new Vector3([0.2,0.2,0.2]);

    const u_ModalMatrix = gl.getUniformLocation(gl.program,'u_ModalMatrix');
    gl.uniformMatrix4fv(u_ModalMatrix,false,modalMatrix.elements);

    const u_MVPMatrix = gl.getUniformLocation(gl.program,'u_MVPMatrix');
    gl.uniformMatrix4fv(u_MVPMatrix,false,MVPMatrix.elements);

    const u_NormalMatrix = gl.getUniformLocation(gl.program,'u_NormalMatrix');
    gl.uniformMatrix4fv(u_NormalMatrix,false,normalMatrix.elements);

    const u_LightColor = gl.getUniformLocation(gl.program,'u_LightColor');
    gl.uniform3fv(u_LightColor,lightColor.elements);

    const u_LightPosition = gl.getUniformLocation(gl.program,'u_LightPosition');
    gl.uniform3fv(u_LightPosition,lightPosition.elements);


    const u_Ambient = gl.getUniformLocation(gl.program,'u_Ambient');
    gl.uniform3fv(u_Ambient,ambient.elements);

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
        2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
        2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
        2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
        -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
        -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
        2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
    ]);

    const color = new Float32Array([    // Colors
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0???    // v4-v7-v6-v5 back
    ]);

    const normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);

    const index = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ])

    const a_Position = gl.getAttribLocation(gl.program,'a_Position');
    const a_Color = gl.getAttribLocation(gl.program,'a_Color');
    const a_Normal = gl.getAttribLocation(gl.program,'a_Normal');


    initArrayBuffer(gl,a_Position,vertex,3,0,0);
    initArrayBuffer(gl,a_Color,color,3,0,0);
    initArrayBuffer(gl,a_Normal,normals,3,0,0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,index,gl.STATIC_DRAW);

    return index.length;

}

function initArrayBuffer(gl,location,data,self,total,offset){
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    gl.vertexAttribPointer(location,self,gl.FLOAT,false,total,offset);
    gl.enableVertexAttribArray(location);
    return buffer;
}

