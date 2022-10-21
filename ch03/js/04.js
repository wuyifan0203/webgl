import {angle2Radians} from "../../lib/math.js";

// x' = x * cosB - y * sinB
// y' = x * sinB + y * cosB

const vShader =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Cos, u_Sin;\n' +
    'void main() {\n' +
    '  gl_Position.x = a_Position.x * u_Cos - a_Position.y * u_Sin;\n' +
    '  gl_Position.y = a_Position.x * u_Sin + a_Position.y * u_Cos;\n' +
    '  gl_Position.z = a_Position.z;\n' +
    '  gl_Position.w = 1.0;\n' +
    '}\n';

const fShader =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n' +
    '}\n';

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const origin = [
        -2,-2,2,-2,0,2
    ]
    const n = initVertexBuffers(origin,gl)


    const angle = 90.0;
    const raians = angle2Radians(angle);
    const [u_sin,u_cos] = [Math.sin(raians),Math.cos(raians)];

    const u_Sin = gl.getUniformLocation(gl.program,'u_Sin');
    const u_Cos = gl.getUniformLocation(gl.program,'u_Cos');

    gl.uniform1f(u_Sin,u_sin);
    gl.uniform1f(u_Cos,u_cos);


    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.TRIANGLES,0,n);
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


main()
