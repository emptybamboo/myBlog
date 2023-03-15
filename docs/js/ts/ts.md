# Typescript教程

## 安装

- 输入`node -v`和`npm -v`可以查看这俩的版本

- 如果要升级,升级npm就打开命令行,先运行`npm install npm@latest -g`再运行`npm install -g npm`即可

- 升级node就从官网下载再安装

- TypeScript 的命令行工具安装方法如下：

  ```bash
  npm install -g typescript
  ```

- 以上命令会在全局环境下安装 `tsc` 命令，安装完成之后，我们就可以在任何地方执行 `tsc` 命令了。

## 编译

- 编译一个 TypeScript 文件很简单：

  ```bash
  tsc hello.ts
  ```

- 我们约定使用 TypeScript 编写的文件以 `.ts` 为后缀，用 TypeScript 编写 React 时，以 `.tsx` 为后缀。

- 这里提到的编译就好像Java的javac编译一样,是把一个**已经存在的ts文件编译出对应的js文件**

- ts中指定类型使用`:`,右侧写具体类型,可以空格也可以不空格

- ts只在**编译时对类型静态检查**,如果发现有错,编译时就报错,但是**默认还是会生成**一个js结果文件,通过`tsconfig.json` 中配置 `noEmitOnError` 即可**阻止报错时也编译生成js文件**。

> 什么叫静态检查,就比如你定义了一个变量`let num: number = 6`,然后又在代码中写明`num = "666"`,这样给number类型的值赋值其他类型,这就会被静态检查出来,但是如果是一个未知的值,运行时才从某些地方比如后端传来再赋值,编译时就无法发现,这就需要手动对类型判断`(if (typeof num === 'number'))`

## 原始数据类型

- JS的类型分两种
  - 原始数据类型
    - 布尔值,boolean
    - 数值,number
    - 字符串,string
    - null
    - undefined
    - ES6中新类型Symbol
    - ES10中新类型BigInt
  - 对象类型

### 布尔值

- boolean类型和构造函数`Boolean` 创造的对象(`new Boolean(1)/Boolean(1)`)不是一回事

- `new Boolean()` 返回的是一个 `Boolean` 对象：`let createdByNewBoolean: Boolean = new Boolean(1);`

- 直接调用 `Boolean` 也可以返回一个 `boolean` 类型:`let createdByBoolean: boolean = Boolean(1);`

### 字符串

- ES6中的**模板字符串**用`符号包裹,比如

  ```js
  let myName: string = 'Tom';
  let myAge: number = 25;
  
  // 模板字符串
  let sentence: string = `Hello, my name is ${myName}.I'll be ${myAge + 1} years old next month.`;
  ```

### 空值

- js中没有空值(Void)概念,在ts中可以用void表示没有任何返回值的函数(`类似Java`)

  ```js
  function alertName(): void {
      alert('My name is Tom');
  }
  ```

- 声明void变量没啥用,因为你只能给他赋值`undefined`和`null`（只在 --strictNullChecks 未指定时)

### Null 和 Undefined

- 在ts中可以使用undefined和null定义这两个基础类型

  ```js
  let u: undefined = undefined;// 严格模式下，会报错
  let n: null = null;
  ```

> tsconfig.json的 strict 默认是true
> "strict": true, /* Enable all strict type-checking options. */
> 默认是严格校验类型的。
> 如果改成false，就不会报错。
> 但是默认strict都是true，还是要按照严格来；
>
> 如果是没有tsconfig.json 是会报错；

- undefined和null是所有类型的子类型,这就意味着这两个类型的值可以赋给number,string变量,但是void类型不可以,会报错

> 声明变量的数据类型为 void 时，非严格模式下，变量的值可以为 undefined 或 null。而严格模式下，变量的值只能为 undefined。

## 任意值

- ts中可以声明为任意类型`any`,允许被赋值为任何类型

- 在任意值上访问任何属性和方法都可以,哪怕你这个属性不存在,也只不过在编译时报错罢了

- 如果声明变量时,不指定类型,会被识别为任意类型

## 类型推论

- 如果**不指定类型**,某些情况下ts会进行**类型推断**

- 比如最开始定义变量不指定类型,但是赋值为字符串,之后又修改为数值,这样的话ts编译就会报错,因为ts会推断最开始的赋值类型字符串类型为变量类型

  ```js
  let myFavoriteNumber = 'seven';
  myFavoriteNumber = 7;
  
  // index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
  //等价于
  let myFavoriteNumber: string = 'seven';
  myFavoriteNumber = 7;
  
  // index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
  ```

- 但是如果**一开始定义变量不赋值**,后续就随便赋值为不同的类型的值了,这样会**被推断为any类型**

  ```js
  let myFavoriteNumber;
  myFavoriteNumber = 'seven';
  myFavoriteNumber = 7;
  ```

## 联合类型

- **联合类型**表示取值可以为多种类型的其中一种,用 `|` 分隔每个类型。类似`let myFavoriteNumber: string | number;`

- 当ts不确定一个联合类型的变量到底是哪个类型,就只能**访问联合类型的所有类型里共有的属性与方法**

> 这可能比较拗口,含义是这样的,假如一个变量联合类型为string|number,那么使用这个变量的方法时,不能使用string类型独有的方法(比如object.length),也不能使用number类型独有的方法(比如object.valueOf()),只能使用这两个类型共有的方法(比如object.toString())

- 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

  ```ts
  let myFavoriteNumber: string | number;
  myFavoriteNumber = 'seven';
  console.log(myFavoriteNumber.length); // 5
  myFavoriteNumber = 7;
  console.log(myFavoriteNumber.length); // 编译时报错
  
  // index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
  ```

- 上例中，第二行的 `myFavoriteNumber` 被推断成了 `string`，访问它的 `length` 属性不会报错。

- 而第四行的 `myFavoriteNumber` 被推断成了 `number`，访问它的 `length` 属性时就报错了。

## 接口

- **接口**的**[任意属性](https://juejin.cn/post/6855449252785717256)**是个比较抽象的概念,它本身就是可以让一个接口的实现类有无数的实现未定义的属性,就像是Java的可变参数

  ```tsx
  interface C {
      [prop: string]: number;
      [index: number]: string;
  }
  ```

- 他的属性名其实并不重要,理论上起什么名字都是一样的,不管是a,b,c,都不会对其他地方产生任何影响

- 反倒是任意属性的**签名**比较重要,也就是[]括号里面写的那个类型,如果是**string**就代表这个任意属性是**类中的属性**,如果是**number**就代表这个任意属性是个**数组**,数组**元素的类型**是**括号外定义的那个**

- 一个接口可以同时定义这两种任意属性，但是 **`number` 类型的签名指定的值类型必须是 `string` 类型的签名指定的值类型的子集**

- **一旦定义了任意属性，那么其他属性(确定属性、可选属性、只读属性等)的类型都必须是它的类型的子集**。

> 所谓的子集,任何属性都可以是any的子集
>
> 单独的属性也可以是联合属性的子集,比如`string`是`string|number`的子集
>
> string也是string自己的子集

- `number` 类型的任意属性签名不会影响其他 `string` 类型的属性签名

- 只读属性,在属性名前加readonly,**约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候**,意思就是你给一个对象赋值的时候,只读属性不管赋没赋值,之后都不可以再改变只读属性的值了

## 数组

- 数组有几种定义方式

  - 类型+方括号:`let fibonacci: number[] = [1, 1, 2, 3, 5];`

    - 这样定义之后,数组里不允许出现其他类型,数组的一些方法也会根据数组定义时的类型进行限制,比如往上面那个数组加`fibonacci.push('8');`就会报错,因为字符串无法添加到number类型的数组中

  - 数组泛型`Array<elemType>`:`let fibonacci: Array<number> = [1, 1, 2, 3, 5];`

  - 接口表示数组:

    ```js
    interface NumberArray {
        [index: number]: number;
    }
    let fibonacci: NumberArray = [1, 1, 2, 3, 5];
    ```

    - 实际上**很少用**这种形式,除非是表示**类数组**

  - 类数组:不是数组类型

    - ```ts
      function sum() {
          let args: number[] = arguments;
      }
      
      // Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 24 more.
      ```

      上例中，`arguments` 实际上是一个类数组，不能用普通的数组的方式来描述，而应该用接口：

      ```ts
      function sum() {
          let args: {
              [index: number]: number;
              length: number;
              callee: Function;
          } = arguments;
      }
      ```

      在这个例子中，我们除了约束当索引的类型是数字时，值的类型必须是数字之外，也约束了它还有 `length` 和 `callee` 两个属性。

      事实上常用的类数组都有自己的接口定义，如 `IArguments`, `NodeList`, `HTMLCollection` 等：

      ```ts
      function sum() {
          let args: IArguments = arguments;
      }
      ```

      其中 `IArguments` 是 TypeScript 中定义好了的类型，它实际上就是：

      ```ts
      interface IArguments {
          [index: number]: any;
          length: number;
          callee: Function;
      }
      ```

- any用在数组中时,代表数组中可以出现各种类型

## 函数

- 在 JavaScript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）：

  ```js
  // 函数声明（Function Declaration）
  function sum(x, y) {
      return x + y;
  }
  
  // 函数表达式（Function Expression）
  let mySum = function (x, y) {
      return x + y;
  };
  ```

- 对于**函数声明**,使用ts进行约束比较简单,只需要在参数后加冒号然后紧跟想要限制的数据类型,然后在参数的括号结束的地方加冒号右边写上返回值限制的格式即可,类似`function sum(x: number, y: number): number{}`

- 对于**函数表达式**来说,就不仅仅这么简单了,不光要对匿名函数做类型限制,等号左边的部分也要添加类型

  ```js
  let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
      return x + y;
  };
  ```

> 在 TypeScript 的类型定义中，`=>` 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

- 也可以**使用接口**定义函数的形状

  ```js
  interface SearchFunc {
      (source: string, subString: string): boolean;
  }
  
  let mySearch: SearchFunc;
  //注意接口里写了返回类型,实现的时候就不用在函数括号最后写返回类型了
  mySearch = function(source: string, subString: string) {
      return source.search(subString) !== -1;
  }
  ```

### 可选参数

- 函数中也是用问号定义`可选参数`,但是普通的`可选参数`必须在`必须参数`后面,也就是说`可选参数`后不能出现`必须参数`了.`function buildName(firstName: string, lastName?: string) {}`

- ES6之后可以给参数添加默认值,添加了默认值的参数会被识别为可选参数,这时就**不受「可选参数必须接在必需参数后面」的限制**了

> 但是要注意,默认参数就算作为可选参数,在调用函数时也不能不填这个参数,不过如果你想**保持默认值**就给这个参数**填为undefined**
>
> **填null是不可以的**,会报错`Argument of type 'null' is not assignable to parameter of type 'string | undefined'.`

  ```js
  function buildName(firstName: string = 'Tom', lastName: string) {
      return firstName + ' ' + lastName;
  }
  let tomcat = buildName('Tom', 'Cat');
  let cat = buildName(undefined, 'Cat');
  ```

### 剩余参数

- ES6可以使用`...item`来定义**剩余参数**,这就很类似Java了,代表函数在某个位置可以有无数个同类型的参数

- 不过剩余参数**只能是最后一个参数**

  ```js
  function push(array: any[], ...items: any[]) {
      items.forEach(function(item) {
          array.push(item);
      });
  }
  
  let a = [];
  push(a, 1, 2, 3);
  ```

### 重载

- 函数重载,据我的理解,ts中的函数重载只能帮助限制参数及返回的参数类型,对具体的函数实现代码需要自己写好,在里面判断所有参数类型的情况使用if避免一些额外情况,所以我感觉有点鸡肋

  ```js
  function add(a: number, b: number): number;
  function add(a: string, b: string): string;
  function add(a: any, b: any): any {
      return a + b;
  }
  //就比如这里,虽然实现的add函数写的类型时any,但是你填boolean类型的时候,因为有前两个函数定义,不符合那两个的定义的话,就会报错
  console.log(add(true,false))
  ```

  ```js
  function reverse(x:number):number;
  function reverse(x:string):string;
  //这里就得自己写好实现,对所有可能性进行判断然后进行不同的处理,Java是各自写各自的方法实现,最后根据参数不同进入不同的方法,TS是只写一份代码,利用TS限制参数和返回值的类型,但是这一份代码比较复杂,在这里要判断各种情况
  //本来我以为,只写最后一个函数就可以完成想要的效果,前两个函数没吊用,但是经过群里大佬解释,我明白了,这样子写最后一个,入参是number出参也会被限制为number,入参是string出参也会被限制为string,如果不写前两个函数定义,入参是string出参可能是number,这是我们不想看到的意外情况
  function reverse(x:string|number):string|number|void{
      console.log(`参数格式为:${typeof x}`);
      console.log(`转换前:${x}`);
      if(typeof x === "string"){
          return x.split('').reverse().join('');
      } else if(typeof x === "number"){
          return Number(x.toString().split('').reverse().join(''))
      }
  
  };
  console.log(`转换后:${reverse(789)}`);
  console.log(`转换后:${reverse("789")}`);
  ```

## 类型断言

- 类型断言有两种方式,一般建议使用第一种

  - 值 as 类型
  - <类型> 值

- 可以把**联合类型**断言为其中一个类型

  ```js
  interface Cat {
      name: string;
      run(): void;
  }
  interface Fish {
      name: string;
      swim(): void;
  }
  
  function isFish(animal: Cat | Fish) {
      if (typeof (animal as Fish).swim === 'function') {
          return true;
      }
      return false;
  }
  ```

- 类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而**滥用类型断言可能会导致运行时错误**

- 比如你硬要把A断言为B,然后调用B的方法,这就肯定会在运行时报错

- 如果使用的是class,这属于JavaScript的类,这时就应该使用原生的instanceof来判断类型,但是如果是 TypeScript 的接口,就无法使用哦instanceof,应该使用断言然后判断它的一些属性来确定类型

>  TypeScript 的接口（`interface`），接口是一个类型，**不是一个真正的值**，它在**编译结果中会被删除**，当然就无法使用 `instanceof` 来做运行时判断了

- **如果不是非常确定，就不要使用 `as any`。**它极有可能掩盖了真正的类型错误

- 类型断言有没有什么限制呢？具体来说，若 `A` 兼容 `B`，那么 `A` 能够被断言为 `B`，`B` 也能被断言为 `A`。

> 所谓的**兼容**是什么,那就是A的全部属性,B都有,这就叫A兼容B,也可以理解为**A是B的子集**

  ```js
  interface Animal {
      name: string;
  }
  interface Cat {
      name: string;
      run(): void;
  }
  
  let tom: Cat = {
      name: 'Tom',
      run: () => { console.log('run') }
  };
  let animal: Animal = tom;//就像面向对象编程中我们可以将子类的实例赋值给类型为父类的变量。
  //换成 TypeScript 中更专业的说法，即：Animal 兼容 Cat。
  ```

- TypeScript 是结构类型系统，类型之间的对比只会比较它们最终的结构，而会忽略它们定义时的关系。

- TypeScript 并不关心 `Cat` 和 `Animal` 之间定义时是什么关系，而只会看它们最终的结构有什么关系——所以它与 `Cat extends Animal` 是等价的

- 我们对断言的**总结**

  - 联合类型可以被断言为其中一个类型
  - 父类可以被断言为子类
  - 任何类型都可以被断言为 any
  - any 可以被断言为任何类型
  - 要使得 `A` 能够被断言为 `B`，只需要 `A` 兼容 `B` 或 `B` 兼容 `A` 即可

- 双重断言就是利用了`任何类型都可以被断言为 any`和`any 可以被断言为任何类型`这两条规则,把任何类型先断言为any再断言为其他类型,等于让类型使用断言的转换畅通无阻了,类似`(cat as any as Fish)`

- 若你使用了这种双重断言，那么十有八九是非常错误的，它很可能会导致运行时错误。**除非迫不得已，千万别用双重断言。**

- **类型断言**只会影响 TypeScript 编译时的类型，类型断言语句在**编译结果中会被删除**

  ```js
  function toBoolean(something: any): boolean {
      return something as boolean;
  }
  
  toBoolean(1);
  // 返回值为 1
  
  //上面这段代码编译后就为
  function toBoolean(something) {
      return something;
  }
  
  toBoolean(1);
  // 返回值为 1
  ```

- 类型断言不是类型转换，它不会真的影响到变量的类型。若要进行类型转换，需要直接调用类型转换的方法

  ```js
  function toBoolean(something: any): boolean {
      return Boolean(something);
  }
  
  toBoolean(1);
  // 返回值为 true
  ```

- 类型声明局限性大一些但是更严格,所以我们**优先使用类型声明**,类型断言局限性小一些

- 比如有两个类,为父子类,由于是父子,所以肯定是父兼容子,导致他俩可以互相断言,但是子类可以声明为父类,因为父类有的子类都有,反之则不可以,因为父类没有子类的一些属性或方法

- 使用泛型可以减少代码中的any,更加规范的完成约束

  ```js
  function getCacheData(key: string): any {
      return (window as any).cache[key];
  }
  
  interface Cat {
      name: string;
      run(): void;
  }
  
  const tom = getCacheData('tom') as Cat;
  tom.run();
  //优化后
  function getCacheData<T>(key: string): T {
      return (window as any).cache[key];
  }
  
  interface Cat {
      name: string;
      run(): void;
  }
  
  const tom = getCacheData<Cat>('tom');
  tom.run();
  ```

## 内置对象

- ECMA的内置对象基本是`Boolean`,`Error`,`Date`,`RegExp`

  ```js
  let flag:Boolean = new Boolean(1);
  let error:Error = new Error("报个小错误");
  let date:Date = new Date();
  let reg:RegExp = /[a-z]/;
  ```

- DOM和BOM的内置对象`Document`、`HTMLElement`、`Event`、`NodeList` 等。

  ```js
  let body: HTMLElement = document.body;
  let allDiv: NodeList = document.querySelectorAll('div');
  document.addEventListener('click', function(e: MouseEvent) {
    // Do something
  });
  ```

- 很多常用方法,其实TS已经做了类型判断了,比如`Math.pow`,这个函数要求两个参数都是数字类型,你如果填的不是数字类型,TS编译期就会报错,当然运行也会报错

## 类型别名

- 可以给类型起别名,比如你可以给string类型起个别名叫abc

  ```js
  type Name = string;
  type NameResolver = () => string;
  type NameOrResolver = Name | NameResolver;
  function getName(n: NameOrResolver): Name {
      if (typeof n === 'string') {
          return n;
      } else {
          return n();
      }
  }
  ```

## 字面量

- 可以使用`type`关键字限制某个值只能是某几个值的范围,如果不在这个范围内就报错,这就叫做字面量类型

  ```js
  type names = "张三" | "李四" | "王老五";
  function getFirstName(name:names) {
      return name.substr(0,1)
  }
  console.log(`获取固定人名的姓:${getFirstName("张三")}`)
  console.log(`获取固定人名的姓:${getFirstName("刘老六")}`)//刘老六不属于names的范围,所以会报错Argument of type '"刘老六"' is not assignable to parameter of type 'names'.
  ```

## 元组

- 数组要求所有元素必须为同一类型,但是**元组**不是,元组可以把不同类型的元素组合到一起,这就类似php的数组了

- 但是元组还是没有php数组那么方便,在创建时需要指定他可以包含哪些类型的元素,比如`let tup:[string,number] = ["哈哈",555]`

- 如果创建时就初始化元组,必须按照定义的类型顺序填上数量顺序都相同的元素,如果创建好了再使用`元组[0]`来填充可以一个个填

- 填入元组的元素再取出会自动被检查出类型,从而调用自己类型的方法

- 如果元组元素已经达到了定义的类型数量,还要往元组中添加元素,就得用`元组.push`方法,能push进去的数据类型是设定的所有类型的联合类型

  ```js
  let tuple:[string,number] = ["老王",66];//如果顺序和定义的不一样比如先66后老王,会报错
  tuple[0] = "老李";//如果类型不对,编译器会提示
  tuple[1] = 88;
  tuple[0].substr(0,1);
  tuple[1].toString();
  tuple.push(66);
  tuple.push(true);//超出范围的时候push,要求类型为创建时所有类型的联合类型,不然就报错
  let tom:[string,number];
  tom[0] = "666";
  let jerry:[string,number] = ["666"];//初始化时必须按顺序填完元祖内容,缺少的话会报错
  ```

## 枚举

- **枚举**,和Java中的类似,不过要简单一些,使用关键字enum定义

- 普通枚举定义:`enum 枚举 {枚举名1,枚举名2,枚举名3....}`

- TS中的枚举会被默认赋值,值为数字0,1,2,3

- 使用`枚举[枚举下标]`可以得到枚举名,反之使用`枚举["枚举名"]`也可以得到枚举值

- 当然不光可以默认值,枚举名也可以手动赋值,比如`enum 枚举 {枚举名1,枚举名2,枚举名3=6,枚举名4}`

- 这样手动赋值之后,后续的默认赋值会跟随手动赋值+1,哪怕是小数也会在小数的基础上+1

- 但是要注意,如果前面的默认值已经有了比如数字2这个值,后边又再手动赋值导致重复出现了数字2这个值,就会有问题,最好**不要出现**这种**覆盖**的情况

- 这种默认的数字或者主动赋值的数字都是**常数项**,还有一种叫做**计算所得项**,比如`enum Color {Red, Green, Blue = "blue".length};`

- 如果紧接在计算所得项**后面的是未手动赋值的项**，那么它就会因为无法获得初始值而**报错**,比如`enum Color {Red = "red".length, Green, Blue};`

- 使用`const enum`定义的叫做常数枚举,它会在编译阶段被删除,而且不能包含计算成员

- 使用哦`declare enum`定义的叫做外部枚举,经常出现在声明文件中,也会在编译期被删除

  ```js
  // enum brand {XiaoMi,Oppo="Oppo".length,Vivo}//一旦有计算所得项,后续的默认枚举就会报错,必须手动赋值
  
  const enum cars {beth,bmw,audi}
  let dictionary = [cars.beth,cars.bmw,cars.audi];//编译完var dictionary = [0 /* cars.beth */, 1 /* cars.bmw */, 2 /* cars.audi */];
  declare enum dress {unqlo,ur,ck,nike}
  let dressDic = [dress.ck,dress.ur,dress.nike,dress.unqlo]//编译后var dressDic = [dress.ck, dress.ur, dress.nike, dress.unqlo];
  ```

## 类

- TS中的class有一点需要特别注意的,**权限修饰符出现在构造函数的参数上意味着将参数定义为类的成员变量，并自动赋值。**

- 这么说可能有点抽象,构成函数的属性有好几种方法可以写

  - 第一种是写在构造函数的参数然后再在构造函数中赋值

    ```js
    class Animal {
      constructor(name) {//就是写在这里
        this.name = name;//然后在这里赋值
      }
      get name() {
        return 'Jack';
      }
      set name(value) {
        console.log('setter: ' + value);
      }
    }
    ```

    

  - 第二种是直接在类里定义,这本来也是通用写法,但是不能直接赋值,可以直接赋值这个是ES7的写法也是TS所支持的

  > ES6 中实例的属性只能通过构造函数中的 this.xxx 来定义，ES7 提案中可以直接在类里面定义

    ```js
    class Animal {
      name = 'Jack';
    
      constructor() {
        // ...
      }
    }
    ```

  - 第三种就是上面提到的权限修饰符出现在构造函数的参数上,将参数定义为类的成员变量

    ```js
    class Example {
      constructor(public name: string, private age: number) {
        // name 和 age 都已经被定义为 Example 的成员变量
      }
    }
    ```

  - 当在构造函数参数上使用了访问修饰符时，TypeScript 会自动将它们生成成员变量，并将它们的值赋给对应的成员变量。这样就**不再需要手动写**类似 `this.name = name` 和 `this.age = age` 的代码了。这种语法可以让代码更加简洁易读，同时也减少了代码的重复性。

## 类与接口

- TS中有一点比较特别的,不同于Java的地方,那就是**接口可以继承类**,只不过这个继承也很特殊,TS创建一个class的时候相当于隐式创建了一个class对应的类型接口interface,其他的接口去extends继承类的时候**相当于继承这个类型接口**

- 只不过class对应的类型接口不包含构造函数,静态属性,静态方法,也就是**只包含其中的实例属性和实例方法**

## 泛型

- TS中的**泛型**和Java很像,指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

- 一般用在函数上的泛型是这样的`function 函数名<T>(参数:类型,参数:可以为T类型):返回类型,可以为T`

- 也可以一次定义多个泛型`function swap<T, U>(tuple: [T, U]): [U, T] {}`

- 函数内部使用泛型变量,由于无法预知会传什么类型的变量进来,所以不能随意操作这个参数的属性或方法

- 可以使用泛型继承来进行约束,使得我们提前知道这个泛型会有哪些必要的属性

  ```js
  interface Lengthwise {
      length: number;
  }
  
  function loggingIdentity<T extends Lengthwise>(arg: T): T {
      console.log(arg.length);
      return arg;
  }
  //这样的话调用这个函数时如果参数没有length这个参数,编辑器会直接报错
  ```

- 多个参数间也可以互相约束`function copyFields<T extends U, U>(target: T, source: U): T {}`

- TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型.当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

  ```js
  function createArray<T = string>(length: number, value: T): Array<T> {
      let result: T[] = [];
      for (let i = 0; i < length; i++) {
          result[i] = value;
      }
      return result;
  }
  ```

## 声明合并

- TS中函数的合并其实就是函数重载

- 接口的合并会把接口中的属性简单的合并到一个接口中,但是，**合并的属性的类型必须是唯一的**

  ```js
  interface Alarm {
      price: number;
  }
  interface Alarm {
      weight: number;
  }
  //相当于
  interface Alarm {
      price: number;
      weight: number;
  }
  
  
  
  interface Alarm {
      price: number;
  }
  interface Alarm {
      price: number;  // 虽然重复了，但是类型都是 `number`，所以不会报错
      weight: number;
  }
  
  
  interface Alarm {
      price: number;
  }
  interface Alarm {
      price: string;  // 类型不一致，会报错
      weight: number;
  }
  
  // index.ts(5,3): error TS2403: Subsequent variable declarations must have the same type.  Variable 'price' must be of type 'number', but here has type 'string'.
  ```

  

- 接口中方法的合并，与函数的合并一样

  ```js
  interface Alarm {
      price: number;
      alert(s: string): string;
  }
  interface Alarm {
      weight: number;
      alert(s: string, n: number): string;
  }
  //相当于
  interface Alarm {
      price: number;
      weight: number;
      alert(s: string): string;
      alert(s: string, n: number): string;
  }
  ```

  

- 类的合并与接口的合并规则一致。

