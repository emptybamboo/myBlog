### 第八天笔记,2019年7月21日,p22-23

#### 添加Lombok支持

- 现在需要做的是首页左边有一些问题列表,右边是热门的话题

- 首先分析一下左边每条记录需要展示什么内容.

- 有问题标题,标签,发布人(有悬浮内容),回复问题,回复数,浏览数,发布时间,最左边是发布用户的头像,我们希望我们也有这个头像显示,但是数据库并没有头像字段,想快速添加一个头像到数据库的字段.

- 首先第一步要在migration上创建一个脚本,数据库语句使用IDEA的databae工具自动生成

- ```mysql
  alter table USER
  	add avatar_url varchar(100);
  
  ```

  ![](https://i.postimg.cc/J4JW0Gyr/image.png)

- 按照命名格式创建第4个migration文件,放入刚刚生成的SQL语句.

![](https://i.postimg.cc/bwhftpbQ/4-migration.png)

- H2数据库很小,只支持一个链接,所以断开数据库连接,之后执行**mvn flyway:migrate**指令.
- <font color=red>但是这里出了问题</font>>,之前User表中的字段gmt_create我写错成了gmt_creat,之后我又手动直接改正确了,甚至把migration文件V1都改为正确的字段,但是这样子执行flyway的命令他会报错,意思就是现在的数据库和之前的版本不对了,经过琢磨,我把正确的字段又改错了回去,再把V1也改回了原来错误的,然后创建V4文件,把修改某个字段名的SQL语句自动生成,放进这个文件,把添加头像url字段的文件改为V5,然后再次执行flyway指令,就成功了,这说明你哪怕一点点小小改动,也需要创建一个migration文件来执行,不能自己手动改了再去修改某个之前有的文件.

![](https://i.postimg.cc/RVGLcTJX/image.png)

- 之后把头像字段加到User实体类中,加上get/set方法.
- 每次都要执行这一步,非常麻烦,所以这节就需要学习一个新的工具:[lombok](https://www.projectlombok.org/).
- 进入官网,选择install下拉菜单中的maven选项,复制依赖,粘贴到项目中的pom.xml中即可.

```xml
<dependency>
		<groupId>org.projectlombok</groupId>
		<artifactId>lombok</artifactId>
		<version>1.18.8</version>
		<scope>provided</scope>
	</dependency>
```

- 他的官方文档中写到,**@Data**注解会自动的生成toString,哈希code,geter,seter方法.
- 所以回到User实体类中删掉所有的get/set方法,在User类上加上注解**@Data**,就自动生成get/set了.顺便就把Question实体类,dto文件夹中的文件改掉.**有了lombok,以后就只需要在实体类添加字段即可,不需要写get/set方法了.**

::: danger

这里只添加lombok的依赖是没用的,必须安装IDEA的lombok插件才会有get/set方法

:::

- 因为刚才在数据库添加了头像字段,所以回到UserMapper中,在insert注解中添加上它.
- 之前我们通过Github的一个API获取数据,刚好这个API中也有头像数据,那就应该在获取API数据时,也获取头像的这个数据.
- 在**AuthorizeController**中添加`user.setAvatarUrl(user.getAvatarUrl());`获取到.
- 重启项目,浏览器中F12删除所有cookie,以为没有做退出功能,不删除就一直是账号登录状态,但是删了之后报错,似乎是没有cookie就会报空指针异常.
- 所以在IndexController和PublishController中,得到Cookie的语句后面加上一个判断

```java
if(cookies !=null && cookies.length!=0)
```

- 运行项目,点击登录,查看数据库,数据库中头像url的数据中的网址打开之后,正常显示Github头像.

#### 完成首页问题列表功能

- 这一节需要布局好首页的页面,并且能把数据展示出来.
- 之前有过类似布局,所以直接去**publish.html**页面复制这部分布局代码

```html
<div class="container-fluid main">
    <div class="row">
        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
            <h2><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> 发起</h2>
            <hr>

            <form action="/publish" method="post">
                <div class="form-group">
                    <label for="title">问题标题(简单扼要) :</label>
                    <!--输入标签内添加name=xx,会自动提交数据-->
                    <input type="text" class="form-control" th:value="${title}" id="title" name="title" placeholder="问题标题__">
                </div>
                <div class="form-group">
                    <label for="description">问题补充(必填,请参照右侧提示) :</label>
                    <textarea  name="description" th:value="${description}" id="description"  class="form-control" cols="30" rows="10"></textarea>
                </div>
                <div class="form-group">
                    <label for="tag">添加标签:</label>
                    <input type="text" class="form-control" th:value="${tag}" id="tag" name="tag" placeholder="输入标签,以,号分割">
                </div>

                <!--在发布旁边提示错误信息-->
                <!--在大的格局下面再包裹一个格局,希望它是充满整个屏幕的-->
                <div class="container-fluid main">
                    <div class="row">
                        <div class="alert alert-danger col-lg-9 col-md-12 col-sm-12 col-xs-12"  th:text="${error}"
                             th:if="${error!=null}"></div>
                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                            <button type="submit" class="btn btn-success btn-publish">
                            发布
                        </button>
                        </div>

                    </div></div>

            </form>
        </div>
        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
            <h3>问题发起指南</h3>
            • 问题标题: 请用精简的语言描述您发布的问题，不超过25字 <br>
            • 问题补充: 详细补充您的问题内容，并确保问题描述清晰直观, 并提供一些相关的资料<br>
            • 选择标签: 选择一个或者多个合适的标签，用逗号隔开，每个标签不超过10个字<br>
        </div>
    </div>
</div>
```

- 粘贴到**index.html**.
- 每个帖子由很多部分组成,在bootstrap中找到合适的样式,替换掉原来的表单部分代码form.

```html
<div class="media">
  <div class="media-left">
    <a href="#">
      <img class="media-object" src="..." alt="...">
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">Media heading</h4>
    ...
  </div>
</div>
```

- 按要求填写具体内容后,快速启动项目,看下是否是想要的效果,如果是,直接从数据库查询所有列表循环展示,问题就解决了.

```html
<div class="media">
                    <div class="media-left">
                        <a href="#">
                            <img class="media-object" src="https://avatars2.githubusercontent.com/u/47071080?v=4">
                        </a>
                    </div>
                    <div class="media-body">
                        <h4 class="media-heading">怎么快速学会 SpringBoot 开发</h4>
                        点击进入帖子
                    </div>
                </div>
```

- 顺便在页面左上角的码匠社区四个字添加链接,希望点击后跳转到主页.(href="/")
- 样式是我们需要的,但是头像图片太大.在community.css改写样式,引入css文件到index.

------

- 怎样获取正确数据列表到页面上呢?到indexController中,index方法return之前查出即可,如何放到页面?通过**model.addAttribute**可以把相应数据全都携带导前端页面去.
- 在**indexController**中@Autowired注入QuestionMapper,在QuestionMapper中写一个能获取列表的方法.

```java
List<Question> questionList = questionMapper.list();
```

- 这个是接收信息的语句,list会报错,alt+enter,就会进入QuestionMapper中创建一个`List<Question> list();`,加上@Select注解写好相对应的SQL语句.

```java
 @Select("select * from question")
    List<Question> list();
```

- 回到indexController中,在index方法的形参中添加`Model model`,在方法最后添加model.addAttribute,把获取到的list发给前端.
- 现在有个问题,Question的实体类是没有头像的,**所以需要把creator关联到User表.Question表中的creator其实是关联到User表中的id,通过User表中的avatar_url才能拿到头像.**
- 所以现在不是这么简单了,需要在Question对象上加一个User对象,但问题就来了,如果加User对象,但是Question本身是一个数据库模型,一一和数据库对应,本身不需要有User对象这么一个概念.
- 所以需要另一个逻辑,DTO,传输层的东西,这时需要定一个新的对象**QuestionDto**.
- **QuestionDto**结构上和Question基本是一样的,只有一个地方不同,它多了一个User对象.

```java
private User user;
```

- 真正用的时候也是用它,所以就希望返回的是一个QuestionDTO,但是QuestionMapper是针对Question这张表,所以不能返回QuestionDto,这时就提到一个新的模型--**<u>Service</u>**.
- 在项目目录下创建service文件夹,创建QuestionService,给它加上@Service注解,这样Spring会自动管理它.

![](https://i.postimg.cc/3Rs9yr6p/service.png)

- **创建QuestionService的目的是在里面不仅仅是使用QuestionMapper,还同时可以使用UserMapper,起到一个组装作用,当一个请求需要组装User同时也需要组装Question,就需要一个<u>中间层</u>做这个事情.习惯上把这个中间层叫做<u>Service</u>.**
- 在idenxCtroller中就使用QuestionService,list报错,alt+enter自动生成.

![](https://i.postimg.cc/QddgdWtw/indexcontroller-questionservice.png)

- 这个list他就需要依赖index依赖的东西,QuestionMapper和UserMapper.所以都@Autowired注入进来.
- 第一步通过questionMapper.list得到question对象,循环question对象.
- 每个question对象里通过userMapper,findById,把quesiton里的creator获取出来,去获取当前的User,导入User类.findById报错,alt+enter自动创建该方法到UserMapper.

```java
List<Question> questions = questionMapper.list();
        for (Question question : questions) {
            User user = userMapper.findById(question.getCreator());
        }
```

```java
@Select("select * from user where id = #{id}")
    User findById(@Param("id") Integer id);
```

- 这时需要把question转换成DTO,就需要new一个QuestionDTO对象,第一步需要把里面所有question对象放到QuestionDTO里面,这时最简单的方法使用Spring中自带的BeanUtils.

```java
BeanUtils.copyProperties(question,questionDTO);
```

- 这个工具类的作用就是快速把前一个对象的属性拷贝到后一个对象上.
- 还差一个User没给过去,所以`questionDTO.setUser(user);`.
- 最后返回的是DTO对象,这时建一个新的List对象,需要把DTOlist返回去

```java
List<QuestionDTO> questionDTOList = new ArrayList<>();
```

- 每次创建新的DTO后把它add进这个list,最终返回questionDTOList.

```java
public List<QuestionDTO> list() {
        List<Question> questions = questionMapper.list();
        List<QuestionDTO> questionDTOList = new ArrayList<>();
        for (Question question : questions) {
            User user = userMapper.findById(question.getCreator());
            QuestionDTO questionDTO = new QuestionDTO();
            BeanUtils.copyProperties(question,questionDTO);
            questionDTO.setUser(user);
            questionDTOList.add(questionDTO);
        }

        return questionDTOList;
    }
```

- 这时indexCtroller中返回的question不仅带有基本Question,同时带有用户信息.
- ![](https://i.postimg.cc/bvTjHW8s/image.png)
- 已经model把数据传给前端,前端怎么拿到呢?和jsp这些模板语言一样,嵌一个模板循环即可.
- 去thymeleaf[官方文档](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#setting-attribute-values)找到迭代相关:

```html
<tr th:each="prod : ${prods}">
        <td th:text="${prod.name}">Onions</td>
        <td th:text="${prod.price}">2.41</td>
        <td th:text="${prod.inStock}? #{true} : #{false}">yes</td>
      </tr>
```

- 成功展示问题到页面.

![](https://i.postimg.cc/1XTgR4jh/image.png)

- 现在需要让回复和浏览默认为0.
- 此时发现,所有驼峰标识的字段的值都没拿到,所以看一下mybatis关于这里的配置.果然有关于驼峰的配置,进入properties中配置一下试试.

```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

- 驼峰配置完之后,回复数浏览数的默认为0可以展示,头像为空因为我第一次填这个的时候Github账号没设置头像,正常

![](https://i.postimg.cc/9QPfKxCj/image.png)

- 如果想这条也有头像,就把设置头像后的User的头像url值复制粘贴给ID为1的那条数据,再重启项目.

![](https://i.postimg.cc/HkLpvTZb/image.png)

- 关于时间的获取,thymeleaf有自己的模板语法,使用之后让最后的时间也正常显示.

```html
<span th:text="${#dates.format(question.gmtCreate,'dd/MMM/yyyy')}"></span>
```

![](https://i.postimg.cc/3xzPjhP8/image.png)

- **总结**:
- 在indexController中,最终是跳转到这个页面,所以跳转之前需要把所有数据放进去,所以在跳转之前,我们需要去查,查询时候我们需要构造DTO,因为DTO不属于任何一个Mapper,所以就需要重新去写一个Service,QuestionService里去查询question,同时循环查询user,把user对象复制到question上去.