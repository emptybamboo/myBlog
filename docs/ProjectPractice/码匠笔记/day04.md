### 第四天的笔记,2019年7月8日,p16
- 查询Springboot如何集成Mybatis,查到官方第一手资料,是英文的,但是最新又好用,所以选择它,发现只要使用mybatis-spring-boot-starter即可集成.
1. 把这个文件加入到pom.xml中
			`<dependency>
			    <groupId>org.mybatis.spring.boot</groupId>
			    <artifactId>mybatis-spring-boot-starter</artifactId>
			    <version>2.0.1</version>
			</dependency>`
2. 教程直接就开始让我们写代码了,但是这个时候就纠结了,配置文件呢?看文档中写到,如果你没有配置默认数据库连接池会自动去找当前的连接池.spring的官方文档中写到,spring有一个内置数据库连接池`HikariCP`,这是一个官方支持并且并发高性能的连接池,如果使用`spring-boot-starter-jdbc`依赖或者`spring-boot-starter-data-jpa`依赖,会自动得到这个连接池.
- 文档写到可以通过properties文件定义连接池,以spring.datasource.*的格式,比如:
`spring.datasource.url=jdbc:mysql://localhost/test
spring.datasource.username=dbuser
spring.datasource.password=dbpass
spring.datasource.driver-class-name=com.mysql.jdbc.Driver`
- 这个username和password是什么呢?默认情况是需要填入这俩.h2本身也支持这个,所以就给个默认的username:sa和password:123
- Driver是连接池连接数据库的一个驱动.上一讲了解到H2的驱动是`org.h2.Driver`,但是不要忘了把`spring-boot-starter-jdbc`写到pom.xml中引入依赖.这样就完成了spring的连接池配置.
- 再看文档,提到了我们需要提供一个Mapper,去路由数据的一个功能.
	1. 在community也就是项目方java代码的根目录下写一个mapper文件夹, 写一个UserMapper.
	2. 首先最外层需要一个Mapper注解,其次需要一个Select注解,将文档中的代码复制过来:
    @Select("SELECT * FROM CITY WHERE state = #{state}")
    City findByState(@Param("state") String state);
	3. 我们这一讲的目的就是在AuthorizeController中获取到GithubUser时存入数据库并且写入Session.
	4. 在org.apache.ibatis.annotations中有Insert注解,在UserMapper中写`public void insert(User user);`,User从哪找到呢?这时引入一个新的模型叫Model.
	5. 类和类之间网络间传输用Dto,在数据库中我们叫它Model(模型),在mapper同级文件夹下创建model文件夹,写一个User,在User中写代码:
	
            public class User {
            private Integer id;
            private String name;
            private String accountId;
            private String token;
            private Long gmtCreate;
            private Long gmtModified;
	
	6. 加入Get/Set,回UserMapper中导入User,但是依然报错,说需要引入一个方法体,原来是UserMapper错定义为了class,应该是Interface.
	7. 给insert加@Insert注解,然后按照SQL语句要求写入插入语句,`insert into 表名 {} values {}`.
	8. id是自增长所以不写,然后把name,accountid依次写入表名后的第一个花括号,注意按照数据库格式,两个单词用下划线分开,全小写.
	9. values括号中写的话用#{值}的方式写,Mybatis就会当你执行这条语句时,会把Object里面的(这里为User)user上的name属性自动填充到#{}开头的这个东西里自动替换掉.#{}中不用按数据库格式,就按java的格式写.
	10. 写好后的Insert注解括号中SQL语句如下:
	`"insert into user (name,account_id,token,gmt_modified) values (#{name},#{accountId},#{token},#{gmtCreate},#{gmtModified})"`
	11. 回到AuthorizeController,使用@Autowired把UserMapper引入.
	12. 在if判断user是否为空里,写上userMapper.insert(new User),在括号里User后面Ctrl+Alt+V自动抽取一个变量,抽出来的User起名为user1,因为上面的GtihubUser起名为了user,为了上下文一致,按住shift+f6修改GtihubUser的这个user(这个快捷键可以在你改某个名字的时候上下文中使用这个名字的都一起改变),会询问你是改变代码还是全部,选择第一个修改代码.下面的User还是shift+f6改成user.
	13. 然后依次写好user.set方法
		1. 第一个Token希望用UUID.
		2. 第二个Name和AccountId,都是从githubUser中直接拿,但是Id是Long类型,因为考虑到可能支持Github平台外的其他平台所以定义成了String,所以需要强转
		3. gmtCreate调用当前时间
		4. gmtModified直接获取gmtCreate即可.

                user.setToken(UUID.randomUUID().toString());
                user.setName(githubUser.getName());
                user.setAccountId(String.valueOf(githubUser.getId()));
                user.setGmtCreate(System.currentTimeMillis());
                user.setGmtModified(user.getGmtCreate());

- 这时写好了,运行项目看看是不是真的登陆成功后就能写入数据库.
- 但是发现报错了,500属于服务器异常,发现是properties里没有修改datasource的url,打开database的properties,里面写的我们需要的是~/community这个地址,所以把配置文件中的url改成`spring.datasource.url=jdbc:mysql:~/community`

#### 这时候遇到了很大的报错问题
1. 首先就是我insert注解中的sql语句写错了,其次是配置文件中jdbc:mysql:~/community是错误的,我们使用的是H2数据库,应该是jdbc:h2:~/community
2. 然后呢,我发现我H2数据库的gmt_create写成了gmt_creat,当我想去修改,出现了严重的问题,我顺手把数据库的用户名密码设置成视频中提到的sa和123,但是一直弹窗无法成功,自然也无法改动数据库列名.
3. 经过询问,我得知需要去C盘下的用户文件夹搜索community开头,db为后缀的文件,一共有两个,统统删除后,回到项目,数据库表已经没了,但是这时可以重新设置用户名密码,不会再出问题,表没了可以重新创建,git玩得转的人可以从git上把表拿回来.
4. 这下运行项目,点击登录,可以发现数据库中已经取到了User信息.要注意H2数据库最多只有一个链接,所以刷新数据库之类的需要断开项目链接.