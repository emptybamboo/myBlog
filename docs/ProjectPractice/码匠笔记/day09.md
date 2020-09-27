### 第九天,2019年7月22日,p24-26

#### 问题总结

**textarea使用th:value不能回显**

- 在publish中,description是用textarea展示,但是这里如果使用thymeleaf中的th:value语法是无法回显textarea内容的,需要使用th:text才可以.

```html
<div class="form-group">
                    <label for="description">问题补充(必填,请参照右侧提示) :</label>
                    <textarea  name="description" th:text="${description}" id="description"  class="form-control" cols="30" rows="10"></textarea>
                </div>
```

**fastjson可以自动把下划线标识映射到驼峰的属性**

- 从github的api中获取的头像url直接就是avatar_url,本来应该在实体类中也是用这个,但是fastjson会自动匹配驼峰命名,所以在实体类直接命名为avatarUrl即可.

**没有错误提示的时候,发布按钮会跑到左边**

- 这是因为使用了th:if,如果为空它就不显示了,所以用div把它包起来,外层div保持原来的自适应尺寸,里面那层全部尺寸下都设置为12.

```html
<div class="container-fluid main">
                    <div class="row">
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                            <div class="alert alert-danger col-lg-12 col-md-12 col-sm-12 col-xs-12"
                                 th:text="${error}"
                                 th:if="${error!=null}">
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                            <button type="submit" class="btn btn-success btn-publish">
                            发布
                        </button>
                        </div>

                    </div></div>
```

**列表日期格式化问题**

- 为了好看一些,使用这种日期格式

```html
<span th:text="${#dates.format(question.gmtCreate,'yyyy-MM-dd HH:mm')}"></span>
```

#### 自动部署

- 之前每次改动一点代码就要重启服务,很麻烦,所以引入一个新工具,**Spring Developer Tools**.
- 它是一个能快速让我们实现自动重启的工具.
- 首先需要引入依赖.

```xml
<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional>
        </dependency>
```

- 需要手动点击Build->Make Project才有响应.
- 自动重启如果和浏览器插件LiveReload一起使用效果会很好.
- 为了不每次还要自己点build,就去设置中把build下的打开.
- 但是有个问题,每次run和debug的时候这个设置就不起作用,先打开setting配置compiler中的build project automatically,打钩. 然后shift+alt+ctrl+?进入Registry改变IDEA本身的配置,其中的`compiler.automake.allow.when.app.running`,打钩即可,意为允许你自动make即使在application在running的状态也可以.
- **但是我这样还是不能热部署,这个问题只能留到之后解决.**

#### 分页原理和实现

- 去bootstrap找到分页样式
- 分析一下,首先,有1,2,3,4,5页,上一页下一页,尾页.点击第五页就会出现跳转到首页.因为首页页码已经不展示了.如果点击跳转到尾页,就不显示下一页和尾页.
- 在数据库中的Question表中复制多条记录,超过一页,这里是复制了12条.
- 分页的话SQL语句就需要在Select语句最后加上limit x,y.第一个x是偏移量,y是返回的结果数.(就是从第x条数据开始,展示y条).
- 我们需要知道一共有多少页,才能知道什么页码时没有下一页最后一页,同时也期望每点击一次传递过来就是当前页码.所以就需要页码和我们数据库SQL的匹配,同时能返回所有页码数.
- 得到一个公式:5(i-1),前端显示的页码就是i,5就是前端分页数,一共显示五页,
- 就比方现在有12页,我们就要判断当12%5!=0,页数就等于12/5+1,否则就是12/5.(java中12/5就等于2).
- 编写后台程序,驱动式编程,在indexcontroller出发,给它传入两个参数,从页面接收而来.

```java
    public String index(HttpServletRequest request,
                        Model model,
                        @RequestParam(name="page",defaultValue = "1") Integer page,
                        @RequestParam(name="size",defaultValue = "5") Integer size){
```

- 一个page,页码,设置默认值,如果不传就是1.size就是页面上展示的页面数量,希望默认为5页.

- 然后这两个参数就获取了,直接把两个参数传到方法中,期望这个方法返回的就是我这些数据.

  ```java
   List<QuestionDTO> questionList = questionService.list(page,size);
  ```

- alt+enter改变方法形参.QuestionService最后弄得list方法就已经添加了这两个形参,在这里写刚才的实现.

- 这里page默认为1,size默认为5,需要一个公式得到真正的值.

```java
 Integer offset = size * (page-1);

        List<Question> questions = questionMapper.list(offset,size);
```

- 这时QuestionMapper中的对应数据库方法就需要这两个参数了

```java
@Select("select * from question")
    List<Question> list(Integer offset, Integer size);
```

- 修改注解中的SQL语句.

```java
@Select("select * from question limit #{offset},#{size}")
    List<Question> list(Integer offset, Integer size);
```

- 如何展示到前端呢?回到页面,上面展示的是当前页码的前几个页码和后面几个页码.所以service返回本身的数据模型并不支持返回页面的一些数据,所以需要定义一个新的DTO.pageDTO.因为希望当请求码匠社区首页时,不仅仅返回列表,还返回一些页码信息给我,所以页码信息封装到对象里.
- 首先它期待list的一个DTO,所以直接给一个List类型的question对象进去,这个对象包裹的就是页面所承载的一些元素.

```java
@Data
public class PaginationDTO {
    private List<Question> questions;
}
```

- 正常情况这些参数是前端js来算的,但是这个项目是要弱化js,熟悉后端.
- 在paginationDTO中定义一个boolean类型的showPrevious,意思是是否有上一页按钮.
- 还有一个第一页按钮(点击返回最前页),定为showFirstPage.
- 当然也就有下一页和最后一页按钮对应的showNext和showEndPage.
- 当前页定义为Integer类型的page.
- 期待返回所有显示出来的页码的数组pages.

```java
private List<Question> questions;
    private boolean showPrevious;
    private boolean showFirstPage;
    private boolean showNext;
    private boolean showEndPage;
    private Integer page;
    private List<Integer> pages;
```

- 在之前写好的service中返回这个对象.new一个PaginationDTO,直接把它return,这时候会报错,alt+enter,把list,return一个PaginationDTO出去,这时indexctroller里会报错,再次alt+enter把它变为这个PaginationDTO对象就好.
- 改名为pagination,传到前端的也改成这个名字,index页面里改一下接收到的question为pagination.question.

```html
<div class="media" th:each="question : ${pagination.questions}">
```

- 回到QuestionService中把questionDTOlistset进paginationDTO

```java
paginationDTO.setQuestions(questionDTOList);
```

- 第二步需要查询一下页面总数(一共有几页),刚刚已经知道了每一页的列表,但是当前的所有question的总数我们不知道,所以需要有一条语句查到总数.

- 使用的语句是

  ```mysql
  select count(1) form question
  ```

> ```
> count(1)，其实就是计算一共有多少符合条件的行。
> 1并不是表示第一个字段，而是表示一个固定值。
> 其实就可以想成表中有这么一个字段，这个字段就是固定值1，count(1)，就是计算一共有多少个1.
> 同理，count(2)，也可以，得到的值完全一样，count('x')，count('y')都是可以的。一样的理解方式。在你这个语句理都可以使用，返回的值完全是一样的。就是计数。
> count(*)，执行时会把星号翻译成字段的具体名字，效果也是一样的，不过多了一个翻译的动作，比固定值的方式效率稍微低一些。
> ```

- 在QuestionMapper中的具体查询就是这样

```java
 @Select("select count(1) from question")
    Integer count();
```

- 回到service中就可以在这里拿到所有的数量.

```java
Integer totalCount = questionMapper.count();
```

- 所以我们就能拿到一个分页数.所有计算的逻辑应该在paginationDTO中进行,所以预想有这么一个方法,传入totalCount,page,size,就能把所有需要的值算出来返回给我们.
- alt+enter创建这个方法到paginationDTO.
- 页码算法如下:

```java
 public void setPagination(Integer totalCount, Integer page, Integer size) {
        Integer totalPage;
        if(totalCount%size==0){
            totalPage = totalCount/size;
        }else {
            totalPage = totalCount/size+1;
        }

        pages.add(page);
        for(int i = 0;i<3;i++){
            if(page-i>0){
                pages.add(page-i,0);
            }

            if(page + i <= totalCount){
                pages.add(page+1);
            }
        }

        // 是否展示上一页
        if(page==1){
            showPrevious = false;
        }else {
            showPrevious = true;
        }

        //是否展示下一页
        if(page == totalPage){
            showNext=false;
        }else {
            showNext=true;
        }
//        发现当页面页码列表的五个数不包含第一页和最后一页时,就会显示最前页最后页
        //是否展示第一页
        if(pages.contains(1)){
            showFirstPage = false;
        }else {
            showFirstPage = true;
        }

        //是否展示最后一页
        if(pages.contains(totalCount)){
            showEndPage = false;
        }else {
            showEndPage = true;
        }
    }
```

- 但是页面中出现了页码显示问题,需要修改这部分代码.
- thymeleaf中拼接链接语法如下:`th:href="@{/(page=${page})}"`
- thymeleaf中动态class语法如下:`th:class="${row.evev? 'even' : 'odd'}"`,放到li标签上.

```java
public void setPagination(Integer totalCount, Integer page, Integer size) {
//        当前类的page等于传过来参数的page,这样就能把当前页赋值下来了,不然前端调用pagination.page是没有值的



        if(totalCount%size==0){
            totalPage = totalCount/size;
        }else {
            totalPage = totalCount/size+1;
        }

//        防止出现-1页和比页码大的页
        if(page<1){
            page=1;
        }
        if(page>totalPage){
            page=totalPage;
        }
        this.page = page;

        pages.add(page);
        for(int i = 1;i<3;i++){
            if(page-i>0){
                pages.add(0,page - i);
            }

            if(page + i <= totalPage){
                pages.add(page + i);
            }
        }

        // 是否展示上一页
        if(page==1){
            showPrevious = false;
        }else {
            showPrevious = true;
        }

        //是否展示下一页
        if(page == totalPage){
            showNext=false;
        }else {
            showNext=true;
        }
//        发现当页面页码列表的五个数不包含第一页和最后一页时,就会显示最前页最后页
        //是否展示第一页
        if(pages.contains(1)){
            showFirstPage = false;
        }else {
            showFirstPage = true;
        }

        //是否展示最后一页
        if(pages.contains(totalPage)){
            showEndPage = false;
        }else {
            showEndPage = true;
        }
    }
```

- **总结**:
- 首先我们页面上传递两个参数过来,page代表每一页的页码,size代表每一页的分页数.
- 然后把参数自动传到service里.

```java
PaginationDTO pagination = questionService.list(page,size);
```

- 首先service中需要查出totalcount

```java
Integer totalCount = questionMapper.count();
```

- 使用下面的数据库语句:

```java
@Select("select count(1) from question")
    Integer count();
```

- 拿到数据库的总数,通过总数和当前页数和当前每页显示数算出一系列数据.

```java
public void setPagination(Integer totalCount, Integer page, Integer size) {
//        当前类的page等于传过来参数的page,这样就能把当前页赋值下来了,不然前端调用pagination.page是没有值的



        if(totalCount%size==0){
            totalPage = totalCount/size;
        }else {
            totalPage = totalCount/size+1;
        }

//        防止出现-1页和比页码大的页
        if(page<1){
            page=1;
        }
        if(page>totalPage){
            page=totalPage;
        }
        this.page = page;

        pages.add(page);
        for(int i = 1;i<3;i++){
            if(page-i>0){
                pages.add(0,page - i);
            }

            if(page + i <= totalPage){
                pages.add(page + i);
            }
        }

        // 是否展示上一页
        if(page==1){
            showPrevious = false;
        }else {
            showPrevious = true;
        }

        //是否展示下一页
        if(page == totalPage){
            showNext=false;
        }else {
            showNext=true;
        }
//        发现当页面页码列表的五个数不包含第一页和最后一页时,就会显示最前页最后页
        //是否展示第一页
        if(pages.contains(1)){
            showFirstPage = false;
        }else {
            showFirstPage = true;
        }

        //是否展示最后一页
        if(pages.contains(totalPage)){
            showEndPage = false;
        }else {
            showEndPage = true;
        }
    }
```

- 同时加了一个容错处理,页码小于1就设置为1,大于总数就设置成总数,同时通过size* (page-1)去计算它的limit

```java
 if(page<1){
            page=1;
        }
        if(page>paginationDTO.getTotalPage()){
            page=paginationDTO.getTotalPage();
        }
Integer offset = size * (page-1);
```

- 为什么这么做呢?因为limit方法第一个参数就是偏移量offset,比如说你是15,就是从第16个参数开始,所以需要做这么简单的一个运算.

```java
@Select("select * from question limit #{offset},#{size}")
```

- 运算完成后,重新封装了一个对象**PaginationDTO**,对象里包裹这些样式和这些元素传到前端去.
- 传到前端后,在index.html中首先改变了问题列表的变量属性,从这个**pagination.questions**里去取值

```html
<div class="media" th:each="question : ${pagination.questions}">
```

- 取值后正常显示,下面这些数据使用的是bootstrap分页组件,能通过前一页上一页下一页循环列表展示.
- 同时翻页按钮上的><这些符号是不能直接显示的,需要转译符号,因为你直接用它相当于一个标签的闭合.