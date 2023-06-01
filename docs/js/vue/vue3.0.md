# Vue3.0笔记

## 运行启动

- CMD和powershell都可以使用npm和node命令,但是IDEA打开的终端却不行,我经过各种折腾包括但不限于修改IDEA终端打开的程序,重启IDEA,终端中设置环境变量....都没用,最后起作用的方法是把IDEA关闭然后按下windows键输入idea右键管理员运行,完美解决问题

## 创建应用

- 在注册根组件的时候,也就是createApp之后,返回的app对象可以设置全局错误处理`app.config.errorHandler = (err) => {//处理错误}`,可以注册全局组件`app.component('TodoDeleteButton', TodoDeleteButton)`

## 模板语法

### v-html

- v-html是把一段字符串渲染成html的,而不会形成数据绑定,也就是说哪怕你在这段html字符串中写了`[[某某变量]]`,也只会直接被这样渲染出来而不是去取那个变量的值并随之绑定

- 双大括号只能在html标签之中使用,而不能在html标签上使用

  ```html
  <div>{{这就是之中}}<div>
  <div id="{{这就是之上}}"></div>
  ```

### v-bind

- v-bind可以动态绑定一个对象,从而一次绑定多个值`(一次设定标签的id,class之类的属性)`

  ```vue
  const objectOfAttrs = {
    id: 'container',
    class: 'wrapper'
  }
  <div v-bind="objectOfAttrs"></div>
  ```

### 使用JS表达式

- 双大括号之中和标签属性的值都可以使用JS表达式,也大概就是加减乘除,三元表达式,调用一些基础方法,模板字符串之类的
- 表达式的定义要明确,表达式又叫**单一表达式**,判断是不是表达式就看它**可不可以直接写在return后面**,比如赋值/定义语句,条件判断(三元表达式除外)就不是表达式
- **也可以**在标签上的**v-bind处与双大括号处使用函数**,但是这种绑定在表达式中的方法每次更新都会重新调用,所以**不能有副作用**,比如**改变数据或触发异步操作**

> 很明显,一旦更新就重新调用,如果你这个函数改变了数据,那就调用之后数据又更新然后又要重新调用,无限循环

- 表达式只能访问有限的全局对象,不过可以自行在 [`app.config.globalProperties`](https://cn.vuejs.org/api/application.html#app-config-globalproperties) 上显式地添加它们，供所有的 Vue 表达式使用。

### 动态参数

- 在标签上可以使用**动态参数**,格式是`指令+:+[动态参数]`,类似`<a :[attributeName]="url"> ... </a>`和`<a @[eventName]="doSomething">`,如果有一个参数`const attrName = ref("id");`,name动态参数到标签上代表了将数据和标签的id属性绑定
- 动态参数中表达式的**值应当是**一个**字符串**，或者是 `null`。特殊值 `null` 意为**显式移除该绑定**。其他非字符串的值会触发警告。
- **空格和引号**在动态参数中**不合法**,如果要传入复杂的动态参数,推荐使用**计算属性替换复杂的表达式**

- 在指令绑定时,还可以使用**修饰符**,表示在绑定的同时执行一些特定的操作,比如`<form @submit.prevent="onSubmit">...</form>`中`.prevent` 修饰符会告知 `v-on` 指令对触发的事件调用 `event.preventDefault()`：

## 响应式

### 声明

- 声明响应式状态有两种方法
  - 第一种是写`export default { }`并在其中写`setup{}`函数,把所有需要响应式的函数和对象,变量都放进去
  - 第二种就是在单文件组件中,`<script>`标签上加setup:`<script setup></script>`,这样,标签内所有的函数对象和变量就自动是响应式的了,**只推荐使用这个方法**

### DOM更新时机

- 有的时候**响应式状态修改**会**涉及很多DOM**,虽然一般来讲这个DOM更新的速度会很快,但实际上**不是同步是异步**的,所以如果有需要明确**等待状态改变后的DOM更新完成**,就使用`nextTick()`这个全局API

  ```js
  import { nextTick } from 'vue'
  
  function increment() {
    state.count++
    nextTick(() => {
      // 访问更新后的 DOM
    })
  }
  ```

### 响应层次

- Vue3中,状态都是默认深层响应式的,即使在更深层次的对象或数组,改动也能被检测

  ```js
  import { reactive } from 'vue'
  
  const obj = reactive({
    nested: { count: 0 },
    arr: ['foo', 'bar']
  })
  
  function mutateDeeply() {
    // 以下都会按照期望工作
    obj.nested.count++
    obj.arr.push('baz')
  }
  ```

### 响应式对象VS原始对象

### reactive()

- `reactive()`返回的是个代理对象,和原始对象不相等,Vue的响应式系统**最佳实践**是**只使用声明对象的代理对象**

- 对同一个原始对象调用几次`reactive()`返回的都是同一个代理对象,类似spring的依赖注入这种单例模式

- 响应式对象内部的嵌套对象依然是代理对象,用一个普通对象赋值给响应式对象内部,原始对象和这个内部对象也是不相等的

- `reactive()`的局限性

  - 仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#使用键的集合对象)），而对 `string`、`number` 和 `boolean` 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。

  - 因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须**始终保持对该响应式对象的相同引用**。这意味着我们不可以随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失

    > 举个例子
    >
    > ```js
    > let state = reactive({count:0});
    > console.log(`state:${state.count}`)
    > function changeState(){
    >   state = reactive({count:1});
    >   console.log(`state重新赋值:${state.count}`)
    > }
    > //原本双大括号显示的值是初始的0,点击之后触发函数changeState,如果响应性连接还在,那么按钮中的内容会从"显示state内容:0"变为"显示state内容:1"
    > //但是实际上,打印了state重新赋值:1,按钮上的数字却没变,这就叫做响应性连接丢失,使用{{}}绑定的响应式对象现在怎么改变都和显示出来的无关了,影响不到他
    > <button @click="changeState">显示state内容:{{ state.count }}</button>
    > ```
    >
    > 

- 操作**`reactive()`函数返回的响应式对象**,**正确的使用方法**是在某个函数里**直接操作这个对象或对象中的属性**,如果把对象**再次设为一个对象变量**或者**提出对象的某个属性为单独的变量**,再去操作这个衍生对象/数据,就和原本的响应式对象**失去了连接**,如果把**响应式对象的属性作为入参**放到某个函数中再去更新,**也会失去原本的连接**

  ```js
  let state = reactive({count:0});
  console.log(`state:${state.count}`)
  function changeState(){
    //这里改变count的值不会改变state.count的值
    // state = reactive({count:1});
    // let count = state.count;
    // count++;
    //这里改变innerCount的值不会改变state.count的值
    // let { innerCount } = state;
    // innerCount++;
    //作为参数传入函数getFieldAndChange的state.count,在函数内部改变它的值,不会改变state.count的值
    getFieldAndChange(state.count);
    console.log(`state重新赋值:${state.count}`)
  }
  function getFieldAndChange(num){
    console.log(`getFieldAndChange执行前:${num}`)
    num++;
    console.log(`getFieldAndChange执行后:${num}`)
  }
  <button @click="changeState">显示state内容:{{ state.count }}</button>
  ```

### ref()

- 为了**解决`reactive()`的限制**,Vue 提供了一个 [`ref()`](https://cn.vuejs.org/api/reactivity-core.html#ref) 方法来允许我们创建可以使用任何值类型的响应式 **ref**
- ref包装出的对象必须调用`.value`才能访问到值

> 顶层对象就直接`.value`,嵌套对象就先调用里面的对象再`.value`

- 如果要**使用TS对ref对象做类型限制**,有三种方法

  - 使用Ref类型:`const year: Ref<string | number> = ref('2020')`
  - 调用时传入泛型参数:`const year = ref<string | number>('2020')`
  - 直接赋值,让TS自己推导类型:`const num = ref(123)`这就会自己推导为number类型,后续赋值为别的类型会报错

- ref的`.value`属性是响应式的.当值为对象类型,会用`reactive()`自动转换它的value

- 一个包含对象类型值的 ref 可以响应式地替换整个对象

  ```js
  const objectRef = ref({ count: 0 })
  
  // 这是响应式的替换,相对应的在reactive()中是不可以的,会丢失
  objectRef.value = { count: 1 }
  ```

- ref 被传递给函数或是从一般对象上被解构时，不会丢失响应性

  ```js
  const obj = {
    foo: ref(1),
    bar: ref(2)
  }
  
  // 该函数接收一个 ref
  // 需要通过 .value 取值,意思就是函数内部要取值还是得用参数.value,而不是直接用参数
  // 但它会保持响应性
  callSomeFunction(obj.foo)
  
  // 仍然是响应式的(就算把内部的属性抽出来,也可以说所谓的结构出来)
  const { foo, bar } = obj
  ```

  ```js
  //这个是我自己动手写的
  const refBigObj = {
    one : ref(1),
    two: ref(2)
  }
  //将ref对象传入,在函数中修改,还是会保持响应式连接,改变最初定义的ref对象
  changeRef(refBigObj.one);
  //把ref对象中抽象出来,还是会保持响应式连接,改变最初定义的ref对象
  const { one,two } = refBigObj;
  one.value = 666;
  console.log(`ref修改了one:${refBigObj.one.value}`);
  two.value = 777;
  console.log(`ref修改了two:${refBigObj.two.value}`);
  function changeRef(ref){
    console.log(`ref的one初始值:${refBigObj.one.value}`);
    ref.value++;
    console.log(`ref的one结束值:${refBigObj.one.value}`);
  }
  ```

#### ref的解包

- ref函数会在**模板**渲染上下文**顶层属性**时自动解包,也就是不用`.value`也可以读到该响应式属性的值

  ```js
  const count = ref(0)
  //这里就是顶层属性,直接对象内部就是属性的值
  ```

- 如果**不是顶层属性**,而是内部第二层,就**不会自动解包**,可以用方法把内层属性改为顶层属性,方法是把内部ref函数返回变量的值对应的键名作为常量名加上大括号放在等号左边,然后把原本的多层对象赋值给这个新的对象即可

  ```js
  const object = { foo: ref(1) }
  //这就不是顶层属性,ref处理的属性在这个对象的内部
  {{ object.foo + 1 }}//如果这样使用就不会解包
  const { foo } = object//这样可以把内层属性改为顶层属性
  {{ foo + 1 }}//这样就可以解包渲染出这个双层大括号的值
  ```

  ```js
  const refObj = ref({count:0});
  const refBigObj = {
      one : ref(1),
      two: ref(2)
  }
  //要注意这里是一个普通对象里的ref对象,而不是ref对象里的普通对象
  const refWithOne = {refOne:ref(123)}
  const { refOne } = refWithOne;
  <div>显示ref顶层属性{{refObj}}</div>
  <div>显示ref嵌套属性{{refBigObj.one}}</div>
  <div>显示ref嵌套属性{{refOne+66}}</div>
  ```

  

- 不过如果不对多层对象中的ref对象再进行计算,而是直接**作为最终值**在双大括号中**文本插值**,那也可以成功解包

  ```js
  {{ object.foo }}
  ```

- ref对象在响应式对象内部会自动解包,这意思就是如果调用`响应式对象.ref对象`,不用加`.value`也可以直接拿到值

- 如果新建一个ref对象替换响应式对象内部的ref对象,原先的对象会失去联系

  ```js
  //嵌套reactive
  const high = ref(0);
  const man = reactive({high});
  //和普通属性一样,不需要.value就可以调用嵌套在reactive对象中的ref对象
  console.log(`不使用.value调用ref:${man.high}`)
  console.log(`man.high之前:${high.value}`)
  //改变reactive对象的嵌套对象就可以关联到外部关联的ref对象
  man.high = 666;
  console.log(`man.high之后:${high.value}`)
  const otherHigh = ref(2);
  //新建了一个ref对象,赋值给reactive对象内部的嵌套ref对象,这时内部的嵌套ref对象会失去和外部ref的响应式关联
  man.high = otherHigh;
  console.log(`新建ref复制给嵌套对象的嵌套对象值:${man.high}`)//2
  console.log(`新建ref复制给嵌套对象的外部对象值:${high.value}`)//666
  ```

- 当 ref **作为响应式数组或像 `Map` 这种原生集合类型**的元素**被访问**时，**不会进行解包**。

  ```js
  const books = reactive([ref('Vue 3 Guide')])
  // 这里需要 .value
  console.log(books[0].value)
  
  const map = reactive(new Map([['count', ref(0)]]))
  // 这里需要 .value
  console.log(map.get('count').value)
  ```

  ```js
  //ref 作为响应式数组或像 Map 这种原生集合类型的元素被访问时，不会进行解包。
  const arrRef = reactive([ref("数组ref")]);
  const mapRef = reactive(new Map([['index',ref('map ref')]]));
  //如果不加.value打印出来就是[object Object]----[object Object]
  //加了.value打印出来就是数组ref----map ref
  console.log(`${arrRef[0].value}----${mapRef.get("index").value}`)
  ```

## 计算属性

- 模板里如果写的太多逻辑,太臃肿就会变得难以维护

> 模板我个人理解就是`<template></template>标签中的内容`

- 所以最好使用**计算属性**描述依赖响应式状态的复杂逻辑

> 计算属性就是compute(),其中该填的是一个lambda表达式,返回处理过后的值

- 计算属性会**返回一个ref结果对象**,可以在模板中自动解包

- Vue的计算属性会**自动追踪响应式依赖**,可以检测到`计算属性`出来的结果依赖于哪个`响应式变量`,当`响应式变量`改变时,任何依赖于计算属性的结果绑定都会同时更新

  > 注意这里说的是自动追踪`响应式依赖`,如果不是响应式依赖,就不会追踪了,也就是说如果计算属性计算的是一个普通变量,比如`let name = "王麻子"`,这样就算你改变了这个变量,计算属性也不会变

  ```js
  //这就是最原始的版本,直接使用JS表达式处理逻辑再展示,这样会复杂臃肿难以维护
  let author = reactive({
    name: "刘慈欣",
    book: [
        "三体",
        "球状闪电",
        "流浪地球"
    ]
  });
  <span>JS表达式:{{author.book.length>0?"是":"否"}}</span>
  ```

  ```js
  //这个是重构为计算属性版本的,compute返回的是一个ref对象,之后只要author.book数据发生了改变,计算属性会自动追踪到跟着一起改变
  const publishBook = computed(()=>{
      return author.book.length>0?"是":"否"
  })
  function addBook(){
      author.book.push("新书")
  }
  function clearBook(){
      author.book = [];
  }
  <span>计算属性:{{publishBook}}</span>
  <button @click="addBook">增加新书</button>
  <button @click="clearBook">清除所有书</button>
  ```

  ```js
  //如果compute计算的是一个普通变量/常量,那就不存在追踪跟着一起改变
  let hot = 666;
  const hot2 = computed(()=>{
      return hot+1
  });
  //这里即使改变了hot的值,hot2这个计算属性也是不会变的
  function changeHot(){
      console.log(`hot:${hot}`)
      hot = 777;
      console.log(`hot:${hot}`)
  }
  <span>计算属性,非reactive版本:{{hot2}}</span>
  <button @click="changeHot">改变hot</button>
  ```

- 如果使用函数,获得的结果是和计算属性是一样的

- 但是不同的地方在于,**计算属性值**会基于其响应式依赖**被缓存**,只要计算属性值依赖的**响应式对象没有变**,你获取多少次计算属性值都**不用重新计算而是直接得到缓存的值**,如果使用函数那就次次都要计算才得到值

### 可写计算属性

- 计算属性默认只读,如果要修改,会得到运行时警告

- 手动编写get和set方法就可以修改,但是平常使用应该**避免直接修改计算属性值**

- 而且需要注意,计算属性的get方法不应该有副作用,也就是**不要在 getter 中做异步请求或者更改 DOM**！

  ```js
  const firstName = ref("lv");
  const lastName = ref("zhichao");
  //直接定义好set和get方法,这样使用结果.value就等于调用get方法,使用 计算属性.value = xxx值 赋值操作就等于调用set方法
  const fullName = computed({
      get(){
          return firstName.value + " " +lastName.value;
      },
      set(newName){
          [firstName.value,lastName.value] = newName.split(" ");
      }
  });
  let inputName = ref("");
  function changeFullName(){
      console.log(`inputName对象:${inputName.toString()},值为${inputName.value}`)
      fullName.value = inputName.value;
  }
  <div>全名:{{fullName}}</div>
  <input v-model="inputName" type="text"><button @click="changeFullName">修改全名</button>
  ```

## 为True还是False

- 当值为`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.时,就是Flase
- 其余的都为true

## Class与Style绑定

- Vue中可以很方便的使用v-bind动态绑定class和style,从而操控元素样式,甚至对这两个的绑定提供了特殊的功能加强

- v-bind:class可以缩写为:class

- 绑定class可以**直接在标签上写对象**,对象的key代表了要绑定的class名,对象的**value为true则绑定**class反之则不绑定

  ```html
  <div class="static" :class="{active:isActive,'text-danger':hasError}">测试class绑定</div>
  <!--渲染出的-->
  <div data-v-7a7a37b1="" class="static active text-danger">测试class绑定</div>
  ```

- 当标签上**本身有class**,又使用`:class`绑定时,两者会合二为一

  ```html
  <div class="static" :class="{active:isActive,'text-danger':hasError}">测试class绑定</div>
  <!--渲染出的-->
  <div data-v-7a7a37b1="" class="static active text-danger">测试class绑定</div>
  ```

- 绑定的对象并不一定需要写成内联字面量的形式，也可以**直接绑定一个对象**

  ```vue
  const bindClass = reactive({
    active: true,
    'text-danger': false
  })
  <div :class="bindClass">测试class绑定-直接绑定对象</div>
  <!--渲染出的-->
  <div data-v-7a7a37b1="" class="active">测试class绑定-直接绑定对象</div>
  ```

- 也可以**绑定计算属性**

  ```vue
  const computedClass = computed(()=>({
    active : isActive.value&& !error.value,
    'text-danger': error.value && error.value.type === "fatal"
  }));
  <div :class="computedClass">测试class绑定-computed对象</div>
  <!--渲染出的-->
  <div data-v-7a7a37b1="" class="active">测试class绑定-computed对象</div>
  ```

- 也可以**绑定数组**,数组中直接是定义的ref基础字符串,直接写为class名

  ```vue
  const activeStr = ref("active")
  const errorStr = ref("text-danger")
  <div :class="[activeStr,errorStr]">测试class绑定-数组</div>
  <!--渲染出的-->
  <div data-v-7a7a37b1="" class="active text-danger">测试class绑定-数组</div>
  ```

- 如果想**数组中有条件的渲染**某个元素,可以使用**三元表达式**

  ```vue
  const isActive = ref(true);
  const activeStr = ref("active")
  const errorStr = ref("text-danger")
  <div :class="[isActive?activeStr:'',errorStr]">测试class绑定-数组三元表达式</div>
  <!--渲染出的-->
  <div data-v-7a7a37b1="" class="active text-danger">测试class绑定-数组三元表达式</div>
  ```

- 如果写好几个三元表达式来判断导致class太长了不好维护,也可以在**数组中嵌套对象**

  ```vue
  const isActive = ref(true);
  const errorStr = ref("text-danger")
  <div :class="[{active:isActive},errorStr]">测试class绑定-数组嵌套对象</div>
  <!--渲染出的-->
  <div data-v-7a7a37b1="" class="active text-danger">测试class绑定-数组嵌套对象</div>
  ```

  

- 在组件上使用,如果在**只有一个根元素的组件标签**上写class属性,这个**class会被添加到组件的根元素**上,会和组件的文件中写好的class合并

> 注意这里的在组件上使用意思是在父组件的文件中,找到子组件的标签并写上class

- 绑定class对象也是和直接写class一样的

  ```vue
  const isActive = ref(true);
  <HelloWorld msg="You did it!" class="abc" :class="{active:isActive}"/>
  <!--渲染出的-->
  <div data-v-e17ea971="" data-v-7a7a37b1="" class="greetings abc active"><h1 data-v-e17ea971="" class="green">You did it!</h1><h3 data-v-e17ea971=""> You’ve successfully created a project with <a data-v-e17ea971="" href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> + <a data-v-e17ea971="" href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. </h3></div>
  ```

- 如果你的组件有多个根元素，你将需要指定哪个根元素来接收这个 class。可以通过组件的 `$attrs` 属性来实现指定,格式是使用绑定class的方式`:class="$attrs.class"`

  ```html
  <!--父组件中写的-->
  <TheWelcome class="kkkkk"/>
  <!--子组件中定义好-->
  <WelcomeItem :class="$attrs.class">
      <template #icon>
        <DocumentationIcon />
      </template>
      <template #heading>Documentation</template>
  
      Vue’s
      <a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a>
      provides you with all information you need to get started.
  </WelcomeItem>
  <!--渲染出的-->
  <div data-v-bd9b3c35="" class="item kkkkk"><i data-v-bd9b3c35=""><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" fill="currentColor"><path d="M11 2.253a1 1 0 1 0-2 0h2zm-2 13a1 1 0 1 0 2 0H9zm.447-12.167a1 1 0 1 0 1.107-1.666L9.447 3.086zM1 2.253L.447 1.42A1 1 0 0 0 0 2.253h1zm0 13H0a1 1 0 0 0 1.553.833L1 15.253zm8.447.833a1 1 0 1 0 1.107-1.666l-1.107 1.666zm0-14.666a1 1 0 1 0 1.107 1.666L9.447 1.42zM19 2.253h1a1 1 0 0 0-.447-.833L19 2.253zm0 13l-.553.833A1 1 0 0 0 20 15.253h-1zm-9.553-.833a1 1 0 1 0 1.107 1.666L9.447 14.42zM9 2.253v13h2v-13H9zm1.553-.833C9.203.523 7.42 0 5.5 0v2c1.572 0 2.961.431 3.947 1.086l1.107-1.666zM5.5 0C3.58 0 1.797.523.447 1.42l1.107 1.666C2.539 2.431 3.928 2 5.5 2V0zM0 2.253v13h2v-13H0zm1.553 13.833C2.539 15.431 3.928 15 5.5 15v-2c-1.92 0-3.703.523-5.053 1.42l1.107 1.666zM5.5 15c1.572 0 2.961.431 3.947 1.086l1.107-1.666C9.203 13.523 7.42 13 5.5 13v2zm5.053-11.914C11.539 2.431 12.928 2 14.5 2V0c-1.92 0-3.703.523-5.053 1.42l1.107 1.666zM14.5 2c1.573 0 2.961.431 3.947 1.086l1.107-1.666C18.203.523 16.421 0 14.5 0v2zm3.5.253v13h2v-13h-2zm1.553 12.167C18.203 13.523 16.421 13 14.5 13v2c1.573 0 2.961.431 3.947 1.086l1.107-1.666zM14.5 13c-1.92 0-3.703.523-5.053 1.42l1.107 1.666C11.539 15.431 12.928 15 14.5 15v-2z"></path></svg></i><div data-v-bd9b3c35="" class="details"><h3 data-v-bd9b3c35="">Documentation</h3> Vue’s <a href="https://vuejs.org/" target="_blank" rel="noopener">official documentation</a> provides you with all information you need to get started. </div></div>
  ```

## 条件渲染

- v-if在**普通元素**上和**template元素**上据说是有区别的
- 经过尝试,普通元素如果是嵌套的,在最外层v-if如果是false就可以做到一次隐藏所有内层元素
- 而template标签,如果不写v-if,内外层元素都不会显示出来
- 如果写了v-if,为true的话,template包裹的所有元素会显示出来,而template标签本身不会显示,普通元素最外层的元素是会显示出来的
- **Vue3文档**上提到,如果要**使用v-if渲染一组元素,该使用template**,但是查询chatgpt后发现,**Vue2中`v-if` 只能应用于单个元素或模板**（即 `<template>` 元素）。但是**Vue3中这个限制已经被解除**了。你可以在任何元素上使用 `v-if`，包括普通的 `<div>` 元素，并且在该元素下包含任意数量的子元素。这说明**Vue3的文档更新不及时**

### v-show

- `v-show` 不支持在 `<template>` 元素上使用，也不能和 `v-else` 搭配使用。
- 即使在template上使用了,template元素中的内容也不会正常显示,反而原本不会被渲染出来的template标签,在v-show的时候无论是true还是false都会被渲染出来

### v-show和v-if该如何选择

- v-show和v-if该如何选择,都是根据条件选择是否显示某些元素的
- `v-if` 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。
- **`v-if`** 也是**惰性**的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有**当条件首次变为 true 时才被渲染**。
- 相比之下，**`v-show`** 简单许多，**元素无论初始条件如何，始终会被渲染**，只有 CSS `display` 属性会被切换。
- 总的来说，`v-if` 有更高的切换开销，而 `v-show` 有更高的初始渲染开销。因此，如果**需要频繁切换，则使用 `v-show` 较好**；如果在**运行时绑定条件很少改变，则 `v-if` 会更合适。**

### v-if和v-for

- 当 `v-if` 和 `v-for` 同时存在于一个元素上的时候，`v-if` 会首先被执行。
- 所以尽量**不要同时使用他俩**,这里的同时使用**指的是在某一个元素上同时使用**,不是指在某个页面中不能同时使用

## 列表渲染

### v-for

- 常规使用有**两种方式**,一种是`v-for='item in items'`一种是`v-for='item of items'`,前者用的比较多,后者更接近JS原生定义

- 如果v-for使用的是数组,那可以在轮训的每个元素后添加一个参数代表索引`v-for='(item ,index) in items'`

- **可以使用解构函数**,直接抽出数组对象中对象的属性,比如你的对象book中有两个属性,name和page,就可以解构为`<div v-for="({name,page},index) of liuBook">`,注意**解构的时候命名一定要和你解构的对象属性名相同**,如果不同也可以解构,但是你拿不到任何值

  ```vue
  const liuBook = ref([{
  name: "三体",
  page: 888
  },{
  name: "球状闪电",
  page:130
  }]);
  const liuName = ref("刘慈欣");
  <!--
  这是正常解构,最终显示的结果为
  使用解构函数
  0.刘慈欣:《三体》-888页
  1.刘慈欣:《球状闪电》-130页
  -->
  <div>
      使用解构函数
      <div v-for="({name,page},index) of liuBook">
          <div>{{index}}.{{liuName}}:《{{name}}》-{{page}}页</div>
      </div>
  </div>
  <!--
  这是乱解构,解构出的名字和对象内属性不一致,就会拿不到值
  使用解构函数
  0.刘慈欣:《》-页
  1.刘慈欣:《》-页
  -->
  <div>
      使用解构函数
      <div v-for="({age,talk},index) of liuBook">
          <div>{{index}}.{{liuName}}:《{{age}}》-{{talk}}页</div>
      </div>
  </div>
  ```

### v-for与对象

- v-for是可以遍历对象的,遍历的是这个对象的所有属性,遍历的顺序会基于对该对象调用 `Object.keys()` 的返回值来决定。

> 注意了,这里的 `Object.keys()` 方法的正确调用方式是, `Object.keys(xx对象)` ,而不是`xx对象.keys()`,第一次看到的时候我想当然了
>
> 而且据我观察,这个顺序也就是我们定义对象时写的属性顺序

- 对象的v-for可以有三个参数,分别是属性值,属性名,索引值:` v-for="(obj,key,index) in 需要遍历的对象`

  ```vue
  const liuPerson = reactive({
  name: "刘慈欣",
  age: 52,
  gender: "男"
  })
  <div>
      for循环对象
      <div v-for="(obj,key,index) in liuPerson">
          index:{{index}}key:{{key}},value:{{obj}}
      </div>
  </div>
  ```

### v-for使用范围值

- 所谓使用范围值就相当于Java里写一个固定数字的循环

- `<span v-for="n in 10">{{ n }}</span>`,这样就会进行循环,不过是**从1开始**

### 通过key管理状态

- 意思就是要显式的把遍历的一组数据中的独一无二的ID单独绑定到标签上,方便Vue排序,替换数据之类的操作

- Vue默认按照**就地更新**策略更新通过v-for渲染的元素列表,一旦v-for绑定的数据发生变化,Vue优先更新现有的DOM元素而不是重新渲染,这样可以一定程度上提高效率,但**只适用于列表渲染输出的结果不依赖子组件状态或者临时 DOM 状态 (例如表单输入值) 的情况**。

- 为了应对这种情况[推荐](https://cn.vuejs.org/style-guide/rules-essential.html#use-keyed-v-for)在任何可行的时候为 `v-for` 提供一个 `key` attribute，除非所迭代的 DOM 内容非常简单 (例如：不包含组件或有状态的 DOM 元素)，或者你想有意采用默认行为来提高性能。

- `key` 绑定的值期望是一个基础类型的值，例如字符串或 number 类型。不要用对象作为 `v-for` 的 key。

  ```vue
  const foodArr = reactive([
  {
  name: "三明治",
  hot: 890
  },
  {
  name: "酸奶",
  hot: 230
  },
  {
  name: "糙米饭",
  hot: 750
  },
  {
  name: "猪排",
  hot: 530
  },
  ]);
  const foodArrWithId = reactive([
  {
  id:1,
  name: "三明治",
  hot: 890
  },
  {
  id:2,
  name: "酸奶",
  hot: 230
  },
  {
  id:3,
  name: "糙米饭",
  hot: 750
  },
  {
  id:4,
  name: "猪排",
  hot: 530
  },
  ]);
  function delFoodArr(index){
  console.log(`传入的index=${index},数组长度:${foodArr.length},要删除的元素:${foodArr[index]},删除前的数组:${foodArr.toString()}`)
  if(foodArr.length>=1){
  foodArr.splice(index,1);
  }
  console.log(`删除后的数组:${foodArr.toString()}`)
  }
  function delFoodArrWithId(index){
  console.log(`传入的index=${index},数组长度:${foodArrWithId.length},要删除的元素:${foodArrWithId[index]},删除前的数组:${foodArrWithId.toString()}`)
  if(foodArrWithId.length>=1){
  foodArrWithId.splice(index,1);
  }
  console.log(`删除后的数组:${foodArrWithId.toString()}`)
  }
  <!--
  删除第一组没有绑定ID的数据时,比如原本第二行的数据,输入框的值是111,点击删除第二行,原来的第三行这时变为第二行,但是输入框依然残留着之前第二行输入的111
  第二组绑定了ID的数据,同样删除第二行,顶上来的第三行输入框的值就是本该属于第三行的222
  这说明不绑定ID的情况下,临时 DOM 状态 (例如表单输入值) 会残留,导致页面数据混乱,绑定了ID每次都是重新渲染,自然不会出现这个问题
  -->
  <div>
      <div v-for="(food,index) in foodArr">
          {{index}}.
          <input type="text"  v-bind:class="''+index+index+index">
          {{ food.name }}-热量{{ food.hot }}kj
          <button @click="delFoodArr(index)">删除</button>
      </div>
  </div>
  <div>
      带有ID的v-for
      <div v-for="(food,index) in foodArrWithId" :key="food.id">
          {{index}}.
          <input type="text"  :class="''+index+index+index">
          {{ food.name }}-热量{{ food.hot }}kj
          <button @click="delFoodArrWithId(index)">删除</button>
      </div>
  </div>
  ```

### 组件上使用v-for

- 可以直接在组件上使用v-for,也就是在父组件中的子组件标签上使用v-for,但是这样在子组件中是取不到值的

- 必须把要传递的数据单独v-bind:`<TheWelcome class="kkkkk" v-for="(food,index) in foodArrWithId" :food="food" :index="index" :key="food.id"/>`,然后在子组件中使用props`defineProps(['food','index']);`这样才可以正常在子组件中使用v-for传入的值

  ```vue
  <!--父组件中-->
  <TheWelcome class="kkkkk" v-for="food in foodArrWithId" :key="food.id"/>
  <!--子组件中这样是取不到值的-->
  <template>
  {{food}}
  </tempalte>
  <!--即使子组件中添加了props接收方法,也取不到-->
  <script setup>
  defineProps(['food']);
  </script>
  ```

  ```vue
  <!--父组件中单独把要传递的属性一个个v-bind绑定,可以使用便捷式写法-->
  <TheWelcome class="kkkkk" v-for="(food,index) in foodArrWithId" :food="food" :index="index" :key="food.id"/>
  <!--子组件中添加了props接收方法,可以取到-->
  <script setup>
  defineProps(['food']);
  </script>
  <template>
  666{{food}}--{{index}}
  </tempalte>
  
  ```

### 数组变化侦测

- Vue 能够侦听响应式数组的变更方法，并在它们被调用时触发相关的更新。

  - `push()`
  - `pop()`
  - `shift()`
  - `unshift()`
  - `splice()`
  - `sort()`
  - `reverse()`

- 也有一些不可变 (immutable) 方法，例如 `filter()`，`concat()` 和 `slice()`，这些都不会更改原数组，而总是**返回一个新数组**。当遇到的是非变更方法时，我们需要将旧的数组替换为新的

  ```js
  // `items` 是一个数组的 ref
  items.value = items.value.filter((item) => item.message.match(/Foo/))	
  ```

- 你可能认为这将**导致 Vue 丢弃现有的 DOM 并重新渲染整个列表**——幸运的是，情况**并非如此**。Vue 实现了一些巧妙的方法来最大化**对 DOM 元素的重用**，因此**用另一个包含部分重叠对象的数组来做替换**，仍会是一种**非常高效的操作**。

- 有时需要**显示数组过滤或排序后的内容**,但又**不实际改变原数组**的数据,这种情况下应该使用**计算属性**返回过滤或排序后的数组,假如多层v-for嵌套,**不可以使用计算属性**,那就使用**计算属性同样内容的函数**调用即可

> 为什么说v-for嵌套就不能用计算属性呢??
>
> 计算属性针对的是定义好的值,而多层数组嵌套意味着数组的每个元素又包含数组,这种内层的数组没法提前取出到计算属性中,因为内部是有多个数组的,不可能一次处理,也不可能只处理其中的某个数组
>
> ```json
> [
>     {
>         [{},{}]
>     },
>     {
>         [{},{}]
>     },
>     {
>         [{},{}]
>     }
> ]
> ```
>
> 所以本来针对一层数组使用的是计算属性
>
> ```vue
> const numbers = ref([1, 2, 3, 4, 5])
> 
> const evenNumbers = computed(() => {
>   return numbers.value.filter((n) => n % 2 === 0)
> })
> <li v-for="n in evenNumbers">{{ n }}</li>
> ```
>
> 而针对v-for嵌套,就只能在内层的嵌套中,v-for后边数组的定义处使用和计算属性计算过程相同的函数
>
> ```vue
> const sets = ref([
>   [1, 2, 3, 4, 5],
>   [6, 7, 8, 9, 10]
> ])
> 
> function even(numbers) {
>   return numbers.filter((number) => number % 2 === 0)
> }
> <ul v-for="numbers in sets">
>     <!--注意是在这里使用的函数-->
>   <li v-for="n in even(numbers)">{{ n }}</li>
> </ul>
> ```
>
> 

- 在计算属性中**使用 `reverse()` 和 `sort()` 的时候务必小心**！这两个方法将**变更原始数组**，**计算函数中不应该这么做**。请在**调用这些方法之前创建一个原数组的副本**：意思就是比如你本来想获得倒过来的某个数组,但是直接调用arr.reverse()会改变原数组,这时候就需要创建一个完全复制arr内容的数组,再返回它调用reverse()方法之后的值

## 事件处理

### 方法与内联事件

- **内联事件处理器**是指直接在模板中使用 JavaScript 表达式来处理事件，通常使用 v-on 指令绑定事件,处理简单事件。比如num++,字符串拼接.....
- **方法事件处理器**是指在组件中定义的方法，通常在模板中使用方法名来绑定事件。`<button v-on:click="incrementCount">Increment count</button>`
- 有一个很诡异的事,事件绑定的如果是函数名,比如`v-on:click="incrementCount"`这就是方法事件处理器,如果是带括号的函数,就成了内联事件处理器

- `@click="foo()" `也是调用方法和直接 `@click="foo"` 有什么区别呢？为何 `@click="foo()"` 是内联处理器而不是方法处理器？
- `foo()` 最后会变成一个 `() => foo()` 这样的函数，这就导致 `foo` 拿不到 `event` 参数.而直接 `foo`，`foo` 可以收到 `event` 参数

### 在内联事件处理器中访问事件参数

- 有时需要在内联事件处理器中访问原生 DOM 事件。可以向该处理器方法传入一个特殊的 `$event` 变量，或者使用内联箭头函数`(就是lambda表达式,把需要传递的事件参数event先写到最开始的参数括号中)`

> 其实我觉得这种情况应该还比较多,因为只要触发带参数的函数调用全是内联事件,这事如果要使用事件对象,就得采用这两种方法

```vue
function innerJoin(str,event){
//这里只是为了表达可以调用原生事件,实际上对于一个普通button来说,event.preventDefault();的调用是无意义的,这个方法是取消默认行为,但是普通button没有默认行为
if(event){
event.preventDefault();
}
alert(str);
}
<button @click="innerJoin('直接填写参数',$event)">内联调用事件参数提交按钮</button>
<button @click="(event)=>{innerJoin('lambda匿名函数传参',event)}">内联lambda事件参数提交按钮</button>
```

### 事件修饰符

- 处理事件时有一些关于事件的方法调用是很常见的,比如`event.preventDefault()` 或 `event.stopPropagation()`

- 为解决这一问题，Vue 为 `v-on` 提供了**事件修饰符**。修饰符是用 `.` 表示的指令后缀

  - `.stop`

    - 等同于`event.stopPropagation()`方法,用于阻止事件冒泡或捕获，以避免事件触发其他元素的事件处理程序。

    - 通俗点说,就是你是嵌套的内层标签,这时你自身触发了一个点击事件,然后就从你开始一层层向外,直到根元素为止所有的点击事件都会按顺序被你的事件传播到之后而触发,一旦加了stop,就**从标的地方开始不再往外层扩散**

      ```vue
      <div @click="print777">
          <span @click="print666">
              <!--先后弹窗显示BUTTON,666,777-->
              <button @click="greet">传递三层</button>
          </span>
      </div>
      function greet(event) {
      if (event) {
      console.log(event)
      alert(event.target.tagName);
      }
      }
      function print666() {
      alert(666);
      }
      function print777() {
      alert(777);
      }
      ```

      

  - `.prevent`

    - 等同于`event.preventDefault()`,是一个事件处理程序中常用的方法之一。这个方法用于**取消事件的默认行为**。

    - 假如有一个超链接a标签,在其中嵌套了一个button标签,点击button按钮时,想要阻止a链接的跳转,就需要在button的事件上加上.prevent

      ```html
      <a href="https://www.baidu.com">
          <button @click.prevent="greet">点击按钮</button>	
      </a>
      ```

  - `.self`

    - 只有事件从元素本身发出才处理反馈函数,这种情况我只能想到一种案例,就是多层嵌套标签由内而外有好几个点击函数,点击最内层就触发外层所有事件,**加了`.self`可以让外层的事件`不跟随触发`**,当然加哪个标签哪个标签的事件才会被停止,**更外层的还会执行**

      ```html
      <!--先后弹窗显示BUTTON,777,显示666的那个事件被.self停止了-->
      <div @click="print777">
          <span @click.self="print666">
              <button @click="greet">传递三层</button>
          </span>
      </div>
      ```

  - `.capture`

    - 作用是添加事件监听器时，使用 `capture` 捕获模式,与[原生 `addEventListener` 事件](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#options)相对应

    - 说白了就是有多层嵌套标签,当触发了最里层的事件,就会由内而外依次触发,然后添加了`.capture`的就先触发,如果填写了多个,就由外而内依次触发,说得再简单一点就是**谁有该事件修饰符，就先触发谁**

      ```html
      <!--先后弹窗显示777,666,BUTTON,本来是反过来的顺序,标了.capture的优先触发,而同时标了的又从外到内触发-->
      <div @click.capture="print777">
          <span @click.capture="print666">
              <button @click="greet">传递三层-测试capture</button>
          </span>
      </div>
      ```

      

  - `.once`

    - 这个很简单,加了的标签,事件只会触发一次,比如点击事件,点第一次触发,第二次就没反应了

  - `.passive`

    - 滚动事件的默认行为 (scrolling) 将立即发生而非等待 `onScroll` 完成*,*以防其中包含 `event.preventDefault()`
    - 一般用于触摸事件的监听器，可以用来[改善移动端设备的滚屏性能](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善滚屏性能)。

- 还可以链式使用修饰符,比如`@click.stop.prevent`

> 使用修饰符时需要注意调用顺序，因为相关代码是以相同的顺序生成的。因此使用 `@click.prevent.self` 会阻止**元素及其子元素的所有点击事件的默认行为，**而 `@click.self.prevent` 则只会阻止对元素本身的点击事件的默认行为。

### 按键修饰符

- 大部分时候使用的是鼠标点击的事件,但是针对键盘案件也有事件
- 使用时就是`@keyup.具体按键`,在你按下设置的按键时就可以触发,你可以直接使用 [`KeyboardEvent.key`](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key/Key_Values) 暴露的按键名称作为修饰符，但需要转为 kebab-case 形式`(就是全小写,使用-分词)`。比如`@keyup.page-down`

> @keyup.page-down这个我刚开始以为是方向键下键,但是按了下发现没用,最后发现其实是page down键,键盘上简写为page dn,在我的工作笔记本上它是小键盘数字3,还必须得NUM LOCK之后点中标签再按才可以
>
> 我试用的时候用的是input,点中input标签再按下pagedown很容易,但是我尝试了div标签,哪怕先点上去再按也是没反应的

- 按键修饰符触发有个**前提条件**,就是标签要能被选中**获得焦点**

  - 在 HTML 中，只有一些特定的元素才能够获得焦点，这些元素包括：

    - `<a>`元素（只有当`href`属性存在时）
    - `<button>`元素
    - `<input>`元素（包括`text`、`password`、`checkbox`、`radio`、`email`等各种类型）
    - `<select>`元素
    - `<textarea>`元素
    - `<iframe>`元素
    - `<audio>`元素和`<video>`元素（只有当`controls`属性存在时）

  - 除了这些元素，其他元素默认情况下是无法获得焦点的。但是，你可以使用`tabindex`属性来让任何元素获得焦点

    ```html
    <div tabindex="0">这个div可以获得焦点</div>
    ```

  - 注意，当`tabindex`属性为非负整数时，该元素将成为可聚焦元素，其中较小的数字意味着更先聚焦。如果两个元素具有相同的`tabindex`，则它们将按照它们在文档中出现的顺序进行聚焦。

#### 系统按键修饰符

- 包括

  - `.ctrl`
  - `.alt`
  - `.shift`
  - `.meta`

- 这个和一般按键修饰符不太一样,普通的是获得焦点按下就触发,这个是按下指定按键同时按下别的键,**按住指定按键`松开别的键`才触发**

  ```html
  <div tabindex="0" @keyup.ctrl="greet">ctrl</div>
  <div tabindex="0" @keyup.alt="greet">alt</div>
  <div tabindex="0" @keyup.shift="greet">shift</div>
  <div tabindex="0" @keyup.meta="greet">meta</div>
  ```

> 请注意，系统按键修饰符和常规按键不同。与 `keyup` 事件一起使用时，该按键必须在事件发出时处于按下状态。换句话说，`keyup.ctrl` 只会在你仍然按住 `ctrl` 但松开了另一个键时被触发。若你单独松开 `ctrl` 键将不会触发。

- 也可以和其他案件组合使用,**按顺序按下多个按键触发**,按下的间隔要短,隔太久就分不出是不是组合键了

  ```html
  <!--完全按顺序才可以,第一个是先按下ctrl再按enter,第二个是先点击再按下windows-->
  <div tabindex="0" @keyup.ctrl.enter="greet">ctrl+enter</div>
  <div tabindex="0" @click.meta="greet">click+meta</div>
  ```

#### .exact修饰符

- 允许控制触发一个事件所需的确定组合的系统按键修饰符。

- 典型的例子是,在同一个页面按enter是提交,按shift+enter是换行

  ```html
  <!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
  <button @click.ctrl="onClick">A</button>
  
  <!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
  <button @click.ctrl.exact="onCtrlClick">A</button>
  
  <!-- 仅当没有按下任何系统按键时触发 -->
  <button @click.exact="onClick">A</button>
  ```

  > 我测试,只有`@click.ctrl.exact`是最不准确的,无论是我先click再ctrl再按别的,还是先按别的键再click在ctrl,还是click按别的再按ctrl都会触发...
  >
  > `@click.exact`经过测试,点击之后,按住系统按键再点击就不会触发了

## 表单输入绑定

### 基本用法

- 将表单输入框的内容同步给 JavaScript 中相应的变量,`v-model` 指令帮我们简化了这一步骤

> `v-model` 会**忽略任何表单元素上初始**的 `value`、`checked` 或 `selected` attribute。它将始终将当前绑定的 JavaScript 状态视为数据的正确来源。你应该在 JavaScript 中使用**响应式系统的 API 来声明该初始值**。

#### 选择器

- 如果 `v-model` 表达式的**初始值不匹配任何一个选择项**，`<select>` 元素会渲染成一个“未选择”的状态。在 iOS 上，这将**导致用户无法选择第一项**，因为 iOS 在这种情况下不会触发一个 change 事件。因此，我们**建议提供一个空值的禁用选项**

  ```vue
  const select = ref("");  
  <p>下拉选择框:{{select}}</p>
  <select v-model="select">
      <option disabled value="">不好意思,这个不让你选</option>
      <option >chat gpt</option>
      <option >new bing</option>
      <option >小元</option>
  </select>
  ```

### 值绑定

- 对于单选按钮，复选框和选择器选项，`v-model` 绑定的值通常是静态的字符串 (或者对复选框是布尔值)
- 但有时我们可能希望将该值**绑定**到当前组件实例上的**动态数据**。这可以通过**使用 `v-bind` 来实现**。此外，使用 `v-bind` 还使我们可以将选项值绑定为非字符串的数据类型。

> 啥叫动态数据?
>
> 你去绑定`<div name="王老五"></div>`这样写死的数据就叫静态
>
> 绑定`<div :name="customer.name"></div>`这样传入的参数,就叫动态数据

- `v-model` 和 `v-bind` 都是用来实现数据绑定的指令，但它们的应用场景略有不同。`v-model` 适用于表单元素等需要实现双向数据绑定的场景，而 `v-bind` 则更加灵活，适用于需要动态绑定属性的各种场景`(即可以绑定value,也可以绑定什么text,class之类的属性)`。

#### 复选框

- 也就是checkbox,多选框,点击的那种

- Vue针对复选框,有两个特有属性`true-value` 和 `false-value`,仅支持和 `v-model` 配套使用。

> 选中则为true-value,不选中就是false-value,初始值为v-model绑定的值

  ```vue
  const toggle = ref("yes");
  <p>单选,标签上定义选中与否的值:{{toggle}}</p>
  <input type="checkbox" v-model="toggle" true-value="yes" false-value="no">
  ```

- 这两个属性也可以动态绑定,不过就要使用到v-bind了

  ```html
  <input
    type="checkbox"
    v-model="toggle"
    :true-value="dynamicTrueValue"
    :false-value="dynamicFalseValue" />
  ```

#### 选择器选项

- `v-model` 同样**也支持非字符串类型的值绑定**！在上面这个例子中，当某个选项被选中，`selected` 会被设为该对象字面量值 `{ number: 123 }`。

  ```html
  <select v-model="selected">
    <!-- 内联对象字面量 -->
    <option :value="{ number: 123 }">123</option>
  </select>
  ```

### 修饰符

#### .lazy

- 默认,input标签会在input事件后更新数据,添加`.lazy`后,是**在change事件后更新数据**

> 也就是说,本身是你输入了新的字符就更新,现在你输入完,input框绑定的值不会变,当**点中input的时候按下回车才会变**

#### .number

- `.nember`可以**把输入的数字字符串转换为数字格式**,比如你有一个定义的字符串`const numStr = ref("")`,这时如果你在标了`.number`的input输入框中输入纯数字字符串,numStr就会被转换为number类型的数据,**而不是说你输入符号汉字之类的都能给你变成数字**

## 侦听器

- 计算属性是不允许在计算的过程中出现副作用的,而有时我们就是需要在状态变化时执行一些类似修改DOM,异步操作之类的副作用
- 所以在`组合式API`里就可以使用**watch函数**在每次**响应式状态变化**时触发回调函数

> 啥叫`响应式状态变化`,就是比如你定义了一个响应式变量,你修改了它的属性值,这就属于

- 最基本的监听代码案例

  ```vue
  <p>输入文字触发回调</p>
  <input type="text" v-model="watchInput">
  //当在输入框中输入文字修改watchInput的值时就会触发watch监听
  const watchInput = ref("");
  watch(watchInput, (newValue, oldValue) => {
  console.log(`侦听参数watchInput发生变化,之前的值为:${oldValue},后来的值为:${newValue}`);
  });
  ```

- 监听数据源,也就是**watch函数的第一个参数**,可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组

  ```vue
  <p>输入数字触发不同的回调</p>
  X:<input type="text" v-model="watchX">
  Y:<input type="text" v-model="watchY">
  const watchX = ref(0);
  const watchY = ref(0);
  watch(watchX, (newX) => {
    console.log(`x变化,新的值为:${newX}`)
  });
  watch(() => watchX.value + watchY.value, (sum) => {
  //这里的相加,明明是数字但是按字符串拼接起来了,不懂为啥
    console.log(`相加发生变化,sum=x+y=${sum}`)
  });
  watch([watchX, () => watchY.value], ([newX, newY]) => {
    console.log(`x或y发生变化,x=${newX},y=${newY}`)
  });
  ```

- **不可以直接监听响应式对象的属性**,这样做你修改属性也不会触发监听方法,可以**使用getter返回这个属性的值**作为被监听的值

  ```vue
  <p>输入数字触发错误的对象属性变化回调:{{objField}}</p>
  count:<input type="text" v-model="objField.count">
  const objField = reactive({count:0});
  //这里如果监听的是一个对象的属性,改变这个属性是不会触发监听的,应该用一个getter方法返回这个属性
  watch(objField.count,(count)=>{
    console.log(`直接监听对象属性内容是:${count}`)
  });
  watch(()=>objField.count,(count)=>{
    console.log(`getter方法返回对象属性监听内容是:${count}`)
  });
  ```

### 深层侦听器

- 给watch的第一个参数传入一个响应式对象(也就是reactive创建出的),会隐式创建一个深层侦听器,该回调函数在所有嵌套变更时都会被调用,也就是**不管这个对象内部有多少层,随便改变里面的任意属性的值都会触发**

  ```vue
  <p>按钮测试深层响应</p>
  <button @click="changeObjDeep">按我改变属性触发</button>
  let objDeep = reactive({count:0});
  watch(objDeep,(newValue,oldValue)=>{
    console.log(`深层监听,objDeep内部属性发生变化也能监听到,old:${JSON.stringify(oldValue)},new:${JSON.stringify(newValue)}`)
  });
  //这里就是修改了响应式对象的count属性,就可以触发监听方法回调
  function changeObjDeep(){
    objDeep.count++;
  }
  ```

- 一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调

> 这个我感觉比较少用,所以就提一嘴,什么时候真遇到了再补充吧

### 即时回调

- `watch` **默认是懒执行**的：仅当**数据源变化时，才会执行回调**。但在某些场景中，我们希望在创建侦听器时，**立即执行一遍回调**。举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。

> 这就很像Java中的do while,先执行一遍

- 最基础的实现就是在watch方法的最后一个参数添加一个对象,对象属性为`immediate: true` 选项来强制侦听器的回调立即执行

  ```JS
  const nowStart = ref(0);
  watch(nowStart,(newV,oldV)=>{
    //这句打印会直接打印,后续等到nowStart值变了才打印
    console.log(`监听先执行一遍,old:${oldV},new:${newV}`)
  },{immediate:true});
  ```

### watchEffect()

- `watchEffect()` 允许我们**自动跟踪回调的响应式依赖**。

- 换句更通俗的话说,只要是watchEffect方法内**使用到的响应式对象/属性发生了变化**,就会**触发监听**,而且监听方法会**自动先运行一次**,和watch方法相比,想达成同样的效果自动运行一次省去了指定 `immediate: true`

  ```js
  const watchNum = ref(0);
  const watchData = ref(null);
  //这两个方法效果是相同的,但是watchEffect不用在参数上声明需要追踪的响应式属性以及是否需要先运行一次的immediate参数
  watch(watchNum,()=>{
    console.log(`修改前watchData${JSON.stringify(watchData)}`)
    watchData.value = watchNum.value;
    console.log(`修改后watchData${JSON.stringify(watchData)}`)
  },{immediate:true});
  watchEffect(()=>{
    console.log(`watchEffect修改前watchData${JSON.stringify(watchData)}`)
    watchData.value = watchNum.value;
    console.log(`watchEffect修改后watchData${JSON.stringify(watchData)}`)
  });
  ```

- 对于这种只有一个依赖项的例子来说，`watchEffect()` 的好处相对较小。但是对于**有多个依赖项的侦听器**来说，使用 `watchEffect()` **可以消除手动维护依赖列表的负担**。此外，如果你需要**侦听一个嵌套数据结构中的几个属性**，`watchEffect()` 可能会**比深度侦听器更有效**，因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性。

> 就是说watchEffect方法体内,使用的响应式依赖越多就越方便,因为都是自动追踪的,而且是使用了什么属性追踪什么属性
>
> 不像深层侦听一样,会去因为一个多层的响应式对象其中某层的一个属性递归跟踪整个响应式对象

- `watchEffect()` 只能在同步执行期间监听,使用异步回调,只在第一个await出现前访问到的属性才会被监听
- 相比之下,watch方法可以更精准的控制回调函数触发时机,而且把要追踪的属性写在参数里更明确,而watchEffect方法可以更方便的完成自动追踪与首次执行,但是响应式依赖关系体现的不是很明确,至少比写在参数上不明确

### 回调的触发时机

- 当你更改响应式状态,可能会同时更新Vue组件与触发侦听器回调

- **默认**用户创建的**侦听器**都是在**Vue组件更新前触发**,如果想**在侦听器回调里访问Vue组件更新后的DOM**,需要指明 `flush: 'post'` 选项

  ```js
  watch(source, callback, {
    flush: 'post'
  })
  
  watchEffect(callback, {
    flush: 'post'
  })
  ```

- 当然也有方便的**直接使用方法** `watchPostEffect()`

### 停止侦听器

- 一般很少这么做,因为在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止

- 不过侦听器必须用**同步**语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。

  ```JS
  <script setup>
  import { watchEffect } from 'vue'
  
  // 它会自动停止
  watchEffect(() => {})
  
  // ...这个则不会！
  setTimeout(() => {
    watchEffect(() => {})
  }, 100)
  </script>
  ```

  

- 要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数

  ```JS
  const unwatch = watchEffect(() => {})
  
  // ...当该侦听器不再需要时
  unwatch()
  ```

- **请尽可能选择同步创建**。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑`(相当于轮询,只不过限制了条件才往下执行)`

  ```js
  // 需要异步请求得到的数据
  const data = ref(null)
  
  watchEffect(() => {
    if (data.value) {
      // 数据加载后执行某些操作...
    }
  })
  ```

## 模板引用

- 大多数时候Vue是把DOM操作抽象起来的,但是总有特殊情况需要我们直接访问底层DOM元素,这时就可以使用ref属性,`<input ref="input">`,它允许我们在一个特定的 DOM 元素或子组件实例被挂载后，获得对它的直接引用。

### 访问模板引用

- 获得模板引用,需要声明一个同名的ref

  ```vue
  <p>模板引用ref,直接聚焦于这个输入框</p>
  <input type="text" ref="firstRef">
  
  <script>
      const firstRef = ref(null);
      onMounted(()=>{
          //直接聚焦
          firstRef.value.focus();
      });
  </script>
  
  ```

> 要注意,这里编辑器不会有任何提示,需要自己注意对照着起好同名,自然而然就会起作用

- 只可以**在组件挂载后**才能访问模板引用。如果你想在模板中的表达式上访问 `input`，在初次渲染时会是 `null`。这是因为在初次渲染前这个元素还不存在呢！

- 如果你需要侦听一个模板引用 ref 的变化，确保考虑到其值为 `null` 的情况

  ```vue
  <p>模板引用ref,挂载后直接聚焦于这个输入框,注销后就置为null了</p>
  <input type="text" ref="secondRef" v-if="secondRefFlag">
  <button @click="changeRefFlag">按下反转secondRefFlag:{{secondRefFlag}}</button>
  <script>
      const secondRef = ref(null);
      watchEffect(()=>{
          if(secondRef.value){
              secondRef.value.focus();
          }else{
              console.log(`还未挂载或者已经被置为null了`)
          }
      });
      const secondRefFlag = ref(true);
      function changeRefFlag(){
          secondRefFlag.value = !secondRefFlag.value;
      }
  </script>
  ```

### v-for中的模板引用

> 需要 v3.2.25 及以上版本

- 当在 `v-for` 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素

> 意思就是,当有一个循环的元素列表,这时候你再v-for的那个标签上写的ref属性,对应的同名ref变量得是一个数组,因为循环几次就有几个数据要存进去

```vue
<p>多列表模板引用ref</p>
forRef:{{JSON.stringify(forRef)}}
<ul>
    <li v-for="drink in forRefList" ref="forRef">
        {{drink}}
    </li>
</ul>
<button>点击显示forRef</button>
<script>
    const forRefList = ref([
        "可乐","雪碧","芬达","怡宝"
    ]);
    const forRef = ref([]);
    onMounted(()=>{
        console.log(`v-for对应的ref的值为:${forRef.value.map(i => i.textContent)}`)
        forRef.value[1].style.color = "red";
        forRef.value[0].style.color = "green";
        forRef.value[2].style.color = "yellow";
        forRef.value[3].style.color = "gray";
    });
</script>

```

- 不过最后的ref数组,并不一定和源数组顺序对应

- 这里的forRefList就是源数组。而ref="forRef"会收集所有循环渲染出来的li元素，并且把它们放在一个名为forRef的ref数组里。但是这个ref数组并不保证与源数组相同的顺序，因为Vue3会对v-for进行优化和重用。所以如果你想要获取某个元素对应的ref值，最好不要直接通过索引访问ref数组，而是通过其他方式来匹配。

### 模板函数引用

- 除了使用字符串值作名字，`ref` attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。该函数会收到元素引用`(你在哪个元素上标了ref属性,这里的元素引用就是引用的哪个元素)`作为其第一个参数
- 注意我们这里需要使用动态的 `:ref` 绑定才能够传入一个函数。当绑定的元素被卸载时，函数也会被调用一次，此时的 `el` 参数会是 `null`。你当然也可以绑定一个组件方法而不是内联函数。

> - 组件方法是指在v-on指令中绑定一个组件实例上已经定义好的方法，比如：
>
> ```html
> <button v-on:click="doSomething">Click me</button>
> ```
>
> 这里的doSomething就是一个组件方法，它可以在组件实例的methods选项中定义。
>
> - 内联函数是指在v-on指令中直接写一个JavaScript表达式或函数调用，比如：
>
> ```html
> <button v-on:click="count++">Click me</button>
> ```
>
> 这里的count++就是一个内联函数，它会直接修改组件实例上的count属性。

- 但是经过我的测试发现,**这里的官方文档有问题**,它让我使用`:ref`去绑定

- 然后`<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">`让我将 el 赋值给一个数据属性或 ref 变量,可是如果赋值给一个ref变量,当执行`ref变量 = el`的**赋值操作的时候**,**响应式变量**就**检测到了数据变化**,然后**页面重新加载**,然后又赋值触发响应式变量数据变化,整个页面就会**重复渲染N多次**

- chatgpt指出了我的问题,原文如下:

- 在Vue3中，当一个响应式对象发生变化时，会触发组件的重新渲染。因此，如果您在模板中使用了响应式对象，并且该对象在组件中的某个地方发生了变化，就会导致组件重新渲染。这可能会导致多次渲染和性能问题。

  在您的代码中，您使用了响应式对象 `bindRef`，并将其绑定到了一个动态的 `ref`。每当 `bindRef` 的值发生变化时，组件都会重新渲染。因此，如果 `bindRef` 的值被修改了多次，那么组件就会被重新渲染多次，导致性能下降和页面变得很长。

  为了避免这种情况，您可以使用 `toRef` 将响应式对象转换为非响应式对象。这样，当对象发生变化时，不会触发组件的重新渲染。例如：

  ```JS
  javascriptCopy codeimport { reactive, toRef } from 'vue';
  
  const bindRef = toRef(reactive({}), 'value');
  ```

  使用 `toRef` 将 `bindRef` 转换为非响应式对象，然后将其绑定到 `div` 元素的动态 `ref` 中，这样就可以避免多次渲染的问题了。

> - 为何我这段代码会导致页面渲染好几次,变得很长  `<p>模板引用ref绑定函数</p>  <div :ref="(el) => {bindRef.value = el}">哈哈哈</div> const bindRef = reactive(null)`;
>
>   - 在 Vue 3 中，当 ref 对象被赋予新的值时，它会导致组件重新渲染。因此，如果您在模板中使用 `ref` 绑定元素，并在 `setup` 中使用 `ref` 定义引用对象，都可能导致重复渲染的问题。
>
>     为了解决这个问题，您可以使用 `toRef` 或 `toRefs` 函数来将响应式对象转换为非响应式引用对象。这样做可以保留对响应式对象的引用，同时避免重复渲染的问题。例如：
>
>     ```vue
>     phpCopy code<template>
>       <p>模板引用ref绑定函数</p>
>       <div :ref="bindRef">哈哈哈</div>
>     </template>
>         
>     <script>
>     import { ref, toRef } from 'vue'
>         
>     export default {
>       setup() {
>         const elRef = ref(null)
>         const bindRef = toRef(elRef, 'value')
>         
>         return {
>           bindRef
>         }
>       }
>     }
>     </script>
>     ```
>
>     在这个例子中，我们首先使用 `ref` 定义一个响应式引用对象 `elRef`，然后使用 `toRef` 将其转换为一个非响应式引用对象 `bindRef`。由于 `toRef` 返回的是一个非响应式对象，因此在模板中使用 `bindRef` 绑定元素不会导致重复渲染的问题。
>
>     请注意，如果您需要引用响应式对象的多个属性，可以使用 `toRefs` 函数将其转换为一个对象，其中每个属性都是一个非响应式引用对象。例如：
>
>     ```vue
>     phpCopy code<template>
>       <p>模板引用ref绑定函数</p>
>       <div :ref="elRefs.container">哈哈哈</div>
>       <div :ref="elRefs.item1">项目1</div>
>       <div :ref="elRefs.item2">项目2</div>
>     </template>
>         
>     <script>
>     import { ref, toRefs } from 'vue'
>         
>     export default {
>       setup() {
>         const elRefs = toRefs({
>           container: ref(null),
>           item1: ref(null),
>           item2: ref(null)
>         })
>         
>         return {
>           elRefs
>         }
>       }
>     }
>     </script>
>     ```
>
>     在这个例子中，我们使用 `toRefs` 将一个包含多个响应式引用对象的对象转换为一个包含多个非响应式引用对象的对象。这样做可以避免在模板中使用多个 `ref` 导致重复渲染的问题。

### 组件上的ref

- 模板引用也可以用在组件上,这种情况下引用中获得的值是组件实例

  ```vue
  <template>
  <main>
      <TheWelcome class="kkkkk" ref="welcome"/>
      </main>
  </template>
  <script>
      const welcome = ref(null);
      onMounted(()=>{
          console.log(`子组件信息:${JSON.stringify(welcome)}`)
      });
  </script>
  ```

- 使用了 `<script setup>` 的组件是**默认私有**的：一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显式暴露

  ```vue
  <!--这是在子组件welcome中-->
  <script setup>
  const a = 1;
  const b = ref(666)
  defineExpose({a,b})
  </script>
  <!--实际上在上方的父组件中的打印,打印出的子组件实例内容为:子组件信息:{"__v_isShallow":false,"__v_isRef":true,"_rawValue":{"a":1,"b":666},"_value":{"a":1,"b":666}}-->
  ```

- 当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 `{ a: number, b: number }` (ref 都会自动解包，和一般的实例一样)。

## 组件基础

### 使用组件

- 组合式API使用`<script setup>`,在其中import引入组件后可以直接在template标签中使用,格式就是`<引入时自定义的标签名/>`
- 组件可以被重用多次,而且每一个组件都维护着自己的状态,这是因为每使用一个组件,就创建了一个新的实例
- 在单文件组件中,推荐使用`PascalCase` 的标签名,也就是大驼峰

### 传递props

- 要往创建好的组件中传递数据,必须使用props

- 在组合式API的方法下,需要在使用组件的地方,声明的组件标签上使用标签属性或者冒号+标签属性`(也就是v-bind)`把数据绑定到标签上:`<Highest food="beef" nutrition="protein"/>`或`<Highest :food="beef" :nutrition="protein"/>`

- 然后在组件的vue文件中的`<script setup>`标签中使用`defineProps()`表明组件要接收的值有哪些:`defineProps(['food','nutrition']);`,声明好了之后不需要使用任何引用,直接使用属性名就可以使用props数据

- `defineProps` 会返回一个对象，其中包含了可以传递给组件的所有 props

- 一个组件可以有任意多的 props，默认情况下，所有 prop 都接受任意类型的值。

  ```vue
  <!--父组件中声明子组件标签-->
  <script setup>
      import Highest from './components/study/Highest.vue'
  </script>
  <Highest food="beef" nutrition="protein"/>
  ```

  ```vue
  <!--二级子组件-->
  <template>
    <h1>主页面Highest</h1>
    食品名称:{{food}}
    <EldestSon :nutrition="nutrition"/>
    <EldestSon />
    <EldestSon :nutrition="nutrition"/>
  </template>
  
  <script setup>
  import EldestSon from './second/EldestSon.vue'
  const props = defineProps(['food','nutrition']);
  console.log(`主页面Highest组件打印props:${JSON.stringify(props)}`);
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```vue
  <!--三级子组件-->
  <template>
    <div>我是一个子组件EldestSon</div>
    食品种类:{{nutrition}}
  </template>
  
  <script setup>
    const props = defineProps(['nutrition']);
    console.log(`子组件EldestSon组件打印props:${JSON.stringify(props)}`);
  </script>
  
  <style scoped>
  
  </style>
  ```

### 监听事件

- 有时父子组件需要交互,就需要使用一些事件,让子组件中经过一些操作可以触发父组件的事件

> 就比如,一个弹窗是子组件,其中有个按钮,按下去修改的数据在父组件中

- 父组件可以通过 `v-on` 或 `@` 来选择性地监听子组件上抛的事件

> 子组件可以把自己内部的事件起一个名字往父组件抛,父组件直接在子组件标签上使用`@抛出事件名=xxxx`来选择性监听,实现这个事件在父组件的具体效果

- 子组件可以通过调用内置的 [**`$emit`** 方法](https://cn.vuejs.org/api/component-instance.html#emit)，通过传入事件名称来抛出一个事件,这个属于**从前的旧办法**

  ```vue
  <!--父组件-->
  <!--这个案例就是,子组件里有很多文字,还有个按钮,点击按钮的时候,抛出事件给父组件,父组件让这个事件触发后可以把包裹子组件的标签内的字体样式大小变大-->
  <p>组件监听事件</p>
  <div :style="{fontSize:fontSize+'em'}" >
      <TextZone @bigger="fontSize += 0.1"/>
  </div>
  ```

  ```vue
  <!--子组件-->
  <template>
  <div>
      <h4>吴 加 亮 布 四 斗 五 方 旗 　 宋 公 明 排 九 宫 八 卦 阵</h4>
      <p>御 营 中 选 到 左 羽 右 翼 良 将 二 员 为 中 军 ， 那 二 人 ： 御 前 飞
          龙 大 将 酆 美 ； 御 前 飞 虎 大 将 毕 胜 。</p>
      <button @click="$emit('bigger')">放大字体</button>
      </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  
  </style>
  
  ```

- 我们可以通过 [`defineEmits`](https://cn.vuejs.org/api/sfc-script-setup.html#defineprops-defineemits) 宏来声明需要抛出的事件,事实上这也是**组合式API应该用的方式**

- `defineEmits`一样只能用于`<script setup> `之中,它返回一个等同于 `$emit` 方法的 `emit` 函数。

  ```vue
  <!--父组件-->  
  <p>组件监听事件</p>
  <div :style="{fontSize:fontSize+'em'}" >
      <TextZone @bigger="fontSize += 0.1"/>
  </div>
  ```

  ```vue
  <template>
  <div>
      <h4>吴 加 亮 布 四 斗 五 方 旗 　 宋 公 明 排 九 宫 八 卦 阵</h4>
      <p>御 营 中 选 到 左 羽 右 翼 良 将 二 员 为 中 军 ， 那 二 人 ： 御 前 飞
          龙 大 将 酆 美 ； 御 前 飞 虎 大 将 毕 胜 。</p>
      <button @click="bigger">放大字体</button>
      </div>
  </template>
  
  <script setup>
      const emits = defineEmits(['bigger']);
      //这里就要把定义好的事件写出来,在其中触发emits('事件名'),这个就相当于以前在标签上直接$emit('bigger')一个效果,上抛的作用
      const bigger = () =>{
          console.log(`触发bigger方法`)
          //如果想要传递参数,就在emits第二个参数上写,如果有多个参数建议用一个对象把数据塞进去即可
          //就像emits('increase', {params1:'1',params2:'2'});
          emits('bigger');
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  尝试着让new bing给我一个**带参数的defineEmits案例**

  ```vue
  您好，这是必应。根据网络搜索结果，我为您找到了一个vue3的组合式API风格的emit事件传递代码案例1：
  
  <template>
    <div>
      <h2>MyTextInput.vue</h2>
      <label for="my-text-input">{{ label }}</label>
      <input id="my-text-input" type="text" v-model="text" @input="handleInput" />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const props = defineProps({
    label: String,
  });
  
  const text = ref("");
  
  const emit = defineEmits(["update"]);
  
  const handleInput = () => {
    emit("update", text.value.toUpperCase());
  };
  </script>
  ```

  

  ```vue
  <template>
    <div id="app">
      <h1>App.vue</h1>
      <p>{{ message }}</p>
      <MyTextInput label="Enter some text:" @update="handleUpdate" />
    </div>
  </template>
  
  <script setup>
  import MyTextInput from "./components/MyTextInput.vue";
  
  const message = ref("Hello Vue 3!");
  
  const handleUpdate = (value) => {
    message.value = value;
  };
  </script>
  
  ```

### 插槽

- 默认父组件使用子组件标签的时候可以是直接闭合`<abc/>`,也可以是左右闭合`<abc></abc>`

- 但是如果在左右闭合的子组件标签里写一些东西是不会显示出来的

- 这时候就需要使用slot标签,用在子组件的template中,然后父组件在自己的vue文件中的子组件标签内写内容就可以被显示出来了

  ```vue
  <!--父组件-->  
  <p>组件slot简易案例</p>
  <SlotSimple>警告小孩不准玩火,不然尿炕</SlotSimple>
  ```

  ```vue
  <!--子组件-->
  <template>
    <div>
      <p style="color: red">这是一个警告区域</p>
      <slot/>
    </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  
  </style>
  ```

### 动态组件

- 有些场景需要在几个组件间来回切换,比如知乎,就有`关注,推荐和热榜`,点击不同的部分显示的内容也就不同

- 这种需求就可以使用Vue 的 `<component>` 元素和特殊的 `is` attribute 实现

- 被传给 `:is` 的值可以是以下几种：

  - 被注册的组件名
  - 导入的组件对象

  ```vue
  <!--父组件-->  
  <p>切换组件</p>
  <div>
      <button @click="tab = 'TabOne'">切换为1</button>
      <button @click="tab = 'TabTwo'">切换为2</button>
      <button @click="tab = 'TabThree'">切换为3</button>
  </div>
  <component :is="allTab[tab]" style="{
                                      border: 1px solid #ccc;
                                      padding: 10px;
                                      }"></component>
  <script setup>
      const tab = ref("TabOne");
      const allTab = {TabOne, TabTwo, TabThree};
  </script>
  ```

  ```vue
  <!--TabOne,其他的两个也一样,只不过div里的文字变成了分支二-222222222222222222222,分支三-3333333333333333-->
  <template>
    <div>分支一-111111111111111111</div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  
  </style>
  
  ```

## 组件

- 可以使用Vue应用实例的`app.component()`方法,让组件在当前Vue应用中全局可用,而且是不用import就可以

- 全局注册之后可以在任何地方用,这意味着多个全局组件也可以在彼此内部互相使用

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'
  import AllOne from './components/study/AllOne.vue'
  import AllTwo from './components/study/AllTwo.vue'
  import './assets/main.css'
  const app = createApp(App);
  //这里就是注册组件,名其实可以随意起,不用和组件文件名相同,不过要遵循大驼峰
  app.component("AllOne",AllOne)
      .component("AllTwo",AllTwo);
  app.mount('#app')
  ```

  ```vue
  <!--全局组件AllOne-->
  <template>
    <div>全局组件1111111111</div>
  <!--这里就是在全局组件中使用另外的全局组件-->
    <AllTwo/>
  </template>
  
  <script setup>
  
  
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```vue
  <!--全局组件AllTwo-->
  <template>
    <div>全局组件2222222222</div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```vue
  <!--welcome组件,在app组件中有使用-->
  <template>
    <div class="item">
      <i>
        <slot name="icon"></slot>
      </i>
      <div class="details">
        <h3>
          <slot name="heading"></slot>
        </h3>
        <slot></slot>
      </div>
    </div>
  <!--在一般组件中使用全局组件-->
    <AllOne/>
  </template>
  ```

## props

- Vue3声明式API中,使用 `defineProps()` 宏来声明props

- 除了使用字符串数组来声明 prop 外，还可以使用对象的形式

  ```vue
  // 使用 <script setup>
  defineProps({
    title: String,
    likes: Number
  })
  ```

- 对于以对象形式声明中的每个属性，key 是 prop 的名称，而值则是该 prop 预期类型的构造函数。

### 细节

#### props名字格式

- 总结一句话就是组件名一般是大驼峰,组件上用属性传递props用小横杠隔开,子组件接收props用小驼峰

  ```vue
  <PropSon/>//组件名,大驼峰
  <PropSon :usual-intake="usualIntake" :reward-that="rewardThat"/>//组件上父传子组件属性,横杠隔开
  //子组件接收,小驼峰
  const props = defineProps({
    usualIntake: Number,
    rewardThat: Array
  });
  ```

#### 静态vs动态

- 静态就是在标签上直接属性=值

- 动态就是v-bind:属性=值/变量

  ```html
  <BlogPost title="My journey with Vue" />
  
  <!-- 根据一个变量的值动态传入 -->
  <BlogPost :title="post.title" />
  
  <!-- 根据一个更复杂表达式的值动态传入 -->
  <BlogPost :title="post.title + ' by ' + post.author.name" />
  ```

#### 不同类型

- **任何**类型的值都可以作为 props 的值被传递。
- 但是要注意,静态传递的全都会被当成字符串,一旦不是传递字符串格式的值,统统动态传递

> 不是字符串的值就等于一个JS表达式了,表达式就是可以写在return后边的句子

- 使用一个对象可以一次绑定多个props,对象的属性名就是props名,对象的值就是props的值

- 父组件

  ```vue
  <template>
  <PropSon :name="name" :usual-intake="usualIntake" :age="47" :is-man="true" :book="{name:'三体',num:120000}" :reward-that="rewardThat"
           v-bind="me" :mouth="undefined" :person="666" are-you-sure/>
  </template>
  <script setup>
  const name = ref(666)
  const usualIntake = ref(3362)
  const rewardThat = ["萧强","孢子","刘老六"];
  const me = {
  high: 182,
  weight: 194
  };
  </script>
  ```

- 子组件

  ```vue
  <template>
    <p>我是子组件PropSon</p>
    <p>限定类型部分,name:{{name}},age:{{age}},isMan:{{isMan}},usualIntake:{{usualIntake}},book:{{book}},rewardThat:{{rewardThat}},rewardThat:{{high}},weight:{{weight}}</p>
    <p>修改props的特殊情况,单独生成ref变量:{{sonName}},计算属性:{{computeName}}</p>
    <p>props校验,gender:{{gender}},mouth:{{mouth}},person:{{person}}</p>
    <p>Boolean类型转换:{{areYouSure}}</p>
  </template>
  
  <script setup>
  import {computed, ref} from "vue";
  import {Person} from "./person.js"
  const props = defineProps({
    name: String,
    age: Number,
    isMan: Boolean,
    usualIntake: Number,
    book: Object,
    rewardThat: Array,
    high: Number,
    weight: Number,
    snack: {
      required:true,
      type: String
    },
    gender:{
      type:String,
      default:"男"
    },
    mouth:{
      type:String,
      default:"罗技302"
    },
    person:Person,
    //无论声明类型的顺序如何，Boolean 类型的特殊转换规则都会被应用
    areYouSure:[Number,Boolean]
  });
  // props.name = "刘德华";
  const sonName = ref(props.name);
  const computeName = computed(()=>{
    return "开头-" + props.name + "-结尾"
  });
  //不能在 <script setup> 中的 defineProps() 函数中引用本地声明的变量，因为它将被提升到 setup() 函数之外。如果您的组件选项需要在模块作用域内进行初始化，则可以使用单独的普通 <script> 来导出选项。
  // class Person{
  //   constructor(firstName,lastName) {
  //     this.firstName = firstName;
  //     this.lastName = lastName;
  //   }
  // }
  </script>
  
  ```

### 单向数据流

- 所有的 props 都遵循着**单向绑定**原则，props 因父组件的更新而变化，自然地将新的状态向下流往子组件，而不会逆向传递。这避免了子组件意外修改父组件的状态的情况，不然应用的数据流将很容易变得混乱而难以理解。

> 简单一句话,传到子组件的props值不允许修改

- 只有两种情况是例外

  - 想把props的值作为一个局部数据

    ```vue
    <script setup>
        const props = defineProps({
            name: String,
        })
        const sonName = ref(props.name);
    </script>
    ```

    

  - 需要对传入的props值进行进一步转换

    ```vue
    <script setup>
        props = defineProps({
            name: String,
        })
        const computeName = computed(()=>{
            return "开头-" + props.name + "-结尾"
        });
    </script>
    ```

    

### props校验

- 要声明对 props 的校验，你可以向 `defineProps()` 宏提供一个带有 props 校验选项的对象，例如

- ```vue
  <script setup>
  import {Person} from "./person.js"
  const props = defineProps({
    snack: {
      required:true,
      type: String
    },
    gender:{
      type:String,
      default:"男"
    },
    mouth:{
      type:String,
      default:"罗技302"
    },
    person:Person,
    //无论声明类型的顺序如何，Boolean 类型的特殊转换规则都会被应用
    areYouSure:[Number,Boolean]
  });
  // props.name = "刘德华";
  const sonName = ref(props.name);
  const computeName = computed(()=>{
    return "开头-" + props.name + "-结尾"
  });
  //不能在 <script setup> 中的 defineProps() 函数中引用本地声明的变量，因为它将被提升到 setup() 函数之外。如果您的组件选项需要在模块作用域内进行初始化，则可以使用单独的普通 <script> 来导出选项。
  // class Person{
  //   constructor(firstName,lastName) {
  //     this.firstName = firstName;
  //     this.lastName = lastName;
  //   }
  // }
  </script>
  ```

> `defineProps()` 宏中的参数**不可以访问 `<script setup>` 中定义的其他变量**，因为在编译时整个表达式都会被移到外部的函数中。
>
> 案例就是我上面代码里写在 `<script setup>` 中的Person类

- 所有 prop 默认都是可选的，除非声明了 `required: true`。

- 除 `Boolean` 外的未传递的可选 prop 将会有一个默认值 `undefined`。

- `Boolean` 类型的未传递 prop 将被转换为 `false`。这可以通过为它设置 `default` 来更改——例如：设置为 `default: undefined` 将与非布尔类型的 prop 的行为保持一致。

- 如果声明了 `default` 值，那么在 prop 的值被解析为 `undefined` 时，无论 prop 是未被传递还是显式指明的 `undefined`，都会改为 `default` 值。

- **不符合类型**的都会在F12的console里**显示黄色警告**

  ```
  这个是设定了name为string类型,却传了666的值
  Vue warn]: Invalid prop: type check failed for prop "name". Expected String with value "666", got Number with value 666. 
  at <PropSon name=666 usual-intake=3362 age=47  ... > 
  at <PropFather> 
  at <App>
  这个是设置了snack为required:true却没有从父组件中传递
  [Vue warn]: Missing required prop: "snack" 
  at <PropSon name=666 usual-intake=3362 age=47  ... > 
  at <PropFather> 
  at <App>
  这个是设置了person的类结构,传过来的值却是个666
  [Vue warn]: Invalid prop: type check failed for prop "person". Expected Person, got Number with value 666. 
  at <PropSon name=666 usual-intake=3362 age=47  ... > 
  at <PropFather> 
  at <App>
  ```

### Boolean类型转换

- 但凡是设置为Boolean的类型的props,如果直接写这个属性名在组件标签上,默认就是true值,不写就是false值

  ```html
  <!-- 等同于传入 :disabled="true" -->
  <MyComponent disabled />
  
  <!-- 等同于传入 :disabled="false" -->
  <MyComponent />
  ```

- 当一个 prop 被声明为允许多种类型时,无论声明类型的顺序如何，`Boolean` 类型的特殊转换规则都会被应用。

  ```vue
  defineProps({
    disabled: [Boolean, Number]
  })
  ```

> 意思就是设置某个props可以为多种类型,但是其中一种有Boolean,那么此时如果直接写这个属性名在组件标签上,默认就是true值,不写就是false值

## 事件

- 组件的事件监听器也可以加修饰符,比如`.once`

  ```vue
  <TextZone @bigger.once="bigger"/>
  ```

- 像组件与 prop 一样，事件的名字也提供了自动的格式转换。注意这里我们触发了一个以小驼峰形式命名的事件，但在父组件中可以使用横杠分隔形式来监听。与 [prop 大小写格式](https://cn.vuejs.org/guide/components/props.html#prop-name-casing)一样，在模板中我们也推荐使用横杠分隔形式来编写监听器。

  ```vue
  <!--父组件中,传递过来的小驼峰命名的事件名,在子组件标签上写的时候写为小横杠隔开的格式可以被自动对应上-->
  <TextZone @bigger.once="bigger" @small="small" @print-str="printStr"/>
  
  <script setup>
  const printStr = (str)=>{
    console.log(`父组件的printStr方法中得到的字符串:${str.value}`)
  }
  </script>
  ```

  ```vue
  <!--子组件中,传递到父组件的事件名应该是小驼峰命名-->
  <input type="text" @keyup="printStr" v-model="inputStr">
  
  <script setup>
  const inputStr = ref("");
  const num = ref(0.2);
  const emits = defineEmits({
    bigger: (num) => {
      //这里是参数验证,返回的如果是false,则验证不通过,效果就是会在F12的console后台报一条黄色[Vue warn]: Invalid event arguments: event validation failed for event "bigger".
      //如果是返回true则验证通过
      return (num > 0.2);
    },
    small: null,
    //这里如果直接在方法体里使用本文件script中定义的局部变量会报错
    printStr: (str) => {
      return typeof str === "string" && str.value.length > 0
    }
  })
  const printStr = () => {
    console.log(`触发printStr方法`)
    emits('printStr', inputStr);
  }
  </script>
  ```

### 声明触发的事件

- 在Vue3组合式API中,使用 [`defineEmits()`](https://cn.vuejs.org/api/sfc-script-setup.html#defineprops-defineemits) 宏来声明它要触发的事件,然后需要在函数中调用emit()方法把事件实际传递到父组件监听
  - 如果只使用defineEmits而不使用emit()，那么组件就无法向父组件发送任何事件，因为emit()是触发事件的函数。
  - 如果只使用emit()而不使用defineEmits或emits选项，那么组件就无法清晰地声明它可以发出的事件，这可能会导致代码混乱和缺乏文档。另外，在Vue 3中，如果没有在emits选项中定义事件，那么它们将被视为原生事件，并且不能被父组件的v-on监听器捕获。

```VUE
<template>
  <div>
    <h4>吴 加 亮 布 四 斗 五 方 旗 　 宋 公 明 排 九 宫 八 卦 阵</h4>
    <p>御 营 中 选 到 左 羽 右 翼 良 将 二 员 为 中 军 ， 那 二 人 ： 御 前 飞
      龙 大 将 酆 美 ； 御 前 飞 虎 大 将 毕 胜 。</p>
    <!--    <button @click="$emit('bigger')">放大字体</button>-->
    <button @click="bigger">放大字体</button>
    <button @dblclick="small">缩小字体</button>
  </div>
</template>

<script setup>
import {ref} from "vue";

const num = ref(0.2);
//这里是声明有哪些事件要传到父组件
const emits = defineEmits(['bigger','small']);
//在这里是实际使用emit传递事件到父组件监听
const bigger = () => {
  console.log(`触发bigger方法`)
  emits('bigger', num);
}
const small = () => {
  console.log(`触发small方法`)
  //这里如果直接传递0..2,到父组件中参数会被识别为字符串,导致做加减法的时候会把数字变为NaN,使用ref包裹则没有这个问题
  emits('small', ref(0.2), 666)
}
</script>
```

```vue
<!--父组件接收事件,并完成在父类中的具体实现-->
<TextZone @bigger.once="bigger" @small="small"/>
<script setup>
const bigger = (num)=>{
  console.log(`父组件的bigger方法参数:${JSON.stringify(num)}`)
  console.log(`父组件的bigger方法前:${fontSize.value}`)
  fontSize.value += num.value;
  console.log(`父组件的bigger方法后:${fontSize.value}`)
}
const small = (num,printNum)=>{
  console.log(`父组件的small方法前:${fontSize.value}`)
  fontSize.value -= num.value;
  console.log(`父组件的small方法后:${fontSize.value}`)
  console.log(`父组件中small方法打印参数为:${printNum}`)
}
</script>
```



> 如果一个原生事件的名字 (例如 `click`) 被定义在 `emits` 选项中，则监听器只会监听组件触发的 `click` 事件而不会再响应原生的 `click` 事件。

### 事件校验

- 和对 props 添加类型校验的方式类似，所有触发的事件也可以使用**对象形式**来描述。

- 要为事件添加校验，那么事件可以被赋值为一个函数，**接受的参数**就是抛出事件时**传入 `emit` 的内容**，**返回一个布尔值**来表明事件是否合法。

  ```vue
  <template>
    <div>
      <h4>吴 加 亮 布 四 斗 五 方 旗 　 宋 公 明 排 九 宫 八 卦 阵</h4>
      <p>御 营 中 选 到 左 羽 右 翼 良 将 二 员 为 中 军 ， 那 二 人 ： 御 前 飞
        龙 大 将 酆 美 ； 御 前 飞 虎 大 将 毕 胜 。</p>
      <!--    <button @click="$emit('bigger')">放大字体</button>-->
      <button @click="bigger">放大字体</button>
      <button @dblclick="small">缩小字体</button>
      <input type="text" @keyup="printStr" v-model="inputStr">
    </div>
  </template>
  
  <script setup>
  import {ref} from "vue";
  
  const inputStr = ref("");
  const num = ref(0.2);
  //使用对象形式,就可以做事件参数校验了
  const emits = defineEmits({
    bigger: (num) => {
      //这里是参数验证,返回的如果是false,则验证不通过,效果就是会在F12的console后台报一条黄色[Vue warn]: Invalid event arguments: event validation failed for event "bigger".
      //如果是返回true则验证通过
      return (num > 0.2);
    },
    small: null,
    //这里如果直接在方法体里使用本文件script中定义的局部变量会报错
    printStr: (str) => {
      return typeof str === "string" && str.value.length > 0
    }
  })
  const bigger = () => {
    console.log(`触发bigger方法`)
    emits('bigger', num);
  }
  const small = () => {
    console.log(`触发small方法`)
    //这里如果直接传递0..2,到父组件中参数会被识别为字符串,导致做加减法的时候会把数字变为NaN,使用ref包裹则没有这个问题
    emits('small', ref(0.2), 666)
  }
  const printStr = () => {
    console.log(`触发printStr方法`)
    emits('printStr', inputStr);
  }
  </script>
  ```

  ```vue
  <!--父组件中实现具体事件-->
  <TextZone @bigger.once="bigger" @small="small" @print-str="printStr"/>
  <script setup>
  const bigger = (num)=>{
    console.log(`父组件的bigger方法参数:${JSON.stringify(num)}`)
    console.log(`父组件的bigger方法前:${fontSize.value}`)
    fontSize.value += num.value;
    console.log(`父组件的bigger方法后:${fontSize.value}`)
  }
  const small = (num,printNum)=>{
    console.log(`父组件的small方法前:${fontSize.value}`)
    fontSize.value -= num.value;
    console.log(`父组件的small方法后:${fontSize.value}`)
    console.log(`父组件中small方法打印参数为:${printNum}`)
  }
  const printStr = (str)=>{
    console.log(`父组件的printStr方法中得到的字符串:${str.value}`)
  }
  </script>
  ```

  

## 组件v-model

- 之前我还有疑惑,Vue官方明明是不希望组件内修改外部传入的数据,为啥官方教程里还在教组件的v-model双向绑定?
- 之后才明白,Vue官方教程里的**组件的v-model**双向绑定**并不是真正的修改外部传入的数据**，而是通过**触发一个事件来通知父组件更新数据**。这样做的好处是可以让父组件对数据的变化有更多的控制权，也可以避免子组件直接修改父组件的状态而导致不可预期的结果。所以，v-model指令在组件上其实是一个语法糖，它相当于传递了一个prop和监听了一个事件。

- 组件的双向绑定不是简单的在子组件的标签上加一个v-model就可以完成的,因为已经跨组件了
- 这里举例子组件内部是一个输入框,双向绑定父组件中的一个属性,组件内部需要做两件事：
  1. 将内部原生 `<input>` 元素的 `value` attribute 绑定到 `modelValue` prop
  2. 当原生的 `input` 事件触发时，触发一个携带了新值的 `update:modelValue` 自定义事件

```vue
<!--子组件-->
<template>
<div>
    <input :value="modelValue" @input="$emit('update:modelValue',$event.target.value)"/>
    </div>
</template>

<script setup>
    //默认方式实现组件v-model
    defineProps(["modelValue"]);
    defineEmits(["update:modelValue"]);
</script>

<style scoped>

</style>

```

```vue
<!--父组件-->
<p>组件v-model</p>
<div>本身这个框绑定的value值:{{onlyElementModelValue}}</div>
<ElementModel v-model="onlyElementModelValue" />

<script>
    //组件v-model
    const onlyElementModelValue = ref("");
</script>
```

- **一定要注意**,这里父组件中我们是直接使用的`v-model=某个属性`,因此这是**没指定传输的数据名称**的,所以在**子组件中接收的数据名称**是**固定的`modelValue`**,一个字母都不能错,错了就识别不出来,input元素的**更新数据方法也是固定格式**,`update:数据名称`,默认就是`update:modelValue`

- 还有一种方式可以实现组件内v-model,使用一个可写的，同时具有 getter 和 setter 的 `computed` 属性。`get` 方法需返回 `modelValue` prop，而 `set` 方法需触发相应的事件

  ```vue
  <template>
    <div>
      <input  v-model="value"/>
    </div>
  </template>
  
  <script setup>
     import {computed} from "vue";
    computed方式实现组件v-model
     const prop = defineProps(["modelValue"]);
     const emit = defineEmits(["update:modelValue"])
    
     const value = computed({
       get(){
         return prop.modelValue;
       },
       set(value){
         emit("update:modelValue",value)
       }
     });
  </script>
  
  <style scoped>
  
  </style>
  
  ```

### 参数

- **默认情况**下，`v-model` 在组件上都是**使用 `modelValue` 作为 prop**，并以 `update:modelValue` 作为对应的事件。我们可以通过给 `v-model` 指定一个参数来**更改这些名字**,指定的方式就是在`v-model`后面加个冒号然后跟自定义的prop名

- 在这个例子中，子组件应声明一个 `title` prop，并通过触发 `update:title` 事件更新父组件值

  ```vue
  <!--子组件-->
  <template>
    <div>
      <!--v-model同时指定属性名称-->
      <input :value="title" @input="$emit('update:title',$event.target.value)"/>
    </div>
  </template>
  
  <script setup>
     defineProps(["title"]);
     defineEmits(["update:title"]);
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```vue
  <!--父组件-->
  <p>组件v-model</p>
  <div>本身这个框绑定的title值:{{onlyElementModelTitle}}</div>
  <ElementModel v-model:title="onlyElementModelTitle" />
  
  <script>
      //组件v-model
      const onlyElementModelTitle = ref("");
  </script>
  ```

### 绑定多个v-model

- 参数部分已经知道可以自定义prop名,从而等于自定义事件名,这样就可以在单个组件上创建多个`v-model`双向绑定

  ```vue
  <!--子组件-->
  <template>
    <div>
      <!--默认方式实现组件v-model-->
      <input :value="modelValue" @input="$emit('update:modelValue',$event.target.value)"/>
      <!--v-model同时指定属性名称-->
      <input :value="title" @input="$emit('update:title',$event.target.value)"/>
    </div>
  </template>
  
  <script setup>
     defineProps(["modelValue","title"]);
     defineEmits(["update:modelValue","update:title"]);
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```vue
  <!--父组件-->
  <p>组件v-model</p>
  <div>本身这个框绑定的value值:{{onlyElementModelValue}},本身这个框绑定的title值:{{onlyElementModelTitle}}</div>
  <ElementModel v-model:title="onlyElementModelTitle" v-model="onlyElementModelValue"/>
  
  <script>
      //组件v-model
      const onlyElementModelValue = ref("");
      const onlyElementModelTitle = ref("");
  </script>
  ```

### v-model修饰符

- 之前学习输入绑定,知道了`v-model`有很多内置修饰符,但是有时候我们可能需要一个自定义修饰符
- 举个例子,现在要创建一个叫big的修饰符,会让输入框输入的字符串第一个字母变为大写
- 组件标签上的v-model上添加的修饰符可以通过组件内部 `modelModifiers` prop 在组件内访问到

> 要注意,modelModifiers要通过对象形式取到,而且**名字**也是**固定**的,类似之前的modelValue

- 下面的组件中我们声明了 `modelModifiers` 这个 prop，它的默认值是一个空对象

- 在模板中的 `v-model` 绑定 `v-model.big="某个响应式对象"` 上被使用了。所以这时的`props.modelModifiers`对象中,包含了big修饰符,且值为true.`console.log(props.modelModifiers) *// { big: true }*`

- 有了这个 prop，我们就可以检查 `modelModifiers` 对象的键，并编写一个处理函数来改变抛出的值。

  ```vue
  <template>
  <div>
      <!--自定义修饰符-->
      <input type="text" :value="modelValue" @input="emitValue"/>
      </div>
  </template>
  
  <script setup>
      //自定义修饰符
      const prop = defineProps({
          modelValue:String,
          //这里定义出自定义修饰符
          modelModifiers:{
              default:()=>{}
          }
      });
      const emit = defineEmits(["update:modelValue"]);
      //input输入文字时,触发自定义函数,进行数据的修改以及抛出事件给父组件,让父组件修改源数据
      function emitValue(e){
          let value = e.target.value;
          if(prop.modelModifiers.big){
              value = value.charAt(0).toUpperCase() + value.slice(1);
          }
          emit("update:modelValue",value);
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```vue
  <!--父组件-->
  <ElementModel v-model.big="onlyElementModelValue"/>
  ```

  

- 对于又有参数又有修饰符的 `v-model` 绑定，生成的 prop 名将是 `arg + "Modifiers"`。

> 意思就是,同时自定义了参数名和自定义修饰符,传入子组件中的自定义修饰符对象的名字就会是`参数名+Modifiers`
>
> 比如`v-model:title.big`,生成的自定义修饰符对象名字就是`titleModifiers`

```vue
<template>
  <div>
    <!--同时指定v-model属性名+自定义修饰符-->
    <input type="text" :value="title" @input="$emit('update:title',$event.target.value)"/>
  </div>
</template>

<script setup>
//同时指定v-model属性名+自定义修饰符
  const prop = defineProps(["title","titleModifiers"]);
 defineEmits(["update:title"])
</script>

<style scoped>

</style>

```

```vue
<!--父组件-->
<ElementModel v-model:title.big="onlyElementModelTitle"/>
```

## 透传Attributes

### Attributes继承

- “透传 attribute”指的是传递给一个组件，却没有被该组件声明为 [props](https://cn.vuejs.org/guide/components/props.html) 或 [emits](https://cn.vuejs.org/guide/components/events.html#defining-custom-events) 的 attribute 或者 `v-on` 事件监听器。最常见的例子就是 `class`、`style` 和 `id`。
- 当一个组件以单个元素为根作渲染时，透传的 attribute 会自动被添加到根元素上。

> 通俗点说就是,假如在当前组件A中引入了一个子组件B,这个子组件B里就一个元素,也就是只有一个根元素了,那样的话,在组件A中使用子组件B的标签,并在标签上标注一些特殊属性比如class,style,id,标注v-on的监听事件比如click之类的,都会被直接传递到子组件B中,标注在子组件B的根元素上

```vue
<!--父组件-->  
<p>属性透传</p>
<Transmit class="good" />
```

```vue
<!--子组件-->  
<!--最终渲染出<button class="good">-->  
<template>
普通的透传按钮元素 
<button>InnerTransmit组件按钮</button>
</template>
```



- 而且如果子组件的根元素上已经有了class或style,就会和父组件中写在子组件标签上的class和style结合

> 比如父组件中的子组件标签是这样`<MyButton class="large" />`
>
> 子组件根元素本身是这样`<button class="btn">click me</button>`
>
> 最后渲染出来就是这样`<button class="btn large">click me</button>`

- 同样的规则也适用于v-on监听器,监听器比如click会添加到子组件根元素上,当子组件原生的元素被点击,触发父组件的onClick方法,如果子组件原生元素也有click方法,那就点击时两个同时触发

  ```vue
  <!--父组件-->  
  <p>属性透传</p>
  <Transmit @click="printFood" />
  
  <script setup>
      function printFood(){
          console.log(`今天吃牛霖`)
      }
  </script>
  ```

  ```vue
  <!--子组件-->
  <template>
  <!--透传click事件-->
    <button @click="printFoodInner">Transmit组件按钮</button>
  </template>
  
  <script setup>
      //点击按钮同时触发子组件的printFoodInner和父组件透传进来的printFood,实测是先触发子组件的后触发父组件的
      function printFoodInner(){
          console.log(`今天吃低脂奶酪`)
      }
  </script>
  
  ```

#### 深层组件继承

- 有的时候下一个组件会在根节点上渲染另一个组件(`也就是子组件中又有个子组件,套娃`)
- 这时候特殊的属性和事件就会一路透传下去到最后一个子组件
  - 透传的 attribute 不会包含 `子组件` 上声明过的 props 或是针对 `emits` 声明事件的 `v-on` 侦听函数，换句话说，声明过的 props 和侦听函数被 `子组件`“消费”了。
  - 透传的 attribute 若符合声明，也可以作为 props 传入 `最末端的子组件`。

```vue
<!--父组件-->  
<p>属性透传</p>
<Transmit @click="printFood" class="good" :weight="193.8"/>

<script setup>
    function printFood(){
        console.log(`今天吃牛霖`)
    }
</script>
```

```vue
<!--第一层子组件Transmit-->
<template>
  <!--透传两层属性-->
  <InnerTransmit/>
</template>

<script setup>
import InnerTransmit from "./second/InnerTransmit.vue"
//defineProps抓取prop,如果不定义为变量,那么只能在template中直接根据defineProps中接收的prop名来双括号使用
//如果要在script setup中使用则必须把defineProps定义为变量,再使用这个变量.prop名来获取prop的值,如果像template中那么使用会导致页面重复渲染
//像weight这种prop被我们半路截下,也就不会透传到更深层组件了
const props = defineProps(["weight"]);
console.log(`Transmit截取到的prop属性weight:${props.weight}`);
</script>

<style scoped>

</style>

```

```vue
<!--第二层子组件Transmit-->
<template>
<!-- 普通的透传按钮元素 -->
<!-- 最终渲染出的就是<button  @click="printFood" class="good">,weight属性作为prop被上一个组件取用了 -->
  <button>InnerTransmit组件按钮{{$attrs}}</button>
</template>

<script setup>
//子组件中必须是单独元素才可以传递监听事件,哪怕加一个双层括号取一些全局变量{{$attrs}}也会导致监听事件透传失败
</script>

<style scoped>

</style>

```

### 禁用Attributes继承

- 如果你**不想要**一个组件自动地继承 attribute，你可以在组件选项中设置 `inheritAttrs: false`。

- 如果你使用了 `<script setup>`，你需要一个额外的 `<script>` 块来书写这个选项声明

  ```vue
  <script>
  // 使用普通的 <script> 来声明选项
  export default {
    inheritAttrs: false
  }
  </script>
  
  <script setup>
  // ...setup 部分逻辑
  </script>
  ```

- 透传进来的 attribute 可以在模板的表达式中**直接用 `$attrs` 访问到**。

> ```vue
> <!--但是要注意,如果这样写,组件就不再被识别为只有一个根元素了,会影响透传-->
> <template>
> <button>按钮</button>
> {{attrs}}
> </template>
> ```
>
> 

- 这个 `$attrs` 对象包含了除组件所声明的 `props` 和 `emits` 之外的所有其他 attribute，例如 `class`，`style`，`v-on` 监听器等等。

  - 和 props 有所不同，透传 attributes 在 JavaScript 中**保留了它们原始的大小写**，所以像 `foo-bar` 这样的一个 attribute 需要通过 `$attrs['foo-bar']` 来访问。
  - 像 `@click` 这样的一个 `v-on` 事件监听器将在此对象下被**暴露为一个函数 `$attrs.onClick`。**

- 有时可能会存在最末端的子组件,不止一个根元素,基本分为两种情况

  - 为了样式,根元素被div包裹起来了

    - 这时我们想要让可以**透传**的属性和事件都**作用到内层的元素**上,**官方文档**告诉我,可以通过**设定 `inheritAttrs: false` 和使用 `v-bind="$attrs"` 来实现**

    - 但是我个人实验发现**只使用`v-bind="$attrs"`就可以做到**

      ```vue
      <!--父组件-->  
      <p>属性透传</p>
      <Transmit @click="printFood" class="good" :weight="193.8"/>
      
      <script setup>
          function printFood(){
              console.log(`今天吃牛霖`)
          }
      </script>
      ```

      ```vue
      <!--第一层子组件Transmit-->
      <template>
        <!--透传两层属性-->
        <InnerTransmit/>
      </template>
      
      <script setup>
      import InnerTransmit from "./second/InnerTransmit.vue"
      //defineProps抓取prop,如果不定义为变量,那么只能在template中直接根据defineProps中接收的prop名来双括号使用
      //如果要在script setup中使用则必须把defineProps定义为变量,再使用这个变量.prop名来获取prop的值,如果像template中那么使用会导致页面重复渲染
      //像weight这种prop被我们半路截下,也就不会透传到更深层组件了
      const props = defineProps(["weight"]);
      console.log(`Transmit截取到的prop属性weight:${props.weight}`);
      </script>
      
      <style scoped>
      
      </style>
      
      ```

      ```vue
      <!--第二层子组件Transmit-->
      <template>
      <!--  多层包裹,把透传的属性和事件选择性放在某个元素上-->
      	<div class="green">
              <!-- 这样透传过来的class以及点击事件就都绑定到这个button上了-->
          	<button v-bind="$attrs">InnerTransmit组件按钮</button>
          </div>
      </template>
      
      <script setup>
          //子组件中必须是单独元素才可以传递监听事件,哪怕加一个双层括号取一些全局变量{{$attrs}}也会导致监听事件透传失败
      </script>
      
      <style scoped>
      
      </style>
      
      ```

      > [没有参数的 `v-bind`](https://cn.vuejs.org/guide/essentials/template-syntax.html#dynamically-binding-multiple-attributes) 会将一个对象的所有属性都作为 attribute 应用到目标元素上。
      >
      > 没有参数的v-bind就是`v-bind=xxx`,有参数的是`v-bind:name=xxx`
      >
      > 比如有个对象`{class:abc,style:{color:red}}`,没有参数的v-bind绑定这个对象到某个元素上相当于一次性绑定了class和style这两个属性给这个元素

  - 同时存在多个根元素同级

    - 和单根节点组件有所不同，有着多个根节点的组件没有自动 attribute 透传行为。如果 `$attrs` 没有被显式绑定，将会抛出一个**运行时警告**。

    - 如果 `$attrs` 被显式绑定，则不会有警告

      ```vue
      <template>
      <!--
      这样会因为最深层不是一个根节点导致透传不知道传给谁,控制台报错
      runtime-core.esm-bundler.js:40 [Vue warn]: Extraneous non-props attributes (class) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.
        at <InnerTransmit onClick=fn<printFood> class="good" >
        at <Transmit onClick=fn<printFood> class="good" weight=193.8 >
        at <App>
      runtime-core.esm-bundler.js:40 [Vue warn]: Extraneous non-emits event listeners (click) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.
        at <InnerTransmit onClick=fn<printFood> class="good" >
        at <Transmit onClick=fn<printFood> class="good" weight=193.8 >
        at <App>
      runtime-core.esm-bundler.js:40 [Vue warn]: Extraneous non-props attributes (class) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.
        at <WelcomeItem class="kkkkk" >
        at <TheWelcome class="kkkkk" ref="welcome" >
        at <App>
      -->
        <div>第一个div</div>
        <span v-bind="$attrs">第二个span</span>
        <div>第三个div</div>
      </template>
      
      <script setup>
      //子组件中必须是单独元素才可以传递监听事件,哪怕加一个双层括号取一些全局变量{{$attrs}}也会导致监听事件透传失败
      </script>
      
      <style scoped>
      
      </style>
      
      ```

      

### 在JS中访问透传Attributes

- 如果需要，你可以在 `<script setup>` 中使用 `useAttrs()` API 来访问一个组件的所有透传 attribute

  ```vue
  <script setup>
  import { useAttrs } from 'vue'
  
  const attrs = useAttrs()
  </script>
  ```


## 插槽

