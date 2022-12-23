const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'attribute float a_Face;\n' +
    'uniform mat4 u_mvpMatrix;\n' +
    'uniform int u_Face;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_mvpMatrix * a_Position;\n' +
    '  int face = int(a_Face);\n' +
    '  vec3 color  = (face == u_Face) ? vec3(1.0):vec3(a_Color.rgb);\n' +
    '  if(u_Face == 0){\n' +
    '    v_Color = vec4(color,a_Face / 255.0);\n' +
    '  }else{\n' +
    '    v_Color = vec4(color,a_Color.a);\n' +
    '  };\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';


window.onload=()=>{
    main();
}


var currentAngle = 0;

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const n = initVertexBuffers(gl);

    const projectionMatrix = new Matrix4().setPerspective(30,canvasDom.width/canvasDom.height,1,100);
    const viewMatrix = new Matrix4().lookAt(3,3,7,0,0,0,0,1,0);
    const vpMatrix = projectionMatrix.multiply(viewMatrix)

    const u_mvpMatrix = gl.getUniformLocation(gl.program,'u_mvpMatrix');
    const u_Face = gl.getUniformLocation(gl.program,'u_Face')

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0,1.0);

    canvasDom.addEventListener('click',(ev)=>{
        const x = ev.x,y=ev.y;
        const rect = ev.target.getBoundingClientRect();
        const isInCanvas = rect.left <=x && x<rect.right && rect.top<=y && y<rect.bottom;
        if(isInCanvas){
            const xInCanvas = x - rect.left,yInCanvas = y - rect.top;
            gl.uniform1f(u_Face,1);
            draw(gl,n,vpMatrix,u_mvpMatrix,currentAngle);
            const pix = new Uint8Array(4);
            gl.readPixels(xInCanvas,yInCanvas,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pix);

            gl.uniform1f(u_Face,pix[3])
            draw(gl,n,vpMatrix,u_mvpMatrix,currentAngle);
        }
    })


    const tick = ()=>{
        currentAngle = animate(currentAngle);
        draw(gl,n,vpMatrix,u_mvpMatrix,currentAngle);
        window.requestAnimationFrame(tick)
    }
    tick()
}
var g_MvpMatrix = new Matrix4();
function draw(gl,n,vpMatrix,mvpMatrixLocation,currentAngle) {
    g_MvpMatrix.set(vpMatrix);
    g_MvpMatrix.rotate(currentAngle,1,0,0);
    g_MvpMatrix.rotate(currentAngle,0,1,0)
    g_MvpMatrix.rotate(currentAngle,0,0,1);
    gl.uniformMatrix4fv(mvpMatrixLocation,false,g_MvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);
}

function initVertexBuffers(gl) {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    const vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
    ]);

    const colors = new Float32Array([   // Colors
        0.2, 0.58, 0.82,   0.2, 0.58, 0.82,   0.2,  0.58, 0.82,  0.2,  0.58, 0.82, // v0-v1-v2-v3 front
        0.5,  0.41, 0.69,  0.5, 0.41, 0.69,   0.5, 0.41, 0.69,   0.5, 0.41, 0.69,  // v0-v3-v4-v5 right
        0.0,  0.32, 0.61,  0.0, 0.32, 0.61,   0.0, 0.32, 0.61,   0.0, 0.32, 0.61,  // v0-v5-v6-v1 up
        0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84,  0.78, 0.69, 0.84, // v1-v6-v7-v2 left
        0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56,  0.32, 0.18, 0.56, // v7-v4-v3-v2 down
        0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93,  0.73, 0.82, 0.93, // v4-v7-v6-v5 back
    ]);

    const faces = new Uint8Array([   // Faces
        1, 1, 1, 1,     // v0-v1-v2-v3 front
        2, 2, 2, 2,     // v0-v3-v4-v5 right
        3, 3, 3, 3,     // v0-v5-v6-v1 up
        4, 4, 4, 4,     // v1-v6-v7-v2 left
        5, 5, 5, 5,     // v7-v4-v3-v2 down
        6, 6, 6, 6,     // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    const indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    const a_Position = gl.getAttribLocation(gl.program,'a_Position');
    const a_Color = gl.getAttribLocation(gl.program,'a_Color');
    const a_Face = gl.getUniformLocation(gl.program,'a_Face');
    initArrayBuffer(gl,a_Position,vertices,3);
    initArrayBuffer(gl,a_Color,colors,3);
    initArrayBuffer(gl,a_Face,faces,1);

    initElementArrayBuffer(gl,indices)

    return indices.length;
}

function initArrayBuffer(gl,location,data,size,step=0,offset=0) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
    gl.vertexAttribPointer(location,size,gl.FLOAT,false,step,offset)
    gl.enableVertexAttribArray(location)
}

function initElementArrayBuffer(gl,data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,data,gl.STATIC_DRAW);
}

var last = Date.now(); // Last time that this function was called
function animate(angle) {
    var now = Date.now();   // Calculate the elapsed time
    var elapsed = now - last;
    last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle % 360;
}
var ANGLE_STEP = 20.0; // Rotation angle (degrees/second)
