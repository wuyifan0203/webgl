
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
    'uniform sampler2D u_Sampler;\n'+
    'varying vec2 v_Texture;\n'+
    'void main() {\n' +
    '  gl_FragColor = texture2D(u_Sampler,v_Texture);\n' +
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
        -0.5,0.5,0.0,1.0,
        -0.5,-0.5,0.0,0.0,
        0.5,-0.5,1.0,0.0,
        0.5,0.5,1.0,1.0
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

    const u_Sampler = gl.getUniformLocation(gl.program,'u_Sampler');
    const texture = gl.createTexture();
    const image = new Image();
    image.src = '../../resources/sky.jpg'

    image.onload = ()=>{
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1); // 将纹理图像进行Y轴反转
        gl.activeTexture(gl.TEXTURE0); // 激活纹理对象
        gl.bindTexture(gl.TEXTURE_2D,texture);// 绑定纹理对象
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);// 配置纹理对象参数
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image) // 将纹理图像分配给纹理对象
        gl.uniform1i(u_Sampler,0);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
}

main()
