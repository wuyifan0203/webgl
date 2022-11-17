
const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec4 a_Color;\n' +
    'uniform mat4 u_ProjectMatrix;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ProjectMatrix * a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'varying vec4 v_Color;\n'+
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';


let [near,far] =[0.0,0.5]

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');
    const pDoM = document.createElement('p');
    document.body.appendChild(pDoM)


    initShaders(gl,vShader,fShader);

    initVertexBuffers(gl);

    document.addEventListener('keydown',(e)=>{
        const key = e.code;
        console.log(key)

        if(key === 'KeyW'){
            near+=0.01;
        }else if(key === 'KeyS'){
            near-=0.01;
        }else if(key === 'KeyA'){
            far+=0.01;
        }else if(key === 'KeyD'){
            far-=0.01;
        }
        pDoM.innerText = `near: ${near} , far: ${far}`;

        const projectMatrix = new Matrix4().setOrtho(-1,1,-1,1,near,far);

        draw(gl,projectMatrix)
    })

}

function initVertexBuffers(gl) {
    const vertices = new Float32Array([
        0.0,0.5,-0.4,    0.4,1.0,0.4,
        -0.5,-0.5,-0.4,    0.4,1.0,0.4,
        0.5,-0.5,-0.4,    1.0,0.4,0.4,

        0.5,0.4,0.2,   1.0,0.4,0.4,
        -0.5,0.4,0.2,   1.0,1.0,0.4,
        -0.0,-0.6,-0.2,   1.0,1.0,0.4,

        0.0,0.5,0.0,    0.4,0.4,1.0,
        -0.5,-0.5,0.0,    0.4,0.4,1.0,
        0.5,-0.5,0.0,    1.0,0.4,0.4,
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

function draw(gl,projectMatrix) {
    const u_ProjectMatrix = gl.getUniformLocation(gl.program,'u_ProjectMatrix');
    gl.uniformMatrix4fv(u_ProjectMatrix,false,projectMatrix.elements)


    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,9)
}


main()
