
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


let [ex,ey,ez] =[0.2,0.25,0.25]

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    initVertexBuffers(gl);

    const u_ProjectionMatrix = gl.getUniformLocation(gl.program,'u_ProjectionMatrix');
    const projectMatrix = new Matrix4().setOrtho(-1,1,-1,1,0,2);
    gl.uniformMatrix4fv(u_ProjectionMatrix,false,projectMatrix.elements)


    document.addEventListener('keydown',(e)=>{
        const key = e.code;

        if(key === 'KeyW'){
            ey+=0.01;
        }else if(key === 'KeyS'){
            ey-=0.01;
        }else if(key === 'KeyA'){
            ex+=0.01;
        }else if(key === 'KeyD'){
            ex-=0.01;
        }else if(key === 'Space'){
            ez+=0.01;
        }else if(key === 'KeyC'){
            ez-=0.01;
        }


        const viewMatrix = new Matrix4().setLookAt(ex,ey,ez,0.0,0.0,0.0,0.0,1.0,0.0)
        const modalMatrix = new Matrix4().scale(1,1,1).rotate(30,0,1,0).translate(0,0,0)
        viewMatrix.multiply(modalMatrix)
        draw(gl,viewMatrix)
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

function draw(gl,viewMatrix) {
    const u_ModalViewMatrix = gl.getUniformLocation(gl.program,'u_ModalViewMatrix');
    gl.uniformMatrix4fv(u_ModalViewMatrix,false,viewMatrix.elements);


    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,9)
}


main()
