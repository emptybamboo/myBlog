# On Java 8笔记

## 第一章:对象的概念

protected到底子类是如何调用的

default的所谓包内的范围是?

## 第三章:万物皆对象

### 对象清理

#### 作用域

- ```java
  {
      int x = 12;
      {
          int x = 96; // Illegal
      }
  }
  ```

- 这在Java中是不允许的,编译器会提示变量x被定义过了

- 因为Java设计者认为这样会导致程序混乱

#### 对象作用域

- Java 对象与基本类型具有不同的生命周期。当我们使用 `new` 关键字来创建 Java 对象时，它的生命周期将会超出作用域。

- ```java
  {
      String s = new String("a string");
  } 
  // 作用域终点
  ```

- 引用s在{}之外就已经结束了,但是new出来的对象依然在内存中占用内存.

- 内存的释放不用担心,垃圾处理器会替我们完成

### 类的创建

#### 字段

- 可以存在只有字段的类,这样的类没有任何方法也可以被创建为对象
- 可以使用这个对象的引用来指定字段值:`object.name = "王老五"`
- 也可以修改对象内部包含的另一个对象的数据:`myPlane.leftTank.capacity = 100;`
- **这里只是表示下可以这样操作,但是一般很少这样操作**

### 程序编写

#### static关键字

- 通常只有new对象后,数据存储空间才被分配,对象方法才能被外接调用
- 但是有时却不这样
  - 有时你只想为特定字段分配共享空间,压根不想创建对象
  - 某个类中有一个与类任何对象都无关的方法,不创建对象也能调用
- 说某个事物是静态的,意思就是该字段或方法不依赖任何特定的对象,即时从未创建国该类对象,也可以调用静态方法或访问静态字段
- 一般的非静态方法和字段我们就必须先创建一个对象并使用对象访问字段或方法.

> 这也就是平时为啥**在main方法中测试**别的方法代码,老是要**修改调用的方法为static**,其实**根本不用**,是我自己忘了,只需要**new一下本类的主类**,然后使用主类对象**调用类中方法即可.**
>
> 比如Solution类,其中有reverse方法,只需要
>
> Solution s = new Solution();
>
> s.reverse(55);

---

- 如果同时new了两个一样的类,类中只有一个静态变量,那创建两个对象之后,两个对象中的静态变量**只占一份存储空间**.

  ```java
  StaticTest st1 = new StaticTest();
  StaticTest st2 = new StaticTest();
  ```

  

- 可以通过对象定位它(`st1.i和 st2.i`),也可以类名引用它`StaticTest.i`,后者不能用于非静态成员

- `StaticTest.i++`之后,`st1.i和 st2.i`都会加一

## 第四章:运算符

### 赋值

- 基本类型的赋值都是直接的,比如`a = b`,如果b是基本类型,就会把b的值赋值一份给变量a,a的值再改变也不会影响到b
- 但是对象复制不同,**操作对象实际上是操作对象的引用**,等号右边的对象赋予左边时,赋予的只是该对象的引用,**两者在堆中会指向同一个对象**.
- 使用方法传递参数时,如果参数是对象,在许多其他编程语言中,会在内部复制其参数对象,但是在Java中,**方法参数传递对象**实际上**传递的也是引用**.

### 关系运算符

- **equals()**方法的**默认行为**是**比较对象的引用**而不是具体内容.
- 大多数Java库类通过覆写`equals()`方法比较对象的内容而不是其引用.

### 字面值常量

- 整体就不太明白..其他进制的一些

### 下划线

- Java中的`%n`可以忽略平台差异生成适当的换行符,但是仅限使用 `System.out.printf()` 或 `System.out.format()` 时。对于 `System.out.println()`，我们仍然必须使用 `\n`；如果你使用 `%n`，`println()` 只会输出 `%n` 而不是换行符。

### 指数计数法

- e本身应该代表自然对数的基数,约等于2.718

- 所以指数表达式 “1.39 x e-43”应该意味着 “1.39 × 2.718 的 -43 次方”

- 但是因为历史遗留,在Java中它真正的含义是 “1.39 × 10 的 -43 次方”。

- ```java
  float f4 = 1e-43f; //10 的幂数
  ```

- 编译器通常会将指数作为 **double** 类型来处理，所以假若没有这个后缀字符 `f`，编译器就会报错，提示我们应该将 **double** 型转换成 **float** 型。

### 字符串运算符

- 我们经常会看到一个空字符串 `""` 跟着一个基本类型的数据。(`System.out.println("" + x);`)这样可以隐式地将其转换为字符串，以代替繁琐的显式调用方法（如这里可以使用 **Integer.toString()**）。

### 类型转换

- 根据类型向下转换,可能会发生信息丢失,此时编译器会强制我们进行转型,就需要手动显式转型(`int a = int(long类型数字)`)
- 向上转换则不用进行显式转型,因为较大类型数据肯定能容纳较小类型的数据(`long a = int类型数字;`)

#### 阶段和舍入

- 从float和double转为整数值时,小数位会被截断
- 如果想四舍五入可以使用`Math.round()`方法.

#### 类型提升

- 如果我们对小于 **int** 的基本数据类型（即 **char**、**byte** 或 **short**）执行任何算术或按位操作，这些值会在执行操作之前类型提升为 **int**，并且结果值的类型为 **int**。
- 若想重新使用较小的类型，必须使用强制转换（由于重新分配回一个较小的类型，结果可能会丢失精度）。
- 通常，表达式中最大的数据类型是决定表达式结果的数据类型。**float** 型和 **double** 型相乘，结果是 **double** 型的；**int** 和 **long** 相加，结果是 **long** 型。

## 第五章:控制流

### break和continue

- 都是用于迭代语句内控制流程
- **break**表示跳出当前循环体
- **continue**表示停止本次循环,开始下次循环
- break会中断for循环,就是说如果break的话你在for循环的条件里结尾的i++就不会执行了

### goto

- goto实际上是一种很臭名昭著的关键字,会导致代码无法控制流程,但某些情况却依然是最佳解决

- 所以虽然goto是Java的保留字但未被启用

- 但是在break和continue上可以**利用一些操作达到goto的效果**

- 那就是使用标签`label`,使用方法为标签加冒号`label:`,当然标签名可以随便起

- ```java
  label1:
  outer-iteration { 
    inner-iteration {
    // ...
    break; // [1] 退出内部循环,在外部循环中往内部循环下走
    // ...
    continue; // [2] 停止这次循环,继续下次内部循环
    // ...
    continue label1; // [3] 同时停止内外部循环,跳到label1处,继续先外后内的循环
    // ...
    break label1; // [4] 同时停止内外部循环跳到label1处,并且不会再进入这两个循环中
    } 
  }
  ```

- 标签**必须紧贴循环语句**,它俩**中间不应该有任何语句**,**标签就等于是一个循环的开关**

- 如果在有递增的情况下continue到循环外围,也会跳过for循环结尾的i++递增.

- 标签的使用:

  - 简单的一个 **continue** 会退回最内层循环的开头（顶部），并继续执行。
  - 带有标签的 **continue** 会到达标签的位置，并重新进入紧接在那个标签后面的循环。
  - **break** 会中断当前循环，并移离当前标签的末尾。
  - 带标签的 **break** 会中断当前循环，并移离由那个标签指示的循环的末尾。

- 在 **Java 里需要使用标签**的**唯一理由**就是因为**有循环嵌套存在**，而且想从多层嵌套中 **break** 或 **continue**。

### switch

- java中的switch,括号里面只会是一个整数表达式,值或本身一定会是一个整数.
- 它要求使用一个选择因子，并且必须是 **int** 或 **char** 那样的整数值。
- 假若将一个字串或者浮点数作为选择因子使用，那么它们在 switch 语句里是不会工作的。对于非整数类型（Java 7 以上版本中的 String 型除外），则必须使用一系列 **if** 语句。
- 这里有个小技巧,**int整数与字母字符比较**
  - 数字97和单引号包围的字符a是相等的,注意是单引号,如果是双引号就不行
  - 同理98=='b',99=='c'....
  - 直接将整数强转就得到字符,比如(char)97就得到a

### 字符串switch

- Java7版本以后,switch也可以用于判断字符串了
- Math.random()方法产生从0到1之间的随机值,[0,1),左闭右开

## 第六章:初始化和清理

### 方法重载

#### 重载与基本类型

- **基本类型**可以**自动从较小的类型**转型为**较大的类型**。当这与重载结合时，这会令人有点困惑
- 举个例子就是当你传入的参数是个char类型,但是方法是以int接收,那参数会自动向上转为int类型,如果同时有一个重载方法是long类型接收,也一样是转为int,虽然是向上转型也只会转一级,不会跨级跳跃
- char<byte<short<int<long<float<double
- 如果**传入的参数类型大于方法期望接收的参数类型**，你必须首先**做下转换**，如果你不做的话，编译器就会报错。

### this关键字

- **this** 关键字只能**在非静态方法内部**使用。当你调用一个对象的方法时，**this** 生成了一个对象引用。
- 如果你在一个类的方法里调用该类的其他方法，不要使用 **this**，直接调用即可
- **this** 关键字只用在一些必须显式使用当前对象引用的特殊场合。例如，用在 **return** 语句中返回对当前对象的引用。
- 比如一个自增的方法,自增完成返回this,这个方法的返回值还是对象,可以直接链式调用这个方法自增下去.
- 这就很像ES6中的promise

#### 在构造器中调用构造器

- 如果一个类中有多个构造器,并且你需要在一个构造器中调用另一个构造器来避免代码重复,可以通过this关键字完成调用
- 一般来说this关键字代表的是当前对象,但是如果**在构造器中给this一个参数列表**(this(params))就变成了另外的意思,也就变成了调用当前对象的构造器的作用,如果调用字段那还是普通用法(this.name = "张三")
- 并且要注意**在构造器中调用其他构造器只能调用一次**,不能多次根据方法重载调用好几个构造器.
- 必须首先调用构造器,否则编译器会报错.
- 同时,在构造函数之外的地方是不能使用this调用构造函数的.

#### static的含义

- static方法中不会存在this
- 不能在静态方法中调用非静态方法(反之可以)
- 静态方法主要目的就是创建一个像全局方法的方法,但是Java中不允许全局方法
- 一个类中的静态方法可以访问其它静态方法和静态属性

### 垃圾回收器

- 垃圾回收器只知道清理new出来的对象,因为这个Java中允许为类定义一个名为**finalize()**的方法.
- Java中对象并非总是被垃圾回收
  - 对象可能不被垃圾回收
  - 垃圾回收不等于析构(C++概念)
  - 垃圾回收只与内存有关。
- 你不在需要某个对象前,如果必须执行某些操作(可以大概理解为钩子函数),就得自己去做
- 内存如果不是濒临用完,对象占用的空间就永远不会释放,则当程序退出时，那些资源会全部交还给操作系统。

### `finalize()` 的用途

- 对于与垃圾回收有关的任何行为来说（尤其是 `finalize()` 方法），它们也**必须同内存及其回收有关**。
- 之所以有**finalize()**方法,是因为在分配内存时可能采用了C语言的做法而非Java中的做法,这种情况一般发生在调用`本地方法`的情况下
- 本地方法可以在Java代码里调用非Java代码,比如C,C++,有些C中的方法使用之后必须使用C的清理方法来清理

#### 必须实施清理

- 要清理对象就必须在需要清理的时候执行清理动作的方法.
- Java中没有C++的析构函数,因为垃圾回收器会帮你释放存储空间,但是随着学习深入,你发现垃圾回收器不能完全替代提够函数.
- 无论是`垃圾回收`还是`终结`,都不保证一定发生,如果JVM并未面临内存耗尽,它可能不会浪费时间执行垃圾回收来回复内存

#### 终结条件

- 通常不能指望`finalize()`,必须创建其它的清理方法并明确调用,所以**finalize()只对大部分程序员很难用到的一些晦涩内存清理有用**.

### 成员初始化

- 如果是**方法局部变量**,未初始化会出现编译时错误
- 如果是**类成员变量**,就会有些不同,只要是基本类型数据都会有个初始值.初始值就是未定义时都会有的值.
- 类中定义对象引用时,如果不初始化,应用会被赋值为null

#### 指定初始化

- 可以直接用等于号赋值:`int i = 10`

- 也可以使用某个方法赋值,方法return的值赋给成员变量

  ```java
  int i = f();
  int f() {
      return 11;
  }
  ```

### 构造器初始化

- 就算你在构造器中对变量初始化,也无法阻止自动初始化.
- 比如有个类成员变量int变量i,没有初始化默认是0,你在构造方法中初始化为10,它会先初始化为0然后在构造器中初始化为10.

#### 初始化顺序

- **类成员变量**在类中(直接在类中,而不是在类的方法或构造方法中)会**根据上下顺序**初始化,就算它们乱七八糟的排列,中间插几个方法的队,也不会影响**它们最先初始化完成**.
- 然后才是构造函数中的初始化赋值.

#### 静态数据初始化

- 无论创建多少个相同的对象,静态数据**只占一份存储区域**

> 打个比方,底下的Cupboard类如果在一个方法里被new出两个对象,那么第一次new的时候bowl4,bowl5两个静态变量已经初始化,第二次就不会再初始化了

- **static**关键字**不能应用于局部变量**,只能作用于属性

- **类成员变量**的**初始化顺序**是,**首先初始化静态对象**(如果之前它们**没被初始化过**),然后是**非静态对象**,即使类中非静态对象的初始化代码写在静态对象初始化上面也一样

- ```java
  class Cupboard {
      Bowl bowl3 = new Bowl(3);//反而是写在最上面的这个对象最后初始化,它排在静态对象后面初始化
      static Bowl bowl4 = new Bowl(4);
      Cupboard() {
          System.out.println("Cupboard()");
          bowl4.f1(2);
      }
      void f3(int marker) {
          System.out.println("f3(" + marker + ")");
      }
      static Bowl bowl5 = new Bowl(5);
  }
  ```

#### 显式静态初始化

- 可以把**静态初始化动作**都放在类中一个特殊的**静态代码块**中
- 看起来像个方法,其实只是跟在static后的代码块,与其它静态初始化一样,这段代码**只执行一次**:在**首次创建这个类的对象(new obj())或首次访问这个类的静态成员(Obj.staticParam)时**（甚至不需要创建该类的对象）

#### 非静态实例初始化

- 和静态代码块很像,也是一个花括号括起来的代码块,只不过没有static关键字在前
- 可以使用它保证不管哪个构造器被调用,某些操作一定会发生

> 比如我无参构造里打印一句话,int参数构造里就不打印这句话,但是我还是想让对象初始化的时候这两种构造器选哪个都不影响我打印,那就写到代码块里,会早于构造器就执行打印

- 因为它是在类初始化的时候,**在构造器前执行**的

### 数组初始化

- Java中数组可以这样初始化`int[] a1`或`int a1[]`,两者含义一样,但是前者更合理,更符合这是一个int数组的表达
- 编译器**不允许指定数组大小**,可以使用花括号来进行初始化:`int[] a1 = {1,2,3,4,5}`
- Java中将一个数组赋值给另一个数组其实是把引用赋值了,并不会产生一个新的数组,两个数组都指向相同的数组.

#### 动态数组创建

- 如果不确定数组需要多少元素,可以使用new在数组中创建元素

- new不能创建非数组外的基本类型数据

- 比如`a = new int[50]`,这样就会创建一个50个元素的数组,默认值全都为0

- 数组元素中的基本数据类型值会自动初始化为默认值（对于数字和字符是 0；对于布尔型是 **false**

- 也可以在**定义的同时初始化**:`int[] a = new int[50]`,而且应该**尽量这样做**

- 如果你创建了一个非基本类型的数组，那么你创建的是一个引用数组。(其实不太懂这里的引用数组是啥)

- 也可以用花括号列表初始化数组,有两种形式

  ```java
  Integer[] a = {
      1, 2,
      3, // Autoboxing
  };
  Integer[] b = new Integer[] {
      1, 2,
      3, // Autoboxing
  };
  ```

- **这两种形式里初始化列表最后的逗号**可选,也就是**可有可无**,有也不会报错

- 第一种方法更受限,只能用于数组定义处,第二种可以用在任何地方甚至是方法内部

- `Other.main(new String[] {"fiddle", "de", "dum"});`

#### 可变参数列表

- 可变参数列表可以应用在**参数个数或类型未知**的场合
- 实际上可变参数列表会被编译器填充为数组,可以在方法内部使用for循环迭代
- 当然如果你**直接传递**的就是一个**数组**,那就不会转换,**直接当做可变参数列表**来使用
- 可变参数的**个数可以为0**,当具有可选的尾随参数这个特性会很有帮助
- 可变参数列表中可以使用**任何类型的参数**，**包括基本类型**。
- 可变参数列表使方法重载更复杂,可以在方法中增加一个非可变参数解决这个问题
- 你应该总是在重载方法的一个版本上使用可变参数列表，或者压根不用它。

### 枚举类型

- 枚举的值惯例全部大写字母表示,如果多个单词就是用下划线分割

- 创建枚举时,会自动创建toString方法,以便显示枚举实例名称

- `ordinal()`方法表示单个枚举常量的**声明顺序**

- `static values()`按照**枚举常量的声明顺序**组成这些**常量构成的数组**

  ```java
  public static void main(String[] args) {
      //Spiciness.values()得到所有枚举常量组成的数组,可以拿来遍历
      for (Spiciness s: Spiciness.values()) {
          System.out.println(s + ", ordinal " + s.ordinal());//ordinal()得到每个常量的声明顺序,就像数组的下标,0,1,2,3...
      }
  }
  ```

  

- 枚举**和swtich配合使用**是非常合适的

## 第七章:封装

- 如果你是一个类库的作者,你想修改完善自己的类库代码,这有很大压力
- 一般来说使用你类库的客户端程序员希望你的代码在某些方面保持不变,不然会影响到他们代码中使用到你类库的部分出问题
- 为解决这个问题Java提供了**访问修饰符**,可以让类库开发者控制哪些是客户端程序员可用的哪些是不可用的
- 从**最大**权限**到最小**依次是:
  - **public**
  - **protected**
  - **包访问权限**
  - **private**
- Java通过**package**关键字**控制**如何把类库组件捆绑到一个内聚的类库单元中.

### 包的概念

- 包内包含一组类,它们被组织在一个单独的命名空间
- 所谓的包也是就文件夹

> com
>
> - baidu
>   - www
>     - util
>       - StringUtil.Java
>       - IntegerUtil.Java
>
> 这里的util就是一个包

- 一般来说想在不是这个包的范围内使用这个包的类,就得写一串完整的全名比如:**java.util.ArrayList**
- 当然这样代码就太冗长了,所以出现了**import**,可以单独导入(import java.util.ArrayList;),也可以导入某包下所有类(import java.util.*)
- 可能会考虑如果出现重名该如何
  - 如果是方法的重名,类之间是相互隔离的,不同的类有相同签名的方法不会冲突
  - 但是如果是类名冲突,我们就要为每个类创建一个唯一标识符组合
- 本书代码示例大部分**只存在单个文件**,为本地使用,所以尚未受到包名的干扰,但其实这些文件**已经存在包中**了,叫做`未命名包`或`默认包`
  - 未命名包其实就相当于你在一个二级目录下,你当前文件夹下还有个文件夹里面存着很多Java文件,你直接把一些Java文件存在了当前文件夹下,这就是未命名包的范围,就类似上方例子中的www包下你放了一些Java文件
- **一个Java员代码文件**成为一个`编译单元`,后缀必须是`.java`,其中可以有一个也**只能有一个public类**,类名与文件名相同(不含后缀),**超出**一个public类**编译器不接受**

> 通俗的说就是One.java文件中只能有一个public类,就是 class One

- 如果编译单元中还有**其他类**,**包外是访问不到的**,他们不是public,他们是**为public主类提供支持**的类

#### 代码组织

- 编辑java文件时,java文件每个类都会有个输出文件,和java文件中每个类名相同,后缀为`.class`
- Java中可运行程序是一组`.class`文件,它们可以打包压缩成一个Jar包
- 每个源文件通常含有一个public类和任意个非public类,因此每个文件都有个public组件(不是很明白),可以使用关键字**package**把这些组件集中在一起
  - package语句必须是文件中除注释外第一行代码
  - 如果你写了`package hidiing`,意味着当前java文件是hiding类库的一部分,正在声明的java文件中的public类名称位于hiding的保护伞下,任何人想要使用该名称,必须指明完整类名或import导入(Java中包名全程小写)
- **package** 和 **import** 这两个关键字将单一的全局命名空间分隔开，从而**避免名称冲突**。

#### 创建独一无二的包名

- 一个包不会被打包成单一文件,由很多`.class`文件组成
- 合理的做法是把特定包下所有`.class`文件都放在一个目录下
- 这解决了两个问题
  - 创建独一无二的包名和查找可能隐藏于目录结构某处的类。
  - 把 **package** 名称分解成你机器上的一个目录.
    - 所以当 Java 解释器必须要加载一个 .class 文件时，它能定位到 **.class** 文件所在的位置。首先，它找出环境变量 **CLASSPATH**（通过操作系统设置，有时也能通过 Java 的安装程序或基于 Java 的工具设置）。
    - **CLASSPATH** 包含一个或多个目录，用作查找 .**class** 文件的根目录。从根目录开始，Java 解释器获取包名并将每个句点替换成反斜杠，生成一个基于根目录的路径名（取决于你的操作系统，包名 **foo.bar.baz** 变成 **foo\bar\baz** 或 **foo/bar/baz** 或其它）。然后这个路径与 **CLASSPATH** 的不同项连接，解释器就在这些目录中查找与你所创建的类名称相关的 **.class** 文件
    - 对于 Java 新手而言，设置 CLASSPATH 是一件麻烦的事（我最初使用时是这么觉得的），后面版本的 JDK 更加智能。你会发现**当你安装好 JDK 时，即使不设置 CLASSPATH，也能够编译和运行基本的 Java 程序**。

#### 冲突

- 如果你引入的不同的包中有相同类名,你又需要使用该怎么解决冲突
- 要么就使用类的全称,包含全部路径`new java.util.Vector();`
- 要么就只import要使用的这个类的包,另一个类不要使用星号引入避开即可

### 访问权限修饰符

#### 包访问权限

- 什么修饰符都没使用就是**默认访问权限,也就是包访问权限**
- 意味着当前保重所有其他类都可以访问那个成员,对这个包外的类这个成员就像是private
- **取得对成员访问权**的唯一方式是
  - 使成员为public,这样不管是谁都可以访问它
  - 成员不加访问修饰符,为包访问权限,然后把其他类放在相同包内
  - 复用章节可以看到,继承的类可以访问public成员也可以访问protected成员
  - 提供get/set方法,从而读取和改变值

#### public:接口访问权限

- 只要使用public就意味着紧随public后面声明的成员是人人可用的

- ```java
  // hiding/dessert/Cookie.java
  // Creates a library
  package hiding.dessert;
  public class Cookie {
      public Cookie() {
          System.out.println("Cookie constructor");
      }
      void bite() {
          System.out.println("bite");
      }
  }
  ```

  ```java
  // hiding/Dinner.java
  // Uses the library
  import hiding.dessert.*;
  public class Dinner {
      public static void main(String[] args) {
          Cookie x = new Cookie();
          // -x.bite(); // 无法运行bite方法,因为在包外不能访问包访问权限的方法
      }
  }
  ```

- 例子中会输出`Cookie constructor`

- 这个例子中可以创建Cookie对象,因为他构造器和类都为public,但是无法访问到对象中bite()方法,因为它是包访问权限,Dinner在包之外

  - Cookie在包`hiding/dessert`之中
  - Dinner在包hiding之中,或者可以说是默认包中,显然不在Cookie的包内

#### 默认包

- 如果一个类或方法是包访问权限,那肯定不能被不在包内的类调用或访问,但是**如果两个java文件在相同目录**且**都没有给自己设定明确包名**(就是package指定),Java会把这样文件看作是**隶属于该目录的默认包中**,因此它们**为该目录中所有其他文件**都提供了**包访问权限**

#### private:你无法访问

- 使用**private**关键字除了包含该成员的类，其他任何类都无法访问这个成员。
- 使用 **private**，你可以自由地修改那个被修饰的成员，无需担心会影响同一包下的其他类。
  - 这里我的理解就是说,private只能自己调用自己,不会被同一个包下其它类调用,所以你修改被private修饰的类或对象时不会影响到其它类,因为他们都没能调用过这个成员,毫无瓜葛自然不会受影响
- private可以**防止别人直接访问某个特定构造器**(或全部构造器)
  - 意味着可以控制在别的地方是否可以new出这个类的对象,或者说控制怎样才能创建出这个类的对象,比如可以定义静态方法返回对象
- 类的**助手方法**都可以声明为private,它不会被包中其它地方误用,**只为自己的类工作**

#### protected:继承访问权限

- protected处理的是继承的概念
- 如果你创建了新包,从新包中创建了父类的一个子类,那就唯一只能访问父类的public成员.
- 父类可能**希望某个特定成员可以被子类访问,**但是**不能被其他人**访问,这就像**家传武功**
- 这时就是用protected,同时protected还提供了包访问权限

#### 包访问权限VSpublic构造器

- 如果你定义了一个**具有包访问权限的类**,并且在其中定义一个**public构造器**
- 但是这样**包外还是访问不到这个构造器**,这种写法是虚假的

### 接口和实现

- 访问控制通常被称为隐藏实现,将数据和方法包装进类中并把具体实现隐藏称作封装
- 就是你写好的类库代码,你控制不让一些人访问,实际上就是向使用者隐藏了实现
- 接口与实现分离,如果在一组程序中使用接口,程序员只能向public接口发送消息,那就可以自由修改任何不是public的事物(private,protected,默认),却不会破坏客户端代码

> 这里的接口不是Java里的interface,也不是前后端的接口,按我的理解应该是各个类之间互相使用的通道方法

- 创建类最好遵从这个规则,public成员放在类的最前,然后是protected,然后是private

### 类访问权限

- 访问修饰符**也可以用来修饰类**,控制访问权限,加载class之前即可
- 还有一些限制
  - **每个java文件只能有一个public类**,每个文件有一个公共接口用public类表示,超过一个编译器就报错
  - public类名称必须和文件名相同,当然文件内没有public类也是可能的,这时可以随意命名
- **类只能是public或默认包权限**,不能是pravite或protected
- **类中属性应该尽可能都设置为private**
- 为了防止类被外界访问,可以把构造器都private,这样只有你自己能创建对象(在类的static成员中)
- 只能用static成员创建对象也叫**单例模式**,所有构造方法都不准外界使用,这样在用static创建对象一次之后,也就是成员初始化之后,static变量初始化完成,不管多少次拿到的都是初始化时创建好的那一个对象引用,这个类就是单例的.

## 第八章:复用

- Java中使用面向对象的概念进行代码**复用**是通过类解决,是用别人构建或调试过的代码,而不是创建新类

  - 第一种方式是在新类中创建现有类的对象,这叫做**组合**

  > 说白了就是new一个工具类,然后类名.方法调用,完成你要想的功能

  - 第二种是创建现有类的新类,其实就是子类,这就叫**继承**,面线对象概念的重要基础之一

### 组合语法

- 初始化有4种方法

  - 对象被定义时,意味着它们总是在调用构造函数前初始化

  > 就是直接写在类中的初始化变量,类似于数据实体类的属性,像`private String name`

  - 在该类的构造函数中
  - 在实际使用对象前,这通常称为`延迟初始化`,当对象创建开销大而且不是每次都需要创建对象的时候可以减少开销

  > 就是先在类中写好但是不初始化的变量,在具体调用方法中再赋值初始化

  - 使用实例初始化

  > 就是在类中使用{}代码块

### 继承语法

- 使用`extends`关键字可以生成一个父类的子类
- main方法可以用来测试,而且main方法即使它的类不是公共类,即使它的类只有包访问权限,也可以访问main方法,因为它是public修饰的static方法,直接使用Class.main即可
- 子类中使用`super.父类方法`即可调用父类方法,不能只接调用父类方法,这会引发子类方法继承到的父类方法的递归调用
- 一般的**标准**是,**父类的成员变量都private**,**方法都public**,因为继承的子类不能随便动父类的变量和数据,**不然每个子类都可以修改父类数据,那父类对象就废了,数据会被无数的子类修改.**

####   初始化基类

- 当你创建子类对象,其实它包含父类的子对象,这个子对象就像你自己new出来的父类对象一样
- Java**在子类对象中**为了**正确初始化父类**,会**自动调用父类的构造函数**
- 构造函数的执行一定是**从最顶级的父类开始往下一直到最底层的子类**的构造函数为止,**哪怕子类不写构造函数**使用默认无参构造也不影响父类构造函数的调用

#### 带参构造函数

- 无参构造函数编译器可以很容易调用,但是**带参数**的就不行了,**需要我们手动调用**
- 在子类的构造方法中使用`super(param)`即可调用父类带参构造
- **对父类的构造函数调用必须是子类构造函数中第一个操作**,如果顺序有问题编译器会报错
- 如果**子类中构造函数**里**没有对父类带参构造调用**,编译器也会**报错**

### 委托

- Java不直接支持的第三种重用关系称为**委托**。这介于继承和组合之间，因为你将一个成员对象放在正在构建的类中(比如组合)，但同时又在新类中公开来自成员对象的所有方法(比如继承)。
- 用我通俗的话说就是,在一个新类中,创建另一个类的对象,并在新类中创建方法来调用另一个类的所有方法,方法体内就是`另一个类对象.另一个类方法`

> ```java
> private String name;
> private SpaceShipControls controls =
>     new SpaceShipControls();
> public SpaceShipDelegation(String name) {
>     this.name = name;
> }
> // Delegated methods:
> public void back(int velocity) {
>     controls.back(velocity);
> }
> ```

#### 保持适当的清理

- Java没有C++的析构函数,一般垃圾都是GC回收,除了一些特殊资源的垃圾回收,比如数据库连接,IO对象之类的
- 这些特殊的就必须放在finally中清理,防止异常

#### 名称隐藏

- **方法重载**指的是在同一个类中,反复编写出多个同名的方法,他们唯一不同的就是参数类型,以及参数排序
- **方法重写**指的是在子类中重写父类的某个方法,方法名和参数以及参数顺序完全相同,但是要在方法上加**@Override**注解
- 如果在**父类中有一个方法名多次重载**,则在子类中父类子类的所有这个方法名代表的方法都会起作用,**哪怕不使用super.method**也可以**通过参数的不同来调用**同一方法名的不同版本

```java
class Homer {
    char doh(char c) {
        System.out.println("doh(char)");
        return 'd';
    }
    float doh(float f) {
        System.out.println("doh(float)");
        return 1.0f;
    }
}
class Milhouse {}
class Bart extends Homer {
    void doh(Milhouse m) {
        System.out.println("doh(Milhouse)");
    }
}
public class Hide {
    public static void main(String[] args) {
        Bart b = new Bart();
        //这前三个方法都是父类中的,但是没使用super就调用到了
        b.doh(1);
        b.doh('x');
        b.doh(1.0f);
        b.doh(new Milhouse());
        /* 输出:
            doh(float)
            doh(char)
            doh(float)
            doh(Milhouse)
        */
    }
}
```

### 组合和继承的选择

- 组合和继承都允许在新类中放置子对象
  - 组合是new个显式对象
  - 继承是隐式包含父类对象
- 当你在新类中想包含一个已有类的功能,就是用组合而非继承

> 就好比你想在开车的时候喝水,你不可能创建一个水的子类既包含车的特性又包含水的特性,你只需要在车的对象里创建水对象调用喝水方法

- 使用继承的时候,使用一个现成类开发出新版本,一般是意味着使用一个通用类,为了特殊需求将其特殊化
- 你就会发现，用一个交通工具对象来组成一部车是毫无意义的——车不包含交通工具，它就是交通工具。
- 这种“**是一个**”的关系是**用继承来表达**的，而“**有一个**“的关系则用**组合来表达**。

### protected

- 理想中仅靠private就足够,但实际上,经常想把一个事物尽量对外界隐藏,而允许子类对象访问
- protected就起这个作用,**允许子类对象访问,同时有包访问权限**
- 使用时最好是**将属性声明为private**保留修改底层实现的权利,然后**通过protected控制类的继承者**的访问权限

### 向上转型

- 子类是父类的一种类型
- 假如有一个Car类,是父类,它有一个子类Toyota类
- 继承意味着父类所有方法在子类中也是可用的,任何可以发送给父类的消息也可以发给子类
- 假如某个方法`move(Car car)`需要一个Car对象,我们传入一个Toyota对象完全不影响方法的执行,这就叫**向上转型**
- **向上转型永远是安全**的,因为子类是父类的超集,向上转型它**只可能失去方法不可能增加方法**,就好**像一个金字塔**
- 最简单的例子就是所有Java中的类都有一个最大父类Object,每个Java对象都可以调用Object类中的方法

#### 再论组合和继承

- 虽然书里教了很多继承但实际上写代码很少用到继承
- 只需要问自己一个问题就可以明白是否要写继承代码,就是`我需要向上转型吗??`

### final关键字

#### final数据

- 编译器中有一块数据是恒定不变的

  - 一个永不改变的编译时常量。
  - 一个在运行时初始化就不会改变的值。

- **编译时常量**可以在编译时计算,**减少了运行时负担**,Java中这类常量必须是**基本类型**,用final修饰,而且**必须在定义常量时赋值**

- 被 **static** 和 **final** 同时修饰的属性只会占用一段不能改变的存储空间。

- 对**基本类型**,final使**其数值恒定不变**

- 而对于**对象引用**,final只能**使其引用不变**,不能再拿其他对象或者new一个新对象赋值给这个final修饰的对象,这点对数组也是一样

- **典型常量定义方式**:public(可以在包外访问)+static(只有一个)+final(说明是一个常量):`public static final int VALUE_THREE = 39;`

- 惯例来说带有恒定初始值的final static变量(也就是编译时常量)命名全用大写,单词用下划线分割.

- 如果只加了final而没有加static,创建新对象时这个常量等于随着新对象又出现了一份(虽然它们可能值相同,如果使用Random方法就会不同),而加了static之后,随着第一次加载类时完成了常量初始化,创建多少个这个类的对象,常量永远在内存中只是那一份,无数个对象引用常量都指向它

- final修饰的对象,依然可以使用对象的方法或者获得对象数据来改变对象内的数据,数组也是一样,可以使用数组[索引]去改变数组元素的大小

  ```java
  //value类
  private final Value v2 = new Value(22);
  private static final Value VAL_3 = new Value(33);
  
  //另外的类
  fd1.v2.i++; // v2是个对象,final无法阻挡对象引用拿到对象内数据再增减
  for (int i = 0; i < fd1.a.length; i++) {
      fd1.a[i]++; // a是个数组,虽然是final修饰但是无法阻挡修改数组元素
      fd1.v2 = new Value(0); // Error: new了新对象改变final对象的引用是不允许的,会报错
      fd1.a = new int[3];//new新数组赋给final修饰的数组是不允许的,会报错
  }
  ```

  

#### 空白final

- 空白final指的就是**没有初始值**的final属性
- 编译器会要求空白final**必须在使用前初始化**
- 初始化都是**在构造函数中**完成

#### final参数

- 参数列表中,把参数标为final意味着方法**不能改变参数指向的对象或基本变量**,其实**和普通的final使用没任何区别**

- 这个特性主要用于传数据给**匿名内部类**

- ```java
  void with(final Gizmo g) {
      //-g = new Gizmo(); // 因为g参数是final修饰所以不能赋给它新引用
  }
  int g(final int i) {
      return i + 1;//这里只能返回i+1,如果返回i++就会报错,以为你想改变final参数的值
  }
  ```

#### final方法

- 使用final修饰方法的原因是**给方法上锁**,**防止子类通过重写方法改变方法.**

#### final和private

- **private**如果修饰方法,其实**隐式指定为final类型**,方法不能被子类重写,所以在修饰方法时,**private后加final是一个纯多余行为**.

- 但是有一点可能会迷惑,你试图重写方法时,看上去奏效,而且不会报错

- 这是因为如果一个方法是private实际上它只是这类里的**隐藏在内部的代码**,只是**恰好父类中有和它同名的方法**而已

- 你**没有重写方法,只是创建了新方法**

- 这样的新方法使用**向上转型父类是调用不到同名父类内部方法**的

- ```java
  OverridingPrivate2 op2 = new OverridingPrivate2();
  op2.f();
  op2.g();
  // 向上转型:
  OverridingPrivate op = op2;
  // 调用不到父类中的同名方法:
  //- op.f();
  //- op.g();
  // 这里也一样调不到:
  WithFinals wf = op2;
  //- wf.f();
  //- wf.g();
  ```

#### final类

- final修饰类意味着它**不能被继承**,断子绝孙了
- 由于类final修饰了,所以**类中的方法**也都**隐式final**修饰了,你都不能继承这个类,自然没办法重写类中方法

### 类初始化和加载

- Java每个类的编译代码都存在于它的独立文件中,该文件只有使用程序代码时才会被加载
- 也可以说,**类的代码在首次使用时加载**
- 这通常指**创建了类的第一个对象**或者是**访问了类的静态属性或方法**,**构造器也是**个**static**方法,虽然它的static关键字是**隐式**的
- 所以一个类的**任意静态成员被访问时就会被加载**
- 首次使用就是static初始化发生时**,所有的static对象和代码块**(这很重要,你调用static,就先只有static被初始化)在加载时按文本顺序一次初始化,static变量只被初始化一次.

#### 继承和初始化

- main方法执行前会去找当前类的编译文件,然后会先发现当前类是否有父类,一层层网上找出所有父类
- 不论是否创建父类对象,父类都会被加载
- 然后父类的static初始化开始执行,之后是下一级的子类static初始化,因为子类中static初始化可能依赖父类成员是否正确初始化
- 然后必要的类就加载完毕了,可以创建对象了,首先就是对象所有基本类型变量设默认值
- 然后会调用父类构造器,调用完成后父类常量按顺序初始化

```java
class Insect {
    private int i = 9;
    protected int j;
    Insect() {
        System.out.println("i = " + i + ", j = " + j);
        j = 39;
    }
    private static int x1 = printInit("static Insect.x1 initialized");
    static int printInit(String s) {
        System.out.println(s);
        return 47;
    }
}
public class Beetle extends Insect {
    private int k = printInit("Beetle.k.initialized");
    public Beetle() {
        System.out.println("k = " + k);
        System.out.println("j = " + j);
    }
    private static int x2 = printInit("static Beetle.x2 initialized");
    public static void main(String[] args) {
        System.out.println("Beetle constructor");
        Beetle b = new Beetle();
    }
}

	//输出
	static Insect.x1 initialized
    static Beetle.x2 initialized
    Beetle constructor
    i = 9, j = 0
    Beetle.k initialized
    k = 47
    j = 39
```

## 第九章:多态

- 多态是面相对象三大特性第三个--封装,继承,多态

### 向上转型回顾

- 在需要父类对象引用的地方使用子类引用不用类型转换,因为向上转型可能缩小接口,但不会比父类的全部接口更少

> 这里的接口泛指具体的方法和数据

#### 忘掉对象类型

- 向上转型时,如果需要父类对象引用的地方我们塞入的是子类对象,那直接为需要父类对象引用对象的地方写一个接受子类对象的版本不好吗??
- 当然可以,但是有缺点,这样意味着父类的每个新子类都需要编写特定方法,加大编程量,而且以后如果添加类似新方法也会有大量新工作.

> **自我理解**:这里的意思是,如果每个需要父类对象引用的地方都给一个新子类类型写对应的方法,引用子类新类型,那就需要使用方法重载在父类写很多个对应每个子类的方法版本,编译器还不会提醒,很可能忘了,而如果使用多态向上转型,那就只需要在各自新子类中重写方法即可,代码写在各自该有的位置,清晰明了,而且编译器也会提醒

- 重载不像重写,这里的重载只在父类中进行,只是接受参数类型不同,你不去重载编译器不会提示你,这就让类型处理难以管理

- ```java
  class Stringed extends Instrument {
      @Override
      public void play(Note n) {
          System.out.println("Stringed.play() " + n);
      }
  }
  class Brass extends Instrument {
      @Override
      public void play(Note n) {
          System.out.println("Brass.play() " + n);
      }
  }
  public class Music2 {
      public static void tune(Wind i) {
          i.play(Note.MIDDLE_C);
      }
      public static void tune(Stringed i) {
          i.play(Note.MIDDLE_C);
      }
      public static void tune(Brass i) {
          i.play(Note.MIDDLE_C);
      }
      public static void main(String[] args) {
          Wind flute = new Wind();
          Stringed violin = new Stringed();
          Brass frenchHorn = new Brass();
          tune(flute); // No upcasting
          tune(violin);
          tune(frenchHorn);
      }
  }
  ```

  

### 转机

- 为什么方法接收父类对象,你传入子类的对象,还能精准执行到子类中重写父类的方法呢?这就需要了解`绑定`这个主题

#### 方法调用绑定

- 把一个方法调用和方法主体关联起来称为**绑定**.
- 如果绑定发生在程序运行前,叫做**前期绑定**

> 这是面向过程语言默认的绑定方式

- 之前提到的问题解决办法就是**后期绑定**,在运行时根据对象类型进行绑定,也叫**动态绑定**或**运行时绑定**
- Java中**除了static和final**方法(private隐式final),**其他方法都是后期绑定**
- 所以一般情况下**后期绑定都是自动发生**
- 把**对象置为final**就是为了**防止方法被重写**,现在我们知道这**也关闭了动态绑定**,某种情况下可以让代码更高效,但其实大部分情况不会对性能有什么改变,所以最好别是为了提升性能实用final,而是**为了设计**

#### 产生正确的行为

- 当明白Java中所有方法都是通过后期绑定来实现多态,就可以编写**只和父类打交道**的代码,而且对于子类来说都能正常工作
- 换句话说,你想对象发送一条信息,**让对象自己做正确的事**
- 比如说有父类--形状,三个子类--圆,三角,方,这例子很直白,圆是一种形状
- **向上转型就是这样简单**:`Shape s = new Circle();`

> **这里很关键,之前我一直分不清是创建更小的子类赋给父类还是反过来.**

- 这里将一种类型赋值给另一种类型,看似错误,但是没问题,因为圆就是一个形状,所以没有报错

#### 可扩展性

- 由于多态,可以向系统中添加任意多的新类型,而不需要修改父类的通用方法
- 在设计良好的OOP程序中,很多方法会遵循**只与基类接口通信**.
- 这样的程序是可扩展的,可以**从通用父类派生新的数据类型**,从而**添加新功能**,那些操纵父类接口的方法不需要改动就可以用于新子类
- **多态**能提供的特性:代码中的修改不会破坏程序中其他不应受到影响的部分。换句话说，多态是一项“**将改变的事物与不变的事物分离**”的重要技术。

#### 陷阱：“重写”私有方法

- **private方法**是隐式final的,所以**对子类来说是隐蔽的**
- **试图在子类里重写父类中private方法**会得到一个全新同名方法,因为父类方法屏蔽了子类,所以**它都不算是重写方法**.
- 只有**非private方法才能被重写**,但是得小心private方法的重写,因为直接重写编译器是不报错的,除非使用`@Override`注解,会显著报错

#### 陷阱：属性与静态方法

- 只有**普通的方法调用可以是多态**的
- 例如，如果**你直接访问一个属性**，该访问会在编译时解析

> 说白了就是只有public重写的方法调用可以多态,直接用对象取方法不能多态,你转成父类就拿的是父类属性,不转就拿的是子类属性,看见啥是啥

---

- 这么说吧,如果父类子类有相同的public成员属性,你使用子类对象向上转型,直接去取对象属性,因为已经向上转型为父类对象,所以拿到的是父类中的属性值,而不会是多态拿到子类的

- 这时其实在子类代码中有两个同名属性,通过直接调用默认属性名或this.属性名可以拿到子类自己的属性,通过super才能拿到父类的同名属性

- 不过实际上这种情况基本不会发生,通常把属性都置为private,因此不能直接访问只能通过方法访问,此外也不可能给父类子类属性起相同的名字

  ```java
  class Super {
      public int field = 0;
      public int getField() {
          return field;
      }
  }
  class Sub extends Super {
      public int field = 1;
      @Override
      public int getField() {
          return field;
      }
      public int getSuperField() {
          return super.field;
      }
  }
  public class FieldAccess {
      public static void main(String[] args) {
          Super sup = new Sub(); // 向上转型
          //这里不会通过多态sup.field就拿到子类的field属性,但是sup.getField()方法因为是重写的而且是public,所以调用的是子类方法
          System.out.println("sup.field = " + sup.field + 
                             ", sup.getField() = " + sup.getField());
          Sub sub = new Sub();
          //这里就一切正常,没有向上转型,子类拿到自己的属性,自己调用自己方法,自己调用使用super取了父类属性的自己的方法
          System.out.println("sub.field = " + sub.field + 
                             ", sub.getField() = " + sub.getField()
                             + ", sub.getSuperField() = " + sub.getSuperField())
      }
  }
  ```

  ```java
  //输出
  sup.field = 0, sup.getField() = 1
  sub.field = 1, sub.getField() = 1, sub.getSuperField() = 0
  ```

  

---

- **静态方法不具有多态性**
- 静态的方法只与类关联，与单个的对象无关。

### 构造器和多态

- 构造器不具有多态性,认门会把它看作是隐式声明的静态方法

#### 构造器调用顺序

- 子类的构造过程中总会调用父类构造器,初始化时**自动按继承层次往上调用构造器**,所以每个父类的构造器都会被调用到
- 约定俗成属性都声明为private,所以父类只能靠自己的知识和权限初始化,子类拿不到这些
- 因此就要**调用所有构造器**,否则构建不出完整对象
- 如果子类构造器主体**没有显式调用父类构造器**,编译器会**默认调用无参构造**,如果父类没有无参构造,编译器会报错

---

- 对象的**构造器调用顺序**如下

  - 父类构造器被调用,这个步骤递归重复

  > 说人话就是从祖宗类一直往下挨个执行构造器,一直到爷爷类爸爸类最后是最小子类的构造器,当然在调用最小子类构造器前还需要下面的步骤

  - 按生命顺序初始化成员
  - 调用子类构造器的方法体

- 使用继承时,就知道了父类的一切,并可以访问父类中任意public和protected的成员

#### 继承和清理

- 使用组合和继承创建新类时,**大部分时候你不用关心清理**
- 如果有清理问题,必须**为新类创建一个清理方法**
- 由于继承,如果有其他特殊清理工作,必须**在子类中重写清理方法**,重写时**记得调用父类清理方法**,不然顾头不顾腚
- 如果成员变量中有对象也一定记得销毁,但是**销毁顺序**必须要和**变量对象初始化顺序相反**,以防一个对象依赖另一个对象

> 就这么说吧,先创建了a对象,后创建了b对象,b对象的清理方法里可能使用了a对象,如果你按正顺序先销毁a,后销毁b,那a已经销毁,b的清理方法无法完成

- 首先进行的是子类的清理,最后才是父类,因为子类清理可能会调用父类的一些方法
- 虽然**通常都不会搞清理方法**,但是要搞就要小心

---

- 子类对象拥有自己的成员对象,并且知道它们能存活多久,何时调用清理方法,但是如果某个成员对象被其他一个或多个对象共享,就必须使用`引用计数`来跟踪仍然访问者共享对象的对象数量

- ```java
  class Shared {
      private int refcount = 0;
      private static long counter = 0;
      private final long id = counter++;
      Shared() {
          System.out.println("Creating " + this);
      }
      public void addRef() {
          refcount++;
      }
      protected void dispose() {
          if (--refcount == 0) {
              System.out.println("Disposing " + this);
          }
      }
      @Override
      public String toString() {
          return "Shared " + id;
      }
  }
  class Composing {
      private Shared shared;
      private static long counter = 0;
      private final long id = counter++;
      Composing(Shared shared) {
          System.out.println("Creating " + this);
          this.shared = shared;
          this.shared.addRef();
      }
      protected void dispose() {
          System.out.println("disposing " + this);
          shared.dispose();
      }
      @Override
      public String toString() {
          return "Composing " + id;
      }
  }
  public class ReferenceCounting {
      public static void main(String[] args) {
          Shared shared = new Shared();
          Composing[] composing = {
              new Composing(shared),
              new Composing(shared),
              new Composing(shared),
              new Composing(shared),
              new Composing(shared),
          };
          for (Composing c: composing) {
              c.dispose();
          }
      }
  }
  ```

- Shared的counter跟踪创建的Shared对象数量,还提供了id值

> counter是静态,所以**第一次new的时候就初始化完毕**,并且之后就一直存在,不会再被赋0初始化,但是每次new Shared对象的时候,它都会执行++操作加一,并且加完赋给新对象的id属性,这就产生了唯一ID
>
> 而由于静态初始化后每次新对象产生它都++,那么它也就记录了新对象的数量

- counter类型为long不是int是为了防止溢出
- id是final的,这就和SQL中的ID一样,创建后不希望被修改
- 在将一个 **shared** 对象附着在类上时，必须记住调用 `addRef()`，而 `dispose()` 方法会跟踪引用数，以确定在何时真正地执行清理工作。使用这种技巧需要加倍细心，但是如果需要清理正在共享的对象，**你没有太多选择**。

#### 构造器内部多态方法的行为

- 如果在构造器中调用了正在构造的对象的动态绑定方法会怎么样
- 如果在**构造器中调用了动态绑定方法**,就会用到那个**方法的重写定义**,调用结果难以预料,因为重写的方法在对象完全构造出之前就被调用

> 很不明白如果一个父类有好几个子类都重写了这个方法,那在父类构造器调用的时候会用哪个子类的重写定义
>
> 根据我个人的理解,应该是如果新建某个具体子类的对象,新建的时候首先会去父类调用构造函数,这时如果构造函数中调用了某个被子类重写的动态绑定方法,就会调用子类中的重写版本

- **初始化的实际过程**是:
  - 在所有事发生前，分配给对象的存储空间会被初始化为二进制 0。
  - 如前所述调用基类构造器。此时调用重写后的 `draw()` 方法（是的，在调用 **RoundGraph** 构造器之前调用），由步骤 1 可知，**radius** 的值为 0。
  - 按声明顺序初始化成员。
  - 最终调用派生类的构造器。
- 所有事物**至少初始化为0**,通过组合**嵌入类中的对象被赋予null**
- **构造器**有一条好规范:做尽量少的事让对象进入良好状态,如果有可能,**尽量别调用类中任何方法**
- **父类构造器中**能**安全调用**的只有**父类的final方法**(private默认final),这些方法不能被重写,所以不会出现意想不到的结果,尽量遵守这条规则

### 协变返回类型

- Java5之后引入了协变返回类型
- **可以理解为方法返回值的多态行为**
- 父类的方法返回一个对象,子类中重写方法本来应该处处一样,包括返回类型,但是现在**允许子类重写的时候返回父类方法返回类型的子类对象**,就比如父类方法返回Collection类型,子类重写方法返回List类型

> 毕竟子类可以得到父类中所有方法,所以返回子类不影响原先方法的调用,这也是多态的内涵

### 使用继承设计

- 到处都使用继承会给设计带来负担
- 写代码**首选组合**,特别是你不知道该使用组合还是继承的时候
- 组合更加灵活,可以**动态选择类型**,而继承要求编译时知道确切类型

> 说人话就是组合的话,new好的对象赋给某个对象变量,在代码中的某个方法可以取这个对象变量的某个子类变量或另外一个对象赋给它,这样相同的执行结果就可以不同,更灵活
>
> 比如类中对象变量是`private  Actor actor = new HappyActor();`
>
> 可以在某个方法里写`actor = new SadActor();`,这样actor 就指向了另一个对象,在代码中使用actor的地方就可以获得不同的效果

- 这样你就获得了运行时的**动态灵活性**（这被称为`状态模式`）。
- 与之相反，我们无法在运行时才决定继承不同的对象；那在编译时就完全决定好了。

#### 替代VS扩展

- 继承有两种方式,一种是`is a`,一种是`is like a`
- 前者子类有且只有父类中的所有方法的重写版本,子类父类中的方法都是一样的,只是内部实现细节不同
- 这样的话子类可以完美替代父类,一切通过多态处理
- 后者子类拥有相同的父类方法,同时还有额外方法实现的新特性
- 单这也有缺点,子类扩展部分在积累中不存在,一旦向上转型就无法调用这些新方法

#### 向下转型与运行时类型信息

- 向上转型永远是安全的
- 但是因为向上转型会丢失类型信息,为了重新获取类型信息,就需要向下转型
- Java中每次转型都会被检查,哪怕是用括号强转,如果不是能正常转型的对象就会报错`ClassCastException`

## 第十章:接口

- 抽象类是一种**介于普通类和接口之间**的折中工具
- 对于构建**具有属性**和**未实现方法**的**类**来说,抽象类也是重要且必要的工具,你不可能总是使用纯粹的接口

### 抽象类和方法

- 抽象类中都是哑方法,只要调用就报错,因为接口方法的目的是**为它的子类创建一个通用方法**
- 创建通用方法的唯一理由是不同的子类可以用不同方式表示此接口.
- **抽象类的对象是没有意义**的,创建抽象类知识为了通过通用方法操纵一系列类,因此**抽象类只表示接口方法,不是具体实现**
- 我们希望抽象类所有的方法产生错误,但这会延迟到运行时才能的值错误,最好在编译时捕捉问题,就像泛型一样
- Java提供了一个叫**抽象方法**的机制,这个方法只有声明没有方法体:`abstract void f()`
- 包含抽象方法的类叫做抽象类.**如果一个类包含一个或多个抽象方法,那么类本身也必须限定为抽象**,否则编译器会报错,在创建抽象类对象时报错

> 只要有一个抽象方法,类就必须是抽象类
>
> 抽象类也可以有不抽象的方法
>
> 抽象类甚至可以不包含任何抽象方法

- 如果创建继承抽象类的新类并创建对象,那就必须**为所有父类抽象方法提供方法定义**,如果不这么做(**允许不做这么做**),新类就还是一个抽象类,编译器会**强制**为新类加上`abstract`关键字

- 可以把一个不包含任何抽象方法的类置为**abstract**,在类中的**非抽象对象没啥意义**但又想**阻止创建类的对象**的时候可以这么做.

- 想创建可初始化的类,就要继承抽象类,然后提供所有抽象方法的定义

- **@Override**这个注解的作用是规范代码,**对代码本身没有影响**,你加了它,如果覆写不规范它会在编译时报错告诉你,你不加他也可以完成方法的覆写,就是可能会耗费你更多精力比对,何况加上它一目了然就告诉你这是个覆写父类的方法

- 如果不加这个注解,一旦出现不相同的方法名或签名,抽象机制会认为你没有实现抽象方法从而产生编译时错误

- ```java
  abstract class AbstractAccess {
      private void m1() {}
      // private abstract void m1a(); // illegal
      protected void m2() {}
      protected abstract void m2a();
      void m3() {}
      abstract void m3a();
      public void m4() {}
      public abstract void m4a();
  }
  ```

- 如果**不加修饰符,接口方法自动为public**

- 当然抽象类不可能允许private abstract,因为这样子类就**不能覆写这个方法**,那这个**抽象方法就毫无意义**

### 接口创建

- 接口使用关键字**interface**创建
- **Java8之前**的**接口只允许抽象方法**,并且接口中的抽象方法都不用加`abstract`关键字,因为是在接口中,Java知道这些方法不能有方法体

> 你想加abstract也可以加,不过没有任何用处,反而显得你不懂接口

- **Java8之前**,interface关键字产生一个完全抽象的类,不提供任何实现,只能描述类应该像什么,做什么,就是说只能决定方法名,参数列表和返回类型,无法确定方法体,接口只提供形式,通常没有实现
- 一个接口表示所有实现了该接口的类看起来都应该像这样,接口就这样被用来建立类之间的协议
- **Java8之中**,接口稍有变化,因为Java8**允许接口包含默认方法和静态方法**

> 这里的默认方法指的是default关键字描述的方法

- 接口代表一个类的类型或一个形容词,如 Runnable 或 Serializable,而抽象类通常是类层次结构的一部分或一件事物的类型,如 String 或 ActionHero。

> 接口通常是描述这个类应该是如何的,所以形容词比较多,比如普通的类代表各种运动,那接口可能就是`快速的`,`强力的`这样的形容词,用来要求一些运动具有这样的特征
>
> 而抽象类本身就是一个类,它可能本身就是一种事物

- 和类一样,需要在**关键字interface**前**加public关键字**(在接口名和文件名相同时),否则接口只有包访问权限,只能在接口相同的包下使用,那就废了
- **接口可以包含属性**,隐式指明为static和final,也就是**常量**
- **接口中的方法**可以标注为public,但是如果不标注**默认也是public**,所以当实现接口中方法必须定义为public,不然只有包访问权限,**方法的访问权限**等于**降级**了,这是**Java不允许**的

> Java中继承或扩展的方法只能放大访问权限,不能缩小

#### 默认方法

- Java8可以使用default在接口中定义不需要`继承之后必须实现`的方法的方法体

- ```java
  public class AnImplementation implements AnInterface {
      public void firstMethod() {
          System.out.println("firstMethod");
      }
      public void secondMethod() {
          System.out.println("secondMethod");
      }
      public static void main(String[] args) {
          AnInterface i = new AnImplementation();
          i.firstMethod();
          i.secondMethod();
          //输出firstMethod
          //secondMethod
      }
  }
  ```

- 这时候再新增一个方法,然后不在接口实现类实现它,编译器会报错

- 如果我们使用**default**为新方法提供默认实现,那么所有和接口有关的代码都可以正常工作,还可以调用default修饰的新方法

- ```java
  interface InterfaceWithDefault {
      void firstMethod();
      void secondMethod();
      default void newMethod() {
          System.out.println("newMethod");
      }
  }
  ```

- 增加默认方法的极具说服力的理由是它允许**在不破坏已使用接口的代码**的情况下，**在接口中增加新的方法**。默认方法有时也被称为*守卫方法*或*虚拟扩展方法*。

#### 多继承

- 多继承意味着**一个类可能从多个父类型中继承特征和特性**。

- Java8之前是严格要求单继承的,也就是只能继承自一个雷,但可以实现任意多个接口

- 现在**Java8之后**,Java可以**通过默认方法具有某种多继承的特性**

- 接口带有默认方法意味着结合了多个父类的行为

- 因为接口中仍然不允许存在属性(只有静态属性,等于常量),所以属性仍然只会来自单个父类或抽象类,就是**不存在状态的多继承**

- ```java
  
  interface One {
      default void first() {
          System.out.println("first");
      }
  }
  interface Two {
      default void second() {
          System.out.println("second");
      }
  }
  interface Three {
      default void third() {
          System.out.println("third");
      }
  }
  class MI implements One, Two, Three {}
  public class MultipleInheritance {
      public static void main(String[] args) {
          MI mi = new MI();
          mi.first();
          mi.second();
          mi.third();
          //输出
          first
          second
          third
      }
  }
  ```

- 这时只要父类方法中方法名和参数列表不同(方法重载),就可以工作的很好,否则会编译器错误

- ```java
  interface Bob1 {
      default void bob() {
          System.out.println("Bob1::bob");
      }
  }
  interface Bob2 {
      default void bob() {
          System.out.println("Bob2::bob");
      }
  }
  // class Bob implements Bob1, Bob2 {}
  /* Produces:
  error: class Bob inherits unrelated defaults
  for bob() from types Bob1 and Bob2
  class Bob implements Bob1, Bob2 {}
  ^
  1 error
  * 同时扩展Bob1和Bob2接口会报错,因为他们有完全相同名字和参数的方法bob(),这样新类调用该方法Java不知道你想用哪个
  */
  interface Sam1 {
      default void sam() {
          System.out.println("Sam1::sam");
      }
  }
  interface Sam2 {
      default void sam(int i) {
          System.out.println(i * 2);
      }
  }
  // This works because the argument lists are distinct:这样是可以的,因为扩展的两个类的同名方法参数列表不同,方法重载可以分辨你调用哪个方法
  class Sam implements Sam1, Sam2 {}
  interface Max1 {
      default void max() {
          System.out.println("Max1::max");
      }
  }
  interface Max2 {
      default int max() {
          return 47;
      }
  }
  // class Max implements Max1, Max2 {}
  /* Produces:
  error: types Max2 and Max1 are imcompatible;
  both define max(), but with unrelated return types
  class Max implements Max1, Max2 {}
  ^
  * 这样是不行的,因为两个接口中的默认方法,方法名相同,参数也相同,这两个就是Java分辨方法的必要条件,而返回值的不同Java是分辨不出的
  1 error
  */
  ```

- 为了解决返回类型区分不出方法,需要**重写冲突的方法**

- ```java
  
  interface Jim1 {
      default void jim() {
          System.out.println("Jim1::jim");
      }
  }
  interface Jim2 {
      default void jim() {
          System.out.println("Jim2::jim");
      }
  }
  public class Jim implements Jim1, Jim2 {
      //重写之后指定这个方法是调用哪个基类中的就不会有错误了,在这里既可以使用super关键字选择父类实现的其中一种,也可以自己重定义
      @Override
      public void jim() {
          Jim2.super.jim();
      }
      public static void main(String[] args) {
          new Jim().jim();
      }
  }
  ```

#### 接口中的静态方法

- Java8之后,**接口中允许存在静态方法**,这样可以**把工具功能置于接口**中,从而**操作接口**或**成为通用工具**

- ```java
  
  public interface Operations {
      void execute();
      static void runOps(Operations... ops) {
          for (Operations op: ops) {
              op.execute();
          }
      }
      static void show(String msg) {
          System.out.println(msg);
      }
  }
  ```

  ```java
  class Bing implements Operations {
      @Override
      public void execute() {
          Operations.show("Bing");
      }
  }
  class Crack implements Operations {
      @Override
      public void execute() {
          Operations.show("Crack");
      }
  }
  class Twist implements Operations {
      @Override
      public void execute() {
          Operations.show("Twist");
      }
  }
  public class Machine {
      public static void main(String[] args) {
          Operations.runOps(
              new Bing(), new Crack(), new Twist());
      }
      //输出
      Bing
      Crack
      Twist
  }
  ```

### 抽象类和接口

|         特性         |                            接口                            |                  抽象类                  |
| :------------------: | :--------------------------------------------------------: | :--------------------------------------: |
|         组合         |                    新类可以组合多个接口                    |            只能继承单一抽象类            |
|         状态         |        不能包含属性（除了静态属性，不支持对象状态）        | 可以包含属性，非抽象方法可能引用这些属性 |
| 默认方法 和 抽象方法 | 不需要在子类中实现默认方法。默认方法可以引用其他接口的方法 |         必须在子类中实现抽象方法         |
|        构造器        |                         没有构造器                         |               可以有构造器               |
|        可见性        |                      隐式 **public**                       |    可以是 **protected** 或 “friendly”    |

- 在合理的范围尽可能抽象,所以**一般更倾向使用接口**而不是抽象类,只有**必要时才使用抽象类**
- **如果不是必须**使用,**尽量不要用接口和抽象类**,普通类大多时候已经很好,如果不行再移动到接口或抽象类中
- **接口可以定义main方法**,其中也可以有方法体

### 完全解耦

- 基本没太理解,需要掌握可以去看书
- `https://www.jishuchi.com/read/onjava8/12009#98yspz`

### 多接口结合

- 结合的多接口是有价值的,因为你有时候要表达“一个 **x** 是一个 **a** 和一个 **b** 以及一个 **c**”。

- 子类并不要求必须继承自抽象类或具体父类(不包含任何抽象方法),那就只能继承一个类,其它父元素必须都是接口

- 需要把所有接口名称置于implements之后并用逗号分割

- 可以有任意多个接口,并可以向上转型为每个接口

  ```java
  interface CanFight {
      void fight();
  }
  interface CanSwim {
      void swim();
  }
  interface CanFly {
      void fly();
  }
  class ActionCharacter {
      public void fight(){}
  }
  class Hero extends ActionCharacter implements CanFight, CanSwim, CanFly {
      public void swim() {}
      public void fly() {}
  }
  public class Adventure {
      public static void t(CanFight x) {
          x.fight();
      }
      public static void u(CanSwim x) {
          x.swim();
      }
      public static void v(CanFly x) {
          x.fly();
      }
      public static void w(ActionCharacter x) {
          x.fight();
      }
      public static void main(String[] args) {
          Hero h = new Hero();
          t(h); // Treat it as a CanFight
          u(h); // Treat it as a CanSwim
          v(h); // Treat it as a CanFly
          w(h); // Treat it as an ActionCharacter
      }
  }
  ```

- 一次继承一个类,扩展多个接口时**必须先写继承后写扩展**,否则编译器会报错

- 接口 **CanFight** 和类 **ActionCharacter** 中的 `fight()` 方法签名相同，而在类 Hero 中也没有提供 `fight()` 的定义。

- 当**想创建一个对象**时，**所有的定义必须首先都存在**。

- 由于fight()方法在类 **ActionCharacter** 中已经定义过(虽然是无方法体的实现)，这样才使得创建 **Hero** 对象成为可能。

> 继承的父类中实现了同名同参数的方法

- **Adventure** 中可以看到四个方法,它们接收不同的接口和类作为参数,当创建Hero对象时,它可以被传到这四个方法里任意一个,意味着它**可以依次向上转型为每个接口或父类**
- 这就是**使用接口的核心原因**之一:**向上转型为多个父类型**
- 第二个原因和适用抽象类相同:**防止创建该类的对象**,确保仅仅是个接口
- 这样可以得到启示,如果**创建不带任何方法定义或成员变量**的父类,就**选择接口**不是抽象类
- 如果知道某事物是父类,可以考虑用接口实现

### 使用继承扩展接口

- 使用继承很容易在接口中增加方法声明,还可以在新接口中结合多个接口

- ```java
  interface Monster {
      void menace();
  }
  interface DangerousMonster extends Monster {
      void destroy();
  }
  interface Lethal {
      void kill();
  }
  class DragonZilla implements DangerousMonster {
      @Override
      public void menace() {}
      @Override
      public void destroy() {}
  }
  interface Vampire extends DangerousMonster, Lethal {
      void drinkBlood();
  }
  class VeryBadVampire implements Vampire {
      @Override
      public void menace() {}
      @Override
      public void destroy() {}
      @Override
      public void kill() {}
      @Override
      public void drinkBlood() {}
  }
  public class HorrorShow {
      static void u(Monster b) {
          b.menace();
      }
      static void v(DangerousMonster d) {
          d.menace();
          d.destroy();
      }
      static void w(Lethal l) {
          l.kill();
      }
      public static void main(String[] args) {
          DangerousMonster barney = new DragonZilla();
          u(barney);
          v(barney);
          Vampire vlad = new VeryBadVampire();
          u(vlad);
          v(vlad);
          w(vlad);
      }
  }
  ```

- 对于普通类来说,extends只能用于一个类,也就是只能有一个父类

- 但是**构建接口时可以引用多个父类接口**,接口之间逗号隔开

#### 结合接口时的命名冲突

- 实现多个接口时,如果出现继承的父类和扩展的接口中有同名方法怎么办

- 如果是方法名和参数列表完全相同,那就没有任何问题,可以在最后的子类中重写该方法

- 如果其他相同,但是只有返回类型不同就会出问题,因为Java无法靠返回类型判断方法,这时就算你想重写Java都分不清你重写的这个方法名属于哪个类或接口

- 所以在使用组合接口时,尽量避免不同接口中使用相同方法名

  ```java
  interface I1 {
      void f();
  }
  interface I2 {
      int f(int i);
  }
  interface I3 {
      int f();
  }
  class C {
      public int f() {
          return 1;
      }
  }
  class C2 implements I1, I2 {
      @Override
      public void f() {}
      @Override
      public int f(int i) {
          return 1;  // 方法重载,不同的参数列表识别为两个方法,分别重写
      }
  }
  class C3 extends C implements I2 {
      @Override
      public int f(int i) {
          return 1; // 方法重载,接口中的方法重写,父类方法可以不重写直接调用
      }
  }
  class C4 extends C implements I3 {
      // 完全相同，没问题
      @Override
      public int f() {
          return 1;
      }
  }
  // 方法的返回类型不同,Java分辨不出它们中的同名方法属于谁,就不知道该让你如何处理
  //- class C5 extends C implements I1 {}
  //- interface I4 extends I1, I3 {}
  ```

### 接口适配

- 相同的接口可以有多个实现
- 简单情况下体现在一个方法接收接口作为参数,该接口的实现和传递对象则取决于方法的使用者

> 就是有个方法,你调用的时候需要往它的括号里塞参数,这个参数就是某个接口对象,至于这个方法之中怎么使用这个接口就由编写方法的人自己说了算

- 接口常见用法是**策略模式**,编写一个方法执行某些操作并接受一个指定的接口作为参数.

- `只要对象遵循接口,就可以调用方法`,这让方法更灵活,通用,具有可复用性

- 例如，类 **Scanner** 的构造器接受的是一个 **Readable** 接口。你会发现 Readable 没有用作 Java 标准库中其他任何方法的参数——它是单独为 Scanner 创建的，因此 Scanner **没有将其参数限制为某个特定类**。通过这种方式，Scanner 可以**与更多的类型协作**。如果你**创建了一个新类并想让 Scanner 作用于它**，就让它**实现 Readable接口**.

- ```java
  public Scanner(Readable source) {
      this(Objects.requireNonNull(source, "source"), WHITESPACE_PATTERN);
  }
  //Scanner的某个构造函数,只需要传入Readable接口即可
  //这里所有扩展了Readable接口的类都符合条件,因为可以向上转型,扩展后的类相当于子类,一定有接口中方法
  
  ```

- ```java
  public class RandomStrings implements Readable {
      private static Random rand = new Random(47);
      private static final char[] CAPITALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
      private static final char[] LOWERS = "abcdefghijklmnopqrstuvwxyz".toCharArray();
      private static final char[] VOWELS = "aeiou".toCharArray();
      private int count;
      public RandomStrings(int count) {
          this.count = count;
      }
      //按我的理解呢,这里每次都会调用read方法,每次count都会--,直到count--为1的时候执行最后一次,先比较后自减,所以传count是几,就会在下面打印几次
      @Override
      public int read(CharBuffer cb) {
          if (count-- == 0) {
              return -1; // indicates end of input
          }
          cb.append(CAPITALS[rand.nextInt(CAPITALS.length)]);
          for (int i = 0; i < 4; i++) {
              cb.append(VOWELS[rand.nextInt(VOWELS.length)]);
              cb.append(LOWERS[rand.nextInt(LOWERS.length)]);
          }
          cb.append(" ");
          return 10; // Number of characters appended
      }
      public static void main(String[] args) {
          //RandomStrings实现了Readable接口,而Scanner有一个构造参数接受的是这个接口,也就可以接收实现这个接口的类,相当于接收子类,这下Scanner就在内部拿着RandomStrings去处理了,相当于茅台酒厂帮你生产娃哈哈
          Scanner s = new Scanner(new RandomStrings(10));
          while (s.hasNext()) {
              System.out.println(s.next());
          }
      }
  }
  //输出
  Yazeruyac
  Fowenucor
  Goeazimom
  Raeuuacio
  Nuoadesiw
  Hageaikux
  Ruqicibui
  Numasetih
  Kuuuuozog
  Waqizeyoy
  ```

- 假设你有一个类**没有实现 Readable 接口**，怎样才能**让 Scanner 作用于它**呢？下面是一个产生随机浮点数的例子

  ```java
  public interface RandomDoubles {
      Random RAND = new Random(47);
      default double next() {
          return RAND.nextDouble();
      }
      static void main(String[] args) {
          RandomDoubles rd = new RandomDoubles(){};
          for (int i = 0; i < 7; i++) {
              System.out.println(rd.next() + " ");
          }
      }
  }
  //输出
  0.7271157860730044 
  0.5309454508634242 
  0.16020656493302599 
  0.18847866977771732 
  0.5166020801268457 
  0.2678662084200585 
  0.2613610344283964
  ```

- 可以再次使用适配器模式,这里适配器可以实现两个接口,得到一个即是RandomDoubles,又是Readable的类

- **RandomDoubles没有实现Readable,Scanner却作用于它了**(作用于它的子类也是作用于它)

- **相当于Scanner是猪肉处理厂,没有经过检疫的猪肉它压根不处理,现在你有一批猪肉就是RandomDoubles,不让你使用检疫工具Readable,但是你又想合法的把猪肉送进处理厂,这该怎么办呢?就找了个第三方工厂,这个工厂里有检疫工具Readable,你再把你的猪肉RandomDoubles送进这里,从这个第三方工厂里检疫完直接可以送去处理厂Scanner,这样没有直接经过你的手对猪肉有任何处理,照样完成了猪肉的检疫**

- ```java
  public class AdaptedRandomDoubles implements RandomDoubles, Readable {
      private int count;
      public AdaptedRandomDoubles(int count) {
          this.count = count;
      }
      @Override
      public int read(CharBuffer cb) {
          if (count-- == 0) {
              return -1;
          }
          //这里的next()就是RandomDoubles的方法
          String result = Double.toString(next()) + " ";
          cb.append(result);
          return result.length();
      }
      public static void main(String[] args) {
          Scanner s = new Scanner(new AdaptedRandomDoubles(7));
          while (s.hasNextDouble()) {
              System.out.print(s.nextDouble() + " ");
          }
      }
  }
  ```

- 可以以这种方式在已有类中增加新接口，所以这就意味着一个接受接口类型的方法提供了一种让任何类都可以与该方法进行适配的方式。这就是使用接口而不是类的强大之处。

> 这里提到的`让任何类都可以与该方法进行适配的方式`就是任何类都可以扩展接口,扩展完成之后成了接口的子类,自然可以和原先接收接口参数的方法进行适配

### 接口字段

- 接口中的字段都是**自动`static`和`final`**的,所以接口成了创建一组常量的方便工具
- Java5之前这是产生C或C++中的枚举相同效果的唯一方式
- 所以Java5之前的代码可以看到很多接口,里面就是一堆的常量
- 注意Java中的**static final常量**的**命名风格是全英文大写**,单词间下划线隔开
- 接口字段默认public
- Java5之后就有了Java自己的枚举类,但是历史遗留代码里遇到要懂

#### 初始化接口中的字段

- 接口中的字段不能是空的,但是**可以用`非常量表达式`初始化**
- 比如可以用Random赋值给常量
- 因为是**静态**的,所以会在**类第一次被加载时初始化**,这发生在**任何字段首次被访问**时,一旦初始化就不会再改变,不会导致你多次调用一个Random生成的常量次次不一样
- 这些字段不是接口的一部分，它们的值被存储在接口的静态存储区域中。

### 接口嵌套

- ```java
  class A {
      interface B {
          void f();
      }
      public class BImp implements B {
          @Override
          public void f() {}
      }
      public class BImp2 implements B {
          @Override
          public void f() {}
      }
      public interface C {
          void f();
      }
      class CImp implements C {
          @Override
          public void f() {}
      }
      private class CImp2 implements C {
          @Override
          public void f() {}
      }
      //类里可以写private的接口
      private interface D {
          void f();
      }
      private class DImp implements D {
          @Override
          public void f() {}
      }
      //public内部类也可以扩展内部private接口,但是这样的话A.DImp2就只能被自己使用,也就是自己的对象使用(甚至自己的父类都不能用)
      //所以实现private接口是一种可以强制改接口中方法定义不会添加任何类型信息的方式(就是不可以向上转型)
      public class DImp2 implements D {
          @Override
          public void f() {}
      }
      //getD()是一个public方法但是返回的是对private接口的引用
      public D getD() {
          return new DImp2();
      }
      private D dRef;
      public void receiveD(D d) {
          dRef = d;
          dRef.f();
      }
  }
  interface E {
      interface G {
          void f();
      }
      // Redundant "public"
      //多余的public,接口中的接口默认是public
      public interface H {
          void f();
      }
      void g();
      // Cannot be private within an interface
      //不可以在接口中定义私有接口
      //- private interface I {}
  }
  public class NestingInterfaces {
      public class BImp implements A.B {
          @Override
          public void f() {}
      }
      class CImp implements A.C {
          @Override
          public void f() {}
      }
      // Cannot implements a private interface except 
      //不能实现私有接口，除非
      // within that interface's defining class:
      //在接口中定义类:
      //- class DImp implements A.D {
      //- public void f() {}
      //- }
      class EImp implements E {
          @Override
          public void g() {}
      }
      class EGImp implements E.G {
          @Override
          public void f() {}
      }
      class EImp2 implements E {
          @Override
          public void g() {}
          class EG implements E.G {
              @Override
              public void f() {}
          }
      }
      public static void main(String[] args) {
          A a = new A();
          // Can't access to A.D:
          //无法进入A.D
          //- A.D ad = a.getD();
          // Doesn't return anything but A.D:
          //除了A.D什么都不能返回,getD()返回的是D对象,不能向上转型,因为实现的是private接口
          //- A.DImp2 di2 = a.getD();
          // cannot access a member of the interface:
          //无法访问该接口的成员
          //- a.getD().f();
          // Only another A can do anything with getD():
          //只有另一个A对象可以用getD()做任何事情,私有只能被自己调用
          A a2 = new A();
          a2.receiveD(a.getD());
      }
  }
  ```

- **类中嵌套**接口,**可以是private的接口**

- **类中的其他类实现private接口**可以强制该接口中的方法定义不会添加任何类型信息(就是**不可以向上转型**)

- 接口之间也能嵌套,但是接口中的元素必须是public的,不能有private接口

- 当实现某个接口时,不需要实现嵌套在其内部的接口

### 接口和工厂方法模式

- 接口是多实现的途径,而生成复合某个接口的对象的典型方式是**工厂方法模式**

- 不需要直接调用构造器,只需调用工厂对象中的构建方法就能实现对象的生成

- 理论上通过这种方式可以把**接口与实现**的**代码完全分离**,使得可以透明的将某个实现替换为另一个实现

  ```JAVA
  interface Service {
      void method1();
      void method2();
  }
  interface ServiceFactory {
      Service getService();
  }
  class Service1 implements Service {
      Service1() {} // Package access
      @Override
      public void method1() {
          System.out.println("Service1 method1");
      }
      @Override
      public void method2() {
          System.out.println("Service1 method2");
      }
  }
  class Service1Factory implements ServiceFactory {
      @Override
      public Service getService() {
          return new Service1();
      }
  }
  class Service2 implements Service {
      Service2() {} // Package access
      @Override
      public void method1() {
          System.out.println("Service2 method1");
      }
      @Override
      public void method2() {
          System.out.println("Service2 method2");
      }
  }
  class Service2Factory implements ServiceFactory {
      @Override
      public Service getService() {
          return new Service2();
      }
  }
  public class Factories {
      //这里接收工厂,实际接收可以向上转型,接收实现工厂接口的类,这样就可以接收所有不同对象的工厂,从而进行不同Service对象的操作
      public static void serviceConsumer(ServiceFactory fact) {
          Service s = fact.getService();
          s.method1();
          s.method2();
      }
      public static void main(String[] args) {
          serviceConsumer(new Service1Factory());
          // Services are completely interchangeable:
          //Services是完全可互换的
          serviceConsumer(new Service2Factory());
      }
  }
  ```

- 如果没有工厂方法，代码就必须在某处指定将要创建的 **Service** 的确切类型，从而调用恰当的构造器。

- 为什么要添加额外的间接层呢？一个常见的原因是**创建框架**。假设你正在创建一个游戏系统；例如，在相同的棋盘下国际象棋和西洋跳棋：

  ```java
  interface Game {
      boolean move();
  }
  interface GameFactory {
      Game getGame();
  }
  class Checkers implements Game {
      private int moves = 0;
      private static final int MOVES = 3;
      @Override
      public boolean move() {
          System.out.println("Checkers move " + moves);
          return ++moves != MOVES;
      }
  }
  class CheckersFactory implements GameFactory {
      @Override
      public Game getGame() {
          return new Checkers();
      }
  }
  class Chess implements Game {
      private int moves = 0;
      private static final int MOVES = 4;
      @Override
      public boolean move() {
          System.out.println("Chess move " + moves);
          return ++moves != MOVES;
      }
  }
  class ChessFactory implements GameFactory {
      @Override
      public Game getGame() {
          return new Chess();
      }
  }
  public class Games {
      public static void playGame(GameFactory factory) {
          Game s = factory.getGame();
          while (s.move()) {
              ;//这里的意思就是一直调用s.move方法直到返回false
          }
      }
      public static void main(String[] args) {
          playGame(new CheckersFactory());
          playGame(new ChessFactory());
      }
  }
  ```

- 如果类 **Games** 表示一段很复杂的代码，那么这种方式意味着你可以在不同类型的游戏里复用这段代码。你可以再想象一些能够从这个模式中受益的更加精巧的游戏。

> 意思就是Games是很复杂的代码,然后其他游戏就可以Games.palyGames调用它其中的方法进行对不同的游戏的相同代码操作,如果需要你还可以创建其它参数为工厂的方法用以进行别的操作,也是一样可以对不同的游戏复用

## 第十一章:内部类

- 内部类是一种非常有用的特性，因为它允许你把一些**逻辑相关的类组织在一起**，并**控制**位于内部的类的**可见性**。然而必须要了解，内部类与组合是完全不同的概念，这一点很重要。在最初，内部类看起来就像是一种`代码隐藏机制`：将类置于其他类的内部。但是，你将会了解到，内部类**远不止如此**，它了解外部类，并能与之通信，而且你用内部类写出的代码更加优雅而清晰，尽管并不总是这样（而且 Java 8 的 Lambda 表达式和方法引用减少了编写内部类的需求）。

### 创建内部类

- 创建内部类就是**把类定义在外部类的里面**
- 在外部类中的方法使用该类的内部类时,和普通类没啥区别
- **更典型的情况**是外部类有一个方法,返回的是一个指向内部类的引用
- 如果想从**外部类**的**非静态方法之外**的任意位置**创建**某个内部类的对象,必须**详细指出这个对象的类型**:`OuterClassName.InnerClassName(外部类名.内部类名)`

> 在**外部类**的**静态方法中**可以直接指明类型:`InnerClassName(内部类名)`

### 链接外部类

- 上面讲到的内部类似乎还只是一种名字隐藏与组织代码的模式,但还有其他用途

- 它可以**访问其外部对象所有成员**,而**不需要**任何特殊**条件**

- 如何做到的呢?外部类对象创建了一个内部类对象时,**内部类对象**必定会**秘密捕获一个指向外部类对象的引用**,就是那个引用来选择外部类的成员

- 内部类对象只能在**与其外部类对象相关联**的情况下才能**被创建**,也就是当内部类是**非静态**的时候

> 内部类是静态的,内部和外部类就没有关联,因为可以直接使用`外部类名.内部类`,不用创建外部类对象也可以进入内部类

  ```java
  interface Selector {
      boolean end();
      Object current();
      void next();
  }
  public class Sequence {
      private Object[] items;
      private int next = 0;
      public Sequence(int size) {
          items = new Object[size];
      }
      public void add(Object x) {
          if(next < items.length)
              items[next++] = x;
      }
      private class SequenceSelector implements Selector {
          private int i = 0;
          //这里内部类直接访问并修改了外部类的元素items
          @Override
          public boolean end() { return i == items.length; }
          @Override
          public Object current() { return items[i]; }
          @Override
          public void next() { if(i < items.length) i++; }
      }
      public Selector selector() {
          return new SequenceSelector();
      }
      public static void main(String[] args) {
          Sequence sequence = new Sequence(10);
          for(int i = 0; i < 10; i++)
              sequence.add(Integer.toString(i));
          Selector selector = sequence.selector();
          while(!selector.end()) {
              System.out.print(selector.current() + " ");
              selector.next();
          }
      }
  }
  ```

###   .this和.new

- 如果你要生成对外部对象的引用,使用外部类名字后面跟圆点加this,这样的引用自动有正确的类型,并在编译期就被知晓并受检查,因此没有运行时开销

  ```java
  public class DotThis {
      void f() { System.out.println("DotThis.f()"); }
      public class Inner {
          public DotThis outer() {
              return DotThis.this;
              // A plain "this" would be Inner's "this"
          }
      }
      public Inner inner() { return new Inner(); }
      public static void main(String[] args) {
          DotThis dt = new DotThis();
          DotThis.Inner dti = dt.inner();
          dti.outer().f();
      }
  }
  ```

- 有时候会需要告诉某些对象,让它**创建其内部类的对象**,这就需要使用**new表达式**

  ```java
  public class DotNew {
      public class Inner {}
      public static void main(String[] args) {
          DotNew dn = new DotNew();
          DotNew.Inner dni = dn.new Inner();
      }
  }
  ```

- 创建内部类对象不能去引用外部类名字(`DotNew.new Inner是错的`),而必须使用外部类对象来创建该内部类对象

- 拥有外部类对象前是不可能创建内部类对向的,因为内部类对象会隐式链接到创建它的外部对象上,但是如果你创建的是嵌套类(静态内部类),那 它就不需要对外部类对象的引用

### 内部类与向上转型

- 这里的知识稍微有点深奥
- 当**内部类向上转型为其父类**,**尤其是转型为一个接口**的时候,内部类就有了用武之地
- 这是为了内部类中**关于某个接口**的**实现代码**可以**完全被隐藏**,让调用这里代码的程序员只知道实现了哪个接口,但是不知道是怎么实现的接口

> 从实现了某个接口的对象得到接口的引用,与向上转型为这个对象的父类实质上效果是一样的
>
> 用人话解释就是,得到父接口和得到父类这两种向上转型的性质相同

- 所得到的**只是指向父类或接口的引用**，所以能够很方便地隐藏实现细节。

```java
public interface Destination {
    String readLabel();
}
public interface Contents {
    int value();
}


class Parcel4 {
    private class PContents implements Contents {
        private int i = 11;
        @Override
        public int value() { return i; }
    }
    protected final class PDestination implements Destination {
        private String label;
        private PDestination(String whereTo) {
            label = whereTo;
        }
        @Override
        public String readLabel() { return label; }
    }
    //接下来这两个方法,都是new了一个内部类,甚至是内部私有类然后return,因为是自己类内部在new,所以私有也无法阻挡,但是同时方法的返回值类型却是父类接口Destination和Contents,这是在返回的时候向上转型了
    //向上转型之后,具体的对象会携带子类本身的一些信息,在调用接口中的信息时,会根据携带的信息找到具体的子类去执行对应接口的重写方法
    //但是调用这个方法的人只会知道自己得到了一个接口类型的对象,并不知道具体的实现接口类的存在和内部构造
    public Destination destination(String s) {
        return new PDestination(s);
    }
    public Contents contents() {
        return new PContents();
    }
}
public class TestParcel {
    public static void main(String[] args) {
        Parcel4 p = new Parcel4();
        Contents c = p.contents();
        Destination d = p.destination("Tasmania");
        // Illegal -- can't access private class:
        // 不能进入私有类
        //- Parcel4.PContents pc = p.new PContents();
    }
}
```

- **非内部类不能设置为`private`和`protected`**,只能是public或默认package权限
- 如果客户端程序员想了解或访问内部的private或protected类,是要受限的,**private内部类**甚至**不能向下转型**,也就是`PContentsc = p.contents();`或`Contents c = (Parcel4.PContents)p.contents();`都是不允许的
- private内部类给类的设计者提供了一种途径,可以完全阻止任何依赖于类型的编码,并且完全隐藏实现细节

### 内部类方法和作用域

- 除了之前的内部类典型用途,还可以在一个**方法里**或**任意的作用域**内**定义内部类**

> 乍一听作用域也是在方法里,这范围重复了,但是方法里指的是直接在方法中直接写,作用域的话就是类似方法中的某些判断,比如if判断中写内部类,还是有区别的

- 这样做有两个理由

  - 实现了某类接口,于是可以创建并返回对其的应用
  - 要解决一个复杂的问题,想创建一个类辅助解决,但不希望这个类是公共可用的

- **在`方法的作用域`内创建一个完整的类**,这杯称为**局部内部类**

- `PDestination`类是`destination()`方法的一部分,不是类`Parcel5`的一部分,所以在方法外不能直接访问`PDestination`

- 在方法中定义了内部类,**不意味着方法执行完毕内部类就不可用**了

- 虽然这里的内部类有名字,但是同目录下其他类里起这个名字的类不会有命名冲突

  ```java
  public class Parcel5 {
      //这里的返回类型是下面return语句类型的向上转型
      public Destination destination(String s) {
          //这是没有经过任何逻辑直接卸载方法内部的类
          final class PDestination implements Destination {
              private String label;
              private PDestination(String whereTo) {
                  label = whereTo;
              }
              @Override
              public String readLabel() { return label; }
          }
          return new PDestination(s);
      }
      public static void main(String[] args) {
          Parcel5 p = new Parcel5();
          Destination d = p.destination("Tasmania");
      }
  }
  ```

- 在任意的作用域内嵌入一个内部类

- `TrackingSlip`类嵌入在if语句的作用域内,它其实**和别的类一起编译**过,但在**定义它的作用域外它不可用**,除此之外和普通类一样

  ```java
  public class Parcel6 {
      private void internalTracking(boolean b) {
          if(b) {
              class TrackingSlip {
                  private String id;
                  TrackingSlip(String s) {
                      id = s;
                  }
                  String getSlip() { return id; }
              }
              TrackingSlip ts = new TrackingSlip("slip");
              String s = ts.getSlip();
          }
          // Can't use it here! Out of scope:
          //不能用在这,超出作用域
          //显然上方的内部类是在if作用域内的,出了这个作用域,内部类就
          //- TrackingSlip ts = new TrackingSlip("x");
      }
      public void track() { internalTracking(true); }
      public static void main(String[] args) {
          Parcel6 p = new Parcel6();
          p.track();
      }
  }
  ```

  

### 匿名内部类

```java
public class Parcel7 {
    public Contents contents() {
        return new Contents() { // Insert class definition
            //内部类的定义
            private int i = 11;
            @Override
            public int value() { return i; }
        }; // Semicolon required 需要分号
    }
    public static void main(String[] args) {
        Parcel7 p = new Parcel7();
        Contents c = p.contents();
    }
}
```

- 这里的方法`contents()`把**返回值的生成**与表示这个**返回值的类的定义**结合在了一起.

- 这个类没有名字,却在new的类后方的括号里**直接定义了类的构造**

- 这种语法完成了创建一个继承自Contents的匿名类的对象.通过new表达式返回的引用被**自动向上转型**为对Contents的引用.

- 上面匿名内部类的代码等价于下方代码,这就很**类似于lambda表达式**,不用去别处写实现,直接在使用它的地方原地写好实现来用就行

  ```java
  public class Parcel7b {
      class MyContents implements Contents {
          private int i = 11;
          @Override
          public int value() { return i; }
      }
      public Contents contents() {
          return new MyContents();
      }
      public static void main(String[] args) {
          Parcel7b p = new Parcel7b();
          Contents c = p.contents();
      }
  }
  ```

- 这里使用了默认构造器生成Contents,如果你的**父类**需要一个**有参数的构造器**该怎么办

- ```java
  public class Parcel8 {
      public Wrapping wrapping(int x) {
          // Base constructor call:
          return new Wrapping(x) { // [1]把合适参数传给父类构造器
              @Override
              public int value() {
                  return super.value() * 47;
              }
          }; // [2]这里的分号不是标记内部类结束,是标记表达式的结束,不过表达式里正好包含了匿名内部类,说白了和其他地方的分号没区别
      }
      public static void main(String[] args) {
          Parcel8 p = new Parcel8();
          Wrapping w = p.wrapping(10);
      }
  }
  public class Wrapping {
      private int i;
      public Wrapping(int x) { i = x; }
      public int value() { return i; }
  }
  ```

- 这里的Wrapping是一个有具体实现的普通类,但是被拿来当做接口用

- 匿名内部类中定义**字段**时,还能**对其进行初始化操作**

- ```java
  public class Parcel9 {
      // Argument must be final or "effectively final"
      // to use within the anonymous inner class:
      public Destination destination(final String dest) {
          return new Destination() {
              private String label = dest;
              @Override
              public String readLabel() { return label; }
          };
      }
      public static void main(String[] args) {
          Parcel9 p = new Parcel9();
          Destination d = p.destination("Tasmania");
      }
  }
  ```

- 如果定义匿名内部类时,它要**使用匿名内部类之外定义的对象**,编译器会**要求该对象的参数引用是final**或者是effectively final,就像这里destination方法的dest参数,其实去掉final是没问题的(因为是默认final),但是还是加上方便阅读代码

> 这里要求final的那个对象引用,指的是如果这个引用在匿名内部类里用到,那它不是在匿名内部类里置为final,而是在匿名内部类拿到它的位置置为final,这里的例子就是destination方法的参数括号中

- 如果只是给字段赋值,这样做是可以的,如果要做一些**类似构造器**的行为,那就得通过**实例初始化**,达到为匿名内部类**创建一个构造器的效果**

> 为什么匿名内部类不能存在自己的构造器?因为构造器都是用类名命名的,你都匿名了你还要什么构造器
>
> 这里的实例初始化就是{}代码块

- ```java
  abstract class Base {
      Base(int i) {
          System.out.println("Base constructor, i = " + i);
      }
      public abstract void f();
  }
  public class AnonymousConstructor {
      public static Base getBase(int i) {
          return new Base(i) {
              //使用{}代码块这就叫实例初始化
              { System.out.println(
                  "Inside instance initializer"); }
              @Override
              public void f() {
                  System.out.println("In anonymous f()");
              }
          };
      }
      public static void main(String[] args) {
          Base base = getBase(47);
          base.f();
          //输出为
          //Base constructor, i = 47
          //Inside instance initializer
          //In anonymous f()
      }
  }
  ```

- 这里不要求变量i一定是final的,因为i传递给匿名类的父类构造器,不会在匿名内部类中被直接使用

---

- 这个例子中,destination方法参数必须是final,因为在匿名类内部使用了,不过不加final其实Java8也会自动加上

- 可以看到在实例初始化内部,if判断的那部分语句就不能作为字段初始化动作,因为这**不只是`赋值`还涉及到`判断逻辑`**

- 当然这种"构造器"也有**限制**,就是你**无法进行`方法重载`**,普通的class可以有不同参数同名的好多构造器,这里使用实例初始化只是一个代码块,不是一个方法,就无法重载

  ```java
  public class Parcel10 {
      public Destination
          destination(final String dest, final float price) {
          return new Destination() {
              private int cost;
              // Instance initialization for each object:
              {
                  cost = Math.round(price);
                  if(cost > 100)
                      System.out.println("Over budget!");
              }
              private String label = dest;
              @Override
              public String readLabel() { return label; }
          };
      }
      public static void main(String[] args) {
          Parcel10 p = new Parcel10();
          Destination d = p.destination("Tasmania", 101.395F);
      }
  }
  ```


---

- **匿名内部类的继承**相比普通类是**受限**的,要么**继承类**要么实现**接口**,**无法两者兼备**,**接口**也**最多只能实现一个**

### 嵌套类(静态内部类)

- 如果不需要内部类对象和外部类对象之间有关联,可以把**内部类声明为`static`**,这叫做**嵌套类**
- 普通内部类对象隐式包含一个引用指向创建它的外部类对象
- 嵌套类意味着
  - 创建嵌套类的对象时,不需要其外部类的对象
  - 不能从嵌套类的对象中访问非静态的外部类对象
- 普通的内部类不能有**static数据和方法**,也不能**包含嵌套类**,但是**嵌套类可以拥有**这些

> 嵌套类可以拥有静态方法和数据,也可以拥有自己的嵌套类无限套娃,但是要注意,嵌套类指的是静态内部类,普通内部类里不能有静态内部类,不意味着普通内部类里不能有普通内部类

- 之所以普通内部类不能有静态成员和方法是因为:**成员内部类必须先实例化外部类对象再实例化成员内部类**
- 通俗点说就是,静态属性和方法必须在内存中优先加载,但是普通内部类会在外部类对象创建前不加载,内部类未加载却想先把他里面的静态成员完成存储到内存这是不可能的,前后顺序冲突,类似于没有鸡先有蛋
- 普通内部类必须先new外部类对象然后才加载,但是如果这时内部类里有static成员,那就以为着可以直接`内部类名.静态成员`调用它,但是还没new外部对象,内部类就没加载,没加载自然也拿不到其中的静态成员,冲突了

> 非static的内部类，在外部类加载的时候，并不会加载它，所以它里面不能有静态变量或者静态方法。
> 1、static类型的属性和方法，在类加载的时候就会存在于内存中。
> 2、要使用某个类的static属性或者方法，那么这个类必须要加载到jvm中。
> 基于以上两点，可以看出，如果一个非static的内部类如果具有static的属性或者方法，那么就会出现一种情况：内部类未加载，但是却试图在内存中创建static的属性和方法，这当然是错误的。原因：类还不存在，但却希望操作它的属性和方法。
>
>  
>
> java很多想这类不能共同存在的 一般都与他们的生命周期有关。。。
> 比如 静态成员和静态方法是随着类的加载而存在的，也就是说内部类的静态属性是随着类的加载的，但是内部类的实例 是创建后才存在的，也就是说其静态属性优先存在于他的类实例的存在 这显然是矛盾的，所以要把内部类设为静态的 这样他们的生命周期就是相同了；
>
>  
>
> 如果内部类没有static的话，就需要实例化内部类才能调用，说明非static的内部类不是自动跟随主类加载的，而是被实例化的时候才会加载。
> 而static的语义，就是主类能直接通过内部类名来访问内部类中的static方法，而非static的内部类又是不会自动加载的，所以这时候内部类也要static，否则会前后冲突。

```java
public class Parcel11 {
    private static class ParcelContents implements Contents {
        private int i = 11;
        @Override
        public int value() { return i; }
    }
    protected static final class ParcelDestination
            implements Destination {
        private String label;
        private ParcelDestination(String whereTo) {
            label = whereTo;
        }
        @Override
        public String readLabel() { return label; }
        // Nested classes can contain other static elements:
        //嵌套类可以包含其他静态元素
        public static void f() {}
        static int x = 10;
        static class AnotherLevel {
            public static void f() {}
            static int x = 10;
        }
    }
    public static Destination destination(String s) {
        return new ParcelDestination(s);
    }
    public static Contents contents() {
        return new ParcelContents();
    }
    public static void main(String[] args) {
        Contents c = contents();
        Destination d = destination("Tasmania");
    }
}
```

- 外部类Parcel11在main方法中不是必须的,使用静态成员的语法来调用了那些方法

#### 接口内部的类

- **嵌套类可以作为接口的一部分**
- 任何**接口中的类**都**自动**是**public和static**
- 由于嵌套类是static的,所以只是把嵌套类置于接口的命名空间内,这不违反接口规则,**甚至可以在接口的嵌套类中实现本身的这个接口**
- 如果想让实现了某个接口的类可以使用相同的一段公共代码,就可以使用接口内部的嵌套类
- 在main方法中测试类,必须带着已编译过得额外代码,如果你不想这样.可以用嵌套类放测试代码,会产生**TestBed$Tester(外部类$嵌套测试类)**文件,可以在打包前删除

#### 从多层嵌套类中访问外部类的成员

- 内部类被嵌套多少层都不重要,它可以透明访问所有它嵌入的外部类的成员

  ```java
  class MNA {
      private void f() {}
      class A {
          private void g() {}
          public class B {
              void h() {
                  g();
                  f();
              }
          }
      }
  }
  public class MultiNestingAccess {
      public static void main(String[] args) {
          MNA mna = new MNA();
          MNA.A mnaa = mna.new A();
          MNA.A.B mnaab = mnaa.new B();
          mnaab.h();
      }
  }
  ```

- 可以看到在 **MNA.A.B** 中，调用方法 `g()` 和 `f()` 不需要任何条件（即使它们被定义为 **private**）。

### 为什么需要内部类

- 前边说到的内部类的所有特性,都不能回答"为什么需要内部类"的问题
- 如果只是**需要一个对接口的引用**,为什么不**通过外部类实现那个接口**呢?如果这样**能满足需求那就应该这么做**
- 内部类实现一个接口与外部类实现这个接口有什么**区别**??
- 后者不是总能享用到接口带来的方便,有时需要用到接口的实现
- 所以**使用内部类最吸引人的原因**是:每个内部类都能独立地继承自一个（接口的）实现，所以无论外部类是否已经继承了某个（接口的）实现，对于内部类都没有影响。
- 对于**多重继承**来说,**接口解决了部分问题**,而**内部类**有效的实现了多重继承,也就是内部类允许继承多个非接口类型(类或抽象类)

> 所谓的`内部类允许继承多个非接口类型`不是指一个内部类可以extends好几个父类,而是一个类中的不同内部类可以各自extends不同的父类
>
> 
>
> 普通的类只能继承一个父类,这就是`单个继承`,`多重继承`在Java中是不允许的,于是出现了接口,一个类可以扩展多个接口,但是还不是完美的解决多重继承,现在一个类可以有很多的内部类,每个内部类可以继承不同的父类,父类可以是普通类可以是抽象类,然后各个内部类使用父类的功能造就属于这个类的功能,这就是另一种多重继承

- 如果需要在**一个类中实现两个接口**,可以有两种方案
  - 使用单一类,扩展两个接口
  - 使用内部类,扩展一个接口,再创造另一个接口的匿名内部类
- 如果不是实现两个接口,而是**继承两个具体的类**(也可以是抽象类),那就只能使用内部类才能实现多重继承
  - 新类继承一个类,再写一个匿名内部类返回第二个类

- 如果不存在`多重继承`问题,就不需要使用内部类,但是使用内部类**还可以获得其他特性**
  - 内部类可以有多个实例，每个实例都有自己的状态信息，并且与其外部类对象的信息相互独立。
  - 在单个外部类中，可以让多个内部类以不同的方式实现同一个接口，或继承同一个类。 稍后就会展示一个这样的例子。
  - 创建内部类对象的时刻并不依赖于外部类对象的创建
  - 内部类并没有令人迷惑的”is-a”关系，它就是一个独立的实体。

#### 闭包与回调

- 闭包是一个可调用的对象,它记录了一些信息,这些信息来自于创建它的作用域
- 由此可得,**内部类就是面向对象的闭包**,不仅包含外部类对象的信息,还自动拥有一个指向此外部类对象的引用,此作用域内,内部类有权操作所有成员,包括private
- **Java8前**,内部类是实现闭包的唯一方式
- **Java8后**,可以**使用lambda**来实现闭包,语法更加简洁优雅
- 但是Java8之前通过内部类实现闭包的代码我们需要能看懂

```java
interface Incrementable {
    void increment();
}
// Very simple to just implement the interface:
//外部类直接实现接口
class Callee1 implements Incrementable {
    private int i = 0;
    @Override
    public void increment() {
        i++;
        System.out.println(i);
    }
}
class MyIncrement {
    //MyIncrement类作为Callee2的父类,有自己的increment()方法,而且和Callee2希望继承的Incrementable接口中的increment()方法毫不相关,如果Callee2先继承了MyIncrement作为父类,然后又要实现Incrementable接口这就很麻烦,所以就需要Callee2的内部类实现Incrementable接口完成两全其美
    public void increment() {
        System.out.println("Other operation");
    }
    static void f(MyIncrement mi) { mi.increment(); }
}
// If your class must implement increment() in
// some other way, you must use an inner class:
//如果类必须以其他方式实现increment()，则必须使用内部类
//内部类实现此接口
class Callee2 extends MyIncrement {
    private int i = 0;
    @Override
    public void increment() {
        super.increment();
        i++;
        System.out.println(i);
    }
    private class Closure implements Incrementable {
        @Override
        public void increment() {
            // Specify outer-class method, otherwise
            // you'll get an infinite recursion:
            //指定外部类方法，否则将得到无限递归:
            //提供一个返回 Callee2 的“钩子”（hook）-而且是一个安全的钩子。无论谁获得此 Incrementable 的引用，都只能调用 increment()，除此之外没有其他功能
            Callee2.this.increment();
        }
    }
    Incrementable getCallbackReference() {
        return new Closure();
    }
}
class Caller {
    private Incrementable callbackReference;
    Caller(Incrementable cbh) {
        callbackReference = cbh;
    }
    void go() { callbackReference.increment(); }
}
public class Callbacks {
    public static void main(String[] args) {
        Callee1 c1 = new Callee1();
        Callee2 c2 = new Callee2();
        MyIncrement.f(c2);
        Caller caller1 = new Caller(c1);
        Caller caller2 =
                new Caller(c2.getCallbackReference());
        caller1.go();
        caller1.go();
        caller2.go();
        caller2.go();
        //输出
        Other operation
        1
        1
        2
        Other operation
        2
        Other operation
        3
    }
}
```

- 这个例子展示了**类直接实现接口**和**类的内部类实现接口**的区别
- 前者从代码来说更简单
- 当类因为一些情况,比如拥有和接口相同方法名的方法而导致无法正常扩展需要的接口的时候,内部类实现接口完成所需功能代码就显得很必要了,因为之前的类代码不可以修改,不然会牵扯到别处调用该类的代码,所以这样内部类扩展好处很多,不用修改外部类的接口方法(就是那个类和接口中都有的重名方法),也不用修改外部类的接口

- 在`Callee2`中除了`getCallbackReference()`方法其它成员都是private,要想和外部世界联系,接口 **Incrementable**是必须的
- 内部类`Closure`实现了`Incrementable`接口,提供了一个返回`Callee2`的钩子(hook),也就是 `Callee2.this.increment();`,而且是安全的钩子,无论谁获得此`Incrementable`的引用,都只能调用`increment()`方法,除此外没有其它功能
- `Caller`的构造器需要一个 `Incrementable` 的引用作为参数（虽然可以在任意时刻捕获回调引用），然后在以后的某个时刻，`Caller` 对象可以使用此引用回调 `Callee` 类。
- **其实这里我只理解了闭包但是没理解回调**

#### 内部类与控制框架

- 应用程序框架是被设计**解决某类特定问题**的一个或一组类.
- 要运用某个应用程序框架通常是继承一个或多个类,并**重写某些方法**
- 重写方法代码里定制该应用程序框架提供的通用解决方法来解决问题
- 这是**设计模式中`模板方法`**的例子,模板方法包含算法的基本结构,调用一个或多个可重写的方法完成该算法的运算
- **设计模式总是把`变化的事物`和`保持不变的事务`分离**,这个模式中模板方法是保持不变的事物,可重写方法是变化事物

> 可以理解为模板方法就是一套武功,第一招打头,第二招打胳膊,第三招打肚子都分别规划好,大框架不变,然后可重写方法就是每一招打人的具体动作,你可以直拳,摆拳,回旋踢,反正只要能按部就班的完成重写方法该完成的效果,具体怎么完成的可以随便你写代码定制.
>
> 武功框架不变,具体单一动作变化

- 控制框架是一类特殊的应用程序框架,解决响应事件,主要用来响应事件的系统称作`事件驱动系统`,比如GUI就几乎完全是事件驱动的系统

> 类似前端的JS很多操作也是事件驱动,比如点击,双击,拖动这种操作

---

- 接下来有一个框架例子,在事件"就绪`ready()`"时执行事件.本例中基于时间触发事件,不包含具体控制信息,只通过继承提供(指的是重写action()方法)
- 使用抽象类代替接口,因为默认行为都根据时间控制,所以包含了一些具体实现

```java
import java.time.*; // Java 8 time classes
public abstract class Event {
    private Instant eventTime;
    protected final Duration delayTime;
    public Event(long millisecondDelay) {
        delayTime = Duration.ofMillis(millisecondDelay);//根据秒单位转化为Duration格式的时间
        start();
    }
    public void start() { // Allows restarting 允许重新启动
        //获得当前时间再加上延迟时间
        eventTime = Instant.now().plus(delayTime);
    }
    public boolean ready() {
        //获得当前时间并且判断是否在触发事件时间点后
        return Instant.now().isAfter(eventTime);
    }
    public abstract void action();
}
/*
 * Instant 的操作
    加减：`plus()`, `minus()`；
    相互比较：`isAfter()`, `isBefore()`；
    获得时间差：`until()`。
 */
```

- 运行Event并随后调用start(),构造器就会捕获从对象创建时刻开始的时间:`start()获取当前时间,加上延迟时间就生成触发事件的时间`.
- start()是独立方法,没有包含在构造器内,这样就可以在事件运行后重启计时器,也就是可以复用Event对象
- 如果想重复一个事件,只需在action()中调用start()方法
- ready()决定何时可运行action()方法,也可以在子类重写ready()方法,使Event能基于时间以外的其他因素触发

```java
public class Controller {
    // A class from java.util to hold Event objects:
    //Event对象保存在List中
    private List<Event> eventList = new ArrayList<>();
    public void addEvent(Event c) { eventList.add(c); }
    public void run() {
        while(eventList.size() > 0)
            // Make a copy so you're not modifying the list
            // while you're selecting the elements in it:
            //复制一份，这样你在选择列表中的元素时就不会修改列表:
            //这里是重点,终于明白这里的写法了,是复制了一份新的ArrayList
            for(Event e : new ArrayList<>(eventList))
                if(e.ready()) {
                    System.out.println(e);
                    e.action();
                    eventList.remove(e);
                }
    }
}
```

- run方法遍历时间列表,寻找就绪的需要运行的Event对象,找到就绪的之后打印字符串信息,调用其重写的aciton()方法,然后从复制的列表中移除此时间
- 目前的设计你不知道Event到底做了什么,这就是变化的部分,不同的Event对象所具有的的不同行为,你通过创建不同的Event子类表现不同的行为

- 这正是内部类要做的
  - 控制框架是由单个类创建,实现细节被封装.内部类用来表示解决问题所需的各种不同的aciton()
  - 内部类很容易访问外部类任意成员,如果没有这种能力,代码会很让人难受,导致你不想选择内部类解决问题

```java
public class GreenhouseControls extends Controller {
    //这里的具体事件属性都是属于外部类的私有变量
    //每个事件都是继承了Event类的子类
    private boolean light = false;
    public class LightOn extends Event {
        public LightOn(long delayTime) {
            super(delayTime); 
        }
        @Override
        public void action() {
            // Put hardware control code here to
            // physically turn on the light.
            light = true;
        }
        @Override
        public String toString() {
            return "Light is on";
        }
    }
    public class LightOff extends Event {
        public LightOff(long delayTime) {
            super(delayTime);
        }
        @Override
        public void action() {
            // Put hardware control code here to
            // physically turn off the light.
            light = false;
        }
        @Override
        public String toString() {
            return "Light is off";
        }
    }
    private boolean water = false;
    public class WaterOn extends Event {
        public WaterOn(long delayTime) {
            super(delayTime);
        }
        @Override
        public void action() {
            // Put hardware control code here.
            water = true;
        }
        @Override
        public String toString() {
            return "Greenhouse water is on";
        }
    }
    public class WaterOff extends Event {
        public WaterOff(long delayTime) {
            super(delayTime);
        }
        @Override
        public void action() {
            // Put hardware control code here.
            water = false;
        }
        @Override
        public String toString() {
            return "Greenhouse water is off";
        }
    }
    private String thermostat = "Day";
    public class ThermostatNight extends Event {
        public ThermostatNight(long delayTime) {
            super(delayTime);
        }
        @Override
        public void action() {
            // Put hardware control code here.
            thermostat = "Night";
        }
        @Override
        public String toString() {
            return "Thermostat on night setting";
        }
    }
    public class ThermostatDay extends Event {
        public ThermostatDay(long delayTime) {
            super(delayTime);
        }
        @Override
        public void action() {
            // Put hardware control code here.
            thermostat = "Day";
        }
        @Override
        public String toString() {
            return "Thermostat on day setting";
        }
    }
    // An example of an action() that inserts a
    // new one of itself into the event list:
    //一个action()的例子，它将自己的一个新对象插入到事件列表中
    //这个类比较特殊
    public class Bell extends Event {
        public Bell(long delayTime) {
            super(delayTime);
        }
        @Override
        public void action() {
            //在aciton中的动作是新建自己的事件对象携带当时时间加入到事件列表中,这里的addEvent是外部类父类的方法
            addEvent(new Bell(delayTime.toMillis()));
        }
        @Override
        public String toString() {
            return "Bing!";
        }
    }
    //一个由 Event 对象组成的数组被递交给 Restart，该数组要加到控制器上。由于 Restart() 也是一个 Event 对象，所以同样可以将 Restart 对象添加到 Restart.action() 中，以使系统能够有规律地重新启动自己。
    public class Restart extends Event {
        private Event[] eventList;
        public
        Restart(long delayTime, Event[] eventList) {
            super(delayTime);
            this.eventList = eventList;
            for(Event e : eventList)
                addEvent(e);
        }
        @Override
        public void action() {
            for(Event e : eventList) {
                e.start(); // Rerun each event重新运行每个事件
                addEvent(e);
            }
            start(); // Rerun this Event重新运行这个事件
            addEvent(this);
        }
        @Override
        public String toString() {
            return "Restarting system";
        }
    }
    public static class Terminate extends Event {
        public Terminate(long delayTime) {
            super(delayTime);
        }
        @Override
        public void action() { System.exit(0); }
        @Override
        public String toString() {
            return "Terminating";
        }
    }
}
```

- 这里会发现内部类实现继承就很像多重继承,内部类拥有自己父类和外部类以及外部父类的所有方法

- 创建一个GerrnhouseControls对象,并添加不同的Event对象配置该系统,这是`命令模式`的例子

  ```java
  public class GreenhouseController {
      public static void main(String[] args) {
          GreenhouseControls gc = new GreenhouseControls();
          // Instead of using code, you could parse
          // configuration information from a text file:
          //您可以从文本文件解析配置信息，而不是使用代码
          //我在使用DEBUG查看的时候发现和我想的一样
          //Bell对象的action方法会添加一个新的Bell事件进入事件列表,我就在想这样不是会无限套娃吗,运行Bell又添加Bell无穷尽
          //之后的所有事件都正常运行,run方法中的复制列表也会在运行完事件后删除复制列表中事件
          //直到Restart事件,一下子把复制列表恢复成初始长度,因为携带了原始eventList进去
          //直到Terminate事件,该事件的action方法中的System.out退出了方法
          gc.addEvent(gc.new Bell(900));
          Event[] eventList = {
              gc.new ThermostatNight(0),
              gc.new LightOn(200),
              gc.new LightOff(400),
              gc.new WaterOn(600),
              gc.new WaterOff(800),
              gc.new ThermostatDay(1400)
          };
          gc.addEvent(gc.new Restart(2000, eventList));
          gc.addEvent(
              new GreenhouseControls.Terminate(5000));
          gc.run();
      }
  }
  ```

  

### 继承内部类

- 内部类的构造器必须连接到其外部类对象的引用,所以**继承内部类为父类**的时候,**指向外部类对象的神秘引用必须被初始化**,在子类中也不再存在可连接的默认对象

> 意思就是在内部类的子类中需要手动初始化内部类中外部类对象的引用,不然无法再内部类的子类中使用外部类的东西

- ```java
  class WithInner {
      class Inner {}
  }
  public class InheritInner extends WithInner.Inner {
      //- InheritInner() {} // Won't compile无法编译,不能直接使用无参构造,因为这是内部类的子类
      //需要传入外部类对象,在自己的构造函数中调用外部类的无参构造,这样才能一路传递外部类的引用到最深层子类
      InheritInner(WithInner wi) {
          wi.super();
      }
      public static void main(String[] args) {
          WithInner wi = new WithInner();
          InheritInner ii = new InheritInner(wi);
      }
  }
  ```

- 必须使用`外部类.super()`的语法在继承了内部类为父类的类的构造器中

### 内部类可以被重写吗

- 如果一个类有内部类,这时有一个类继承这个外部类,重新在新类里定义那个内部类,只会等于新类自己拥有了一个内部类,和之前那个外部类的内部类并没有什么关联,哪怕它们重名

- 当然也可以在继承了外部类的类中的内部类主动继承外部类中的内部类

  ```java
  class Egg2 {
      protected class Yolk {
          public Yolk() {
              System.out.println("Egg2.Yolk()");//[1][3]
          }
          public void f() {
              System.out.println("Egg2.Yolk.f()");
          }
      }
      private Yolk y = new Yolk();
      Egg2() { System.out.println("New Egg2()");//[2] }
      public void insertYolk(Yolk yy) { y = yy; }
      public void g() { y.f(); }
  }
  public class BigEgg2 extends Egg2 {
      public class Yolk extends Egg2.Yolk {
          public Yolk() {
              System.out.println("BigEgg2.Yolk()");//[4]
          }
          @Override
          public void f() {
              System.out.println("BigEgg2.Yolk.f()");//[5]
          }
      }
      public BigEgg2() { insertYolk(new Yolk()); }
      public static void main(String[] args) {
          Egg2 e2 = new BigEgg2();
          e2.g();
          //输出
          //首先是new BigEgg2(),自然就进入BigEgg2的构造函数,构造函数里调用了insertYolk(new Yolk())方法
          //但是优先是去new了Yolk对象才可以进入insertYolk方法
          //而BigEgg2的Yolk对象是Egg2对象中的Yolk对象的子类,所以先要去找Egg2对象中的Yolk对象
          //内部类的创建依赖于外部类,所以先要创建外部类,也就是Egg2
          //Egg2的初始化首先加载静态成员变量private Yolk y = new Yolk();,也就需要调用Egg2自身的内部类Yolk的构造函数
          //打印Egg2.Yolk()
          Egg2.Yolk()
  		//调用完Yolk的构造函数,就继续Egg2的加载,调用Egg2的构造函数
          //打印New Egg2()
          //Egg2构建完成
          New Egg2()
          //构建完Egg2对象,就要开始执行BigEgg2的构造函数了,调用了父类方法insertYolk,其中的参数是new Yolk
          //Yolk是继承自Egg2中的Yolk,所以如果想new子类Yolk就需要先去加载父类Yolk
          //所以就调用父类Yolk的构造函数
          //打印Egg2.Yolk()
          Egg2.Yolk()
          //调用完父类Yolk的构造函数,就该调用子类构造函数了
          //打印BigEgg2.Yolk()
          BigEgg2.Yolk()
          //子类Yolk构造函数调用完毕,参数准备好了,就可以进入父类方法insertYolk中
          //在方法中把子类BigEgg2的引用传递给父类中的y
          //这时Egg2 e2 = new BigEgg2()就完成了
          //进行e2.g()的调用,这里的e2看似是Egg2类型,其实是向上转型后的BigEgg2
          //本身应该是调用子类中的g方法,但是子类没有g方法,不过不要紧,刚才创建子类对象的过程中调用了父类方法insertYolk把子类对象引用赋给了父类中的y变量
          //所以直接调用父类中的g方法,父类的g方法使用父类的y变量调用f方法,这里的y变量是子类变量,由于多态的特性,调用了子类重写的f方法
          //打印BigEgg2.Yolk.f()
          BigEgg2.Yolk.f()
      }
  }
  ```

  

### 局部内部类

- 可以在代码块里创建内部类,最典型的是在方法体里面创建
- 局部内部类不能有访问说明符,因为它不是外部类的一部分,但是可以访问当前代码块内的常量,以及外部类所有成员
- 局部内部类名字是不可见得,那为什么还要选择局部内部类而不是匿名内部类

> 反正在我看来这两个的效果很接近

- 一个理由是我们需要一个有名字的构造器,或者要重载构造器,匿名内部类只能用实例初始化来完成构造器的功能
- 另一个理由是需要不止一个该内部类的对象

> 我怎么感觉匿名内部类也可以拿到不止一个的对象

### 内部类标识符

- 编译之后每个类都会产生一个.class文件
- 内部类也必须生成自己的.class文件,命名有严格规则:外部类名字+$+内部类名字
- 比如

> 1. `Counter.class`
> 2. `LocalInnerClass$1.class`
> 3. `LocalInnerClass$1LocalCounter.class`
> 4. `LocalInnerClass.class`

- 如果是匿名内部类就简单产生一个数字作为标识符,如果内部类是内部类的内部类就在他们外层的内部类后边加$+自己的名字

## 第十二章:集合

- 程序总是根据运行时才知道的某些条件创建新的对象,在此之前无法知道所需对象的数量甚至类型
- Java有多重保存对象(引用)的方式,如果保存一组基本类型,推荐数组,但是数组大小固定,一般情况下写程序时不知道将需要多少对象,数组的固定尺寸太过限制
- Java于是提供了集合类解决这个问题,其中基本类型有**List,Set,Queue和Map**
- 集合可以自动调整自己的大小,所以可以把任意数量的对象放在集合中不用担心

### 泛型和类型安全的集合

- Java5之前的编译器允许你向集合中插入不正确的类型
- 现如今泛型规定必须在创建集合时使用菱形语法标注好类型
- 最开始要求在等号左右两端,但这样代码复杂难以阅读,后来发现所有类型都可以从左侧获得,所以Java改进为只在等号左侧标注泛型类型
- 当指定类型为泛型参数,不仅限于将确切类型对象放入集合,在这里**向上转型**也可以**生效于泛型**

> 意思就是父类泛型的集合也可以塞子类对象进去,类似
>
> ```java
>     ArrayList<Father> father = new ArrayList<>();
>     father.add(new Son());
> ```

### 基本概念

- Java集合类库分为**两个**概念,也表示**类库的基本接口**

  - **集合(Collection)**:一个独立元素的序列,这些元素都服从一条或多条原则,List必须按插入顺序保存元素,Set不能重复包含元素,Queue按排队规则确定对象产生顺序
  - **映射(Map)**:一组键值对对象,允许用键查找值,ArrayList用数字查找对象,所以它是把数字和对象关联在一起.map允许使用一个对象查找另一个对象,也被称作关联数组,或者称作字典

  > 我老是把Map想成地图,感觉地图的说法倒是很像字典,但实际上肯定不是这个意思,映射才是对的,比如Stream里就有map操作,也就是映射操作的意思

- 写代码时大部分时候是在和这些集合接口打交道,只在创建时需要指定精确类型

> 可不是么,CRUD一天天的老往人家List和Map里赛数据呢

- 创建集合时**推荐向上转型创建**,等号左边的集合类型直接写父类接口类型,这样当需要改变具体实现时,只需要在创建时修改它即可

- ```java
  List<Apple> apples = new ArrayList<>();
  List<Apple> apples = new LinkedList<>();
  ```

- 这方法也**并非万能**,如果你需要子类中独有的方法,那就不能这样使用,因为父类接口中不包含这些方法,无法调用

- 但是父类的方法肯定是所有子类都能用的,必须考虑到所有子类,add方法就是如此,为了照顾到Set不能包含重复元素,Collection的add方法在文档中写到“要确保这个 **Collection** 包含指定的元素。”

### 添加元素组

- Arrays和Collections类中有很多实用方法,可以在一个Collection中**添加一组元素**

  - `Arrays.asList()` 方法接受一个数组或是逗号分隔的元素列表（使用可变参数），并将其转换为 **List** 对象。

  - `Collections.addAll()` 方法接受一个 **Collection** 对象，以及一个数组或是一个逗号分隔的列表，将其中元素添加到 **Collection** 中。

    > 数组自然就是` Integer[] moreInts = { 6, 7, 8, 9, 10 };`这样的数组
    >
    > 至于逗号分隔的元素列表就是指`Arrays.asList(1, 2, 3, 4, 5)`这样的填入不定数量的同类型元素

    

- 所有 **Collection** 类型都包含`addAll()` 方法

- **Collection** 的构造器可以接受另一个 **Collection**，用它来将自身初始化。因此，可以使用 `Arrays.asList()` 来为这个构造器产生输入。`Collection<Integer> collection = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));`

- 但是， `Collections.addAll()` 运行得**更快**，而且很容易构建一个不包含元素的 **Collection** ，然后调用 `Collections.addAll()` ，因此这是**首选方式**。

> 按我的理解嘛所谓的首选方式就是,因为他说可以很容易构建一个不包含元素的 Collection,那只能赋值为null,collection不初始化是不可以调用Collections.addAll方法的
>
> `Collection<Integer> collection = null;`
>
> `Collections.addAll(collection, 11, 12, 13, 14, 15);`

- `Collection.addAll()` 方法只能接受另一个 **Collection** 作为参数(也就是往一个Collection里塞一个Collection)，因此它没有 `Arrays.asList()` 或 `Collections.addAll()` 灵活。这两个方法都使用可变参数列表。
- `Arrays.asList()` 的输出作为一个 **List** ,但这个方法底层是数组实现,一旦生成了List就无法改变List的长度,调用add或move都会“Unsupported Operation（不支持的操作）”
- `List<Snow> snow4 = Arrays.<Snow>asList(new Light(), new Heavy(), new Slush());`注意 `Arrays.asList()` 中间的“暗示”（即 `<Snow>` ），告诉编译器 `Arrays.asList()` 生成的结果 **List** 类型的实际目标类型是什么。这称为**显式类型参数说明**（explicit type argument specification）。

### 列表List

- 有两种类型的List
  - 基本的**ArrayList**,擅长随机访问,但是在中间插入删除元素速度较慢.
  - **LinkedList**,随机访问相对较慢,插入删除更快

---

- **indexof()**方法可以找到对象再List中所处位置的**下标号**,传入对象引用即可,如果没有找到返回-1
- 确定元素是否属于某个List时,寻找元素索引时,以及通过引用从List中删除元素时都会调用**equals()**方法
- 因为Java中对象的特征是引用值,所以对于大部分普通对象,即使是同一个类new出来的两个对象,也会被equals识别为false,indexof()也只会返回-1,但是有一些**例外**,比如String,如果值完全相等的两个String对象,equals()会认为这两个对象相等

- 对LinkedList来说,插入删除都是很快的,但是ArrayList中这就是很慢的,但这不意味着就不该在ArrayList中插入删除元素,或者替换为LinkedList再插入删除,你应该随着插入删除操作变多发现程序变慢然后自己去找到问题并且优化

> 优化是一个很棘手的问题，最好的策略就是置之不顾，直到发现必须要去担心它了

---

- subList()方法是从List中切割出一部分组成新的List,参数是两个索引,**范围取`左闭右开`**,也就是如果是subList(1,4),就会提取List下标为1,2,3的元素组成新List.
- 该方法的**底层是原始列表**,所以对返回列表的更改会反应在原始列表中,反之亦然

> 这句的意思就是说,你从一个5个元素的List切出3个来,得到的新列表其实就等于把原始的列表的一部分漏出来看,并没有真的创建一个新的3元素列表,所以一旦修改了这新列表中的元素,那5个元素的原始列表也会随之发生改变

---

- **retainAll()**方法的效果是**取集合交集**,调用该方法的集合和参数集合的交集元素会组成新集合,新集合的值会给到调用该方法的集合上,是否相交**依赖于equals方法**
- **removeAll()**方法效果是**删除该集合中另一集合中包含的所有元素**,也是一个集合调用该方法,参数为需要删除的那个集合,**基于equals方法**

---

- 不是只能使用**Collection** 的 `addAll()` 方法把某个集合添加到另一个的末尾,使用List重载的addAll()方法可以**把新列表插入到原始列表中的任何位置**,第一个参数为下标,第二个参数为要插入的新列表

### 迭代器Iterators

