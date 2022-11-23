
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


let [ex,ey,ez] =[0.1,0.1,2.8]

function main() {
    console.log('loading....')
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    initVertexBuffers(gl);

    const u_ProjectionMatrix = gl.getUniformLocation(gl.program,'u_ProjectionMatrix');
    const projectMatrix = new Matrix4().setPerspective(30,window.innerWidth/window.innerHeight,1,100);
    gl.uniformMatrix4fv(u_ProjectionMatrix,false,projectMatrix.elements);

    gl.enable(gl.DEPTH_TEST)


    document.addEventListener('keydown',(e)=>{
        const key = e.code;

        if(key === 'KeyW'){
            ez+=0.01;
        }else if(key === 'KeyS'){
            ez-=0.01;
        }else if(key === 'KeyA'){
            ex+=0.01;
        }else if(key === 'KeyD'){
            ex-=0.01;
        }else if(key === 'Space'){
            ey+=0.01;
        }else if(key === 'KeyC'){
            ey-=0.01;
        }

        console.log(ex,ey,ez)


        const viewMatrix = new Matrix4().setLookAt(ex,ey,ez,0.0,0.0,0.0,0.0,1.0,0.0)
        const modalMatrix = new Matrix4().scale(1,1,1).rotate(0,0,1,0).translate(0,0,-2)
        viewMatrix.multiply(modalMatrix)
        draw(gl,viewMatrix)
    })

    console.log('finish')

}

function initVertexBuffers(gl) {
    // deep test
    const vertices = new Float32Array([
        0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
        0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
        1.25, -1.0,   0.0,  1.0,  0.4,  0.4,

        0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
        0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
        1.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

        0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
        0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
        1.25, -1.0,  -4.0,  1.0,  0.4,  0.4,

        // Three triangles on the left side

        -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
        -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
        -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

        -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
        -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
        -0.25, -1.0,   0.0,  1.0,  0.4,  0.4,

        -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
        -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
        -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4,
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
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,18)
}


main()
