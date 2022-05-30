## 李炎恢Vue工具篇

### 入门-安装

- 安装vue-cli命令为`npm install -g @vue/cli`

- 如果想单文件调试,就是只建一个vue文件就开始写代码,需要安装扩展.命令为`npm i @vue/cli-service-global -g`

- 新建项目之后,右键新建vue文件.
- 在单文件里写好你想写的代码之后,命令行中使用`vue serve`就可以创建临时服务器,然后每次写好代码`ctrl+S`保存即可自动更新.
- 也可以使用`vue build`打包项目,打包后在当前目录下的dist文件夹里就是打包的文件
- 一般使用的单文件名都是App.vue,这是默认可以被识别的主文件名,如果你没使用默认的,再构建服务器的时候会报错`Failed to locate entry file in D:\develop\lyh-vue-tool.
  Valid entry file should be one of: main.js, index.js, App.vue or app.vue.`
- 这个时候使用命令指定你的文件就可以解决这个问题(**但还是建议使用默认名**).`vue serve -c index.vue`
- 使用这个-c,服务器构建好后会直接把地址给到你的剪切板,到浏览器直接粘贴即可.

> -o, --open 打开浏览器 
>
> -c, --copy 将本地 URL 复制到剪切板 
>
> -h, --help 输出用法信息

### 创建Vue项目

- 使用命令创建项目是`vue create 文件夹名`
- 然后第一次会有两个选项,默认选项会带有babel和eslint,第二个选项是自定义
- 回车之后进入我们选择带有哪些配置,上下键控制移动,**空格键**控制是否**选中**,选择完毕回车.

> 这里有可能你使用的命令行是gitbash,无法使用上下,需要在git bash 的安装目录，找到bash.bashrc文件,打开文件，在最后添加,alias vue='winpty vue.cmd',重启命令行即可解决

- 这时候会让我们选择配置是存到单文件还是放在package.json,我们选第二个.
- 然后会问要不要保存配置然后起名,起个名字即可.
- 创建好后,会有相对应的提示,让我们进入刚才的文件夹,然后使用`npm run serve`创建服务,这是**项目服务**不是刚才的单文件服务.

---

#### 文件夹的分工

- 进入创建好的项目会看到很多目录
- 我们主要使用的就是src文件夹下的部分
- main.js是脚本位置,语法位置
- App.vue是入口文件,组件化思路开发,最上方是模板,然后是导入的模板信息,然后是导入的信息,最下方是css
- assets是放一些图片音频一类的资源的位置.
- components是放一些其他组件,然后通过App.vue里面的导入组件部分引入进去.

---

- 如果想要删除我们保存过得配置,就要去特定文件夹下找到对应文件,删除我们自己起名字的那个配置部分.
- Linux 下在 home/.vuerc，Win 下在 C:\Users\用户名\.vuerc；

### 组件化开发

- ```js
  new Vue({
    render: h => h(App),
  }).$mount('#app')
  ```

  

- main.js中的箭头函数是注册根组件App.vue

- 而`.$mount('#app')`则是挂载根组件,和之前学到的`el:'#app'`的作用是一样的.

- 我们看到的默认欢迎界面是`components/HelloWorld.vue`中的组件,如果注释掉,页面就会空白,但是还是发现有html元素的,这是因为有`public/index.html`文件,这个文件里的app组件相当于最顶级的组件,我们其他所有组件相当于最后都是塞到它里面去的.

- 小练习:写三个组件放到App.vue中显示.

  - 首先,去components文件夹中创建文件,这里要注意,**文件名一定是首字母大写**

  - 然后在各自文件里写好内容,完了之后到`App.vue`中的`script`标签里使用import引入,import后面紧跟的是你起的组件名.最后面的路径可以带.vue也可以不带.

  - 最后把组件在components中注册,然后放到app的div标签里即可.

    ```vue
    App.vue
    <template>
    <div id="app">
        <Header title="这里是头顶,别摸了会秃"></Header>
        <Sidebar></Sidebar>
        <Footer></Footer>
        </div>
    </template>
    
    <script>
        import Header from "./components/Header";
        import Footer from "./components/Footer";
        import Sidebar from "./components/Sidebar";
    
        export default {
            name: 'App',
            components: {
                Header,
                Footer,
                Sidebar
            }
        }
    </script>
    
    <style>
        #app {
            font-family: Avenir, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            color: #2c3e50;
            margin-top: 60px;
        }
    </style>
    
    ```

    ```vue
    Header.vue
    <template>
        <h1>{{title}}</h1>
    </template>
    
    <script>
        export default {
            name: "Header",
            props : {
                title : String
            }
        }
    </script>
    
    <style scoped>
    
    </style>
    
    ```

    ```vue
    Sidebar.vue
    <template>
        <ul class="list">
            <li v-for="item in link">
                <a href="">{{item}}</a>
            </li>
        </ul>
    </template>
    
    <script>
        export default {
            name: "Sidebar",
            data(){
                return{
                        link : ['首页','娱乐','新闻','国际']
                    }
    
            }
        }
    </script>
    
    <style scoped>
        .list a{
            color: blue;
        }
    </style>
    
    ```

    ```vue
    Footer.vue
    <template>
        <h2 class="Footer">如果侵权,全家升天</h2>
    </template>
    
    <script>
        export default {
            name: "Footer"
        }
    </script>
    
    <style scoped>
        .Footer{
            color: blueviolet;
        }
    </style>
    
    ```

  - 全部搞定之后可以使用`npm run build`打包项目

  - 但是打包之后会出现问题,运行项目是空白,这是路径格式问题.

  - 可以在根目录创建 vue.config.js，设置公共路径

    ```js
    module.exports = {
        publicPath: './',
    }
    ```


### Router入门和安装

#### 安装

- vue-router是vue官方路由管理器.用于构建单页面项目

- 在使用`vue create xxx`时选择最后一个配置`Manually select features`,然后使用空格选中vue-router即可.

- 会提示`Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n)  `是否开启history模式,如果选否,可以到配置中开启.

- 创建完成后,运行项目,这时候会看见home和about两个链接,点击之后页面会发生变化,这就是单页面项目的一个示范

- 而且地址栏的地址是`http://localhost:8081/#/`这样带井号的,这就是哈希模式,没开启history模式的样子.

- 如果要改为histroy模式,就打开router文件夹下的index.js

  ```js
  const router = new VueRouter({
    mode : "history",//这行本来是没有的,默认就为hash模式,加上这行就为history模式
    routes
  })
  ```

- 改模式之后地址栏就不会有#了.

---

#### 改变

- 使用router之后一些文件发生了变化

- 比如入口文件main.js,引入了router,并在Vue对象中注册了

  ```js
  import Vue from 'vue'
  import App from './App.vue'
  import router from './router'//多了这行
  
  Vue.config.productionTip = false
  
  new Vue({
    router,//在这里注册
    render: h => h(App)
  }).$mount('#app')
  
  ```

- 这样才可以在App.vue中使用路由相关组件,如果不注册页面中什么都看不到了.

  ```html
  <div id="app">
      <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
      </div>
      <router-view/>
  </div>
  ```

#### 组件解析

- `router-link`标签会被解析为超链接标签,属性`to`会被解析为`href`

  ```html
  <div id="app">
      <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
      </div>
      <router-view/>
  </div>
  ```

- `routet-view`标签是用来加载views文件夹下组件内容的.

- `<router-link>`对于的 index.js 部分，我们了解下：

  ```js
  //引入 Vue.js
  import Vue from 'vue'
  //引入 vue-router.js
  import VueRouter from 'vue-router'
  //引入 Home 组件
  import Home from '../views/Home.vue'
  //可以参考 API 的解释，参数是一个插件，路由就是一个插件
  //这句话的意思是：初始化这个插件以便使用
  Vue.use(VueRouter)
  //这个常量用于设置每个组件的信息，然后交给路由插件注册
  const routes = [
      {
          path: '/', //链接地址，
          name: 'Home', //别名
          component: Home //加载的组件
      },
      {
          path: '/about',
          name: 'about',
          //另一种组件加载模式，路由懒加载，后面会讲
          component: () => import('../views/About.vue')
      }
  ]
  //实例化路由组件
  const router = new VueRouter({
      mode: 'hash', //默认 mode : 'hash'
      routes
  })
  //导出路由,导出之后再导入到main.js中,注册在Vue对象里,给App.vue使用
  export default router
  ```

#### 练习

- 在Home和About中间插入一个新组件List

- 首先去App.vue中增加一个`router-link`标签

  ```html
  <div id="app">
      <div id="nav">
          <router-link to="/">Home</router-link>|
          <router-link to="/list">List</router-link>|
          <router-link to="/about">About</router-link>
      </div>
      <router-view/>
  </div>
  ```

  

- 然后去到router文件夹下的index.js中,在routes常量下添加一个新的路由

  ```js
  {
      path: '/list',
          name: 'List',
              component: List
  },
  ```

  

- 然后去views文件夹下创建组件List

  ```vue
  <template>
  <h3>这是List组件</h3>
  </template>
  
  <script>
      export default {
          name: "List"
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

- 最后在index.js中引入组件

  ```vue
  import List from "../views/List";
  ```

### 动态路由匹配

- 所谓动态路由匹配：就是将不确定的参数进行路由映射到同一个组件上去； 

- 比如经典的：user?id=5，这个 5 就是动态的数值，最终路径：user/5；

- 当然，复杂一些也是可以的，官网提供了两个案例，如下：

  | 模式                 | 匹配路径         | $route.params      |
  | -------------------- | ---------------- | ------------------ |
  | /user/:id            | /user/5          | {id:5}             |
  | /user/:id/post/:name | /user/5/post/lee | {id:5, post:'lee'} |

- 有个疑问,这里为什么不是`/user/:id/:name`然后得到`{id:5, name:'lee'}`?

#### 尝试

- 新建一个User组件,在其中使用query模式获取地址栏我们输入的`?id=`的值.

  ```html
  <template>
      <h3>User Id : {{$route.query.id}}</h3>
  </template>
  ```

- 地址为`http://localhost:8081/#/user/?id=5`,既可以获取得到

- ```
  Home| List| About
  User Id : 5
  ```

- 如果把index.js中的路由从

  ```js
  {
      path: '/user',//默认情况.使用query模式接收参数
          name: 'User',
              component: User
  },
  ```

  改为这样的

  ```js
  {
      path: '/user/:id',//动态模式,跟在user后面的参数会被直接识别为id
          name: 'User',
              component: User
  },
  ```

- 那么我们输入的url就要变为`http://localhost:8081/#/user/5`

- 而我们接收参数就要变为

  ```html
  <template>
      <h3>User Id : {{$route.params.id}}</h3>
  </template>
  
  ```

#### 路径问题

- 如果我们在主页生成两个组件点击就可以切换页面中携带的id参数.

- 如果像之前那样在根目录添加`vue.config.js`文件,那么本来不会出错的情况下会产生报错`Uncaught SyntaxError: Unexpected token '<'
  app.js:1 Uncaught SyntaxError: Unexpected token '<'`

  ```js
  module.exports = {
      publicPath: './',//这是之前的配置,开发时如果要避免上面的问题就要把'./'改为'/'
  }
  ```

#### 监听

- 由于动态路由访问的都是同一组件不同参数，组件会被复用以提升效率；

- 所以，此时的生命周期的钩子不会再被调用(也就是说同一个组件你改变参数的时候生命周期是不会从头再来的)；那怎么监听路由的变化呢？

- 在App.vue使用watch就可以监听,看到点击之后,点击前是哪个路由,点击后到了哪个路由

  ```js
  <script>
    export default {
      watch : {
        $route(to,from){
          console.log(to);
          console.log(from);
        }
      }
    }
  </script>
  //{name: "User", meta: {…}, path: "/user/5", hash: "", query: {…}, …}
  //{name: "User", meta: {…}, path: "/user/6", hash: "", query: {…}, …}
  //这里可以看到path就代表了路由地址,从/user/5到了/user/6
  ```

#### 匹配

- 在index.js中设置路由时,如果把path设置为*就可以匹配到我们设置好的路由之外的所有路由地址,比如这样我们可以把不存在的路由地址引到404页面

- 我们设置一个*跳转到home页面

  ```js
  {
      path: '*',
          name: 'Home',
              component: Home
  },
  ```

- 然后输入不存在的路由地址`http://localhost:8081/1564564`就会跳到home.

- 如果设定一个地址`/user-*`到List页面也会得到一样的效果,只要url是user-*就会跳到List路由

  ```js
  {
      path: '/user-*',
          name: 'List',
              component: List
  },
  ```

- `http://localhost:8081/user-123`进入这个地址就会到List路由去

### 嵌套路由

- 实际应用场景中，可能存在多种嵌套组件的应用界面，类似栏目分类；

- 比如：新闻**板块下**有国内新闻、国外新闻、体育新闻、音乐新闻等；

- 我们接着上节课 User 路由来分：用户个人档案和用户个人岗位两个子路由

- 首先需要去views文件夹下创建一个文件夹user,用来装User路由的子路由组件

- 然后在其中创建好两个子路由组件,起名注意**开头大写然后驼峰**.

- 写好之后在index.js中的User路由配置中加上children属性,然后再写一个数组括号,然后再一个一个写对象括号放子路由.不过要**注意子组件的路由是不带/号**的,不然会被识别为顶层路由.

- 当然写路由需要组件,那就在文件头部import写好的子路由组件.

- 然后去到App.vue写出跳转到User子路由的组件,这时候发现它不会出现

- 因为还少了最后一步,去到User组件中写好`router-view`标签,这样才能把它的子路由组件们显示在页面中,并且注意这个标签不能写在最顶层,至少要有一个标签包裹起来,就像是我们id为app的那个div标签

  ```html
  App.vue
  <router-link to="/user/5/name">5号名字</router-link>|
  <router-link to="/user/5/phone">5号电话</router-link>
  ```

  ```html
  User.vue 也就是子路由的父亲
  <template>
      <div>
          <h3>User Id : {{$route.params.id}}</h3>
          <router-view></router-view>
      </div>
  </template>
  ```

  ```HTML
  UserName.vue
  <template>
      <h3>用户的名字子组件{{$route.params.id}}</h3>
  </template>
  ```

  ```html
  UserPhone.vue
  <template>
      <h3>用户的电话子组件{{$route.params.id}}</h3>
  </template>
  ```

  ```js
  {
      path: '/user/:id',
          name: 'User',
              component: User,
                  children : [
                      {
                          path: 'name',//这里的路径可以和组件名不一样,路径是浏览器地址栏中要填的.
                          component: UserName,
                      },
                      {
                          path: 'phone',
                          component: UserPhone,
                      }
                  ]
  },
  ```

### 编程式导航

- 之前的导航都是在App.vue中使用`router-link`标签,这种导航只能跳转,非常死板
- 我们可以有一种自定义的导航方法,以一种函数的方式做了判断再导航.

#### 不带参

- 最简单的第一种是写一个按钮,然后按钮绑定一个函数

- 进入到函数中,使用Vue的api中的路由跳转`this.$router.push("/list");`,括号中填路由地址,记得要加/,如果不加会在当前URL后增加一个/list

  ```vue
  <button @click="goList">goList</button>
  
  methods : {
  goList(){
  this.$router.push("/list");
  },
  },
  ```

#### 带参

- 如果携带参数,首先使用params模式的接收参数方法

- 在函数的参数中携带参数,然后push方法中写为对象,name属性写对应路由的name,注意这里要区分大小写,因为不是路径而是name.

- 然后和它搭配的第二个参数就是`params`,参数也为对象,键值对形式,ES6中如果键值对一样的名字可以只写一个.

- **要注意`name`参数必须搭配`params`参数!**

  ```vue
  <button @click="goUser(5)">goUser</button>
  
  goUser(id){
  this.$router.push({
  name : "User",
  params : {
  id
  }
  });
  },
  ```

  ```js
  {
      path: '/user/:id',
          name: 'User',//push方法的name就是对应这里的name,是区分大小写的
              component: User,
                  children : [
                      {
                          path: 'name',
                          component: UserName,
                      },
                      {
                          path: 'phone',
                          component: UserPhone,
                      }
                  ]
  },
  ```

---

- 第二种query传统方式传参.

- 区别于params传参,这里的push方法中的对象参数就要写path属性,然后这里就要写路由里的那个path一样的到这里.

- 第二个参数就是query啦,和之前的params写法一样.

- **要注意,path属性和query属性是固定搭配**

- 但是这样并没有生效,因为需要注意要写专门接受query\传统参数模式的路由,以及需要把User路由组件中接受参数的方式改为`$route.query.id`

  ```vue
  <button @click="goUser2(6)">goUser2</button>
  
  goUser2(id){
  this.$router.push({
  path : "/user",
  query : {
  id
  }
  });
  },
  ```

  ```js
  路由配置index.js
  {
      path: '/user',
          name: 'User',
              component: User
  },
  ```

  ```html
  User组件
  <div>
      <h3>User Id : {{$route.query.id}}</h3>
      <router-view></router-view>
  </div>
  ```

---

#### 上下页

- 上下页有专门的方法`this.$router.go`

- 参数只填step,step为-1则为上一页

- 为1则为下一页

- 实际上就是去到上一步的路由和下一步的路由.

  ```vue
  <button @click="go(1)">goUp</button>
  <button @click="go(-1)">goDown</button>
  
  go(step){
  this.$router.go(step);
  }
  ```

  

### 命名路由和视图

#### 命名路由

- 之前我们使用过命名路由,使用Vue的api中的`this.$router.push`,然后配合属性(比如name和params)即可.

  ```js
  goUser(id){
      this.$router.push({
          name : "User",
          params : {
              id
          }
      });
  },
      goUser2(id){
          this.$router.push({
              path : "/user",
              query : {
                  id
              }
          });
      },
  ```

- 其实直接使用`router-link`也可以实现,只需要往这个标签上`v-bind:to`然后以对象格式输入配对路由属性即可(name和params,path和query)

  ```html
  <router-link :to="{name:'User',params:{id:5}}">user/5</router-link>
  <router-link :to="{path:'/user',query:{id:6}}">user/6</router-link>
  ```

#### 命名视图

- 为什么要命名视图?视图是什么?就是`<router-view/>`标签,它显示我们要插入这个页面的组件,切换路由在单页面应用中就是在切换这个标签的内容.

- 只要给这个标签起了名字也就变成了私有标签.需要去路由配置页配置需要加载这些特殊视图的路由地址.

- 首先写好对应的命名视图标签.

- 然后去创建对应的Vue组件,记得大写开头驼峰命名

- 之后,去到路由配置页面,将原先的`component`属性改为`components`,然后用对象格式写具体加载的视图,default是默认router-view加载的组件,其他的组件格式为`标签name属性的值:import到路由配置页面的组件名`

  ```html
  App.vue
  <router-view name="sidebar"></router-view>
  <router-view/>
  <router-view name="footer"></router-view>
  ```

  ```html
  Sidebar.vue
  <template>
      <h3>这是sidebar组件</h3>
  </template>
  Footer.vue
  <template>
      <h3>这是footer组件</h3>
  </template>
  
  ```

  ```js
  import Sidebar from "../views/Sidebar";
  import Footer from "../views/Footer";
  
  {
      path: '/',
          name: 'Home',
              components: {
                  default : Home,
                      sidebar : Sidebar,//这里的格式键为router-view命名视图的name属性,值为引入这个页面组件你起的名字
                          footer : Footer,
              }
              },
                  {
                      path: '/list',
                          name: 'List',
                              components: {
                                  default : List,
                                      sidebar : Sidebar,
                                          footer : Footer,
                              }
                              },
  ```

  

### 重定向和组件传参

#### 重定向

- 在路由中通过定义可以在访问一些地址时重定向跳转到固定路由.

- 首先可以直接定义一个特殊路径的路由使用`redirect`属性让访问这个地址时跳转到我们想要的路由.

  ```js
  {
      path: '/a',
          redirect : "/list"
  },
  ```

- 或者使用name,path之类的路由属性

  ```js
  {
      path: '/a',
          redirect : {
              name : "List"
          }
  },
  ```

- 也可以使用闭包箭头函数进行一系列判断

  ```js
  {
        path: '/a',
        redirect : ()=>{//这里的括号可以填一个参数,接收到的参数就是跳转之前的一些信息.
          if(true){
            //return 'list' //这里判断之后就可以选择直接返回或返回路由属性
            return {
              name : "List"
            }
          }
        }
      },
  ```

- 使用别名可以在访问这个别名时访问某些路由,不过要注意这时候地址栏就是你输入的别名,不是跳转到的路由名

  ```js
  {
      path: '/list',
          name: 'List',
              alias : "/liebiao",//路由名.
                  components: {
                      default : List,
                          sidebar : Sidebar,
                              footer : Footer,
                  }
                  },
  ```

  

#### 组件传参

- 之前接收传参使用的是`{{$route.params.id}}`这样,我们如果想直接使用`{{id}}`来接收参数该怎么办呢?

- 第一种方法,**布尔模式**,也是动态传参

- 首先去到对应路由组件,把接收参数改为`{{id}}`,在页面属性里使用props,数组中起名也为id

- 然后去到路由配置页面,在对应的路由下添加props属性,填写为true即可.

  ```vue
  User.vue
  <template>
      <div>
          <h3>User Id : {{id}}</h3>
          <router-view></router-view>
      </div>
  </template>
  
  <script>
      export default {
          name: "User",
          props : ['id']//也可以使用对象模式限制格式{id : Number}
      }
  </script>
  ```

  ```js
  index.js
  {
      path: '/user/:id',
          name: 'User',
              props : true,
                  component: User,
                      children : [
                          {
                              path: 'name',
                              component: UserName,
                          },
                          {
                              path: 'phone',
                              component: UserPhone,
                          }
                      ]
  },
  ```

---

- 第二种开始为静态配置

- 首选去到对应组件中,使用props写好拿到的值

- 之后来到路由配置页面,在对应路由的下面使用props传递数据,对象格式键值对传递

- 但是这样会发现还是不行,因为这样**只支持非命名视图**,我们刚才在这个路由地址下加载了命名视图.

  ```vue
  <template>
      <h3>这是List组件 :: {{data}}</h3>
  </template>
  
  <script>
      export default {
          name: "List",
          props : {
              data : {
                  type : String,
                  default : "no data"
              }
          }
      }
  </script>
  ```

  

  ```js
  {
        path: '/list',
        name: 'List',
        props : {
          data : "列表"
        },
        component: List,//使用非命名就可以
        alias : "/liebiao",
        // components: {
        //   default : List,
        //   sidebar : Sidebar,
        //   footer : Footer,
        // }
      },
  ```

- 想在命名视图模式下使用,就要在props中配置对应哪个命名视图的情况下传递

  ```js
  props : {
      default : {//意思就是default : List路由下传递data
          data : "列表"
      }
  },
      components: {
          default : List,
              sidebar : Sidebar,
                  footer : Footer,
      }
  ```

---

- 第三种是经典的query模式,也就是?带参数.

- 访问`/about?search=ok`,看看怎么拿到这个ok

- 非命名视图模式传参.

- 首先在组件中写好对应的数据

  ```vue
  <template>
  <div class="about">
      <h1>This is an about page::{{search}}</h1>
      </div>
  </template>
  
  <script>
      export default {
          name: "User",
          props : {
              search : {
                  type : String,
                  default : "no search"
              }
          }
      }
  </script>
  ```

- 然后去到路由配置页面,使用闭包传递

  ```js
  {
      path: '/about',
      name: 'About',
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
      props: route => ({
        search : route.query.search//固定参数route,然后获取传来的值
      })
    }
  ```

---

- 命名视图模式就要把props写为对象然后在对应路由下使用闭包.

  ```js
  components : {
      default: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
          sidebar : Sidebar,
              footer : Footer,
  },
      props: {
          default: route => ({
              search : route.query.search
          })
      }
  ```


### Node静态服务器

- 使用`npm run build`就可以打包项目,默认没有vue.config.js的情况下会有路径问题导致打包后的项目无法正常访问
- 这时候解决办法就是开发环境本地构建node服务器
- 使用`npm i serve -g`安装服务器.
- 之后如果要运行打包后的项目使用`serve dist`命令即可,因为dist文件夹下是我们打包的项目文件
- 这是**hash模式**的情况.
- **history模式**的情况如何呢?首先删掉dist文件夹
- 如果是这个模式,开发模式下运行是没任何问题的.
- 但是如果是去到打包的文件夹下的index.html右键运行,则不能正常运行
- 使用`serve dist`命令则可以运行,但是有问题,就是如果刷新会404,改变传递的参数也会404
- 这时候只需要在**使用命令时加-s**即可正常运行,比如`serve dist -s`

### 导航守卫

- 导航守卫的作用就是跳转或取消跳转的导航功能,比如登录跳转方案

#### 全局前置守卫

- 全局前置守卫一但写出来,就会出现点不动跳转的情况,这是因为它有拦截路由作用.

- 全局前置守卫的三个参数分别代表上一步的路由相关信息(进入目标的路由对象),下一步的路由相关信息(正要离开的路由对象),以及钩子函数`next()`.

- 在路由对象实例化之后写全局前置守卫,也就是mian.js文件中`const router`的后面

  ```js
  //前置全局路由守卫
  router.beforeEach((to,from,next)=>{
  
  })
  ```

- 首先创建Login组件,然后在路由中注册.

- 在全局前置守卫中判断如果登陆成功就正常跳转,否则跳转到指定的login页面.

- 这个时候还有个问题,如果直接这样去点击跳转会报错,说递归过多`RangeError: Maximum call stack size exceeded`,因为有可能你已经在登录页面又跳到了登录页面,就需要做判断使用进入目标的路由对象,看它的name等不等于我们自己定义的Login路由的name,如果等于就正常跳转,不然就跳到登录页面

  ```js
  //模拟登陆
  const flag = false;
  //前置全局路由守卫
  router.beforeEach((to,from,next)=>{
      if(flag){
          next();
      }else{
          if(to.name==='Login'){
              next();
          }else{
              next("/login");
          }
  
      }
  })
  ```

- 但是这样还会有问题,如果把登录状态改为true,在地址栏强行跳到login页面还是可以的.我们需要在登录状态下对进入这个页面进行阻拦.

- 只需要在flag==true的判断中判断如果要进入的页面是Login,name就跳转到首页,不然就直接跳转即可.

  ```js
  if(flag){
      if(to.name==='Login'){
          next('/');
      }else{
          next();
      }
  
  }
  ```

#### 全局后置钩子

- 对应的就有全局后置钩子,没有拦截属性.

- 可以在跳转之后进行一些操作

  ```js
  router.beforeEach((to,from,next)=>{
      console.log("开始loading");
      if(flag){
          if(to.name==='Login'){
              next('/');
          }else{
              next();
          }
  
      }else{
          if(to.name==='Login'){
              next();
          }else{
              next("/login");
          }
  
      }
  })
  router.afterEach((to,from)=>{
      console.log("结束loading");
  })
  //F12中
  index.js?a18c:39 开始loading
  index.js?a18c:57 结束loading
  ```

### 组件内的守卫

#### 路由独享守卫

- 之前的守卫都是全局守卫,只要运行了每一个路由都会支持

- 现在学习路由独享守卫,只需要写在路由配置区域即可.

- 只需要在某个路由配置中,添加`beforeEnter`属性,然后其他的和之前的**全局前置守卫**一样即可.

- 但是注意只要写了守卫就会有拦截功能,如果不使用next()是不会跳转的

  ```js
  {
      path: '/',
      name: 'Home',
      component: Home,
      beforeEnter : (to,from,next)=>{
        console.log(to);
        console.log(from);
        next();//如果没加这个就不会正常跳转只会打印
      }
    },
        
  ```

  

#### 组件内守卫

- 这里就不用箭头函数了,直接函数即可.

1. 进入时守卫,组件激活时的守卫(点击跳转到该组件)
2. 离开组件的时候触发(从该组件点击跳转到别的组件时)
3. 当组件被复用,动态路由时会被触发(同时好几个地方使用这个组件,第二次点击时开始触发)

```vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
  export default {
    beforeRouteEnter(to,from,next){
      console.log("组件激活时调用");
      next();
    },
    beforeRouteLeave(to,from,next){
      console.log("组件离开时调用");
      next();
    },
    beforeRouteUpdate(to,from,next){
      console.log("组件复用时调用");
      next();
    }
  }
</script>

```

- 复用的例子我们先去配置一下接收id的路由

- 然后创建两个跳转到这个接收id的路由的组件跳转链接`router-link`

- 点击第一次触发的是激活时,第二次就是复用时.

  ```js
  {
      path: '/about/:id',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ```

  ```html
  <router-link to="/about/5">/about/5</router-link>
  <router-link to="/about/6">/about/6</router-link>
  ```

#### this组件

- 在每一步的守卫中都可能会使用到this

- 但是实际上使用时发现,激活时的守卫拿不到this

  ```js
  beforeRouteEnter(to,from,next){
      console.log("组件激活时调用"+this);
      next();
  },
      beforeRouteLeave(to,from,next){
          console.log("组件离开时调用"+this);
          next();
      },
          beforeRouteUpdate(to,from,next){
              console.log("组件复用时调用"+this);
              next();
          }
  ```

  

> 组件激活时调用undefined
> 组件复用时调用[object Object]
>
> 组件离开时调用[object Object]

- 这是因为这个守卫实际上是在组件加载前运行,所以还没有this组件,这时候有一个回调可以拿到组件激活时的this组件

  ```js
  next((vm)=>{
      console.log("组件激活时调用"+vm);
  });
  ```

---

- 最后还有一个**阻止跳转**的方法,在next()中填false即可.

  ```js
  beforeRouteLeave(to,from,next){
      console.log("组件离开时调用"+this);
      next(false);
  },
  ```

### 元信息和过度动效

#### 元信息

- 可以给路由配置一个元信息就是meta属性,一般设置为对象即可.

- 这个属性是固定的,不是想怎么设置都可以的.

- 意思就是在路由中配置一个属性,然后我们进到这个路由就可以拿到这个属性中我们写好的一些值.

- 使用的时候就在守卫中使用`to.meta.title`这样的格式拿到.

  ```js
  {
      path: '/',
      name: 'Home',
      component: Home,
      meta : {
        title : "题目"
      },
      beforeEnter : (to,from,next)=>{
        console.log(to);
        console.log(from);
        next();
      }
    },
  ```

  ```js
  console.log(to.meta.title);
  ```

- 这里如果把meta下的title改为abc就拿不到,因为不能随便自定义元信息.

- 如果在全局守卫写要注意,访问每个组件都会触发,那么有些组件就拿不到meta因为它没有这个属性,就最好做一个属性不等于undefined的判断再对属性进行操作.

#### 过度动效

- 顾名思义就是点击跳转路由时使用css3的转场动效.

- 首先要使用动效标签`transition`把过度区域的标签`router-view`包裹起来

- 然后给这个标签一个name属性,这个name的值要和css的name对应相等.

- 但是直接这样会在跳转时动画有点跳,只需要在css的`leave-to`上加上`display:none`即可.

  ```css
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-leave-to{
      display: none;
  }
  ```

  ```html
  <transition name="fade">
      <router-view/>
  </transition>
  ```

---

- 也可以使用监听在不同的组件切换时给出不同的过度动效.

- 首先准备两套css过度动效.

- 然后使用v-bind给`transition`绑定name属性比如tName.

- 然后在App.vue中的script标签中首先创建data函数返回tName的值,因为v-bind是绑定数据,你总得有个被绑定的数据吧?

- 然后使用watch的标准格式.

- 做好判断如果切换的路由名字是Home,则给它第一种动效,如果是About则给第二种动效.这样即可.

  ```vue
  <template>
    <div id="app">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
  
      </div>
      <transition :name="tName">
        <router-view/>
      </transition>
  
    </div>
  </template>
  <script>
    export default {
      data(){//首先给绑定的tName赋值,因为使用v-bind绑定的数据总得有来源吧,不然和谁绑啊
        return {
          tName : ''
        }
      },
      watch : {
        '$route'(to,from){
            if(to.name==="About"){
                this.tName = "fade";
            }else if(to.name==="Home"){
              this.tName = "fade2";
            }
        }
      }
    }
  </script>
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  
  #nav {
    padding: 30px;
  }
  
  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }
  
  #nav a.router-link-exact-active {
    color: #42b983;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fade-leave-to{
      display: none;
  }
  .fade2-enter-active, .fade2-leave-active {
    transition: opacity .2s;
  }
  .fade2-enter, .fade2-leave-to {
    opacity: 0;
  }
  .fade2-leave-to{
    display: none;
  }
  </style>
  
  ```

  

### 路由数据获取

- 路由数据获取有两种方式
- 第一种是路由完成前获取
- 第二种是路由完成后获取

#### 路由完成后

- 这种方式是用Vue的钩子来完成

- 首先创建一个post组件,然后写好加载属性和要获取的数据.

- 引入到路由中,之后在这个组件中写`created`属性,在其中首先开启加载属性

- 然后使用延迟函数模拟加载,给数据赋值.最后关闭加载属性即可.

- 当然这个数据处理过程应该封装为方法放到methods中.

  ```vue
  Post.vue
  <template>
      <div>
          <div v-if="loading">
              <h3>loading...</h3>
          </div>
          <div v-if="post">
              <h3>{{post.title}}</h3>
              <p>{{post.body}}</p>
          </div>
      </div>
  
  </template>
  
  <script>
      export default {
          data(){
              return {
                  loading : false,
                  post : null,
              }
          },
          created() {//组件创建后
              this.loading = true;
              setTimeout(()=>{
                  this.post = {
                      title : "标题",
                      body : "内容"
                  }
                  this.loading = false;
              },1000);
          },
          name: "Post"
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```js
  index.js
  {
      path: '/post',
          name: 'Post',
              component: () => import(/* webpackChunkName: "about" */ '../views/Post.vue')
  }
  ```

  ```html
  <router-link to="/post">Post</router-link>
  ```

#### 路由完成前

- 这个就需要使用到之前用到过的组件内守卫来完成.

- 把获取数据封装为`getData`方法

- 然后使用路由完成前的守卫`beforeRouteEnter`

- 因为是完成前所以拿不到this组件,使用next方法中的回调函数即可.

- 这种方法会出现一个现象,就是点击跳转会停留在之前的页面等数据加载完再跳转,可以在加载前的页面整一个弹出层之类的loading特效.

  ```vue
  <template>
  <div>
      <div v-if="post">
          <h3>{{post.title}}</h3>
          <p>{{post.body}}</p>
      </div>
      </div>
  
  </template>
  
  <script>
      export default {
          data(){
              return {
                  post : null,
              }
          },
          beforeRouteEnter(to,from,next){
              setTimeout(()=>{
                  next((vm)=>{//回调函数,可以拿到this
                      vm.getData();
                  });
              },1000);
  
          },
          methods : {
              getData(){
                  this.post = {
                      title : "标题",
                      body : "内容"
                  }
              }
          },
          name: "Post"
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

### 路由滚动和懒加载

- 相对没有之前的常用,路由中最后的知识点

#### 滚动行为

- 就是当你的页面需要上下滑动时,路由跳转的时候回记录你上一次滑动的位置带入到跳转后的路由

- 当然这种记录也可以被取消.

- 只需要到路由配置文件中

- 输入scrollBehavior属性,返回坐标即可

  ```js
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
    scrollBehavior(to,from){
      return {
        x : 0,
        y : 0,
      }
    }
  })
  ```

- 如果使用了前进后退按钮,也可以想办法记住这个位置

- 就涉及到scrollBehavior的第三个参数,`savePosition`,如果这个参数存在就返回这个参数就可以记住前进后退之前的滚动位置.

#### 懒加载

- 懒加载就是加载这个路由的时候再加载这个组件,提高运行效率
- 而不是加载第一个组件的时候把所有组件都带进来.
- 可以使用@符号在路径中代表src目录下
- `component: () => import('../views/Post.vue')`就可以改为`component: () => import('@/views/Post.vue')`,会好看很多
- 懒加载似乎**不用在路由设置页面最上方import**组件.

### Vue状态入门

#### 概念

- 安装脚手架时勾选中`Vuex`状态管理器,就会生成一个store目录

- `Vuex`用来解决组件与组件之间共享的状态,几种存储管理所有组件状态,比如某个组件中有个对象,其他组件不能拿来用的问题.

- 首先我们新写一个组件,做一个计数器,点击就增加数字.

- 我们会发现这个数字只能在当前路由组件使用,切换到其他路由用不了这个数字,再切换回这个路由刚才累加的数字也会重新变为0.

- 我们要试着解决这个问题

  ```vue
  <template>
  <div>
      <h1>私有:{{count}}</h1>
      <br>
      <button @click="addCount">私有+</button>
      </div>
  </template>
  
  <script>
      export default {
          name: "Test",
          data(){
              return {
                  count : 0
              }
          },
          methods :{
              addCount(){
                  this.count++;
              }
          }
      }
  </script>
  
  <style scoped>
  
  </style>
  ```

#### store模式

- 如果不是大型单页面应用,使用`Vuex`反而会变得繁琐

- 如果你的应用简单,不需要使用那么重量级的插件,可以使用store模式进行小型的状态共享

- 好比杀鸡焉用牛刀

- 怎么解决刚才上面的问题呢?

- 首先我们在`src`目录下创建`store`目录,然后创建`index.js`文件

- 然后在`index.js`文件中创建常量,并且最后导出

- 在常量中我们写好要共享的数据,以及对这个数据的一些操作方法.

- 之后我们在要使用共享数据的组件中,直接引入这个文件中的常量(ide会自动提示,输入常量名即可).

- 一般数据我们定义到`常量.数据名`这个格式,方法我们用`常量.方法名`调用

  ```js
  const store = {//常量
      state : {//共享数据,state.count调用其中的数据
          count : 0
      },
      increment(){
          this.state.count++;//方法操作共享的数据
      }
  }
  export default store;//最后导出
  
  ```

  ```vue
  <template>
      <div>
          <h1>私有:{{count}} 共享:{{storeState.count}}</h1>
          <br>
          <button @click="addCount">私有+</button>
          <br>
          <button @click="increment">共享+</button>
      </div>
  </template>
  
  <script>
      import store from "../store";
  
      export default {
          name: "Test",
          data(){
            return {
                count : 0,
                storeState : store.state//不需要继续.count,调用到这一级即可,方便调用数据处理方法.
            }
          },
          methods :{
              addCount(){
                  this.count++;
              },
              increment(){
                  store.increment();//因为引入了store常量直接调用方法即可
              }
          }
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

- 这样这个共享的count只要不刷新页面,切换路由再切换回来也不变,而且多个页面可以共享,一变全变.

### Vuex安装和使用

#### 安装使用

- 首先创建项目时勾中vuex即可,然后就会多了一个store目录,其中会有index.jsw文件

- 然后main.js中自动引入vuex

- Vuex有两个特性

- 首先是响应式的,更新状态时组件会即时刷新出来.

- 第二不能直接改变store状态(下面例子中有解释)

- ```js
  export default new Vuex.Store({
      state: {}, //状态值
      mutations: {}, //修改状态
      actions: {}, //接口异步请求，服务端请求数据
      modules: {}
  })
  ```

- 官网写的顺序为,首先进入actions异步获取数据,然后进入mustations改变数据,最后进入state写入数据,然后把数据交给组件.

  ```vue
  {{$store.state}}
  //想使用state中的数据需要在其他组件中使用{{$store.state}}`,很像之前的路由$route.
  ```

- 这是挂载在Vue实例上的,实例内访问比如组建的methods中,要使用`this.$store`,固定写法.

#### 例子

- 首先在store目录下的index.js中state下定义数据,mutations下定义更改数据的方法

- 之后去到about组件中拿到对应数据,使用对应改变数据方法.

- **改变数据方法**一定要使用**固定格式**`this.$store.commit('increment');`,使用commit方法去执行方法.

- 你如果想在方法中直接改变store状态(不推荐),就是`this.$store.state.count++`,其实也可以做到,但是`mutations`是和Vue开发者工具可以协作的,**使用commit可以在浏览器中使用开发者工具追踪你的状态改变.**

- 然后在home组件中写显示出数据,看看是否切换路由数据可以共享

- ```js
  //sotre/index.js
  import Vue from 'vue'
  import Vuex from 'vuex'
  
  Vue.use(Vuex)
  
  export default new Vuex.Store({
    state: {
      count : 0
    },
    mutations: {
      increment(state){
        state.count++;
      }
    },
    actions: {
    },
    modules: {
    }
  })
  
  ```

  ```vue
  //view/About.vue
  <template>
    <div class="about">
      <h1>This is an about page</h1>
      <h3>共享{{$store.state.count}}</h3>
      <br>
      <button @click="increment">共享+</button>
    </div>
  </template>
  <script>
      export default {
        methods : {
          increment(){
            this.$store.commit('increment');
          }
        }
      }
  </script>
  
  ```

  

### State状态设置

- 如果需要设置多个状态,赋值取值就会比较麻烦
- `Vuex`是单一状态树,一个对象包含全部状态,每个应用仅一个store实例.

#### 例子

- 首先,我们创建一个新组件在view文件夹下,为`Person.vue`.

- 在其中创建列表展示三个属性,姓名,性别,年龄

- 这三个属性我们都写到store文件夹下的index.js中.也就是共享状态.

- 写好路由和路由跳转之后就可以拿到.

  ```vue
  //Person.vue
  <template>
      <div class="person">
          <ul>
              <li>姓名:{{$store.state.name}}</li>
              <li>性别:{{$store.state.gender}}</li>
              <li>年龄:{{$store.state.age}}</li>
          </ul>
      </div>
  </template>
  
  <script>
      export default {
          name: "Person"
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```js
  //store/index.js
  state: {
      count : 0,
      name : "埼玉",
      gender : "男",
      age : 100,
    },
  ```

- 如果想实时改变age属性,就在Person组件里写一个输入框,v-model绑定age.

- 然后给age在computed中写好get/set方法.(为了不在{{}}中写太长,把所有属性都放到computed中获取.)

- set方法中把value传递,然后去到store/index.js中写对应方法拿到value赋给age即可

  ```vue
  <input type="text" v-model="age">
  computed : {
  name(){
  return this.$store.state.name;
  },
  gender(){
  return this.$store.state.gender;
  },
  age : {
  get(){
  return this.$store.state.age;
  },
  set(value){
  this.$store.commit('setAge',value);
  }
  },
  }
  ```

  ```js
  setAge(state,value){
      state.age = value;
  }
  ```

- 但是这样子重复代码太多,有太多的`this.$store.state`.

- 要解决这个问题,`Vuex`提供了一个辅助函数`mapState`.

- 在需要的地方导入,这个辅助函数名字是固定的,用大括号导入.

#### 数组方式

- 如果**只想展示**属性而不是修改属性,并且你当前组件展示时的属性名和state中的属性名完全一样,就可以使用**数组方式**

- 首先在Person.vue引入mapState.

- 然后在computed中调用这个函数,之后在其中写好数组,数组的每个元素就是每个属性的名字,即可显示.

  ```vue
  import { mapState } from 'vuex';
  
  computed : mapState(['name','gender','age']),
  ```

- 如果想改变属性就单独写个方法,用事件改变

- ```vue
  <input type="text" @input="setAge" :value="age">//绑定了输入事件
  methods : {
  setAge(e){//e是事件对象event
  this.$store.commit('setAge',e.target.value);
  }
  }
  ```

#### 对象方式

- 如果展示时的属性名和state中的属性名不一样,就得使用对象方式

- 使用方法同样是在computed中调用辅助函数,只不过这次辅助函数中塞入的是一个对象.

- 对象键为当前组件属性名,值为共享状态的值.值使用箭头函数引入,箭头函数需要拿到state也就是store中的state.

- 还有种简写方法就是直接值为字符串`'共享状态名'`.

- 如果想对共享状态进行处理,就需要在computed中把属性写为方法,然后进行操作,当然在辅助函数中的方法参数必须为state.

  ```js
  computed : mapState({
      name : (state) => state.name,//state就是store中的state对象
      gender : 'gender',//等同于上面的一行,简写
      age (state){
          return state.age + this.count
      }
  }),
  ```

- 但这样有个问题,如果要给computed新增一些内容就不行了,一个辅助函数把这里占死了,无法增加新的内容.

- 只需要使用对象展开运算符即可.也就是三个点...

  ```js
  computed : {
      test(){
          return "test";
      },
          ...mapState({
              name : (state) => state.name,
              gender : 'gender',
              age (state){
                  //return state.age + this.count
                  return state.age
              }
          })
  },
  ```

### Getters派生状态

- 假如我们要对某个状态在所有组件中进行处理,如果都是用计算属性或者辅助函数那要在不同的组件里写很多遍

- 这时候我们就应该去`store/index.js`中设置一个getter方法对这个状态一次进行处理,在组件中调用时用`$store.getter.getGender`格式即可生效.getGender只是例子,就是写在`store/index.js`中的gettter方法名

- 当然也可以使用计算属性把一长串模板中的引入变短.

  ```js
  //store/index.js
  getters : {
      getGender(state){
          return '【'+state.gender+"】"
      },
  ```

  ```vue
  //简化前
  <li>性别:{{gender}}||{{$store.getters.getGender}}</li>
  
  //简化后
  <li>性别:{{gender}}||{{getGender}}</li>
  getGender(){
  return this.$store.getters.getGender;
  },
  ```

#### 传参

- 直接在计算属性中的调用最后加括号传参是不可以的.

- 我们需要去到状态设置文件中,去改写getter方法

- getter中返回的如果是值你只能调用属性,返回的是方法才能传参

- 如果使用es6语法就是连续的箭头函数,第一个参数为state,第二个参数为传递的参数,最后return你想返回的结果即可.

- 写为es5格式的代码就是原先的getter方法中返回了一个闭包匿名函数,这个函数接收到参数然后处理再返回.

  ```js
  //Person.vue
  getGender(){
                  return this.$store.getters.getGender(2);
              },
  //index.js
  getters : {
      getGender(state) {
          return '【' + state.gender + "】"
      },
          getGender:  (state) => (id) =>  {//es6
              return '【' + state.gender + ',' + id + "】"
          },
              getGender(state){//es5
                  return  function (id) {
                      return '【' + state.gender + ',' + id + "】"
                  }
  
              },
  },
  ```

- 传参除了在方法里直接`this.$store.getters.getGender(2)`传递

- 也可以在模板中传参`{{getGender(2)}}`

---

- 针对getter方法名和模板调用名不同,getter也有辅助函数名为`mapGetters`.

- 像之前的`mapState`一样引入,使用方法也一样

- 如果getter方法名和调用名一样就使用数组方式,如果不一样就使用对象方式

  ```js
  ...mapGetters(['getGender']),
      ...mapGetters({
      getGender :'getGender',
  }),
  ```

- 如果使用辅助函数传参,就只能在模板中传参.

### Mutations状态提交

- `Vuex`必须通过`Mutations`提交给那个状态才能够追踪到数据.

- 固定格式`this.$store.commit('方法名',额外参数)`.

- 之前提到额外参数可以传递事件对象event的值

- 但是大多情况下建议传递对象event,这样可以多个字段传递过去.比较灵活

  ```js
  //Person.vue
  methods : {
      setAge(e){
          this.$store.commit('setAge',e);
      }
  }
  //index.js
  setAge(state,payload){//额外参数传递对象过来另加灵活
      state.age = payload.target.value;
  }
  ```

#### 辅助函数

- 和之前的辅助函数使用方法都一样

  ```js
  import { mapMutations } from 'vuex'
  
  ...mapMutations(['increment']),//如果方法名和index.js中相同
      ...mapMutations({//如果方法名和index.js中不同
      add : 'increment'
  }),
  ```

- 如果需要传参的话,似乎这样子就无法传参?其实不是,payload是自动传递的,不用写也可以在index.js中的方法里的第二个参数拿到.

  ```vue
  //Person.vue
  <input type="text" @input="setAge" :value="age">
  
  import { mapState,mapGetters,mapMutations } from 'vuex';
  
  methods : {
              // setAge(e){
              //     this.$store.commit('setAge',e);
              // },
              ...mapMutations({
                  setAge : 'setAge'
              }),
          }
  ```

  ```js
  setAge(state,payload){//第二个参数不用传递自动可以拿到
      state.age = payload.target.value;
  }
  ```

- 最后注意,这些Mutations操作,都必须是同步的,不然无法追踪数据,异步的话就要去Action中.

### Actions异步提交

- 之前讲过,`vuex`状态的异步操作交给Actions,操作完再把数据交给Mutations处理,这样子可以对数据进行追踪.

#### 例子

- 首先我们去创建新组件Post.vue

- 然后在路由页面写好路由,在App.vue中写好路由跳转链接

- 之后去到状态设置文件中设置一个新属性info.

- 然后在Post组件中拿到这个值,再创建一个按钮绑定一个点击方法.

- 方法中使用`this.$store.dispatch('方法名')`进入状态管理页面中的acitons模块中的对应方法.

- 在对应方法中拿到数据再去到Mutations中的方法里处理数据即可.

- actions中的方法可以自动获得参数`context`,等同于状态对象`store`,可以用它调用commit方法进入Mutations处理数据

  ```vue
  <template>
      <div class="post">
          <h3>{{$store.state.info}}</h3>
          <button @click="getInfo">获取</button>
      </div>
  </template>
  
  <script>
      export default {
          name: "Post",
          methods : {
              getInfo(){
                  this.$store.dispatch('getInfo');//固定格式进入Actions
              }
          }
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  ```js
  mutations: {
              getInfo(state,value){
                  state.info = value;
              },
  },
      actions: {
          //ES5写法
          getInfo(context){//这里的方法都可以获得context参数,等同于Store对象,可以调用commit进入mutations方法
              setTimeout(() => {//模拟异步
                  context.commit('getInfo',"异步信息");
              },1000);
          }
      },
  //es6写法,直接格式化参数拿到commit方法
  getInfo({commit}){
        setTimeout(() => {
          commit('getInfo',"异步信息");
        },1000);
      },
  ```

- 辅助函数使用方法和之前都一样

  ```js
  ...mapActions(['getInfo']),
      ...mapActions({
      getInfo : 'getInfo'
  }),
  ```

  

### Module模块化

- state使用的是单一状态数,所有状态都集中在一个对象中,状态数量多起来就会很重
- Vuex提供了Module模块化设置,可以将状态分隔为一个个小模块

#### 例子

- 首先在store文件夹下创建module文件夹,在其中创建一个list.js文件

- 这个文件中的内容就和状态管理文件中的那个store对象一样.

- 然后去创建新组件List.vue,设置好路由放好跳转路由链接.

- 然后在状态管理文件中最顶部**import**这个模块,再**放在modules部分**.

- 这时候在list.js中的state下写好name状态

- 然后去到List.vue试着引入,使用`$store.state.name`引入的是index.js中的name,如果想引入这个list模块的同名状态,需要使用`$store.state.list.name`

- 然后想通过按钮上的setName方法改变存在的name,就需要在List.vue的methods中写这个方法,然后去触发异步Action中的方法,使用`this.$store.dispatch('方法名')`,本质上还是一个状态,这样写完全可以

- 但是这时候要注意,setName方法只有list.js中有,试着制造冲突,把setName方法也放到index.js中去看看.

- 这时候点击按钮两个名字都会改变.

- 为了**隔离主状态和模块状态名称冲突**,需要在模块状态开头位置**设置命名空间**,也就是在`export default`中的最顶端设置`namespaced : true`

- 设置之后改变的就只有主状态的name.

- 设置命名空间后,命名空间名就是list,就要在List.vue的方法中这样调用Actions的方法`return this.$store.dispatch('list/setName');`

- 假如模块和主状态文件有同名getters方法,该怎么分别调用呢.

- 在List.vue中使用计算属性,同名getName,然后使用`return this.$store.getters(['list/getName']);`即可调用getters方法

- 并且也可以使用mapActions辅助函数

  ```js
  //list.js
  export default {
      namespaced : true,
      state :{
          name : "无名"
      },
      getters : {
          getName(state) {
              return '【' + state.name + "】"
          },
      },
      mutations: {
          setName(state,value){
              state.name = value;
          },
      },
      actions: {
          setName({commit}){//这里的方法都可以获得context参数,等同于Store对象,可以调用commit进入mutations方法
              setTimeout(() => {
                  commit('setName',"杰诺斯");
              },1000);
          },
      },
  }
  
  ```

  ```vue
  //List.vue
  <template>
      <div class="list">
          <h3>{{$store.state.list.name}}</h3>
          <h3>{{getName}}</h3>
          <h3>{{$store.state.name}}</h3>
          <button @click="setName">命名</button>
      </div>
  </template>
  
  <script>
      import { mapActions } from 'vuex'
      export default {
          name: "List",
          computed : {
              getName(){
                  return this.$store.getters['list/getName'];
              }
          },
          methods : {
              // setName(){
              //     return this.$store.dispatch('list/setName');
              // },
              ...mapActions({
                  setName : 'setName'
              }),
          },
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  

### Vuex其他设置

#### 项目结构

- 随着写的越来越多,Actions,getters这些也变得混乱,这里的部分单独也可以进行分离
- 在store下直接创建js文件,建议和store对象中的属性同名比如state,getters.
- 然后把所有该属性下的内容剪切到那个js文件中,只留下类似`state,`即可.当然要在index.js顶部import引入新写的分离js
- 建议项目很大的时候这么做,项目小的话必要性不大

#### 严格模式

- 之前讲到比如`Vuex`必须通过`Mutations`提交给那个状态才能够追踪到数据.
- 你直接改变状态值也可以,但是不推荐
- 如果开启严格模式,那直接改变状态值的时候就会在浏览器有报错,但是不影响程序运行
- 所以一般是在开发阶段开启严格模式监督我们更好的写代码.
- 开启方式:在index.js的export default下的第一行写`strict : true`即可开启

### Axios跨域和封装

#### 安装

- 安装命令,在项目根目录输入`npm i axios`

#### 跨域

- 我们创建一个新组件Ajax.vue,在主页面配置跳转路由链接,在路由页面配置好

- 然后我们有两个服务器中的数据文件,一个设置为可跨域,一个不可跨域

- 首先在Ajax.vue中import安装好的axios.

- 写一个axios异步方法,发现从可跨域的可以拿到数据,没跨域的就不行

  ```vue
  <template>
  <div class="ajax">
      <h3>姓名:{{name}}</h3>
      <button @click="getName">获取+</button>
      </div>
  </template>
  
  <script>
      import axios from 'axios'
      export default {
          name: "Ajax",
          data(){
              return {
                  name : ''
              }
          },
          methods : {
              getName(){
                  //可跨域
                  axios.get("https://cdn.liyanhui.com/data.json ").then((res) => {
                      this.name = res.data[0].username
                      console.log(res);
                  })
                  //不可跨域
                  axios.get("https://cdn.ycku.com/data.json").then((res) => {
                      console.log(res);
                  })
              }
          }
      }
  </script>
  
  <style scoped>
  
  </style>
  
  ```

  

  ```
  Access to XMLHttpRequest at 'https://cdn.ycku.com/data.json' from origin 'http://localhost:8081' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://www.ycku.com' that is not equal to the supplied origin.
  Uncaught (in promise) Error: Network Error
  ```

- 解决办法:

  - 在vue.config.js文件中配置代理,如果url有端口号也要写端口号,配置好之后在axios中直接写就好.

    ```js
    //vue.config.js
    module.exports = {
        devServer : {
            proxy : "https://cdn.ycku.com/"
        }
    }
    
    ```

    ```js
    //Ajax.vue
    methods : {
        getName(){
            axios.get("/data.json").then((res) => {
                this.name = res.data[0].username;
                console.log(res);
            })
        }
    }
    ```

#### 封装

- 为什么要封装?因为直接使用axios,每个组件都要重复配置各种参数

- 就像上面写的axios代码,每个组件里都这么写就有很多重复

- 再一个后期维护,如果要修改一些参数,很多组件都要一个个修改

- 甚至后期要把axios彻底换掉,那只需要把封装的那个文件换掉即可

- 首先在项目根目录src文件夹下创建http文件夹,在其中写一个api.js文件

- 引入axios,然后导出我们封装的get方法

- 在组件中引入我们的这个get方法,使用发现正常.

  ```js
  //http/api.js
  import axios from "axios";
  //es5
  export function get(url){
      //为了返回的值可以使用then,我们需要返回一个promise对象
      return new Promise((resolve,reject)=>{
          axios.get(url).then(res=>{
              resolve(res.data);
          }).catch(err => {
              reject(err.data)
          });
      });
  
  }
  //es6
  export const get = (url) => {
      return new Promise((resolve,reject)=>{
          axios.get(url).then(res=>{
              resolve(res.data);
          }).catch(err => {
              reject(err.data)
          });
      });
  
  }
  
  ```

  ```js
  //Ajax.vue
  import { get } from "@/http/api.js"
  export default {
      name: "Ajax",
      data(){
          return {
              name : ''
          }
      },
      methods : {
          get("/data.json").then(data => {//返回的就是data而不是res
          this.name = data[0].username;
      console.log(data);
  });
  }
  }
  }
  ```

  

### CSS预处理器

- vue支持主流的预处理器，用法都比较简单，安装脚手架时选择 CSS 预处理

- 创建新项目,创建时选择

- 首先发现主页的css变为less格式

- 然后我们去About组件中写css,也用less写,把h1标签中的字变为红色

  ```vue
  <template>
    <div class="about">
      <h1>This is an about page</h1>
    </div>
  </template>
  
  <style lang="less">
    @color : red;
  
    .about h1{
      color : @color;
    }
  </style>
  
  ```

