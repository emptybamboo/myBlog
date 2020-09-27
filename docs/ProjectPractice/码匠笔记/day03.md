### 第三天的笔记,2019年7月7日,p11-p15
#### Github登陆之获取用户信息
- Component注解
	1. 它和controller有点像,controller是把当前的类作为路由API的一个承载者
	2. component仅仅是把当前类初始化到spring容器的上下文(content)
	3. 简单的理解就是加了这个注解后,就不需要实例化它的对象,不需要写成Xx xx = new Xx()这样
	4. 也就是spring的IOC概念,放了@Component这个注解,对象就自动实例化放到一个池子里,当我们用的时候,很轻松就能从池子拿出来用.
	5. 在其他需要被这个注解注释的地方用Autowired注解,private Xx xx,即可使用这个类

- 如果参数超过两个以上,别放到形参中,封装成对象去做(dto数据传输模型).
- 在GithubProvider中的getAccessToken方法传递这五个参数(clientId/clientSecret/code/redirectUri/state),调用这个POST地址,获取accesstoken.这五个地址是Github的[App数据交互](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)所要求的.
- 之后需要做POST请求,拷贝OKhttp文档对应部分过来,但是少了一步,没有引入jar包.使用引入MAVEN方法引入
```xml
<dependency>
            <groupId>com.squareup.okhttp3</groupId>
            <artifactId>okhttp</artifactId>
            <version>3.14.1</version>
</dependency>
```
- 在AuthorizeController中调用刚才写好的provider方法,
- @Autowired注解会自动把spring里写好的实例加载到当前使用的上下文
```java
@Autowired
    private GithubProvider githubProvider;
```
- callback方法中的下面直接调用GithubProvider,这个方法需要一个AccessTokenDto,但是我想把它定义一个在外边的变量,因为我还要给它赋值,shift+enter会自动把光标移动到下一行最前方.
` String accessToken = githubProvider.getAccessToken(accessTokenDto);`
- 在dto文件夹下创建GithubUser,这个GithubUser其实是provider的一个返回值.
- 回到GithubProvider,写好getUser方法,也是参考OKhttp文档,第一步构建一个HttpClient` OkHttpClient client = new OkHttpClient();`
- 第二步构建一个request
- `Request request = new Request.Builder()
                    .url("https://api.github.com/user?access_token="+accessToken)
                    .build();`
- response.body().string()就能拿到string对象,但是通过浏览器的请求,已经知道了他就是json格式,就直接用下载好的fastjson的包去做解析.
- parseObject可以吧string自动转换为java的类对象.
```java
try {
            Response response = client.newCall(request).execute();
            String string = response.body().string();
            GithubUser githubUser = JSON.parseObject(string, GithubUser.class);
            return githubUser;
        } catch (IOException e) {
        }
        return null;

```
- 这里得到的access_token是这样的,'access_token=123456&scope=user&token_type=bearer',而我们希望拿到的只有这部分'123456',所以要把得到的这部分进行字符串拆分,split
```java
String[] split = string.split("&");
String tokenstr = split[0];
String token = tokenstr.split("=")[1];
```
- 最好写完之后改为链式编程
`String token = string.split("&")[0].split("=")[1];`
#### 配置application.properties
- 为了不在代码中暴露clientid和clientsecret和redirecturi,就把这三个写进配置文件application.properties中.
- 当我们把这些具体地址写到了application.properties配置文件中,就需要一个新的注解,先直接定义过来,再写上@Value注解,里面写上${配置文件中的键名},之后再把定义的这个放到底下的set方法,原理和Autowired是一个意思,Value的意思是它会去配置文件里读类似github.client.id这个key的value,把它赋值到我们这个controller(AuthorizeController)里定义的private String clientId;
```java
 	@Value("${github.client.id}")
    private String clientId;
    @Value("${github.client.secret}")
    private String clientSecret;
    @Value("${github.redirect.uri}")
    private String redirectUri;
```
- 之后AuthorizeController就可以改成
```java
	accessTokenDto.setClient_id(clientId);
	accessTokenDto.setClient_secret(clientSecret);
	accessTokenDto.setRedirect_uri(redirectUri);
```
#### session与cookie
- 当把HttpServletRequest写入方法里,Spring就会自动去把上下中的request放到这里让我们用
```java
public String callback(@RequestParam(name="code") String code,
                           @RequestParam(name="state")String state,
                            HttpServletRequest request)
```
- AuthorizeController中定义登陆逻辑,如果user不为空就登陆成功,把user放到session里,如果登陆失败就重新登陆.
```java
if(user!=null){
            //登陆成功,写cookie和session,前提条件在方法形参里写好HttpServletRequest request才能用request
            request.getSession().setAttribute("user",user);//把user对象放到了session里面
            return  "redirect:/";//21.如果不使用redirect,就像 return "index";,它只会把页面渲染成index,如果加了这个redirect前缀
            //就会把地址全部去掉直接重定向到这个页面.
        }else{
            //登陆失败,重新登陆
            return  "redirect:/";
        }
```
- 最后在index页面用thymeleaf的if逻辑,未登录右上角显示登陆,登陆了右上角就显示name(github的setting中的name,也就是昵称).
```html
<li class="dropdown" th:if="${session.user!=null}">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                       aria-expanded="false" th:text="${session.user.getName()}"><span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">消息中心</a></li>
                        <li><a href="#">个人资料</a></li>
                        <li><a href="#">退出登录</a></li>
                    </ul>
                </li>
                <li th:if="${session.user == null}"><a href="http://github.com/login/oauth/authorize?client_id=123456&redirect_uri=http://localhost:8887/callback&scope=user&state=1">登录</a></li>
```
#### 引入数据库,Mysql
- 上一P中有个疑问,当服务重启的时候我们的登录态就会消失,怎么保留登录态呢?就需要引入数据库的概念.
	1. 创建数据库:`CREATE DATABASE 数据库名;`
	2. 创建数据表:`CREATE TABLE table_name (column_name column_type);`

            CREATE TABLE IF NOT EXISTS `runoob_tbl`(
               `runoob_id` INT UNSIGNED AUTO_INCREMENT,
               `runoob_title` VARCHAR(100) NOT NULL,
               `runoob_author` VARCHAR(40) NOT NULL,
               `submission_date` DATE,
               PRIMARY KEY ( `runoob_id` )
            )ENGINE=InnoDB DEFAULT CHARSET=utf8;

		- 如果你不想字段为 NULL 可以设置字段的属性为 NOT NULL， 在操作数据库时如果输入该字段的数据为NULL ，就会报错。
		- AUTO_INCREMENT定义列为自增的属性，一般用于主键，数值会自动加1。
		- PRIMARY KEY关键字用于定义列为主键。 您可以使用多列来定义主键，列间以逗号分隔。
		- ENGINE 设置存储引擎，CHARSET 设置编码。
		
	3. 增(插入数据):往table_name表中插入数据field1, field2,...fieldN,数据的值分别为value1, value2,...valueN.
	
            INSERT INTO table_name ( field1, field2,...fieldN )
                                   VALUES
                                   ( value1, value2,...valueN );
                     
	4. 查(查询数据):
            ```
            SELECT column_name,column_name
            FROM table_name
            [WHERE Clause]
            [LIMIT N][ OFFSET M]
            ```

		- 查询语句中你可以使用一个或者多个表，表之间使用逗号(,)分割，并使用WHERE语句来设定查询条件。
		- SELECT 命令可以读取一条或者多条记录。
		- 你可以使用星号（*）来代替其他字段，SELECT语句会返回表的所有字段数据
		- 你可以使用 WHERE 语句来包含任何条件。
		- 你可以使用 LIMIT 属性来设定返回的记录数。
		- 你可以通过OFFSET指定SELECT语句开始查询的数据偏移量。默认情况下偏移量为0。(limit加offset完成分页功能)
	5. 改(更新):
	    - `UPDATE table_name SET field1=new-value1, field2=new-value2[WHERE Clause]`
        - 修改表table_name中的field1数据值为new-value1,field2值为new-value2
		- 你可以同时更新一个或多个字段。
		- 你可以在 WHERE 子句中指定任何条件。
		- 你可以在一个单独表中同时更新数据。
	6. 删(删除数据):
		- `DELETE FROM table_name [WHERE Clause]`
		- 删除table_name表中的数据,删除的数据必须满足WHERE后面跟的条件.

#### 初识H2数据库
- 学习Mysql有成本,这个练手项目就是为了快速上手Springboot,所以用H2取代一下.
- 非常小巧,只有2M,可以用jar依赖的方式直接放到项目中去.
- 去maven仓库中搜jar包

        <!-- https://mvnrepository.com/artifact/com.h2database/h2 -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>1.4.199</version>
            <scope>test</scope>
        </dependency>


1. 需要有jar包
2. 希望你有jdbc的Driver,maven仓库没有,怀疑是否是jar包自带.在jar包中查找后发现果然有.

- IDEA右侧自带的database就可以帮你管理数据库.
	1. 打开后点击加号,选择Data source中的H2
	2. URL那行的后面的下拉选择,选择embedded
	3. URL路径是什么呢?官方网站的文档里写出,`jdbc:h2:+路径`即可,在IDEA的database中把URL改为`jdbc:h2:~/community`,~/代表是根目录,并且起了一个和项目同名的名字.
	4. 一般是点击测试连接就会成功,如果提醒缺少Driver文件,那就点击它提醒的下载即可,不影响什么.
	5. 测试连接成功后点击ok就创建好了一个数据库
	6. 然后我们要创建表格用来创建用户信息,右键点击数据库,选择NEW中的Table,起名为user,为了方便起见就用图形化界面创建,下方可以显示出数据库代码的变化.
	7. 点击加号添加,第一个字段为id,勾选自增长(Auto inc)和主键(Primary key).
	8. 第二个添加用户,account_id,varchar格式,设置长度100
	9. 第三个添加name,varchar格式,名字可长可短,设置50即可
	10. 还缺少一个cookie,之所以能在页面上找到服务器端,是因为页面传过来一个cookie到服务器端,服务器端通过cookie,通过框架的解释,自动把session拿到,这时,要连接数据库就不可以用默认session机制,需要自己设置一个值,登陆成功后,手动把它设置到cookie里.等它传递过来的时候,拿这个值往数据库里面插.
	11. 起名为token,设置为char类型,为什么?因为varchar类型是可变的,如果设置成50,你是10/20/30都可以,存储时会根据它固定的长度去设置它的空间,char类型无论你字符长度是多少我都给你占这么多空间,因为你token想用uid类型的,所以设置为36长度,无论长短永远占36个字节.
	12. 创建两个默认值,创建时间和修改时间,后面用于排查.设置为bigint类型.int对应java的int,bigint对应java的long类型.
	13. 下方自动显示数据库语句如下,点击execute
```mysql
create table user
(
	id int auto_increment,
	account_id varchar(100),
	name varchar(50),
	token char(36),
	gmt_creat bigint,
	gmt_modified bigint,
	constraint user_pk
		primary key (id)
);
```
- 现在已经有了h2数据库,表格user,双击它,点击加号就可以添加user,随便填一条数据,点击submit,刷新,显示有这条数据.
- 小技巧积累:
::: tip
Ctrl+e就是IDEA中切换到最近的编程窗口
:::