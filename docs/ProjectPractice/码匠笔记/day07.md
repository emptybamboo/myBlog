### 第七天笔记,2019年7月21日,p21

#### 完成发布文章功能

- 之前做好了相关发布文章界面,这次就要完成具体的发布文章功能.点击发布按钮能成功发布文章到服务器端这个过程.

- 先使用magrition做一个数据库,其中的字段名包括:

  1. id,文章序号,主键自增长
  2. title,文章标题
  3. description,描述
  4. gmt_create,创建时间
  5. gmt_modified,修改时间
  6. creator,创建者
  7. comment_count,文章评论数
  8. view_count,文章阅读数
  9. like_count,文章点赞数
  10. tag,标签

- 将相关的数据库语句用IDEA自带的database工具生成,在<font color=red>resources</font>文件夹下的<font color=red>db</font>文件夹下的<font color=red>migration</font>创建文件,`V3_Create_question_table.sql`,存储进去,方便实用flyway进行版本控制.

- 使用<font color=red>mvn flyway:migrate</font>命令进行数据库更新,之后去写数据库文件(是指后端控制数据增查删改的文件),第一条数据库文件是一条insert语句.

- 进入项目的java/life/majiang/community/mapper目录下仿照它去写一个新的mapper接口,叫QuestionMapper.

- 首先给这个接口上加上<font color=red>@Mapper</font>注解,之后写insert语句,`public void create(Question question)`,加上注解<font color=red>@Insert</font>,在括号中写具体的SQL语句.

- ```java
  @Insert("insert into question (title,description,gmt_create,gmt_modified,creator,tag) public values (#{title},#{description},#{gmt_create},#{gmt_modified},#{creator},#{tag})")
      void create(Question question);
  ```

- 没写的那三个评论数,阅读数,点赞数,因为给了默认值为0.

- 这时把public删掉,去写一个Question实体类,生成get/set方法,这里就需要所有数据库中字段都生成.

- ![](https://i.postimg.cc/Pxdrqhyq/image.png)

- 接下来解决之前的遗留问题,问题提交表单的fomr标签中的aciton中究竟写什么

- ![](https://i.postimg.cc/8CZPs90B/form.png)

- 填写内容后

  ```html
  <form action="/publish" method="post">
  ```

- 为什么同样也是写了pusblish就能路由到一个新的方法呢?这时我们通过method区分,采用post方法,我们定义为,如果你是get我就给你渲染页面,如果你是post,我就给你执行请求.

- 在publishController中,写一个doPublish方法,方法体中先return回publish,为什么要先return回publish,因为当前做的项目**不是前后端分离的**,如果项目是**前后端分离**,在发布页面点击提交,可以不刷新页面,局部刷新提示你当前填写信息有误,**如果不是前后端分离**,就要按照老的方式,点击发布之后,请求到服务器端,做完验证,如果成功就发布成功,如果失败就还是跳转回发起问题页面,并且把错误信息传递回来,并且保证你之前填的信息不出问题.

- 因为是提交表单是post方法,所以给这个**doPublish**方法加上**@PostMapping**注解,括号中同样是/publish.当然因为目前PublishController中的两个方法都是/publish,所以最后会把这个地址加到整个Controller上,方法用于继承更大作用域的page.

- **doPublish**接收表单提交过来的参数使用**@RequestParam**注解.

- **总结:**

- ![](https://i.postimg.cc/Pr6gpDbZ/image.png)

- 点击submit提交整个表单时,会寻找地址为/publish,并且请求方法为post的这个接口,自动路由到这个里面.

- ![](https://i.postimg.cc/CxzWjKJ2/controller.png)

- 这时可以通过**@RequestParam**接收titile,description,tag,接收的同时,首先把它放到model中,为了回显到页面上(如果输入的信息有误,报错之后之前输入的内容不消失依然显示在输入框中).

- 验证一下这些输入项是否为空,如果为空,就提示这个需要补充.

- ![](https://i.postimg.cc/Qts4nNkh/image.png)

- 如果全不为空,验证一下是否登陆,按照index的方式去做,通过token拿到数据库里存的这个User信息,如果User信息存在,那就把它绑定到Session上去,如果不存在,就把user不存在,用户未登录返回到前端去.

- 如果全部工作以后,按照以往的方式构建一个Question对象,创建一个QuestionMapper,然后把它插入到数据库去.

- ![](https://i.postimg.cc/900BvD45/image.png)

- 查看数据库,发现已经成功添加进去数据了,并且成功后会跳转到首页,后边要做的是怎样把它展示到首页.