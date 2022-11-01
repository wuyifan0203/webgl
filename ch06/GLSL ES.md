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

语法




