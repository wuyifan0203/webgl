const vShader =
    'attribute vec4 a_Position;\n'+
    'attribute float a_PointSize;\n'+
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
const pointList = [];
const colorList = [];

function click(ev,gl,dom,position,color) {
    const [x,y] = [ev.clientX,ev.clientY];
    const rect = ev.target.getBoundingClientRect();
    const [halfHeight,halfWidth] = [dom.height/2,dom.width/2]
    pointList.push({
        x:((x-rect.left) - halfHeight)/halfHeight,
        y:(halfWidth-y-rect.top)/halfWidth
    })

    colorList.push({
        r:Math.random(),
        g:Math.random(),
        b:Math.random(),
        a:1
    })

    gl.clear(gl.COLOR_BUFFER_BIT);


    pointList.length && pointList.forEach((point,i)=>{
        const {x,y} = point
        gl.vertexAttrib3f(position,x,y,0.0);
        const {r,g,b,a} = colorList[i];
        gl.uniform4f(color,r,g,b,a);
        gl.drawArrays(gl.POINTS,0,1);
    })
}


main()