# Java核心技术卷一--笔记

## 对象与类

### 面向对象概述

#### 类

- 在扩展一个已有的类时,这个扩展后的新类拥有所扩展的类的全部属性和方法,新类中只需要提供适用于新类的新方法和数据域(数据,类似name,ID)即可.这个过程就是继承.
- 所有类都源于一个超类,既Object类.

#### 对象

- 对象状态(数据)的改变必须通过调用方法实现,如果不经过方法调用就可以改变对象状态,只能说明封装性遭到了破坏.(这就是为什么创建的实体类的属性都是private修饰的原因吧).

##### 类之间的关系

- 依赖(uses-a)
  - 比如订单类使用账户类是因为订单对象需要访问账户对象查看信用状态,但是商品类不依赖于账户类,因为商品对象和客户账户无关.因此如果一个类的方法操纵另一个类的对象,我们说一个类依赖于另一个类.
  - 应该将依赖减少至最少,这样类之间就不会互相影响,也就是解耦.
- 聚合(has-a)
  - 例如一个订单对象包含着一些商品对象.聚合关系意味着类A的对象包含类B的对象.
- 继承(inheritance,即is-a)
  - 如果类A扩展类B,A不但包含从B继承的方法,还有额外的功能.

### 使用预定义类

#### 对象与对象变量

- 要想使用对象就必须先构造对象,并指定其初始状态.然后,对对象应用方法.

- Java中,使用构造器(constructor)构造新实例.

- 构造器的名字应该与类名相同,比如Date类的构造器名为Date..想要构造一个Date对象,需要在构造器前加一个new操作符.

  ```java
  new Date();
  ```

- 一个对象变量并没有实际包含一个对象,而仅仅引用一个对象.

#### LocalDate类

- Date一般直接new出来就可以表示当前时间.
- 但是如果想得到具体的时间在日历中的数据就要使用这个类.
- 静态工厂方法代表调用该类构造器.不要去使用构造器构造对象(也就是new).直接LocalDate.方法名即可.

#### 更改器方法和访问器方法

- 假如现在有个日期变量time.

- 使用LocalDate类的plusDays方法之后,time的值不会变.这就是**访问器方法**,没有改变调用这个方法的对象.

- ```java
  time;//当前时间
  LocalDate newTime = time.plusDays(1000);//但是值可以赋给其他变量.
  ```

- 另外举个例子,Java较早版本里有一个GregorianCalendar来处理日历.

- ```java
  GregorianCalendar time = new GregorianCalendar(2020,3,1);
  time.add(Calendar.DAY_OF_MONTH,1000);
  ```

- 这样处理之后time的值就会变动,这就是更改器方法.

### 用户自定义类

#### 隐式参数与显式参数

- 举例

- ```java
  publick void raiseSalary(double byPercent){
  	double raise = salary * byPercent/100;
      salary += raise;
  }
  
  Jack.raiseSalary(3);
  ```

- `raiseSalary`方法有两个参数,第一个成为隐式参数,是出现在方法名前的员工类对象,第二个参数位于方法名后面括号中的数值,这是一个显式参数.

- 在方法中,关键字this表示隐式参数,如果需要可以用下列方法编写raiseSalary方法(实际上最好一直这样写).

- ```java
  publick void raiseSalary(double byPercent){
  	double raise = this.salary * byPercent/100;
      salary += raise;
  }
  ```

#### 封装的优点

- 有些时候需要获得或设置实例域(属性)的值,因此应该提供下面三项内容.
  - 一个私有的数据域
  - 一个共有的域访问器方法
  - 一个共有的域更改器方法

#### final实例域(属性)

- 构建对象时**必须初始化**这样的域.

- 并且在后面的操作中不能够再对它进行修改.

- > 例如如果name是final修饰,就不会有setName方法.

### 静态域与静态方法

#### 静态域

- 它属于类,不属于任何独立的对象
- 由`static`修饰

#### 静态常量

- 比如π就是Math类的一个静态常量

  ```java
  public static final double PI = 3.1415926....
  ```

- 最好不要把域(属性)设计成public,但是共有常量(final修饰)除外.

#### 静态方法

- 是一种不能向对象实施操作的方法.
- 换句话说,没有隐式参数(this).
- 自身类中的静态方法不能访问自身的实例域,但是可以访问静态域.
- 有两种情况下使用静态方法:
  - 一个方法不需要访问对象状态,其所需参数都是通过显式参数提供.
  - 一个方法只需要访问类的静态域.

#### 工厂方法

- 静态方法还有一种常见用途,即工厂方法.

  ```java
  NumberFormat.currencyFormatter = NumberFormat.getCurrencyInstance();
  NumberFormat.percentFormatter = NumberFormat.getpercentInstance();
  double x = 0.1;
  System.out.println(currencyFormatter.format(x));//结果是$0.10
  System.out.println(percentFormatter.format(x));//结果是10%
  ```

- 为什么不用构造器(new)完成这些操作?

  - 无法命名构造器,构造器名字必须和类名相同,但这里希望得到的货币和百分比采用不同的名字
  - 当你使用构造器,无法改变所构造的对象类型.Factory方法将返回一个`DecimalFormat`类对象,是`NumberFormat`的子类.

#### main方法

- main方法不对任何对象进行操作,事实上,在启动程序时还没有任何一个对象,静态的main方法将执行并创建所需要的对象.

### 方法参数

- Java程序设计语言总是采用`按值调用`.也就是说,方法得到的是所有参数值的一个拷贝,特别是方法不能修改传递给他的任何参数变量的内容.
- 总结一下Java中方法参数的使用情况
  - 一个方法不能修改一个基本数据类型的参数(int或布尔).
  - 一个方法可以改变一个对象参数的状态.
  - 一个方法不能让对象参数引用一个新的对象.

### 对象构造

#### 重载

- 一个方法有相同的名字,不同的参数就产生了重载.
- 说白了就是同一个方法的形参要求不同,就会进入不同的同名方法中去执行.

#### 默认域初始化

- 如果没有在构造器中给域赋初始值,会自动赋为默认值,数值为0,布尔为false,对象引用为null.当然这样是不好的.

#### 无参数的构造器

- 如果一个类里没有编写构造器,默认会提供一个无参构造器,这个构造器负责把所有实例域设置为默认值.
- 如果类中至少提供了一个构造器,但是没有无参构造器,那么构造对象时没提供参数就是不合法的.
- **通俗一点就是无参构造之所以在平时写的实体类中存在,就是因为实体类都有自己的属性类似name,id.那么就需要接收这些属性,也就需要带参构造,那么就不会默认有一个无参构造,那么当不传递参数时就会报错.为了不报错,赋予不传参时所有属性默认值,所以需要无参构造.**

#### 显式域初始化

- 意思就是直接在一个Class开始时就赋给一个实例域初始状态,接下来这个类里用到这个实例的方法啊之类的时候这个实例域就都有默认值了.

#### 参数名

- 参数变量用同样的名字可以把实例域屏蔽起来.

- 也就是当传过来的形参你起名和当前类的实例域同名时,这个属性打出来就不代表类的实例域了,也就是不代表`this.xxx`了.

  ```java
  public Emloyee (String name,double salary){
  	this.name = name;//默认的name不再是this.name了
      this.salary = salary;
  }
  ```

#### 调用另一个构造器

- 在构造器的一次个语句写this(xxx)即可.

  ```java
  public Employee(double s){
  	this("Employee #" + nextId,s);//将调用Employee(string,double)构造器
  	nextId++;
  }
  ```

#### 初始化块

- 在一个类的生命中,可以包含多个代码块,只要构造类对象,这些块就会执行.
- 首先运行初始化块,然后才运行构造器主体部分.

## 继承

### 类,超类和子类

#### 定义子类

- 关键字extend表示正在构造的新类派生于一个已存在的类.
- 子类会自动继承父类的所有方法和属性.同时也可以写只属于自己的方法和属性.

#### 覆盖方法

- 就是写一个和父类中方法名相同的方法,但是要注意,子类会自动继承父类的所有属性,所以通用属性如果在这个覆盖的方法中需要用到,直接用方法名(隐式参数,也就是this.name这种)是拿不到的,因为在父类中一般这种属性会定义为`private`,这种属性是私有域.
- 所以就需要借助父类中得到这个属性的方法,比如叫`getName`.但是直接使用也是不行的,因为正在覆盖的这个方法也叫这个名字,会无限循环调用自己再调用父类方法.
- 这时就要使用`super`关键字来调用父类方法.

#### 子类构造器

- 构造器中也一样,不能直接调用父类私有域,要是用super关键字.

  ```java
  public Manager(String name,double salary,int year,int month,int day){
  	super(name,salary,year,month,day);
  	bonus = 0;
  }
  ```

- super调用构造器语句必须是子类构造器的第一句.

- 如果子类没有显示调用父类构造器,那就会自动调用父类无参构造器,如果超类没有无参构造,子类又没有显式调用父类的其他构造器,就会报错.

---

- 一个变量可以指示多种实际类型的现象称为**多态**.在运行时能自动选择调用哪个方法的现象称为**动态绑定**.

#### 多态

- 在Java中,对象变量是多态的,一个父类变量可以引用父类对象,也可以引用任何一个子类对象.
- 不可以将父类的引用赋值给子类变量.

#### 理解方法调用

1. **编译器查看对象声明类型和方法名**.察觉到你这个对象属于哪个类,就会去这个类找所有名字相同的那个方法,以及父类中为public且同名的方法.
2. 接下来编译器将**查看调用方法时提供的参数类型**.如果所有同名方法中有一个与提供的参数类型完全匹配,就选择这个方法,这个过程叫做**重载解析**.如果子类中有一个方法名和参数类型数量都和父类方法相同的方法,那就会覆盖父类中的方法.同时允许子类覆盖父类方法时,允许把返回类型定为原返回类型的子类型.
3. **如果是private,static,final方法或者构造器,编译器可以准确地知道应该调用哪个方法**.这种方法称为**静态绑定**.
4. 当程序运行,并且用动态绑定调用方法,虚拟机一定调用和当前对象的实际类型最适合的那个类的方法,

#### 阻止继承,final类和方法

- 有时候会希望阻止人们利用某个类定义子类.不允许扩展的类被称为final类.**通俗的说就是加上final关键字这个类就不能再有子类了**.
- 类中方法也可以用final修饰,这样的话子类就不能覆盖这个方法.final类的子类中所有方法自动称为final方法(只是方法,不包括域(属性)).

#### 强制类型转换

- 样式:Father father = (Father) child;
- 只能在继承层次内进行类型转换.
- 在将父类转换成子类钱,应该使用instanceof进行检查.
- **一般情况不推荐强转**.

#### 抽象类

- 如果有一个方法,在父类中根本不用执行,或者说不方便执行,但是所有的子类又需要这个方法,把它放在父类中最方便,这时候就应该使用抽象关键字`abstract`把这个方法在父类中描述为抽象方法.就可以不实现这个方法了.

- 只要有抽象方法的类必须是抽象类.但是除了抽象方法外,抽象类还可以有不抽象的属性和方法.

- 如果一个类是抽象的,就不能创建这个类的对象,但是可以创建一个具体子类的对象.

- 可以定义一个抽象类的对象变量,但是必须指向非抽象子类对象.

  ```java
  Person p = new Student("王小二");//p是抽象类对象,student是person抽象类的非抽象子类
  ```


#### 受保护访问(protected)

- 如果想要允许父类的方法被子类访问或是子类的方法访问父类的某个域,就要将这些方法或域声明为protected.
- 不过子类中的方法只能访问子类对象中的域.而不能访问其他父类对象的域.
- 一般来说**谨慎使用**,,因为可能会派生新子类,并访问这个保护域,破坏了封装.
- **Java中一共有4个访问修饰符**
  1. 仅对本类可见:private
  2. 对所有类可见:public
  3. 对本包和所有子类可见:protected
  4. 对本包可见:默认,不需要修饰符

### Object:所有类的超类

- 虽然Object可以引用任何类型的变量,但是想要对其中的内容进行具体操作需要清除对象的原始类型并且强转.
- Java里只有基础类型不是对象,比如int,boolean.
- 所有的数组类型都扩展了Obeject类.

#### equals方法

- Object类中的euqals方法用于检测一个对象是否等于另一个对象.在Object类中,这个方法检测两个对象是否有相同的引用.
- 一般在自己重写的equals方法中需要调用Objects.equals方法来解决实例域值为null的情况.如果都为null则返回true,只有一个为null返回false.
- 子类中定义equals方法时首先调用父类的equals,如果失败对象不可能相等.如果父类实例域都相等就比较子类实例域.

#### 相等测试与继承

- Java对equals有以下要求
  1. 自反性:对于任何非空引用x,`x.euqals(x)`应该返回true
  2. 对称性:对于任何引用x和y,当且仅当`y.equals(x)`返回true,`x.equals(y)`也应该返回true
  3. 传递性:对于任何引用x,y和z,如果`x.equals(y)`返回true,`y.equals(z)`返回true,`x.equals(z)`也应该返回true.
  4. 一致性:如果x和y引用的对象没有发生变化,反复引用`x.equals(y)`应该返回同样的结果.
  5. 对于任意非空引用x,`x.equals(null)`应该返回false.
- 如果子类有自己的相等概念(比如除了父类之外多出来自己独有的实例域),则对称性需求将强制采用getClass进行检测.
- 如果由父类决定相等的概念,那么就可以用instanceof检测,这样可以在不同子类的对象间进行相同的比较.

#### hashCode方法

- 散列码是由对象导出的一个整型值.
- `Objects.hashCode`方法是null安全的,如果参数为null则返回0.
- 所有基本类型可以使用比如`Double.hashCode`来避免创建对象
- 当然有最好的办法,就是使用`Objects.hash`方法,然后把所有实例域塞进去,这个方法会自动使用`Objects.hashCode`方法.
- Equals和hashCode的定义必须一致,如果x.equals(y)返回true,那么x.hashCode()和y.hashCode()必须相同.

#### toString方法

- 通常用来检测使用,一目了然的看到对象所有属性.
- 一般是类名开头,后面括号中包括所有属性的名字和值
- 最好是通过`getClass().getName()`获得类名字符串.
- 子类也要有自己的toString,如果超类中类名是通过`getClass().getName()`得到,子类只需要调用super.toString即可.
- 只要使用+号,对象会自动调用这个方法.包括直接System.out.println()打印对象也是在调用对象的这个方法.

### 泛型数组列表

- Java中普通数组Array必须指定大小才能创建,想要创建一个不用指定大小的数组就要使用ArrayList.

- ArrayList是一个使用参数类型的泛型类.

- 举例创建一个ArrayList

  ```java
  ArrayList<Employee> staff = new ArrayList<Employee>();
  ```

- 两边都写类型参数有点繁琐,所以JAVA7之后右边不用再写了.

  ```java
  ArrayList<Employee> staff = new ArrayList<>();
  ```

- 如果要添加数组元素,就需要使用add方法.如果add使用后数组内部空间用尽,就会复制这个数组并且创建一个更大的数组把数据放进去.

- 如果比较确定数组的长度,可以在添加元素前使用`ensureCapacity`方法,参数填长度.

- 当确认数组长度不会再变,就可以使用`trimToSize`方法把多余的储存空间回收.

#### 访问数组列表元素

- 很遗憾ArrayList不是Java语言的一部分,只是一个库中的标准类,所以无法像Array一样使用`[]`来操作.而是使用get和set.

### 对象包装器与自动装箱

- 所有的基本类型比如int,double,long都有对应的包装类.
- 泛型数组不允许泛型格式为int,这种情况就需要写为包装类Integer
- 自动装箱:在往一个Integer泛型的数组中添加数据时直接添加数字,这个数字会自动被处理为一个Integer类型的数据.
- 自动拆箱:把一个Interger对象赋给一个int值,会自动拆箱.
- 甚至算术表达式中都可以自动拆装箱.

### 参数数量可变的方法

- 使用...来量化参数

  ```java
  publick static doubel max(double... values){
  	double largest = Double.NEGATIVE_INFINITY;
  	for(double v: valuse){
  		if(v>largest){
  			largest = v;
  			return largest;
  		}
  	}
  }
  //调用这样
  max(3.15,6.98,5.79);
  ```

### 反射

- `getClass()`方法可以返回一个Class类型的实例.这个方法属于Object类.
- `getName()`方法可以返回类的名.
- 静态方法`forName()`可以通过调用活的类名对应的Class对象.`Class.forName('类名')`.如果类在包中,包名也作为类名一部分.
- 如果t是任意Java类型,t.class将代表匹配的类对象.

---

- 一个Class对象实际上表示的是一个类型,但是这个类型未必一定是一种类,比如int不是类,但是int.class是一个Class类型的对象.
- newInstance方法可以动态创建一个类的实例.`e.getClass().newInstance()`,这个方法调用默认构造器,,如果没有则抛出异常.
- 如果希望动态创建实例时传递参数,就要用Constructor类中的newInstance方法.

---

- `getField()`方法可以返回一个包含Field对象的数组,这些对象记录了这个类或其父类的共有域.
- `getDeclareField()`方法返回所有域.
- getMethod,getConstructors同理.一个代表方法一个代表构造方法.

---

- 反射受限于Java的访问控制.因为有私有域这种东西.所以需要使用Field,Method或者Contructor对象的`setAccessible()`方法,就可以有权限了.

### 继承的设计技巧

1. 把公共操作和域放在父类
2. 不要使用受保护的域
3. 使用继承实现is-a关系
4. 除非所有继承的方法都有意义,否则不要使用继承.
5. 在覆盖方法时,不要改变预期的行为.
6. 使用多态,而非类型信息.
7. 不要过多的使用反射.

## 接口,lambda表达式与内部类

- 接口主要用来描述类有什么功能,而不给出每个功能的具体实现,一个类可以实现一个或多个接口,并在需要接口的地方随时使用实现了相应接口的对象.

### 接口

#### 接口概念

- Java中,接口不是类,而是对类的一组需求描述,这些类要遵从接口描述的统一格式进行定义.
- Java5.0中,Comparale接口已经改进为泛型类型.
- **接口方法自动属于public.**所以接口里的方法不用
- 为了让类实现一个接口,通常需要两个步骤
  - 将类声明为实现给定的接口
  - 对接口中的所有方法进行定义

#### 接口的特性

- 接口不是类,不能用new实例化

- 然而可以声明接口的变量.

- 接口变量必须引用实现了接口的类对象

  ```java
  x = new Empolyee();//已经实现了接口的Empolyee类
  ```

- 可以用instanceof检查一个对象是否实现了某个特定的接口

  ```java
  if(anObject instanceof Comparable){
  	...
  }
  ```

- 接口可以被扩展.

- 虽然**接口中不能包含实例域或静态方法**,但可以包含常量.自动设为`public static final`

- 一个类只能有一个父类,但是可以实现多个接口.

#### 静态方法

- 目前为止通常做法是把静态方法放在伴随类中(就是有个和接口名很像的类,用来调用静态方法).
- 但是Java8中可以在接口中增加静态方法了.所以伴随类就是不在必要的了.

#### 默认方法

- 可以为接口方法提供一个默认实现.必须用default修饰符标记这个方法.

  ```java
  public interface Comparable<T>{
  	default int compareTo(T other){
  		return 0;
  	}
  }
  ```

- 当然这没有太大用.因为每一个实例都要覆盖这个方法.

- 但是如果有一个接口其中有好几个方法,但是你可能只用得到一两个,那就可以全写成默认,其余的方法什么都不做.

---

- 假如你多年前的一个类实现了一个接口,现在你的接口新增了一个方法,但是那个老类中没有实现,这样的话假如接口的非默认方法就不能保证源代码兼容.
- 将方法实现为默认方法就可以解决问题,

#### 解决默认方法冲突

- 如果现在接口中把一个方法定义为默认方法,然后又在父类或另一个接口中定义了同样的方法会怎样??Java的规则如下

  - 父类优先.如果父类提供具体方法,同名并且有相同参数类型的默认方法会被忽略

  - 接口冲突.如果一个超接口提供了一个默认方法,另一个接口提供一个同名并且(不论是否是参数类型)参数类型相同的方法,必须覆盖这个方法解决冲突.


### lambda表达式

#### 为什么引入lambda表达式

- 目前为止,在Java中传递一个代码段并不容易,不能直接传递代码段.Java是一种面向对象语言,所以必须构造一个对象,这个对象的类需要有一个方法能包饭所需的代码.

#### lambda表达式的语法

- 第一种lambda表达式形式:参数,箭头(->)以及一个表达式.

  ```java
  (String first,String second)
  	->first.length()-second.length();
  ```

- 如果代码要完成的计算无法放在一个表达式中,就可以像写方法一样,把代码放在{}中,并包含显示的return语句.

  ```java
  (String first,String second)->
      {
  		if(first.length()<second.length()){
              return -1;
          }elseif(first.length()>second.length()){
              return 1;
          }else{
              return 0;
          }
      }
  ```

- 及时lambda表达式没有参数,仍然要提供空括号,就像无参数方法一样.

  ```java
  ()->{
  	for(int x = 100;i<=0;i--){
  		System.out.println(i);
  	}
  }
  ```

- 如果可以推导出一个lambda表达式的参数类型,则可以忽略其类型.

  ```java
  Comparator<String> comp
  	= (first,second)//相当于(String first,String second)
   		->first.length()-second.length();
  ```

- 这里编译器可以推导出first,second的类型必然是字符串,以为这个lambda编导式将赋给一个字符串比较器.

- 无需指定lambda表达式的返回类型.总会由上下文推导出.

- 如果一个lambda表达式**只在某些分支返回一个值**,而在另外一些分支不返回值,这不合法.

  ```java
  (int x) -> ({
  	if(x>=0){
  		return 1;
  	}
  })
  ```

#### 函数式接口

- 对于只有一个抽象方法的接口,需要这种接口的对象时,就可以提供一个lambda表达式.这种接口称为**函数式接口**.

- 就是某个方法的参数中有一个需要实现某个接口的对象的时候,我们可以用一个lambda表达式放在这里.**表达式里其实就是那个接口中没实现的方法的方法体**.

  ```java
  Timer t = new Timer(1000,event->{
  	System.out.println("现在的时间是"+new Date());
      Toolkit.getDefaultToolkit().beep();
  })
  ```

#### 方法引用

- 有时可能已经有县城的方法可以完成你想要的传递到其他代码的某个动作.

- 假如出现一个定时器事件我就打印这个事件对象,普通的lambda写成这样.

  ```java
  Timer t= new Timer(1000,event -> Syetem.out.println(event));
  ```

- 但是如果直接把打印方法传递到Timer构造器就更好了

  ```java
  Timer t= new Timer(1000,event -> Syetem.out::println);
  ```

- 表达式`Syetem.out::println`是一个方法引用,等价于lambda表达式`x -> System.out.println(x)`.

- 要用::操作符分隔方法名与对象或类名,有三种情况

  1. `object::instanceMethod`(实例方法,意思应该是有参数的方法)
  2. `Class::staticMethod`
  3. `Class::instanceMethod`

- 前两种,方法引用等价于**提供方法参数的lambda表达式(就是上面的`event -> Syetem.out.println(event)`,event就是这个提供的方法参数)**.类似的,Math::pow等价于`(x,y)->Math.pow(x,y)`

- 对于第三种情况,第一个参数会成为方法的目标.例如:`String::compareToIgnoreCase`等同于`(x,y)->x.compareToIgnoreCase(y)`.意思就是如果有两个参数,会用第一个参数x来使用方法.

- 可以在方法引用中使用this参数,例如`this::equals`等同于`x->this.equals(x)`.使用super也是合法的.

- 使用`super`作为目标,会调用给定方法的父类版本.

#### 构造器引用

- 和方法引用类似,只不过方法名为new.例如`Person::new`是Person构造器的一个引用.具体是哪个构造器取决于上下文.

- 假如你有一个字符串列表,可以把它传唤为一个Person对象数组,为此要在各个字符串上调用构造器.

  ```java
  ArrayList<String> names = ...;
  Stream<Person> stream = names.stream().map(Person::new);
  List<Person> people = stream.collect(Collectors.toList());
  ```

- 可以用数组类型建立构造器引用,例如`int[]::new`是一个构造器引用,他有一个参数就是数组的长度,这等价于lambda表达式`x->new int[x]`.

- 不过不可以构建泛型数组,如果想构建,就要使用流库中的构造器解决

  ```java
  Person[] people = stream.toArray(Person[]::new);
  ```

- toArray方法调用这个构造器来得到一个正确类型的数组,然后填充这个数组并返回.

#### 变量作用域

- lambda表达式有三个部分

  1. 一个代码块
  2. 参数
  3. 自由变量的值.这里指的是非参数而且不在代码中定义的变量.

  ```java
  public static void repeatMessage(String text,int delay){
  	ActionListener listener = event ->{
  		System.out.println(text);
  		Toolkit.getDefaultToolkit().beep();
  	};
  	new Timer(delay,listener).start();
  }
  ```

- 例子中有一个自由变量text.表示lambda表达式的数据结构必须存储自由变量的值.我们说它被lambda表达式捕获.

- 这里有一个重要限制,lambda表达式中只能引用值不会改变的变量.就是说你引用一个变量,不能在lambda中再改变这个变量.

- 当然在外部它必须也是不会变化的.如果是ifor循环的x参数就不行.

- 在lambda中使用this是指创建这个lambda的方法的this参数.

### 内部类

- 内部类就是定义在类内部的类,为什么要使用内部类??
  - 内部类方法可以访问该类定义所在的作用域中的数据,包括私有的数据.
  - 内部类可以对同一个包中的其他类隐藏起来.
  - 想定义一个回调函数且不想编写大量代码时,使用匿名内部类比较便捷.
- Java内部类的对象有一个**隐式引用**,它引用了实例化该内部对象的外围类对象.通过这个指针可以访问外围类对象的全部状态.

#### 使用内部类访问对象状态

```java
public class TalkingClock{
	private int interval;
	private boolean beep;//这就是外围类的属性
	
	public TalkingClock(int interval,boolean beep){...}
	public void start(){....}
    
    public class TimePrinter implements ActionListener{
        //内部类
        public void actionPerformed(ActionEvent event){
            System.out.println("现在的时间是"+new Date());
            if(beep){//这里的beep是对外围类的引用,可以看做outer.beep
                Toolkit.getDefaultToolkit().beep();
            }
        }
    }
}
```

- 外围类的引用在构造器中设置.编译器修改了所以后的内部类的构造器,添加一个外围引用的参数.因为TimePrinter类没有定义构造器,所以编译器为这个类生成了一个默认的构造器.

  ```java
  public TimePrinter(TalkingClock clock){
      other = clock;
  }
  //outer不是JAVA中的关键字,只是用来说明内部类中的极致
   
  ```

- 当在start方法中创建了TimePrinter对象后,编译器就会将this引用传递给当前的语音时钟的构造器:

  ```java
  ActionListener listener = new TimePrinter(this);
  ```

#### 内部类的特殊语法规则

- 真正的外围类引用语法比上面的outer更复杂,表达式为`OtherClass.this`

- 例如

  ```java
  public void actionPerformed(ActionEvent event){
              if(TalkingClock.beep){
                  Toolkit.getDefaultToolkit().beep();
              }
          }
  ```

---

- 反过来,可以用下列语法更加明确的编写内部对象的构造器

  ```java
  outerObejct.new InnerClass(construction parameters)
  ```

- 例如

  ```java
  ActionListener listener = this.new TimePrinter();
  ```

---

- 如果TimePrinter是一个公有内部类,对于任意的语音时钟都可以构造一个TimePrinter

  ```java
  TalkingClock jabberer = new TalkingClock(1000,true);
  TalkingClock.TimerPrinter listener = jabberer.new TimePrinter();
  ```

---

- 在外围类的作用域之外,可以这样引用内部类:

  ```java
  OtherClass.innerClass
  ```

#### 局部内部类

- 如果内部类只在创建这个类型的对象时使用了一次,就可以在一个方法中定义局部类.

  ```java
  public void start(){
  	class TimePrinter implements ActionListener{
  		public void actionPerformed(ActionEvent event){
  			System.out.println("现在的时间是"+new Date());
              if(beep){
                  Toolkit.getDefaultToolkit().beep();
              }
  		}
          ActionListener listener = new TimePrinter();
          Timer t = new Timer(interval,listener);
          t.strat();
  	}
  }
  ```

- 局部类不能用public或private访问符进行说明,它的作用域被限定在声明这个局部类的块中.

- 这样有一个好处,对外部完全隐藏起来.这里除了start方法外没任何方法知道这个局部类的存在.

#### 由外部方法访问变量

- 局部变量还有一个优点,不仅可以访问外部类,还可以访问局部变量,不过局部变量必须是final,这说明它们一旦赋值就不可变.

```java
public void start(int interval,boolean beeo){
    class TimerPrinter implements ActionListener{
        public void acitonPerformed(ActionEvent event){
            System.out.println("现在的时间是"+new Date());
            if(beep){
                Toolkit.getDefaultToolkit().beep();
            }
        }
         ActionListener listener = new TimePrinter();
        Timer t = new Timer(interval,listener);
        t.strat();
    }
}
```

- TalkingClock类不再需要存储实例变量beep,它只是引用start方法中的beep参数变量.

#### 匿名内部类

- 假如**只创建这个类的一个对象**,就不必命名了,这种类称为**匿名内部类**.

- 格式为

  ```java
  new SuperType(contruction parameters){
  	//inner class methods and data(内部类方法和数据)
  }
  ```

- 例子

  ```java
  public void start(int interval,boolean beeo){
      ActionListener listener = new ActionListener{
          public void acitonPerformed(ActionEvent event){
              System.out.println("现在的时间是"+new Date());
              if(beep){
                  Toolkit.getDefaultToolkit().beep();
              }
          }
          Timer t = new Timer(interval,listener);
          t.strat();
      }
  }
  ```

----

- 由于构造器名字必须和类名相同,但是匿名类没有类名,所以匿名类不能有构造器,取而代之的是将构造器参数传递给父类构造器.

- 尤其是在内部类实现接口的时候,不能有任何构造参数,不仅如此,还要提供一组括号.

  ```java
  new InterfaceType(){
  	//方法和数据
  }
  ```

---

- 多年来Java程序员习惯用匿名内部类实现事件监听器和其他回调,但是**现在最好还是用lambda**表达式,这样简洁得多.

  ```java
  public void start(int interval,boolean beeo){
      Timer t = new Timer(interval,event -> {
           System.out.println("现在的时间是"+new Date());
              if(beep){
                  Toolkit.getDefaultToolkit().beep();
              }
      });
      t.start();
  }
  ```

#### 静态内部类

- 有时候使用内部类只为了把一个类隐藏在另一个类的内部,**并不需要使用外围类对象**,为此可以把内部类声明为static.

### 异常,断言和日志

- 为了避免程序的错误或一些外部环境的影响造成用户数据的丢失,至少应该做到以下几点
  - 向用户通告错误
  - 保存所有的工作结果
  - 允许用户以妥善的形式退出程序

#### 处理错误

- Java中如果某个方法不能采用正常途径返回它的任务,就可以通过另外一个路径退出方法.在这种情况下,方法不返回任何值,而是**抛出**(throw)一个封装了错误信息的对象.这个方法将会立刻退出,并不返回任何值.此外,调用这个方法的代码也将无法继续执行,取而代之的是.异常处理机制开始搜索能够处理这种异常情况的异常处理器.

#### 异常分类

- Java中异常对象都是派生于Throwable类的一个实例.但在下一层立即分解为两个分支:**Error**和**Exception**
- Error类层次结构描述了Java运行时系统的内部错误和资源耗尽错误.**不应该抛出**这种类型的对象,如果出现这种错误应该通报给用户并尽力使程序安全中止.(这种情况很少)
- Exception又分为两个分支,一个派生于`RuntiomeExceoption`,另一个包含其他异常.由于`程序错误`导致的异常属于`RuntiomeExceoption`;程序本身没问题,由于I/O错误这样的问题导致的异常属于其他异常.
- 派生于`RuntiomeExceoption`的异常包含以下几种
  - 错误的类型转换
  - 数组访问越界
  - 访问null指针
- 不是派生于它的异常包括
  - 试图在文件结尾后读取数据
  - 试图打开一个不存在的文件
  - 试图根据给定字符串查找Class对象,而这个字符串表示的类并不存在.

---

- Java将派生于Error类或RuntiomeExceoption类的所有异常称为`非受查异常`,其他所有异常称为`受查异常`.**编译器为所有受查异常提供了异常处理器.**

#### 声明受查异常

- 如果遇到无法处理的情况,Java方法可以抛出一个异常.
- 一个方法不仅需要告诉编译器将要返回什么值,`还要告诉编码器有可能发生什么异常`.
- 比如,一段读取文件的代码知道有可能读取的文件不存在或者内容为空,试图处理文件信息的代码就需要通知编译器可能会抛出`IOException`类的异常.

---

- 不用讲所有可能抛出的异常都进行声明,在遇到以下4中情况应该抛出
  1. 调用一个抛出受查异常的方法.
  2. 程序运行过程中发现错误,并且利用throw语句抛出一个受查异常.
  3. 程序出现错误,比如数组越界.
  4. Java虚拟机和运行时库出现的内部错误.
- 如果出现前两种,必须告诉调用这个方法的程序员有可能抛出异常,因为任何一个抛出遗产够的方法都可能是死亡陷阱.如果没有处理器捕获这个异常,当前执行的线程就会结束.

---

- 对于可能被他人使用的Java方法,应该根据异常规范,在方法首部声明这个方法可能抛出的异常.

  ```java
  public Image loadImage(String s) thrwos IOException{
      ...
  }
  ```

- 如果一个方法可能抛出多个**受查异常**,就必须在方法首部列出所有异常类,用逗号隔开

  ```java
  public Image loadImage(String s) thrwos FileNotFoundException,EOFException{
      ...
  }
  ```

- 但是不需要声明Java内部错误,就是从Error继承的错误,任何代码都有可能抛出这些异常,我们也无法处理.

- 同样也不该声明从`RuntiomeExceoption`继承的那些非受查异常.

  ```java
  void drawImage(int i) throws ArrayIndexOutOfBoundsException {
      ..
  }
  ```

- 总之一个方法必须声明所有可能抛出的**受查异常**,**非受查异常**要么不可控制要么应该避免发生.

- 一个方法声明会抛出一个异常,.实际上方法会跑出这个异常或这个异常子类的异常.比如`IOException`和`FileNotFoundException`

#### 如何抛出异常

- ```java
  throw new EOFException;
  
  //或
  EOFException e = new EOFException();
  throw e;
  ```

- 还有一个含有字符串类型参数的构造器.这个构造器可以细致的描述异常出现的情况.

  ```java
  String gripe = "长度是"+len;
  throw new EOFException(gripe);
  ```

---

- 对于一个已经存在的异常类,将其抛出很容易
  - 找到一个适合的异常类
  - 创建这个类的一个对象
  - 将对象抛出

### 捕获异常

#### 捕获异常

- 要想捕获一个异常,必须使用try/catch语句块.
- 如果在try语句块中的任何代码抛出了一个在catch子句中说明的异常类,那么
  - 程序将跳过try语句块的其余代码
  - 程序将执行catch子句中的处理器代码
- 如果方法中任何代码出现了在catch子句没有声明的异常类型,那么方法会立即退出.

---

- **通常应该捕获那些知道如何处理的异常,将不知道怎么处理的异常继续进行传递.**
- 如果编写一个覆盖父类的方法,这个方法又没有抛出异常,那么这个方法就必须捕获方法代码中出现的每一个受查异常.**不允许在子类的throws说明符中出现超过超类方法所列出的异常类范围.**

#### 捕获多个异常

- 一个try语句可以捕获多个异常,并对不同类型异常做出不同处理,为每个异常单独使用一个catch子句.
- 可以使用`e.getMessage()`得到详细的错误信息,或者使用`e.getClass().getNmae()`得到异常对象的实际类型.

---

- Java7之后,一个catch子句可以捕获多个异常类型.

  ```java
  try
  {
      //可能异常的代码
  }
  catch(FileNotFoundException|UnknownHostException e)
  {
      //处理异常代码
  }
  ```

- 只有当捕获的异常**彼此间不存在子类关系**时才需要这个特性.

#### finally子句

- 在产生资源回收问题时,一种方法是捕获并重新抛出所有的异常,但是这种方法比较乏味,需要在两个地方清除所分配的资源.
- 不管有没有异常被捕获,finally子句中的代码都将被执行.
- 当finally子句中包含return,假设利用return从try语句中推出,在方法返回前,finally子句的内容会被执行.如果finally子句中也有一个return语句,这个返回值将会覆盖原始的返回值.

---

- close方法本身也可能发生异常,这种情况原始的异常会丢失,转而抛出close方法的异常,如果想适当处理,代码会变得极其繁琐.

#### 带资源的try语句

- 带资源的try域最简形式为

  ```java
  try(Resource res = ...)
  {
  	//操作资源
  }
  ```

- try退出时会自动调用`rex.close()`

- 还可以指定多个资源,分号隔开即可.

## 泛型程序设计

### 为什么要是用泛型程序设计

#### 类型参数的好处

- 在Java中增加泛型类之前,反省程序设计是用继承实现的.

  ```java
  public class ArrayList //泛型类出现之前
  {
  	private Object[] elementData;
      
     ...
         public Object get(int i){...}
         public void add(Oabject o){...}
  }
  
  //这种方法有两个问题.当获取一个值时必须进行强制类型转换
  ArrayList files = new ArrayList();
  ...
  String filename = (String) files.get(0);
  //这里没有错误检查.可以向数组列表中添加任何类的对象.
  files.add(new File("..."));
  //对这个调用,编译和运行都不会出错.但是在其他地方如果将get的结果强转为String类型就会产生一个错误.
  ```

- 为此,泛型提供了一个更好的解决方案:**类型参数**.

- ArrayList类就有一个类型参数用来指示元素的类型:

  ```java
  ArrayList<String> files = new ArrayList<String>();
  ```

- 这样使代码更有可读性,一看就知道数组列表中包含的是String类型.

- 同时这样编译器可以检查避免插入错误类型的对象.例如:

  ```java
  files.add(new File("..."));//只能添加String对象
  ```

#### 谁想成为泛型程序员

- ArrayList类有一个方法addAll用来添加另一个集合的全部元素.程序员可能想要将`ArrayList<Manager>`中所有元素添加到`ArrayList<Employee>`中,反过来则不行.
- Java发明了独创性新概念,**通配符类型**,解决了这个问题.

### 定义简单泛型类

- 一个`泛型类`就是具有一个或多个`类型变量`的类.

  ```java
  public class Pair<T>{
      private T first;
      private T second;
      
      public Pair(){
          first = null;
          second = null;
      }
      public Pair(T first,T second){
          this.first = first;
          this.second = second;
      }
      
      public void setFirst(T newValue){
          first = T newValue;
      }
      public void setSecond(T newValue){
          second = T newValue;
      }
  }
  ```

- Pair类引入了一个`类型变量`T,用尖括号括起来,放在类名后面.

- 泛型类可以有多个类型变量,比如可以定义Pair类,其中第一个域和第二个域使用不同的类型.

  ```java
  public class Pair<T,U>
  {
      ...
  }
  ```

- 其中的类型变量**指定方法的返回类型以及域和局部变量的类型.**例如

  ```java
  private  T first;
  ```

---

- Java中`E`表示`集合的元素类型`,`K和V`分别表示`表的关键字`与`值的类型`.`T`表示"任意类型".

### 泛型方法

- 可以定义一个带有类型参数的简单方法

  ```java
  class ArrayAlg{
  	public static <T> T getMiddle(T...a){
          return a[a.length/2];
      }
  }
  ```

- 注意泛型方法类型变量放在修饰符(这里是public static)后面,返回类型的前面.

- 泛型方法可以定义在普通类中也可以定义在泛型类中.

- 调用泛型方法时,在方法名前的尖括号中放入具体的类型.

  ```java
  String middle = ArrayAlg.<String>getMiddle("John","Q","Public");
  ```

### 类型变量的限定

- 一些使用了特殊方法的泛型方法,需要确定类型变量所属的类有这个特殊方法,可以通过对类型变量设置**限定**实现这一点.

  ```java
  public static <T extends Comparable> T min(T[] a)....
  ```

- 现在泛型的min方法只能被实现了Comparable接口的类(如String,LocalDate)的数组调用.

---

- 一个类型变量或通配符可以有多个限定,例如

  ```java
  T extends Comparable & Serializable
  ```

- 限定类型用&分隔,用逗号分隔类型变量.

- Java的继承中,可以根据需要拥有多个接口超类型,但限定中至多有一个类,如果用一个类作为限定,它必须是限定列表中的第一个.**这句没看懂**

### 泛型代码和虚拟机

- 虚拟机中没有泛型类型对象--所有对象都属于普通类

#### 类型擦除

- 无论何时定义一个泛型类型,都会自动提供一个相应的`原始类型`.
- `原始类型`就是删去类型参数后的泛型类型名.
- `擦除`类型变量,并替换为限定类型(无限定的变量用Object)

---

- 原始类型用**第一个限定的类型变量**(也就是尖括号里的extend)来替换,如果没有给定限定就用Object替换.

- 例如`Pair<T>`中的类型变量没有显示的限定,因此原始类型用Object替换T.

- 假如声明了如下类型

  ```java
  public class Interval<T extends Comparable & Serializable> implements Serializable{
      private T lower;
      private T upper;
      ...
      public Interval (T first,T second){
          if(first.compareTo(second)<=0){
              lower = first;
              upper = second;
          }else{
              lower = second;
              upper = first;
          }
      }
  }
  ```

- 原始类型如下

  ```java
  public class Interval implements Serializable{
      private Comparable lower;
      private Comparable upper;
      ...
      public Interval (Comparable first,Comparable second){
          ...
      }
  }
  ```

- **说白了擦除就是把泛型尖括号去掉,如果尖括号里有extends,就取扩展的第一个限定类型替换原先的泛型类型(比如T),如果没有限定的,就用Object替换.**

#### 翻译泛型表达式

- 当程序调用泛型方法,如果擦除返回类型,编译器插入强制类型转换,比如

  ```java
  Pair<Empolyee> buddies = ...;
  Employee buddy = buddies.getFirst();
  ```

- 擦除getFirst的返回类型后会返回Object类型.编译器会自动强转为Employee.

- 也就是说编译器把这个方法调用翻译为两条虚拟机指令.

  1. 对原始方法`Pair.getFirst`的调用
  2. 将返回的Object类型强转为Employee类型

#### 翻译泛型方法

- 类型擦除也会出现在泛型方法中.

  ```java
  public static <T extends Comparable> T min(T[] a)
      
  //擦除类型后
  public static Comparable min(Comparable[] a)
  ```

- 但是泛型方法的类型擦除会带来两个问题.

- 假如有一个子类,父类是泛型类型的,泛型的类型是子类方法的参数类型.这时,擦除之后.

- 同时把父类的泛型和子类方法的类型参数擦除,子类方法参数不变,但是有一个和这个方法同名的继承自父类的方法,参数也是Object类型的.

- 我们希望对子类方法的调用具有多态性,调用最合适的方法,但是经过擦除,出现了两个同名方法并且方法参数类型冲突,因为一个是Object一个是具体类型,那么调用方法时就算参数填具体类型,同时它也是Object类型

  ```java
  class DateInterval extennds Pair<LocalDate>{
      public void setSecond(LocalDate second){
          if(second.compareTo(getFirst())>=0){
              super.setSecond(second);
          }
      }
  }
  //类擦除后变为
  class DateInterval extennds Pair{
      public void setSecond(LocalDate second){
          ...
      }
  }
  ```

- 要解决这个问题,就需要编译器在DateInterval类中生成一个`桥方法`.

  ```java
  public void setSecond(Object second){
  	setSecond ((Date) second)
  }
  ```

### 约束与局限性

#### 不能用基本类型实例化参数类型

- 比如不能有`Pair<double>`,可以有`Pair<Double>`.
- 擦除之后Pair类含有Object的域,而Object不能存储double值.(也就是如果doubel被擦除成Object,原先的实例域double就变为Object,在一些方法调用的时候因为类型不对就会出问题.)

#### 运行时类型查询只适用于原始类型

- 试图查询一个对象是否属于某个泛型类型时,如果使用`instanceof`会得到一个编译器错误,如果使用强制类型转换会得到一个警告.
- 同样的道理,getClass方法总是返回原始类型,同一个类的不同泛型使用getClass得到的总是相同的原始类型.

#### 不能创建参数化类型的数组

- 不能实例化参数化类型的数组

  ```java
  Pair<String>[] table = new Pair<String>[10];//报错
  ```

- 只是不运行创建这些数组,而声明`Pair<String>[]`的变量仍是合法的.不过不能用`new Pair<String>[10]`初始化这个变量.

#### 不能实例化类型变量

- 不能使用像`new T(...),new T[..]或T.class`这样的表达式中的类型变量.

- JAVA8之后,最好的解决办法是让调用者提供一个构造器表达式.,例如

  ```java
  Pair<String> p = Pair.makePair(String::new);
  ```

- makePair方法接受一个`Sipplier<T>`,这是一个函数式接口,表示一个无参数而且返回类型为T的函数:

  ```java
  public static <T> Pair<T> makePair(Sipplier<T> constr){
      return new Pair<>(constr.get(),constr.get());
  }
  ```

- 传统方式通过反射调用Class.newInstace是不可以的

- 应该这样

  ```java
  public static <T> Pair<T> makePair(Class<T> cl){
      try{
          return new Pair<>(cl.newInstace,cl.newInstace)
      }
      catch(Exception ex){
          return null;
      }
  }
  ```

- 这个方法可以这么调用

  ```java
  Pair<String> p = Pair.makePair(String.class);
  ```

#### 不能构造泛型数组

#### 泛型类的静态上下文中类型变量无效

- 不能再静态域或方法中引用类型变量.

  ```java
  public class Singleton<T>{
      private static T singleInstance;//错误
      
      public static T getSingleInstance() //错误
      {
          if(singleInstance==null){
              return singleInstance;
          }
      }
  }
  ```

- 如果个程序能够运行,就可以声明一个`Singleton<Random>`共享随机数生成器,声明一个`Singleton<JFileChooser>`共享文件选择器对话框.

- 但是这个程序无法工作,类型擦除后只剩下Singleton类,他只包含一个singleInstance域.

#### 不能抛出或捕获泛型类的实例.

