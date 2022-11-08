#GLSL ES

## GLSL 基础

-> GLSL 是强类型语言

-> GLSL ES 大小写敏感

-> 每一句以分号(;)结束

-> 着色器有且仅有一个主函数，且该函数不接受任何参数

-> 单行注释 // ，多行注释 /* 和 */ 之间所有为注释

-> 变量名 不能以 webgl_ , gl_ ,  _ webgl_ 开头

## 数据类型

- 数值类型
- 布尔类型

### 基本类型

- float
- int
- bool

### 矢量与矩阵

矢量

- vec2,vec3,vec4: 具有 2，3，4个浮点元素的矢量
- ivec2,ivec3,ivec4: 具有 2，3，4个整型元素的矢量
- bvec2,bvec3,bvec4: 具有 2，3，4个布尔元素的矢量

矩阵

- mat2,mat3,mat4:2 * 2,3 * 3,4 * 4的浮点数矩阵

### 结构体

使用关键字struct申明

例如
```GLSL
struct myStruct
{
  vec4 position;
  vec4 color;
  vec2 uv;
};

myStruct structVar = myStruct(vec4(0.0, 0.0,0.0,0.0), vec4(1.0, 1.0, 1.0, 1.0), vec2(0.5, 0.5));
```

#### 结构体的支持的运算
- =: 赋值，赋值和比较运算符不适用于含有数组或纹理成员的结构体
- ==,!=: 比较，当所有成员都相等时，返回 true

### 数组

- 数组必须声明长度
- 数组不能在声明的同时初始化
- 数组必须由常量表达式初始化
- 数组不能用 const 修饰
- 不支持多维数组
- 不支持pop(),push()等操作

数组声明和初始化的代码示例如下
```glsl
float array[4];
for(int i =0; i < 4; i ++){
    array[i] = 0.0;
}
```

### 取样器

两种取样器 sampler2D samplerCube

除了 = ，== ，!= 取样器变量不可以作为操作数参与计算

## GLSL 程序流程控制

### if 和 if-else

if-else 的用法和 C 语言一致，代码示例如下：

```glsl
if (v_uvMode >= 2.0) {
  i.uv = fract(v_uv0) * v_uvSizeOffset.xy + v_uvSizeOffset.zw;
} else if (v_uvMode >= 1.0) {
  i.uv = evalSlicedUV(v_uv0) * v_uvSizeOffset.xy + v_uvSizeOffset.zw;
} else {
  i.uv = v_uv0;
}
```

没有switch语句

### for 语句

```glsl
const float value = 10.; 
for(float i = 0.0; i < value; i ++){ 
    ...
}
```

可以使用 continue 与 break

```glsl
for(int i = 0; i < 10 ; i++){
    if(i == 8){
        continue;
    }
    // 当i = 8 时这里不会执行
}
```

```glsl
for(int i = 0; i < 10 ; i++){
    if(i == 8){
        break;
    }
    // 当i >= 8 不会执行这里
}
// 当 i == 8 时执行这里
```

discard 只能在片元着色器中使用，表示放弃当前片元处理下一片元

<br/>

## GLSL 函数

定义格式更接近于C语言，格式如下：
```glsl
返回类型 函数名(参数){
    // body
    return 返回值
}

// 例如

void scaleMatrix (inout mat4 m, float s){
  m[0].xyz *= s;
  m[1].xyz *= s;
  m[2].xyz *= s;
}
```

注意：GLSL 的函数不能递归！！！

### 函数规范

如果函数定义在其调用之后，必须在调用前申明函数规范

```glsl
float luma(vec4);  // 规范声明
void main(){
    ...
    float color1 = luma(color);
    ...
} 

float luma(vec4 color){
    return color.r + color.g + color.b;
}
```

### 函数限定词

- in:向函数中传入值。参数传入函数，既可以使用，也可以修改
- const in:向函数中传入值。参数传入函数，可以使用，不可以修改
- out:在函数中被赋值，并被传出
- inout:传入函数，同时在函数中被赋值，并被传出
  
  <br/>

## GLSL 内置函数

### 角度函数

- radians:角度值转弧度制
- degrees:弧度制转角度制

### 三角函数

- sin
- cos
- tan
- asin
- acos
- atan

### 指数函数

- pow:冥函数
- exp:自然指数
- log: 对数
- exp2
- log2
- sqrt
- inversesqrt:开平方的倒数

### 通用函数

- abs
- min
- max
- mod
- sign: 取正负号
- floor
- ceil
- clamp:限定范围
- mix:线性内插
- step:步进函数
- smoothstep:艾米内插步进
- fract:获取小数部分

### 几何函数

- length:矢量长度
- distance：两点间距
- dot:内积
- cross:外积
- normalize:归一化
- reflect:矢量反射
- faceforward:使向量朝前

### 矩阵函数

- matrixCmpMult:逐元素乘法

### 矢量函数

- lessTha：逐元素小于
- lessThanEqual：逐元素小于等于
- greaterThan：逐元素大于
- greaterThanEqual：逐元素大于等于
- equal：逐元素相等
- notEqual：逐元素不等
- any：任意元素为true则为true
- all：所有元素为true则为true

### 纹理查询函数
- texture2D：在二维纹理中获取元素
- textureCube：在立方体纹理中获取元素
- texture2DPrjo：texture2D的投影版本
- texture2DLod：金字塔版本
- textuerCubeLod：textureCube金字塔版本
- texture2DPrjoLod：texture2DLod投影版本

<br/>

## GLSL 变量

### 存储限定字

#### const

用来定义常量，声明时必须初始化，声明后不可更改

```glsl
const lightSpeed = 299792458;
```

#### attribute
只能出现在顶点着色器

只能声明为全局变量

只能为float、vec2、vec3、vec4、mat2、mat3、mat4

```glsl
attrbute vec4 a_Color;
```

全局最小值8

#### uniform

可以使用在顶点着色器与片元着色器

只能是全局变量

是只读的

可以是除了结构体和数组外的任意类型

顶点着色器与片元着色器声明了同名的uniform变量，它就会被两种着色器共享

用来存放共用的数据

```glsl
uniform mat4 u_ViewMatrix;
```

顶点着色器最小数量为128

片元着色器最小数量为16

#### varying

只能是全局变量

用来从顶点着色器向片元着色器传递数据

只能为float、vec2、vec3、vec4、mat2、mat3、mat4

```glsl
varying vec2 v_Color;
```

全局最小值为8

<br/>

### 精度限定字

为了帮助着色器提高效率，减少开支

高精度程序需要更大的开销

由于WebGL是基于OpenGLES2.0的, WebGL程序最后有可能运行在各种各样的硬件平台上。

肯定存在某些情况需要在低精度下运行程序，以提高内存使用效率，减少性能开销，以及更重要的，降低能耗，延长移动设备的电池续航能力。

注意，在低精度下，WebGL程序的运行结果会比较粗糙或不准确，必须在程序效果和性能间进行平衡。

默认精度

```glsl
#ifdef GL_ES
precision mediump float;
#endif
```

WEBGL支持三种精度

- highp: 高精度 float(-2^62,2^62)精度2^-16 int(-2^16,2^16)
- mediump: 中精度 float(-2^14,2^14)精度2^-10 int(-2^10,2^10)
- lowp: 低精度 float(-2,2)精度2^-8 int(-2^8,2^8)

```glsl
mediump float size;
highp vec4 position;
lowp vec4 color;
```

为每一个变量声明精度很繁琐，可以使用 precision 声明着色器的默认精度
```glsl
precision 精度类型 类型名称;
```

接下来的该类型的所有精度都为指定的默认精度

注意:只有片元着色器的 float 精度没有 默认精度，所以需要手动添加，其余的类型在着色器中都有默认精度

##### 顶点着色器的默认精度

int -> highp

float -> highp

sample2D -> lowp

sampleCube -> lowp

##### 片元着色器的默认精度

int -> mediump

float  无

sample2D -> lowp

sampleCube -> lowp

### 预处理指令

有三种常见的预处理指令

```glsl
#if 条件表达式
为真，执行这里
#endif

#ifdef 某宏
如果定义了某宏，执行这里
#endif

#ifndef 某宏
如果没定义了某宏，执行这里
#endif
```

使用 #define 指令进行宏定义

```glsl
#define 宏名 宏内容
```

使用 #undef 来取消对宏的定义

```glsl
#undef 宏名
```

宏名可以随意起，但是不能与预定义宏名相同

预定义宏

- GL_ES:在WEBGL 2.0中定义为 1

- GL_FRAGMENT_PRECISION_HIGH:片元着色器支持highp精度

使用 #version 来指定着色器使用的 GLSL ES 版本

```glsl
#version 101 // 默认100
```

 -#version 必须在着色器顶部


