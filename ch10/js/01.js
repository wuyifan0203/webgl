const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'uniform mat4 u_mvpMatrix;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
    '  gl_Position = u_mvpMatrix * a_Position;\n' +
    '  v_TexCoord = a_TexCoord;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'varying vec2 v_TexCoord;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';


window.onload=()=>{
    main();
}


function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const n = initVertexBuffers(gl);

    const projectionMatrix = new Matrix4().setPerspective(30,canvasDom.width/canvasDom.height,1,100);
    const viewMatrix = new Matrix4().lookAt(3,3,7,0,0,0,0,1,0);
    const vpMatrix = projectionMatrix.multiply(viewMatrix)

    const u_mvpMatrix = gl.getUniformLocation(gl.program,'u_mvpMatrix');

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0,1.0);

    // const a_texCoord = gl.getAttribLocation(gl.program,'a_TexCoord');
    const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

    const path = '../../resources/sky.jpg';

    const currentAngle = [0,0];

    initEventHandlers(canvasDom,currentAngle)


    initTexture(gl,u_Sampler,path);

    const tick = ()=>{
        draw(gl,n,vpMatrix,u_mvpMatrix,currentAngle);
        window.requestAnimationFrame(tick)
    }
    tick()
}
var g_MvpMatrix = new Matrix4();
function draw(gl,n,vpMatrix,mvpMatrixLocation,currentAngle) {
    g_MvpMatrix.set(vpMatrix);
    g_MvpMatrix.rotate(currentAngle[0],1,0,0);
    g_MvpMatrix.rotate(currentAngle[1],0,1,0)

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

    const texCoords = new Float32Array([   // Texture coordinates
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
        0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
        1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
        1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
        0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
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
    const a_TexCoord = gl.getAttribLocation(gl.program,'a_TexCoord');
    initArrayBuffer(gl,a_Position,vertices,3);
    initArrayBuffer(gl,a_TexCoord,texCoords,2);

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

function initTexture(gl,location,path) {
    const texture = gl.createTexture();

    const img = new Image();
    img.src = path;

    img.onload =()=>{
        // 将纹理图像沿Y轴翻转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        // 激活纹理对象
        gl.activeTexture(gl.TEXTURE0);
        //绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D,texture);
        // 配置纹理对象参数
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        // 将图像纹理分配给纹理对象
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
        // 赋值
        gl.uniform1i(location,0);
    }

}


function initEventHandlers(canvas,currentAngle) {
    var dragging = false;         // Dragging or not
    var lastX = -1, lastY = -1;   // Last position of the mouse

    canvas.onmousedown = function(ev) {   // Mouse is pressed
        var x = ev.clientX, y = ev.clientY;
        // Start dragging if a moue is in <canvas>
        var rect = ev.target.getBoundingClientRect();
        if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
            lastX = x; lastY = y;
            dragging = true;
        }
    };

    canvas.onmouseup = function(ev) { dragging = false;  }; // Mouse is released

    canvas.onmousemove = function(ev) { // Mouse is moved
        var x = ev.clientX, y = ev.clientY;
        if (dragging) {
            var factor = 100/canvas.height; // The rotation ratio
            var dx = factor * (x - lastX);
            var dy = factor * (y - lastY);
            // Limit x-axis rotation angle to -90 to 90 degrees
            currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
            currentAngle[1] = currentAngle[1] + dx;
        }
        lastX = x, lastY = y;
    };

}
