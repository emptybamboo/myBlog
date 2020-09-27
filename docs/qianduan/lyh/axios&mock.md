## 【李炎恢】【Mock.js / Axios.js / Json / Ajax】【十天精品课堂系列】

## Mock.js

### Mock.js入门和安装

- 模拟JSON数据的前端技术
- 对于前后端分离的项目,如果后端接口还没写好,就可以使用mock来拿到一些临时数据用以提前完善前端部分.
- 安装命令,进入项目根目录打开命令行,输入`npm install mockjs`.

##### 官方示例

- node运行

  - 首先创建01.js文件
  - require(属于node语法)引入`mockjs`,使用mock方法,以及mock的语法生成一些数据.
  - 然后使用JSON.stringify把数据转为JSON格式

  ```js
  const Mock = require("mockjs");
  const data = Mock.mock({
      // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
      "list|1-10" : [{
          "id|+1" : 1// 属性 id 是一个自增数，起始值为 1，每次增 1
      }]
  });
  console.log(data);
  console.log(JSON.stringify(data,null,4));
  ```

- 浏览器运行

  - 创建html文件

  - 在其中使用script标签引入特定路径的js文件就可以.`http://mockjs.com/dist/mock.js`

  - 然后在html中的script标签中写我们的js代码.

  - 右键运行即可.

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>01</title>
        <script src="http://mockjs.com/dist/mock.js"></script>
    </head>
    <body>
    <script>
        const data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            "list|1-10" : [{
                "id|+1" : 1// 属性 id 是一个自增数，起始值为 1，每次增 1
            }]
        });
        // console.log(data);
        console.log(JSON.stringify(data,null,4));
    </script>
    </body>
    </html>
    
    ```

    

### Mock.js语法规范

- 语法有两部分构成:数据模板定义和数据占位定义
- 数据模板规范:
  - 属性名
  - 生成规则
  - 属性值
- `'属性名|生成规则':属性值`,也就是`//'name'|rule':value`
- **字符串,数值**
  - min-max 
    - 生成 min ~ max 之间的字符串 
    - 'list|1-10' 
  - count 
    - 生成 count 个字符串 
    - 'list|5' 
  - min-max.dmin-dmax 
    - 生成 min ~ max 之间的浮点数， 小数点位数在 dmin ~ dmax 之间 
    - 'id|1-10.1-3' : 1 
  - count.dcount 
    - 生成 count 个字符串， 小数点位数为 dcount 
    - 'id|8.2' : 1 
  - min-max.dcount //同上 
  - count.dmin-dmax //同上 
  - +step 
    - 每次进行累加一个值 
    - 'id|+1' : 1

- **布尔值,对象,数组**
  - 布尔值 
    - 生成布尔值，1/2 概率 true 
    - 'flag|1' : true 
  - 布尔值 min-max 
    - 生成布尔值， 概率为 min/(min + max) 
    - 'flag|1-10' : true 
  - 对象 count 
    - 从对象中随机抽取 count 个属性 
    - 'obj|2' : obj 
  - 对象 min-max 
    - 从对象中随机抽取 min-max 属性 
    - 'obj|1-3' : obj 
  - 数组 1 
    - 获取 1 次数组 
    - 'arr|1' : arr 
  - 数组 count 
    - 重复 count 次组成新数组 
    - 'arr|2' : arr 
  - 数组+1 
    - 累加
    -  'arr|+1' : arr 
  - 数组 min-max 
    - 重复 min-max 次组成新数组 
    - 'arr|1-2' : arr

- 数据定义的占位符@，比较好理解，占领属性值的位置
  - @cname:获取随机中文名
  - @city:获取中文城市

```js
const Mock = require("mockjs");

const people = {
    name : "埼玉",
    age : 25,
    gender : "男"
}
const arr = ['a','b','c'];
const data = Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    "list|1-10" : [{
        //"id|+1" : 1// 属性 id 是一个自增数，起始值为 1，每次增 1
        //"id|1-10.1-3" : 1 //生成小数点前是1-10,小数点后是1-3位的数字
        //"id|8.2" : 1 //小数点前为8,后为两位的数字
        //"id|3" : 1
        //"flag|1" : true //二分之一的概率为true
        //"obj|2" : people//随机从对象中拿出两个属性
        //"obj|1-3" : people,//随机从对象中拿出1-3个属性
        //"arr|1" : arr //获取数组中的一个元素
        //"arr|2" : arr //将同一个数组拿出两次合为一个数组
        //"arr|+1" : arr
        //"arr|1-2" : arr//如果是1就拿出一个数组,是2就把两个数组合成一个
        // "fn" : function () { //支持函数
        //     return "fn"
        // }
        //'reg|1' : /[a-z]/ //支持正则
        //name : "@cname", //cname随机中文名.name随机英文名
        //city : "@city", //随机城市
        //full : "@cname -- @city" //可以拼接
    }]
});
// console.log(data);
console.log(JSON.stringify(data,null,4));

```

### Mock.js随机占位符

- 有两种方式可以生成随机中文名

  ```js
  const Mock = require("mockjs");
  
  console.log(Mock.Random.cname());
  console.log(Mock.mock("@cname"));
  ```

- 常用的大概有

  ```js
  console.log(Mock.mock("@ctitle"));
  console.log(Mock.mock("@ip"));
  console.log(Mock.mock("@image"));
  console.log(Mock.mock("@url"));
  // 820000199501023117
  // 严每或
  // 68.135.165.150
  // http://dummyimage.com/240x400
  // rlogin://kms.bo/cvqqmnnb
  
  console.log(Mock.mock("@integer"));
  console.log(Mock.mock("@color"));
  console.log(Mock.mock("@string"));
  console.log(Mock.mock("@datetime"));
  // 8941981901492640
  // #f279e1
  // sfG@f
  // 1982-11-30 23:12:36
  ```

- 当然有些时候我们可能需要一类字符长度一样的字符串,那也可以自己扩展占位符

  ```js
  Mock.Random.extend({
      cflower(){
          return this.pick([
              "霸王花",
              "玫瑰花",
              "茉莉花",
              "月季花",
          ]);
      }
  });
  console.log(Mock.mock("@cflower"));
  //茉莉花
  ```

## axios

### axios入门和安装

- 安装命令,在项目根目录命令行运行`npm install axios`

- 用法

  ```js
  const axios = require("axios");
  //promise一样的用法,成功是.then,失败为.catch
  axios.get("https://cdn.liyanhui.com/data.json")
      .then(res => {
          console.log(res.data);
      }).catch(err => {
      console.log("错误"+err);//错误Error: Request failed with status code 404
  });
  
  ```

  

- node环境下不存在跨域不跨域,都可以获取到数据,但是浏览器环境则不同.

- 如果本地没安装axios,使用`<script src="https://unpkg.com/axios/dist/axios.min.js"></script>`也可以使用axios

- 浏览器环境下,跨域则获取不到数据

- `Access to XMLHttpRequest at 'https://cdn.ycku.com/data.json' from origin 'http://localhost:63342' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header has a value 'https://www.ycku.com' that is not equal to the supplied origin.
  错误Error: Network Error`

- ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script>
          axios.get("https://cdn.liyanhui.com/data.json")
              .then(res => {
                  console.log(res.data);
              }).catch(err => {
              console.log("错误"+err);//错误Error: Request failed with status code 404
          });
      </script>
  </head>
  <body>
  
  </body>
  </html>
  
  ```


### axios配置和并发

- 有时候我们异步访问某个url,可能要携带一些参数

- 如果每次都拼接到url后面,手动写太过麻烦.

- 所以axios给我们提供了配置携带参数的方法.

  ```js
  axios.get("https://cdn.liyanhui.com/data.json?id=1")
      .then(res => {
      console.log('第一个');
  });//手动拼接很麻烦
  
  axios.get("https://cdn.liyanhui.com/data.json",{//配置拼接,在浏览器的network页面的url后面会拼上配置的参数
      params : {
          id : 1,
          status : 404
      }
  })
      .then(res => {
      console.log(res.data);
  });
  
  //完全配置
  axios({
      url :"https://cdn.liyanhui.com/data.json",
      method : "get",
      params : {
          id : 1,
          status : 404
      }
  })
      .then(res => {
      console.log(res.data);
  });
  ```

  

- 而且axios的异步是并发的,不是等一个执行完再执行另一个.

- 所以连续写三个异步,不一定哪个先执行完毕.

- 使用`axios.all()`方法就可以按顺序执行异步(其实就是promise).

  ```js
  
  //直接写三个异步,运行顺序无法保障
  axios({
      url :"https://cdn.liyanhui.com/data.json",
      method : "get",
      params : {
          id : 1,
          status : 404
      }
  })
      .then(res => {
      console.log("1个");
  });
  axios({
      url :"https://cdn.liyanhui.com/data.json",
      method : "get",
      params : {
          id : 1,
          status : 404
      }
  })
      .then(res => {
      console.log("2个");
  });
  axios({
      url :"https://cdn.liyanhui.com/data.json",
      method : "get",
      params : {
          id : 1,
          status : 404
      }
  })
      .then(res => {
      console.log("3个");
  });
  //使用all方法可以按规定顺序执行异步
  axios.all([
      axios({
          url : "https://cdn.liyanhui.com/data.json",
          data : "1.异步"
      }),
      axios({
          url : "https://cdn.liyanhui.com/data.json",
          data : "2.异步"
      }),
      axios({
          url : "https://cdn.liyanhui.com/data.json",
          data : "3.异步"
      }),
  ]).then(val => {
      for(let i = 0;i < val.length;i++){
          console.log(val[i].config.data);
          //1.异步
          //2.异步
          //3.异步
      }
  
  });
  //上面使用for循环取数据太麻烦,执行多个异步怎么拿到他们各自的数据方便呢?使用spread方法即可
  axios.all([
              axios({
                  url : "https://cdn.liyanhui.com/data.json",
                  data : "1.异步"
              }),
              axios({
                  url : "https://cdn.liyanhui.com/data.json",
                  data : "2.异步"
              }),
              axios({
                  url : "https://cdn.liyanhui.com/data.json",
                  data : "3.异步"
              }),
          ]).then(axios.spread((res1,res2,res3)=>{
              console.log(res1.config.data);
              console.log(res2.config.data);
              console.log(res3.config.data);
          }));
  ```

### axios实例化和拦截

#### 全局配置

- 我们使用的异步网址大概率很长一段是重复的,我们就可以抽离出来设置

- `axios.defaults.baseURL = "https://cdn.liyanhui.com";`,它会自动和我们axios的url属性拼接到一起

  ```js
  axios.defaults.baseURL = "https://cdn.liyanhui.com";
  //注释掉配置就会报错
  //Failed to load resource: the server responded with a status of 404 (Not Found)
  axios.all([
      axios({
          url : "/data.json",
          data : "1.异步"
      }),
      axios({
          url : "/data.json",
          data : "2.异步"
      }),
      axios({
          url : "/data.json",
          data : "3.异步"
      }),
  ]).then(axios.spread((res1,res2,res3)=>{
      console.log(res1.config.data);
      console.log(res2.config.data);
      console.log(res3.config.data);
  }));
  ```

  

#### 实例化

- 实例化就是new一个对象,语法是`axios.create()`,好处是各个对象相对独立不受影响,可以给每个对象不同的配置,比如配置`defaults.baseURL`

- 甚至`create()`方法内部都可以直接传一些配置.

  ```js
  //创建对象再配置
  const myAxios = axios.create();
  myAxios.defaults.baseURL = "https://cdn.liyanhui.com";
  
  //创建对象方法中配置
  const myAxios = axios.create({
      baseURL : "https://cdn.liyanhui.com"
  });
  
  myAxios({
      method : 'get',
      url : "/data.json",
  }).then(res => {
      console.log(res.data);
  });
  ```

#### 拦截

- 所为拦截操作就是在异步操作获取数据前的一些操作

- 拦截操作的代码必须按顺序写在异步代码头顶.

- 比如修改配置,loading,判断验证跳转,比如没登录就跳转到注册页面

- 分为两种,**请求拦截**和**响应拦截**

- 请求拦截是在还没获取数据时拦截,修改配置一类的`axios.interceptors.request.use`,匿名函数中可以拿到config配置对象

- 而相应拦截已经获取到数据,可以对数据进行操作再返回`axios.interceptors.response.use`,匿名函数中可以拿到response对象,可以操作数据

  ```js
  myAxios.interceptors.request.use(config => {
      console.log("请求拦截");//这时就会拦截下面的异步请求
      config.url = "data2.json";//修改配置,url,因为是错误的url所以报错GET https://cdn.liyanhui.com/data2.json 404
      config.timeout = 5;//修改超时配置,0.05s就超时,报错Uncaught (in promise) Error: timeout of 5ms exceeded
      return config;//因为本质是promise,所以只要返回自己,就可以继续调用
  });
  ```

  ```js
  myAxios.interceptors.response.use(response => {
      console.log(response.data);//在这里可以对这个data做各种各样的修改再返回给异步的结果
      return response;
  });
  ```

  ```js
  myAxios({
      method : 'get',
      url : "/data.json",
  })//说白了请求拦截等于是在这里拦截
      .then(res => {//响应拦截是在这里
      console.log(res.data);
  });
  ```

  

### Mock拦截axios请求

- 我们写一个异步请求,假如后端的接口还没写好,所以访问不到网址或拿不到数据

- 我们就把异步请求拦截使用mock填充我们想要的数据

- 只需要使用Mock.mock,第一个参数填要拦截的url,第二个参数写我们要填充的数据格式即可.这样不论这个url能不能拿到数据我们都可以拦截并填充数据.

  ```html
  <!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Title</title>
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <script src="http://mockjs.com/dist/mock.js"></script>
          <script>
              //上下两个url必须一致,这样将来只需要删掉mock代码即可
              axios.request({
                  'method' : 'get',
                  'url' : 'http://cdn.liyanhui.com/data.json',
              }).then(res => {
                  console.log(res.data);
              });
  
              Mock.mock('http://cdn.liyanhui.com/data.json',{
                  "list|5-10" : {
                      "id|+1" : 1,
                      "name" : "@cname",
                      "email" : "@email",
                      "gender" : "@boolean",
                      "price" : "@integer",
                  }
              });
          </script>
      </head>
      <body>
  
      </body>
  </html>
  
  ```

  