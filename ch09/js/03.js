
function initShaders(gl,vShader,fShader) {
    // 7步

    //1.创建着色器
    const VertexShader = gl.createShader(gl.VERTEX_SHADER);
    const FragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    //2.向着色器填充glsl源码
    gl.shaderSource(VertexShader,vShader);
    gl.shaderSource(FragmentShader,fShader);

    //3.编译着色器
    gl.compileShader(VertexShader);
    gl.compileShader(FragmentShader);

    ////检查shader

    const Vresult = gl.getShaderParameter(VertexShader,gl.COMPILE_STATUS);
    const Fresult = gl.getShaderParameter(FragmentShader,gl.COMPILE_STATUS);
    if(!Vresult || !Fresult){
        const Verror = gl.getShaderInfoLog(VertexShader);
        const Ferror = gl.getShaderInfoLog(FragmentShader);
        console.log('Failed to compile Vshader: ' + Verror);
        console.log('Failed to compile Fshader: ' + Ferror);
        gl.deleteShader(VertexShader);
        gl.deleteShader(FragmentShader);
        return false
    }

    if (!VertexShader || !FragmentShader) {
        console.log('init shader error')
        return false;
    }

    //4.创建程序对象
    const program = gl.createProgram();

    //5.为程序对象分配着色器
    gl.attachShader(program,VertexShader);
    gl.attachShader(program,FragmentShader);

    //6.链接程序对象
    gl.linkProgram(program);

    ////检查链接
    const linked = gl.getProgramParameter(program,gl.LINK_STATUS);

    if(!linked){
        const error = gl.getProgramInfoLog(program);
        console.warn('Fail to link shader :'+error);
        gl.deleteProgram(program);
        gl.deleteShader(FragmentShader);
        gl.deleteShader(VertexShader);
        return false
    }

    //7.使用程序对象
    gl.useProgram(program);

    gl.program = program;

    return true

}

const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Normal;\n' +
    'uniform mat4 u_mvpMatrix;\n' +
    'uniform mat4 u_NormalMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_mvpMatrix * a_Position;\n' +
    '  vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n' +
    '  vec3 lightDirection = normalize(vec3(0.0,0.5,0.7));\n' +
    '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
    '  float nDotLd = max(dot(normal, lightDirection), 0.0);\n' +
    '  v_Color = vec4(color.rgb * nDotLd + vec3(0.1), color.a);\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'varying vec4 v_Color;\n'+
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';
window.onload=()=>{
    main();
}

// 流程
// initShader
// initVertexBuffer
// addListener -> draw
// draw
// drawBox * 6

var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    if(!initShaders(gl,vShader,fShader)){
        return
    }

    const n = initVertexBuffers(gl);

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.POLYGON_OFFSET_FILL);

    gl.polygonOffset(1.0,1.0);

    const projectionMatrix = new Matrix4().setPerspective(50,canvasDom.width/canvasDom.height,1,100);
    const viewMatrix = new Matrix4().lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    const vpMatrix = projectionMatrix.multiply(viewMatrix);

    const u_mvpMatrix = gl.getUniformLocation(gl.program,'u_mvpMatrix');
    const  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

    document.addEventListener('keydown',(e)=>{
        keydown(e,gl,n,vpMatrix,u_mvpMatrix,u_NormalMatrix);
    })
    draw(gl,n,vpMatrix,u_mvpMatrix,u_NormalMatrix);
}

var step = 3.0;
var arm1Angle = -90.0;
var handeAngle = 0.0;

var fingerAngle = 0
var joint1Angle = 0.0;

function keydown(e,gl,n,VPMatrix,MVPMatrix,NormalMatrix) {

    switch (e.code){
        case 'ArrowUp':
            joint1Angle < 135.0 && (joint1Angle += step);
            break;
        case 'ArrowDown':
            joint1Angle > -135.0 && (joint1Angle -= step);
            break
        case 'ArrowRight':
            arm1Angle = (arm1Angle + step) % 360;
            break
        case 'ArrowLeft':
            arm1Angle = (arm1Angle - step) % 360;
            break
        case 'KeyA':
            handeAngle = (handeAngle + step) % 360;
            break
        case 'KeyD':
            handeAngle = (handeAngle - step) % 360;
            break
        case 'KeyW':
            fingerAngle < 60 && (fingerAngle = (fingerAngle + step) % 360);
            break
        case 'KeyS':
            fingerAngle > -21 && (fingerAngle = (fingerAngle - step) % 360);
            break
        default: return
    }
    draw(gl,n,VPMatrix,MVPMatrix,NormalMatrix);
}


function draw(gl,n,VPMatrix,MVPMatrix,NormalMatrix) {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    g_modelMatrix.setTranslate(0.0,-14,0.0);
    drawBox(gl,n,4,0.1,4,VPMatrix,MVPMatrix,NormalMatrix);

    g_modelMatrix.setTranslate(0.0,-12.0,0.0).rotate(arm1Angle,0,1,0);
    drawBox(gl,n,1,1,1,VPMatrix,MVPMatrix,NormalMatrix);

    g_modelMatrix.translate(0,10,0).rotate(joint1Angle,0.0,0.0,1.0);
    drawBox(gl,n,1.2,0.8,1.2,VPMatrix,MVPMatrix,NormalMatrix);

    g_modelMatrix.translate(0,8,0).rotate(handeAngle,0.0,1.0,0.0);
    drawBox(gl,n,0.5,0.15,2,VPMatrix,MVPMatrix,NormalMatrix);

    stash(g_modelMatrix);

    g_modelMatrix.translate(0,1.5,1).rotate(fingerAngle,1.0,0.0,0.0);
    drawBox(gl,n,0.2,0.2,0.2,VPMatrix,MVPMatrix,NormalMatrix);

    g_modelMatrix = pop()

    g_modelMatrix.translate(0,1.5,-1).rotate(-fingerAngle,1.0,0.0,0.0);
    drawBox(gl,n,0.2,0.2,0.2,VPMatrix,MVPMatrix,NormalMatrix);
}

function drawBox(gl,n,x,y,z,VPMatrix,MVPMatrix,NormalMatrix) {
    stash(g_modelMatrix);
    g_modelMatrix.scale(x,y,z)
    g_mvpMatrix.set(VPMatrix).multiply(g_modelMatrix);
    gl.uniformMatrix4fv(MVPMatrix, false, g_mvpMatrix.elements);

    g_normalMatrix.setInverseOf(g_modelMatrix).transpose();
    gl.uniformMatrix4fv(NormalMatrix, false, g_normalMatrix.elements);

    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

    g_modelMatrix = pop()
}

var modelMatrixList = [];

function stash(m) {
    const mm = new Matrix4(m);
    modelMatrixList.push(mm);
}

function pop() {
    return modelMatrixList.pop();
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
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
        1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
        -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
        -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
        1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
    ]);

    const normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
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
    const a_Normal = gl.getAttribLocation(gl.program,'a_Normal');


    initArrayBuffer(gl,a_Position,vertex,3,0,0);
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


