### 第五天的笔记,2019年7月9日,p17-p19

#### 实现持久化登录状态获取
- 把插到数据库的这条数据当做登陆的一个状态,拿Token去当做一个登陆的验证,手动模拟cookie和session,做到重启服务器和宕机时,再次启动的时候都可以登陆并且保有登录态.
- 使用Git,当和远端仓库不一致时(指远端比本地更新更多),就可以看作是工作时和同事分别提交,应该输入git pull指令把远端拉过来,再push到远端
- git pull后这时候就会提示打一个备注信息,是不是merge(合并)一下远端的,当然是,这时候ESC+SHIFT+:x然后回车,退出并保存,执行push.
- 
---
- 进入今天整体,怎样登录后通过java代码,往前端写一个cookie
- 当使用Github登陆以后,会做登陆获取到用户信息,获取到用户信息时候生成一个Token,之后把Token放到User对象里面,存储到数据库中,并且把Token放到Cokkie里.
- 试验一下是否成功,运行项目前把H2数据库连接关掉,因为H2数据库它只支持一个连接.
- 我们已经把写到Token里,所以当访问首页时,需要把Cookie里名为Token的信息获取到,去数据库中查询是否存在,以此验证是否成功.
- 在indexController中使用IOC引入UserMapper(也就是用@Autowired),在index方法里,希望userMapper中有一个findByToken方法,给进去一个token,就能获取一个User对象.
- 如果User对象不为空就说明它OK,这个时候在IndexController中,index方法里输入形参HttpServletRequest,使用request的getCookies方法得到cookie发现是一个数组,然后把数组for循环一下,if,cookie的name,equals("token"),就使用cookie的gitValue,设为String类型的token,然后使用userMapper的findByToken方法,把这个token放进去,得到一个User对象,然后把findByToken方法Alt+enter实现在UserMapper中.
- UserMapper中在findByToken方法上写上Select注解,写好数据库语句,注意这里的#{toekn}代表Mybatis会自动取形参中的同名数据token放到这个括号里.不同的时候,如果形参是一个类会自动放,如果不是一个类需要加一个注解,@Param{"token"}设置name为token,后面跟着Value为String token.
- 回到indexController,如果user!=null,就写到session里面,让页面能够展示.如果不等于null就不管它了.
- 基本编写完成,重启服务器查看效果.

#### 集成Flyway Migration
- 发现GithubUser中的bio并没加到数据库,操作加到数据库中,对着数据库中的USER右键,Modify Table,点击+号添加.这样每次都需要视频里的语句分享给观众,每次都这样添加进去,非常麻烦,如果团队有十个人,拷一个脚本十个人都得执行,会给工作带来很大的烦恼.
- Flyway就能解决这个问题,比如张三的数据库是一个版本,李四是另一个版本,Flyway就能把这两个合成一个版本,它能自动帮你管理所有的版本.
- 拷贝官网的maven代码引入.
```html
 <plugin>
                <groupId>org.flywaydb</groupId>
                <artifactId>flyway-maven-plugin</artifactId>
                <version>5.2.4</version>
                <configuration>
                    <url>jdbc:h2:file:./target/foobar</url>
                    <user>sa</user>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>com.h2database</groupId>
                        <artifactId>h2</artifactId>
                        <version>1.4.197</version>
                    </dependency>
                </dependencies>
            </plugin>
```
- properties配置文件中把databaseurl改为这个maven代码中的,并且给maven代码的这个url部分下面加上password标签.
- 按照官方文档接下来应该Creating the first migration.
- 我们应该做的步骤如下:
	1. 在resources的db文件夹下的migration中,创建文件存放你想修改数据库而使用的数据库语句,起名按大概的规范V1__create_表名_table.sql,加入第二条是添加,那就起名V2__Add_bio_col_to_user_table.sql,名字见名知意即可.
	2. 如果你想删掉你所有的数据库,那就执行rm ~/community.*
	3. 然后执行mvn flyway:migrate即可把你创建的文件完成数据库创建.
	:::danger
		注意这里有很大的问题,视频中是Mac系统,如果是Windows,就配置好Maven的PATH,重启IDEA才能使用这个mvn语句.
	:::
	- 但是我注意到我连rm语句都没法执行,会报错:`rm: cannot remove '/c/Users/鍚曞織瓒'$'\205''/community.*': No such file or directory`
	- 那只能改日解决了,其实我感觉这个flyway其实很鸡肋..本来就算一点点改数据库也并不麻烦.