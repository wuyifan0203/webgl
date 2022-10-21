import {angle2Radians} from "../../lib/math.js";

const vShader =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 m4_ModalMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = m4_ModalMatrix * a_Position;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'uniform vec4 u_Color;\n'+
    'void main() {\n' +
    '  gl_FragColor = u_Color;\n' +
    '}\n';

const speed = 45.0

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const origin = [
        -2,-2,2,-2,0,2
    ]
    const n = initVertexBuffers(origin,gl)


    let angle = 0.0;
    let color = [0,0,0]

    const m4_ModalMatrix = gl.getUniformLocation(gl.program,'m4_ModalMatrix');

    const u_Color = gl.getUniformLocation(gl.program,'u_Color');

    const modalMatrix = new Matrix4()

    function tick() {
        angle = updateAngle(angle);
        modalMatrix.setRotate(angle,0,0,1);

        color = [Math.random(),Math.random(),Math.random()]
        draw(gl,color,u_Color,modalMatrix,m4_ModalMatrix)
        window.requestAnimationFrame(tick)
    }

    gl.clearColor(0.0,0.0,0.0,1.0);

    tick()
}

function initVertexBuffers(origin,gl){
    const normalise = origin.map(i=>i/10);
    const vertices = new Float32Array(normalise);
    const n = vertices.length / 2;
    const a_Position = gl.getAttribLocation(gl.program,'a_Position');

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
    return n;

}

function updateAngle(angle) {
    return (angle + (speed * 100) /1000) % 360
}

function draw(gl,color,colorPosition,modalMatrix,matrixPosition) {

    gl.uniformMatrix4fv(matrixPosition,false,modalMatrix.elements);
    gl.uniform4f(colorPosition,color[0],color[1],color[2],1.0)

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,3)

}


main()
