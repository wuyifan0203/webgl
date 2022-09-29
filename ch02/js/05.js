const vShader =
    'attribute vec4 a_Position;\n'+
    'void main() {\n'+
    '  gl_Position = a_Position;\n'+
    '  gl_PointSize = a_PointSize;\n'+
    '}\n';

const fShader =
    'precision mediump float;\n'+
    'uniform vec4 u_Color;\n'+
    'void main() {\n'+
    '  gl_FragColor = u_Color;\n'+
    '}\n';

function main() {
    const canvasDom = document.querySelector('#canvas');
    const gl = canvasDom.getContext('webgl');

    initShaders(gl,vShader,fShader);

    const a_Position = gl.getAttribLocation(gl.program,'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');

    const u_Color = gl.getUniformLocation(gl.program,'u_Color')
    gl.vertexAttrib1f(a_PointSize,10.0);

    canvasDom.addEventListener('mousedown',(ev)=>{
        click(ev,gl,canvasDom,a_Position,u_Color)
    })

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)


}


main()