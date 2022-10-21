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

const pointList = [];
const colorList = [];

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

function click(event,gl,canvas,position,colorPosition) {
    const [x,y] = [event.clientX,event.clientY];
    const rect = event.target.getBoundingClientRect();
    const [halfHeight,halfWidth] = [canvas.height/2,canvas.width/2]
    pointList.push({
        x:((x-rect.left) - halfHeight)/halfHeight,
        y:(halfWidth-y-rect.top)/halfWidth
    });

    colorList.push([Math.random(),Math.random(),Math.random()])

    gl.clear(gl.COLOR_BUFFER_BIT);

    pointList.length && pointList.forEach((point,i)=>{
        const {x,y} = point
        const color = colorList[i]
        gl.vertexAttrib3f(position,x,y,0.0);
        gl.uniform4f(colorPosition,color[0],color[1],color[2],1.0)
        gl.drawArrays(gl.POINTS,0,1);
    })


}


main()
