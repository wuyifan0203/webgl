
const vShader =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_Texture;\n' +
    'varying vec2 v_Texture;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  v_Texture = a_Texture;\n' +
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'uniform sampler2D u_Sampler1;\n'+
    'varying vec2 v_Texture;\n'+
    'uniform sampler2D u_Sampler2;\n'+
    'void main() {\n' +
    '  vec4 color1 = texture2D(u_Sampler1,v_Texture);\n' +
    '  vec4 color2 = texture2D(u_Sampler2,v_Texture);\n' +
    '  gl_FragColor = color1 * color2;\n' +
    '}\n';

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    initVertexBuffers(gl);

    gl.clearColor(0.0,0.0,0.0,1.0);

    initTexture(gl);

}

function initVertexBuffers(gl) {
    const origin = new Float32Array([
        -0.5,0.5  ,0.0, 1.0,
        -0.5,-0.5,  0.0,0.0,
        0.5,0.5,  1.0,1.0,
        0.5,-0.5,  1.0,0.0,

    ])
    const FSIZE = origin.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_Texture = gl.getAttribLocation(gl.program,'a_Texture')


    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,origin,gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Texture,2,gl.FLOAT,false,FSIZE * 4 ,FSIZE * 2);
    gl.enableVertexAttribArray(a_Texture)
}


function initTexture(gl) {

    const u_Sampler1 = gl.getUniformLocation(gl.program,'u_Sampler1');
    const u_Sampler2 = gl.getUniformLocation(gl.program,'u_Sampler2');

    const texture1 = gl.createTexture();
    const texture2 = gl.createTexture();

    const image1 = new Image();
    image1.src = '../../resources/sky.jpg'
    const image2 = new Image();
    image2.src = '../../resources/circle.gif'

    image1.onload = ()=>{
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1); // ?????????????????????Y?????????
        gl.activeTexture(gl.TEXTURE0); // ??????????????????
        gl.bindTexture(gl.TEXTURE_2D,texture1);// ??????????????????
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);// ????????????????????????
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image1) // ????????????????????????????????????
        gl.uniform1i(u_Sampler1,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }


    image2.onload = ()=>{
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1); // ?????????????????????Y?????????
        gl.activeTexture(gl.TEXTURE1); // ??????????????????
        gl.bindTexture(gl.TEXTURE_2D,texture2);// ??????????????????
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);// ????????????????????????
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image2) // ????????????????????????????????????
        gl.uniform1i(u_Sampler2,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP,0,4)

    }
}


main()
