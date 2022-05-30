## 李炎恢B站Vue教程核心篇笔记

### 创建Vue对象

- new的一个新Vue对象只对el定义的元素范围内起作用,范围外的部分是不起作用的.

  ```js
  const app = new Vue
  ```

  ```html
  <div id="app">
      //这个div里才起作用
      {{message}}
      <button v-on:click="duang">点击</button>
  </div>
  ```

- el后面可以像CSS一样的语法定位具体元素,比如用id就是`#id`,用class定位就是`.class`.

- 如果不想数据被修改,可以把data后面的对象定义在Vue对象外部,并且进行`Object.freeze()`.

- 在浏览器使用`app.message`,这里的app实际上是你new出来的Vue对象的名字.

```js
//没错就是这里的这个app
const app = new Vue
```

- 如果不想使用`Object.freeze()`也要禁止更新,那就使用`v-once`,这样插值就只能渲染一次不能更新了.

### v-html

- 使用`{{data}}`这样插值默认插入纯文本值,如果你想插入html,他也会把所有标签当字符串插入,所以要是用`v-html`即可插入你想插入到指定位置的html.

  ```html
  <span v-html="table"></span>
  最后效果是插入一个新的span标签到这个span标签的里面
  ```

  ```js
  const createVue = {
          message : "Hello vue!",
          table : "<span style=\"color: aqua\">颜色</span>",
      };
      // Object.freeze(createVue);
      const app = new Vue(
          {
              el : "#app",
              data : createVue,
              methods: {
                  duang : function () {
                      alert("很黑,很柔,很亮");
                  }
              },
          }
      );
  ```

### v-bind

- `{{data}}`不能作用于标签的属性上比如class,这时候就要用v-bind,这个模板语法可以绑定标签上的所有属性,包括style,class之类的.简写为`:class`.

  ```html
  <span v-bind:class="color">颜色</span>
  ```

  ```js
  const createVue = {
          message : "Hello vue!",
          table : "<span style=\"color: aqua\">颜色</span>",
          color : "red",
      };
  ```

- 模板语法里支持js表达式,但是不支持语句,比如赋值条件判断.

  ```html
  <div>{{num + 1}}</div>
  <div>{{true ? '真' : '假'}}</div>
  <div>{{message.split('')}}</div>
  
  <div>{{ 1 + 1 }}{{true?"真":"假"}}{{message.split(" ")}}</div>
  最终效果 : 2真[ "Hello", "vue!" ]
  ```

- v-if可以决定最后是否显示某个元素,if后面的值为true则显示.

- v-on是触发事件,也就是点击,浮动这些`v-on:click`,也可以缩写为`@click`

### 计算属性

- 当插入的模板比较复杂时,直接使用`{{data}}`一次次渲染就很难维护代码,可能出现看不懂的情况

- 如果直接在`methods`中定义方法拼接模板中的字符,可以解决,但是方法不会缓存,执行多次就可能影响性能

  ```js
  methods: {
      welcome(){
          console.log("welcome"+Math.random());
          return this.start+this.message+this.end;
      }
  },
  //模板里使用方法要带括号{{welcome()}}{{welcome()}}{{welcome()}}
  ```

- 所以vue里有个计算属性,`computed`,把方法定义在这里,再使用的话是**有缓存**的.**计算属性专门处理复杂逻辑.**

  ```js
  computed:{
      welcome(){
          console.log("welcome"+Math.random());
          return this.start+this.message+this.end;
      }
  }
  //模板里使用计算属性不用带括号{{welcome}}{{welcome}}{{welcome}}
  ```

---

### getter,setter

- vue也有其他语言里的getter,setter

- 只不过在`computed`中getter很常用,而setter很少用,所以默认直接写方法就是getter.

  ```js
  computed:{
      //直接写就是getter
      welcome(){
          console.log("welcome"+Math.random());
          return this.start+this.message+this.end;
      }
      //特别定义出get来就可以再定义set出来了,这时方法去掉括号
      welcome:{
          get(){
              console.log("welcome"+Math.random());
              return this.start+this.message+this.end;
          },
              set(val){
                  this.start = val.split(",")[0];
                  this.end = val.split(",")[1];
              }
      }
  }
  ```

---

### v-bind决定元素样式

- `v-bind`绑定class,可以决定元素样式

- 一共有四种方式

  1. 在data中定义决定class的一个boolean格式的数据,然后在元素的`v-bind:vlass`上使用`{class : isClass}`来表示是否加上这个class,true则加,false则不加

     ```js
     const dataObj = {
         message : "Hello vue!",
         isActive : true,
         isBold : false,
     }
     ```

     ```html
     <div class="main" v-bind:class="{active : isActive,bold : isBold}">
         {{message}}
     </div>
     ```

  2. 第一种容易在元素上写的太长,不便于后期维护,那第二种我们可以把判断直接写在data范围内.

     ```js
     const dataObj = {
         message : "Hello vue!",
         isClass : {
             active : true,
             bold : false
         }
     }
     ```

     ```html
     <div class="main" v-bind:class="isClass">
         {{message}}
     </div>
     ```

  3. 第三种方法数组添加,简单暴力

     ```js
     const dataObj = {
         message : "Hello vue!",
         active : 'active',
         bold : 'bold'
     }
     ```

     ```html
     <div class="main" v-bind:class="[active,bold]">
         {{message}}
     </div>
     ```

  4. 第四种是如果这个class是否携带判断比较复杂,可以使用计算属性`computed`

     ```js
     computed:{
         ifClass(){
             //复杂的逻辑判断
             return {
                 active : true,
                 bold : false
             }
         }
     }
     ```

     ```html
     <div class="main" v-bind:class="ifClass">
         {{message}}
     </div>
     ```

- 绑定style一样是四种

  1. ```js
     const dataObj = {
         message : "Hello vue!",
         wantColor : "blue",
     
     }
     ```

     ```html
     <div style="font-size: 20px;color: red" v-bind:style="{color : wantColor}">
         {{message}}
     </div>
     ```

  2. ```js
     const dataObj = {
         message : "Hello vue!",
         wantColor : {
             color  : "blue",
         }
     }
     ```

     ```html
     <div style="font-size: 20px;color: red" v-bind:style="wantColor">
         {{message}}
     </div>
     ```

  3. ```js
     const dataObj = {
         message : "Hello vue!",
         wantColor : {
             color  : "blue",
             fontSize : "40px",
         }
     }
     ```

     ```html
     <div style="font-size: 20px;color: red" v-bind:style="wantColor">
         {{message}}
     </div>
     ```

  4. ```js
     computed:{
         wantColor (){
             //复杂逻辑
             return {
                 color  : "blue",
                 fontSize : "30px",
             }
         }
     }
     ```

     ```html
     <div style="font-size: 20px;color: red" v-bind:style="wantColor">
         {{message}}
     </div>
     ```

---

### v-if,v-esleif,v-show等对显示隐藏的作用

- v-if等于的值为true则显示该元素,为false则不显示.
- 也有v-else-if,和v-else,用法和一般语言的判断是一样的,但是这俩前面一定要有v-if
- v-show则不是渲染与否,而是隐藏与展示的区别,为false的时候是把元素隐藏了,v-if是直接把元素注释了.
- template标签存放多个元素做渲染分组,这种渲染不会从头渲染,如果两个tem标签中有相同的部分,它只会渲染剩余不同的部分.

---

### v-for

- v-for可以像for循环一样循环渲染同个标签

- 格式是`v-for="单体 in 数组"`,用模板拿数据就使用单体.属性即可

  ```js
  const dataObj = {
      arr : [
          {
              name : "埼玉"
          },
          {
              name : "吹雪"
          },
          {
              name : "龙卷"
          }
      ],
  }
  ```

  ```html
  <div id="app">
      <ul>
          <li v-for="man in arr">
              {{man.name}}
          </li>
      </ul>
  </div>
  ```

- 也可以多写一个index获取遍历时的索引

- 这里的in是js的语法,使用ES6的for替代也一样可以

  ```html
  <ul>
      <li v-for="(man,index) in arr">//不加括号也行
          {{index}}{{man.name}}
      </li>
  </ul>
  ```

---

- v-for也可以遍历对象,默认拿到的是对象属性的value,也可以按value,name,key的属性拿到对象的所有信息.

  ```html
  <li v-for="man in obj">
      {{man}}
  </li>
  <li v-for="(value,name,key) in obj">
      {{key}}{{name}}{{value}}
  </li>
  ```

---

- 假如你想在每次循环的时候插入点别的东西,那就使用`<template>`包裹起来,对这个标签循环,然后里面放你原先循环的元素标签以及你想加的东西就可以

  ```html
  <template v-for="man in arr">
      <li>
          {{man.name}}
      </li>
      <li>---------</li>
  </template>
  ```

---

- 也可以进行数字的循环

  ```html
  <li v-for="n in 10">
      {{n}}
  </li>
  ```

---

- 可以使用v-if过滤掉某些元素,但是最好不要v-if和v-for一起在一个元素上使用,因为v-for的级别更高,每次循环都得重复执行一遍,而且屏蔽的元素只是不显示,还是渲染了的.

  ```html
  <li v-for="man in arr" v-if="flag">
      {{man.name}}
  </li>
  <li v-for="man in arr" v-if="man.name != '埼玉'">
      {{man.name}}
  </li>
  ```

- 最好使用`<template>`标签包裹,然后在这个标签上使用循环.内部标签使用屏蔽

  ```html
  <template v-for="man in arr">
      <li v-if="man.name != '埼玉'">
          {{man.name}}
      </li>
  </template>
  ```

- 也可以把属性改为计算属性,过滤后再循环

  ```html
  <li v-for="man in af">
      {{man.name}}
  </li>
  ```

---

### 变异方法(改变数据同时改变渲染)

- 要使用变异式方法(执行之后直接改变数组内容,而不是创建一个新数组,原先的数组不变),就可以在**改变数据的同时也改变渲染**,不然的话只改变了数据,**不重新渲染是没有意义**的.

- **变异方法**有大概这些`push()/pop()/shift()/unshift()/splice()/sort()/reverse();`

- 包括Vue本身的set方法

- 打个比方,现在列表每一行都有一个选项checkbox,如果直接循环,在变异方法增加行的时候,本身选中的那行如果是第二行,第二行的数据被挤走了,它还是会选第二行,为了避免这个问题,必须在你循环的数组中有一个唯一的id属性,在v-for的元素上 `v-bind:key = 元素.id`,就可以在变动时依然选中原先选中的元素

  ```js
  methods: {
      add(){
          this.arr.unshift({id:4,name:"无证"});
      }
  },
  ```

  ```html
  <div id="app">
      <button v-on:click="add">点击</button>
      <ul>
  
          <li v-for="man in arr" v-bind:key = man.id>
              <input type="checkbox">
              {{man.name}}
          </li>
      </ul>
  </div>
  ```

  

### 事件对象event

- 方法触发的时候可以得到事件`event`.

- 直接使用都可以,但是不推荐,如果放在参数里,最好写event这个单词,但是如果把事件放在第二个参数,就不行了,这时候可以在`v-on`的方法括号中写`$event`即可在不是第一个参数的位置拿到事件.

  ```html
  <div>
      <button v-on:click="greet">执行事件</button>
  </div>
  <div>
      <button v-on:click="and('tom',$event)">点击拼接</button>
  </div>
  ```

  ```js
  methods: {
      greet(){
          alert(this.message+event.target.innerText);
      },
          and(word,event){
              alert("hello"+word+event.target.innerText);
          }
  },
  ```

---

- 事件也可以阻止冒泡,但是不推荐用事件`event.stopxxx`那个方法.

- vue中有事件修饰符,可以直接写在`v-on`的动作后面,比如阻止冒泡,比如回车触发

  ```html
  <div  v-on:click="and('jerry',$event)">
      <button v-on:click.stop="and('tom',$event)">点击拼接</button>
  </div>
  想阻止谁冒泡就加给谁stop
  ```

  

  ```html
  <input type="text" v-on:keyup="duang">
  ```

  ```js
  duang(){
      alert("加特技");
  }
  ```

---

### v-model

- `v-model`可以绑定表单中输入的数据和vue代码中data部分的数据.实时共同变动

- 普通输入框绑定字符串,单选可以绑定布尔值,或者值.多选可以绑定数组.

  ```html
  <input type="text" placeholder="请输入" v-model="message">
  <div>{{message}}</div>
  
  <br>
  <input type="checkbox" id="checkbox" v-model="checked">
  <label for="checkbox">{{checked}}</label>
  
  <br>
  <input type="checkbox" id="one" value="one" v-model="checkedNum">
  <label for="one">one</label>
  
  <input type="checkbox" id="two" value="two" v-model="checkedNum">
  <label for="two">two</label>
  
  <input type="checkbox" id="three" value="three" v-model="checkedNum">
  <label for="three">three</label>
  
  <div>多选:{{checkedNum}}</div>
  
  <br>
  <input type="radio" id="man" value="男" v-model="gender">
  <label for="man">男</label>
  
  <input type="radio" id="woman" value="女" v-model="gender">
  <label for="woman">女</label>
  <div>性别:{{gender}}</div>
  
  <br>
  <select v-model="human">
      <option>埼玉</option>
      <option>吹雪</option>
      <option>龙卷</option>
  </select>
  <div>
      one punch man:{{human}}
  </div>
  <br>
  <select v-model="humans" multiple>
      <option>埼玉</option>
      <option>吹雪</option>
      <option>龙卷</option>
  </select>
  <div>
      one punch man:{{humans}}
  </div>
  ```

  ```js
  const dataObj = {
      message : "Hello vue!",
      checked : false,
      checkedNum : [],
      gender : [],
      human : '',
      humans : [],
  }
  ```

### v-bind改变数据

- `v-model`只能是实时变动data中的值,但是真正标签上的value并未改变,如果想改变,就必须使用数据绑定`v-bind`.

  ```html
  <label for="checkbox">
      <input type="checkbox" id="checkbox" v-bind:value="flag" v-model="flag">
      <span>{{flag}}</span>
  </label>
  ```

  ```js
  flag : false,
  ```

- v-bind可以绑定标签上的一切属性,包括label标签的for,标签的id等等.

  ```html
  <label v-bind:for="'man' + index" v-for="(item,index) in dataName" v-model="checkName">
      <input type="checkbox" :id="'man' + index" :value="item" v-model="checkName">
      <span>{{item}}</span>
  </label>
  人物 : {{checkName}}
  id使用字符串+v-for的索引组成
  ```

  ```js
  const dataObj = {
      message : "Hello vue!",
      flag : false,
      checkName : [],
      dataName : ["埼玉","吹雪","龙卷"],
  }
  ```

- 使用修饰符可以完成一些方便的功能

  ```html
  <input type="text" v-model.lazy="val">懒加载绑定,输入完之后点击别处或回车触发
  {{val}}
  <input type="text" v-model.number="val">把输入的值锁定为number格式,但是必须是输入数字开头的值,英文开头则不行
  {{typeof val}}
  <input type="text" v-model.trim="val">去除掉输入的值左右的空格,中间的空格则不行
  {{val}}
  ```

  ```js
  val : "",
  ```

---

### 组件

- **组件的概念**

- 组件必须在创建Vue之前的代码写,因为组件注册后创建Vue才有效,在已经注册的Vue对象后面创建就等于火车开走了你进站了,就没有用了.

- 组件特点

  - 拥有唯一名称,方便调用
  - 以html形式存在
  - 可以复用,而且复用的同一个组件互不干扰.

  ```js
  const firstTem = Vue.extend(
      {
          template : `<div>
  <h3>全局注册组件</h3>
  <p>这是一个全局注册组件</p>
  </div>`
      }
  );
  Vue.component('show',firstTem);
  (1) .Vue.extend()是一个基础构造器(全局 API)，意图创建一个子类；可以理解为new了一个vue,只不过是个小点的版本
  (2) .Vue.component()是注册组件，参数 1 为名称，参数 2 为.extend()；
  ```

- 也可以省略Vue.extend(实际上也很少使用),直接把构造内容使用到Vue.component中

  ```js
  Vue.component('show',{
      template : `<div>
  <h3>全局注册组件</h3>
  <p>这是一个全局注册组件</p>
  </div>`
  });
  ```

- 而这个Vue.component的第二个参数还可以加个data属性,为一个函数,返回的值是一个对象,键值对返回,这个键值对代表了组件中用到的值,这样就可以让组件完全独立,互相不影响

  ```js
  Vue.component('add-button',{
      data(){
          return {
              count : 0,
          }
      },
      template : `<button v-on:click="count++">
  点击量:{{count}}
  </button>`
  });
  对于组件名称强烈建议遵循 W3C 标准，字母小写且用-分隔，代码位置在 new Vue 之前
  ```

- 之前这样的注册是**全局注册**,app为id的div可以使用,新建一个app2也可以使用

  ```html
  <div id="app">
      <add-button></add-button>
      <add-button></add-button>
  
  </div>
  <div id="app2">
      <add-button></add-button>
  </div>
  ```

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : dataObj,
          methods: {
  
          },
          computed:{
  
          }
  
      }
  );
  const app2 = new Vue(
      {
          el : "#app2",
          data : dataObj,
      }
  );
  ```

- 如果不想让其他Vue实例使用你的组件,也就是**私有化**,那就需要在Vue实例的components属性中写你的组件,将组件写在外面组成const常量,再放进来.

  ```js
  const button = {
      data(){
          return {
              count : 0,
          }
      },
      template : `<button v-on:click="count++">
  点击量:{{count}}
  </button>`
  };
  const app = new Vue(
      {
          el : "#app",
          data : dataObj,
          components : {
              'add-button' : button
          },
          methods: {
  
          },
          computed:{
  
          }
  
      }
  );
  ```

- 当然也可以直接把变量写道components里面来不用写到外面去了

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : dataObj,
          components : {
              'add-button' : {
                  data(){
                      return {
                          count : 0,
                      }
                  },
                  template : `<button v-on:click="count++">
  点击量:{{count}}
  </button>`
              }
          },
          methods: {
  
          },
          computed:{
  
          }
  
      }
  );
  ```

  

### 组件嵌套

- 组件是可以嵌套的,只要在一个组件的内部写出`components`内容,键为组件名,字符串格式,值为对象,里面写data返回值,以及具体的template即可

  ```js
  Vue.component("component-a",
                {
      data(){
          return {
              message : "一号父组件"
          }
      },
      template : `
  <div>{{message}}</div>
  `,
      components: {
          "component-a-child" : {
              data(){
                  return {
                      message : "一号子组件"
                  }
              },
              template : `
  <div>{{message}}</div>
  `,
          }
      }
  }
               );
  ```

- 但是要注意,子组件只能在父组件的template中包裹使用,直接拿到app中是不可以的,不起作用.

  ```js
  Vue.component("component-a",
                {
      data(){
          return {
              message : "一号父组件"
          }
      },
      template : `
  <div>
  <div>{{message}}</div>
  <component-a-child></component-a-child>//在这里只能这样包裹在父组件的整体内,拿出去就不显示了,父组件要用div把子组件包括进去
  </div>
  `,
      components: {
          "component-a-child" : {
              data(){
                  return {
                      message : "~~~~~一号子组件"
                  }
              },
              template : `
  <div>{{message}}</div>
  `,
          }
      }
  }
               );
  ```

- 除了这样写子组件,还可以把子组件定义在外部,塞到那个父组件的components中,就是哪个父组件的子组件.

  ```js
  const child = {
      data(){
          return {
              message : "~~~~~~~~~二号子组件"
          }
      },
      template : `
  
  <div>{{message}}</div>
  
  `,
  };
  
  
  Vue.component("component-b",
                {
      data(){
          return {
              message : "二号父组件"
          }
      },
      template : `
  <div>
  <div>{{message}}</div>
  <child></child>
  </div>
  `,
      components : {
          "child" : child
      }
  }
               );
  ```

### 组件通信-props

- 我们注册的new Vue本身也是个组件,是最大的根组件,那么也就可以有子组件

- 但是如果同时根组件中和子组件中都有属性message,怎么把两个message拿出来都显示呢??也就是组件之间如何通信?(**父组件给子组件传值**)

- 首先呢,使用子组件的props属性,后面数组中写好你定好的属性名,比如word.

- 然后,这时候你去子组件在父组件中的标签上写上属性`word = 'xxx'`,这时候虽然显示什么都不变,但是你发现查看元素看不到这个word属性,说明props已经在起作用

- 然后呢去子组件的template中使用模板把word也放到标签内.这时候子标签显示的内容就会多了你写在标签里的xxx,但这不是我们想要的取到父组件的数据.

- 这时候在父组件中再写一个子组件,使用`v-bind:word="message"`,这样就拿到了父组件的message的内容了.

- 不过要注意,标签名都是统一的`单词-单词`格式,而你定义组件名的时候就要按JS格式写成驼峰,也就是goodName这样子的形式,标签名自动识别为good-name

  ```html
  <div id="app">
      <child word="very"></child>
      <child v-bind:word="message"></child>
  </div>
  ```

  

  ```js
  const child = {
      data(){
          return {
              message : "good!"
          }
      },
      template :
      `<div>{{word}}{{message}}</div>`,
      props : ['word'],
  };
  const app = new Vue(
      {
          el : "#app",
          data : dataObj,
          methods: {
  
          },
        computed:{
  
          },
          components : {
              "child" : child
          }
      }
  );
  ```

---

#### props数据格式

- 子组件作为标签出现在父组件中的时候中间是不能插值布局的,模板这个标签的内容完全取决与你定义它时的template后面如何定义.

- 甚至**子组件定义**的时候,**只能是一个大标签作为根节点**,如果**有两个平级的div标签那会报错**的.

- props携带的数据不只可以是字符串,也可以是各种格式.

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              message : "Hello vue!",
              array : [1,2,3,4,5],
              object : {
                  name : "埼玉",
                  gender : "男",
              },
              flag : true,
              number : 100,
          },
          methods: {
  
          },
          computed:{
  
          },
          components : {
              "child" : {
                  data(){
                      return {
                          message : "good!"
                      }
                  },
                  template :
                  `<div>{{word}}</div>`,
                  props : ['word'],
              }
          }
      }
  ```

  ```html
  <child v-bind:word="message"></child>
  <child v-bind:word="array"></child>
  <child v-bind:word="array[2]"></child>
  <child v-bind:word="object"></child>
  <child v-bind:word="object.name"></child>
  <child v-bind:word="flag"></child>
  <child v-bind:word="!flag"></child>
  <child v-bind:word="number"></child>
  ```

#### props携带多个值

- 但是有一个问题,一个标签我想携带多个值怎么办?像之前的word,你写多个也没用.

- 这个时候props数组中的内容的意义才真正体现出来,本来它就是数组,那我们携带几个就写几个数组元素字符串,并且把它放到子组件中用模板带出来.

- 最后在同一个子组件标签中,两次`v-bind:props元素`即可携带显示两个父组件属性.

- 并且在子组件的template中还可以取携带数据的部分值,比如数组的某个元素,对象的某个属性

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              message : "Hello vue!",
              array : [1,2,3,4,5],
              object : {
                  name : "埼玉",
                  gender : "男",
              },
              flag : true,
              number : 100,
          },
          methods: {
  
          },
          computed:{
  
          },
          components : {
              "child" : {
                  data(){
                      return {
                          message : "good!"
                      }
                  },
                  template :
                  `<div>
  <p>{{wordObject.name}}</p>
  <p>{{wordArray[2]}}</p>
  </div>`,
                  props : ['wordObject','wordArray'],
              }
          }
      }
  );
  ```

  ```html
  <child v-bind:word-object="object" v-bind:word-array="array"></child>
  ```

---

- props携带来的数据是单向的,也就是父组件改变的时候,props可以影响到子组件的props,但是反过来就不可以,因为一个父可以有多个子,如果子可以改变父就会出现混乱

  ```js
  "child" : {
      data(){
          return {
              message : "good!"
          }
      },
          template :
      `
  <button v-on:click="word++">{{word}}</button>
  `,
          props : ['word'],
  }
  }
  ```

  ```html
  <div id="app">
      <child v-bind:word="count"></child>这里的自增会报错,不能直接更改props
  </div>
  ```

  

- 并且子也不允许改变props中携带来的属性,如果要更改也可以改但是会报错,应该吧带来的值赋给自己子组件中的新值再去计算,让带来的值保持初始值.

  ```js
  components : {
      "child" : {
          data(){
              return {
                  message : "good!",
                  sonCount : this.word,
              }
          },
              template :
          `
  <button v-on:click="sonCount++">{{sonCount}}</button>
  `,
              props : ['word'],
      }
      }
  ```

  ```html
  <div id="app">
      <child v-bind:word="count"></child>
  </div>
  ```

- 当然最好还是把这个值交给computed计算属性和属性data去计算和存储

  ```js
  components : {
      "child" : {
          data(){
              return {
                  message : "good!",
                  sonCount : this.word,
              }
          },
              template :
          `
  <button v-on:click="addCount">{{computedCount}}</button>
  `,
              props : ['word'],
                  computed: {
                      computedCount(){
                          return this.sonCount;
                      }
                  },
                      methods : {
                          addCount(){
                              this.sonCount++;
                          }
                      }
      }
  }
  ```

  

---

- props不只可以用之前的数组传递,还可以用对象的方式传递

- 如果用对象方式传递,就可以检验传递过来的数据的格式,以及设置某些数据的默认值.

  ```html
  <div id="app">
      <child v-bind:child-num="num"
             v-bind:child-age="age"
             v-bind:child-str="str"
             v-bind:child-arr="arr"
             v-bind:child-obj="obj"
             v-bind:child-price="price"
             >
  
      </child>
  </div>
  ```

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              message : "Hello vue!",
              num : 100,
              age : 100,
              str : "字符串",
              arr : [1,2,3,4,5],
              obj : {
                  name : "埼玉",
              },
              price : 50,
          },
          methods: {
  
          },
          computed:{
  
          },
          components : {
              "child" : {
                  data(){
                      return {
                          message : "good!",
                      }
                  },
                  template :
                  `
  <div>{{childNum}} {{childAge}} {{childStr}} {{childArr}} {{childObj.name}} {{childPrice}}</div>
  `,
                  props : {
                      childNum : Number,//限制类型为数字Number
                      childAge : [String,Number],//既可以是字符串也可以是数字
                      childStr : {
                          type : String,//字符串可以用对象来限制,设定属性
                          default : "没有字符串",//设置默认值,这里指的是没有在父组件中使用的子组件里v-bind拿到这个子组件props的时候显示的值
                      },
                      childArr : {
                          type : Array,
                          // required : true,//必填选项,为true则没有v-bind绑定时报错
                          // default: [],//数组的话不能直接写在这里默认值,必须用函数return默认值
                          default() {
                              return [];
                          }
                      },
                      childObj : {
                          type : Object,
                          default() {
                              return {
                                  name : "无名"//对象的话也不能直接写在这里默认值,必须用函数return默认值,对对象的单个属性return
                              };
                          }
                      },
                      childPrice : {
                          validator(value){
                              return value>90;//自定义验证,返回true显示,false报错
                          }
                      }
                  },
                  computed: {
  
                  },
                  methods : {
  
                  }
              }
          }
      }
  );
  ```

- null和undefined可以通过任何验证

---

### 子组件改变父组件

- vue之前说过讲究单向数据流,最好是父组件改变子组件,但是其实子组件也是可以改变父组件的.

- 使用自定义组件事件即可.

- 首先在子组件中设置一个可以被触发事件的标签,比如button,然后写一个对应的方法在这个标签上用某种方式可以触发它.

- 并把某个子组件data中的数据携带到这个方法中.

- 方法内接受数据,然后使用`this.$emit`来自定义触发事件,将子组件中的数据或一些动作传递到父组件中.

- `this.$emit`后面的括号中第一个参数是定义的事件名,这里不能使用JS的写法驼峰,直接就需要写成连贯的字符串或者-隔开的html标准的命名.第二个参数开始就都是可以携带的数据或动作(比如某数字++).

- 父组件如何接收这个事件呢?父组件中的子组件标签使用`v-on:事件名=父组件方法名`.然后进入对应的父组件方法即可拿到传递过来的数据,如果是动作使用`.sync`即可拿到,都不用方法.

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              message : "hello,vue!"
          },
          methods: {
              fatherMethod(say){
                  this.message = say;
              }
          },
          computed:{
  
          },
          components : {
              "child" : {
                  data(){
                      return {
                          say : "good!",
                      }
                  },
                  template :
                  `
  <div>
  <button v-on:click="childClick(say)">{{say}}</button>
  </div>
  `,
                  computed: {
  
                  },
                  methods : {
                      childClick(say){
                          this.$emit("son-father",say);
                      }
                  }
              }
          }
      }
  );
  ```

  ```html
  <div id="app">
      {{message}}
      <child
             v-on:son-father="fatherMethod"
             ></child>
  </div>
  ```

- 如果要传递动作的话,比如某某数++.

- 首先在子组件中写好方法,点击触发的某个方法,然后方法内还是使用`this.$emit`,只不过这里的参数第一个就需要写成固定格式`update:count`,count是你要改变的父组件中的data数据名,我也不知道为啥固定要写成这样,因为我试着改动事件名就无法触发了.第二个参数就跟你要传递的动作,this.childCount++

- 父组件中只需要绑定props携带的数据即可,在v-on:数据名后面跟.sync即可成功触发

- 这时候如果你还有一个子组件,也使用了props拿到父组件的这个count,你会发现点击的时候这第二个子组件拿到的值也变了.

- 所以子最好不要改变父的值,vue中提倡数据单向传递.

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              count : 5,
          },
          methods: {
          },
          computed:{
  
          },
          components : {
              "child" : {
                  data(){
                      return {
                          childCount : this.count,
                      }
                  },
                  template :
                  `
  <div>
  <button v-on:click="childClick">{{childCount}}</button>
  </div>
  `,
                  props : ['count'],
                  computed: {
  
                  },
                  methods : {
                      childClick(){
                          this.$emit("update:count",this.childCount++);
                      }
                  }
              }
          }
      }
  );
  ```

  ```html
  <div id="app">
      {{count}}
      <child
             v-bind:count.sync="count"
             ></child>
  </div>
  ```

---

### 子组件构建方法

- 之前的子组件都是写在`template`中,其实还有几种构建方法

1. 直接在父组件中构建

   父组件中写好子组件标签,然后标签内写我们需要定义的子组件,子组件标签上需要写`inline-template`

   ```js
   const app = new Vue(
       {
           el : "#app",
           data : {
               message : "hello,vue!",
               count : 5,
           },
           methods: {
           },
           computed:{
   
           },
           components : {
               "child" : {
                   data(){
                       return {
                           name : this.word,
                       }
                   },
                   computed: {
   
                   },
                   methods : {
   
                   },
                   props : ['word']
               }
           }
       }
   );
   ```

   ```html
   <div id="app">
       <child inline-template v-bind:word="message">
           <div>
               {{word}}
           </div>
       </child>
   </div>
   ```

2. 在script标签中定义子组件

   需要在任意位置写好一个script标签,然后给标签加上属性` type="text/x-template"`,在标签内写好你想写的子组件,然后给标签给上一个唯一的id,再去父组件的`components`下的template中用id绑定对应的子组件`template : "#child"`即可.

   ```js
   const app = new Vue(
       {
           el : "#app",
           data : {
               message : "hello,vue!",
               count : 5,
           },
           methods: {
           },
           computed:{
   
           },
   
           components : {
               "child" : {
                   data(){
                       return {
                           name : "埼玉",
                       }
                   },
                   computed: {
   
                   },
                   methods : {
   
                   },
                   template : "#child",
                   props : ['word']
               }
           }
       }
   );
   ```

   ```html
   <div id="app">
       <child v-bind:word="message"></child>
   </div>
   <script type="text/x-template" id="child">
       <div>
           {{word}}
       </div>
   </script>
   ```

3. 使用template标签

   与上面第二个的差别仅仅是标签script改为template,并且去掉type属性即可.

   ```js
   <template id="child">
       <div>
           {{word}}
       </div>
   </template>
   ```

----

### slot插槽

- 本身子组件定义之后放在父组件中只能放一个标签,标签中写内容是没用的,不会显示出来

- 如果想要显示,就可以使用插槽`slot`

- 在子组件中不光展示某个数据,还希望展示点别的东西.

  ```html
  <div id="app">
      <child v-bind:word="message"></child>
      <child v-bind:word="message"></child>
      <child v-bind:word="message"></child>
      <child v-bind:word="message"></child>
  </div>
  <template id="child">
      <div>
          <span>{{word}}</span>
          <span>****</span>
      </div>
  </template>
  ```

- 但是又不希望这里的****是写死的.

- 那么就使用`slot`插槽标签来写

  ```html
  <div id="app">
      <child v-bind:word="message">****</child>
      <child v-bind:word="message">!!!!</child>
      <child v-bind:word="message">@@@@</child>
      <child v-bind:word="message">&&&&</child>
  </div>
  <template id="child">
      <div>
          <span>{{word}}</span>
          <slot></slot>
      </div>
  </template>
  ```

- 这样子,子组件标签中间就可以在父组件中插入东西了

- 但是有可能插槽中大部分内容是重复的,只有少部分是不同的

- 这时候只需要在子组件定义的地方的插槽中写好值,这个值就会在父组件的子组件中没有写值的时候展示,为默认值.

  ```html
  <div id="app">
      <child v-bind:word="message"></child>
      <child v-bind:word="message"></child>
      <child v-bind:word="message"></child>
      <child v-bind:word="message">&&&&</child>
  </div>
  <template id="child">
      <div>
          <span>{{word}}</span>
          <slot>****</slot>
      </div>
  </template>
  ```

#### 具名插槽

- 如果在子组件中写多个插槽标签.那么一个父组件中的子组件标签中插入的值就会被显示多次.

- 为了有父组件中的子组件插入的值和插槽**一对一**的效果,我们可以使用**具名插槽**

- 也就是在想要对应的父组件中的子组件标签上写`v-solt:自定义name`,然后在定义的子组件模板中的slot标签上的name属性写一样的自定义name,即可一一对应.

- `v-slot:name`的简写方法为`#name`

  ```html
  <div id="app">
      <child v-bind:word="message" v-slot:one>//这里的v-slot冒号后面的单词对应模板中slot的name属性,一对一
          <div>
              一号
          </div>
  <!--        <div>-->
  <!--            一号-->  这里的普通内容是会被显示多次的,取决于模板中有几个slot标签
  <!--        </div>-->
      </child>
      <child v-bind:word="message" v-slot:two>
          <div>
              二号
          </div>
  <!--        <div>-->
  <!--            二号-->
  <!--        </div>-->
      </child>
  </div>
  <template id="child">
      <div>
          <slot name="one"></slot>
          <slot name="two"></slot>
      </div>
  </template>
  ```

---

#### 作用域插槽

- 在父组件中,子组件标签是拿不到子组件的数据的,跨出了作用域.

  ```html
  <div id="app">
      <child v-bind:word="message">
          {{obj.gender}}//这样是拿不到子组件中的数据obj的
      </child>
  
  </div>
  <template id="child">
      <div>
          <span>{{word}}</span>
          <slot>{{obj.name}}</slot>
      </div>
  </template>
  ```

  ```js
  components : {
      "child" : {
          data(){
              return {
                  good : "dog",
                  obj : {
                      name : "埼玉",
                      age : 25,
                      gender : "男"
                  }
              }
          },
              template : "#child",
                  props : ['word'],
                      computed: {
  
                      },
                          methods : {
  
                          }
      }
  }
  ```

- 如果想拿到,我们可以使用作用域插槽.

  ```html
  <div id="app">
      <child v-bind:word="message" v-slot:default="prop">
          2.给slot绑定过props之后在这里我们固定写v-slot:default,等于号后面的我们可以自定义起名字,等于把插槽的props传过来的所有数据都塞到这个prop里面,然后使用这个自定义prop.传过来的自定义的那个obj,因为是对象最后在.gender可以拿到对象的gender数据.
          {{prop.obj.gender}}
      </child>
  
  </div>
  <template id="child">
      <div>
          <span>{{word}}</span>
          <slot v-bind:obj="obj">{{obj.name}}</slot>
          1.这里的v-bind:obj="obj"相当于给插槽绑了一个props让它可以把子组件自己的数据传递给父组件中的子组件标签,第一个obj是我们可以自定义的名字,第二个obj是想拿到的子组件的data中的数据name.
      </div>
  </template>
  ```

- 当然` v-slot:default="prop"`可以简写为` v-slot="prop"`

- 如果使用es6的结构我们可以写成

  ```html
  <html-a v-bind:text="message" v-slot="{obj:user}">
      {{user.id}}
  </html-a>
  ```

  

---

### watch监听

- `v-model`可以做到对数据更新的简单监听,但是如果想要复杂点的监听,就得使用`watch`

- watch属性是vue对象的主属性之一,和methods,computed等平级

- 内容为标签上v-model绑定的name,为一个方法,方法名必须和v-model=后面的完全相等才能监听的到

- 当然更标准的写法是name : '方法名',然后把方法写在methods里.

  ```html
  <div id="app">
      <input type="text" v-model="input">{{value}}
  </div>
  ```

  ```js
  const app = new Vue(
          {
              el : "#app",
              data : {
                  message : "hello,vue!",
                  input : '',
                  value : '',
              },
              methods: {
  
              },
              computed:{
  
              },
              watch : {
                  input(val,old){
                      this.value = val + '|';
                  }
              }
          }
      );
  ```

  ```js
  const app = new Vue(
          {
              el : "#app",
              data : {
                  message : "hello,vue!",
                  input : '',
                  value : '',
              },
              methods: {
                  watchThis(val,old){
                       return this.value = val + '|';
                  }
              },
              computed:{
  
              },
              watch : {
                  input : "watchThis"
              }
          }
      );
  ```

- 这样只能监听到data下数据第一级,而不能监听到比如data中的对象的属性,数组的元素.

- 这时就需要**watch和computed相配合**才能达到我们的愿望.

- v-model后面跟我们要监听的第二层数据,比如input.name

- 然后computed里写上一个名字自定义的计算属性,computed可以拿到Vue对象的所有数据,就直接在这个计算属性里return我们要拿到的那个第二层数据

- 然后在watch中写一个和computed中**名字相同的方法**,就可以接收到computed中return的值,放在括号里第一个参数,第二个参数还是可以接收oldValue(变化前的值).

- 然后在watch中就可以对computed中return的值进行各种操作咯

  ```html
  <div id="app">
      <input type="text" v-model="input.name">{{value}}
  </div>
  ```

  ```js
  const app = new Vue(
          {
              el : "#app",
              data : {
                  message : "hello,vue!",
                  input : {
                      name : ""
                  },
                  value : '',
              },
              methods: {
  
              },
              computed:{
                  good(){
                      return this.input.name;
                  }
              },
              watch : {
                  good(val,old){
                      this.value = val + '|'//这里接收到computed中同名方法返回的数据,可以进行操作
                  }
              }
          }
      );
  ```

- 这里还可以把对象内部的属性当做一个整体去监听

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              message : "hello,vue!",
              input : {
                  name : ""
              },
              value : '',
          },
          methods: {
              good(){
                  return this.value = this.input.name+'|';
              }
          },
          computed:{
  
          },
          watch : {
              "input.name" : "good"
          }
      }
  );
  ```

---

#### 监听选项

- 但是像之前的做法都有局限性,那就是只能拿对象的一个属性,如果对象有多个属性我都想拿呢??

- 这时候需要开启监听的一些选项.

  ```html
  <div id="app">
      <input type="text" v-model="input.name">{{value}}|||{{valueTwo}}
  </div>
  ```

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              message : "hello,vue!",
              input : {
                  name : "",
                  count : 100,
              },
              value : '',
              valueTwo : '',
          },
          methods: {
              art(){
                  this.value = this.input.name;
                  this.valueTwo = this.input.count;
              }
          },
          computed:{
  
          },
          watch : {
              input : {
                  handler : "art",
                  deep : true,//开启之后才能拿到深度数据
                  immediate : true,//开启之后才能在监听的时候拿到初始化的值,这里是count
              }
          }
      }
  );
  ```

- 如果想要一次触发多个监听事件,配置的话需要在watch后面的指定数据名的冒号后面写为数组.

  ```js
  const app = new Vue(
      {
          el : "#app",
          data : {
              message : "hello,vue!",
              input : {
                  name : "",
                  count : 100,
              },
              value : '',
              valueTwo : '',
          },
          methods: {
              art(){
                  this.value = this.input.name;
              },
              artTwo(){
                  this.valueTwo = this.input.count;
              }
          },
          computed:{
  
          },
          watch : {
              input : [{
                  handler : "art",
                  deep : true,//开启之后才能拿到深度数据
                  immediate : true,//开启之后才能在监听的时候拿到初始化的值,这里是count
              },
                       {
                           handler : "artTwo",
                           deep : true,//开启之后才能拿到深度数据
                           immediate : true,//开启之后才能在监听的时候拿到初始化的值,这里是count
                       }]
          }
      }
  );
  ```

  

