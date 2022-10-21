import {angle2Radians} from "../../lib/math.js";

const vShader =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 m4_Position, m4_Rotate,m4_Scale;\n' +
    'void main() {\n' +
    '  gl_Position = m4_Scale * m4_Rotate * m4_Position * a_Position;\n' +
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

    const m4_Position = gl.getUniformLocation(gl.program,'m4_Position');
    const m4_Rotate = gl.getUniformLocation(gl.program,'m4_Rotate');
    const m4_Scale = gl.getUniformLocation(gl.program,'m4_Scale');

    const [px,py,pz] = [0.5,0.0,1.0]
    const m4_position = new Float32Array([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        px,py,pz,1
    ]);

    const [sx,sy,sz] = [2,1,1]
    const m4_scale = new Float32Array([
        sx,0,0,0,
        0,sy,0,0,
        0,0,sz,0,
        0,0,0,1
    ]);

    const m4_rotate = new Float32Array([
        u_cos,u_sin,0,0,
        -u_sin,u_cos,0,0,
        0,0,1,0,
        0,0,0,1
    ]);

    gl.uniformMatrix4fv(m4_Position,false,m4_position);
    gl.uniformMatrix4fv(m4_Rotate,false,m4_rotate);
    gl.uniformMatrix4fv(m4_Scale,false,m4_scale);



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
