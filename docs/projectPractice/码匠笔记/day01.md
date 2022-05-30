### 码匠笔记项目的第一天,p1-p3的视频内容,2019年6月30日
---

```java
	@GetMapping("/greeting")
    public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name, Model model) {
        model.addAttribute("name", name);
        return "greeting";
    }
```

* @RequsetParam(name="name")这里就是在定义传过来的值的key是什么,后面的String name变量就是在接收这个参数的值的.
* 这个方法可以让我们从浏览器获取到这个接收的参数.但是这个信息是如何显示到我们需要的页面上呢?spring提供了一个方式叫Model.
	* 通过这个Model model就可以把它传递到页面上去,这是一个内置的类,只要把它放到形参里面,spring的管理就会把它自动注入里面.
	* model.addAttribute("name", name);中的model就是一个map,也是以key:vlaue的形式往前端传递(key是name,value是前端传过来的name并且我接收到了再set到model里面).这样的话它就会自动承载到里面,返回到我们下文中需要展示的页面里去.
	* return "greeting";是什么意思?即使spring模板引擎去提供的一个方式,如果直接返回一个string字符串的时候(就是return "字符串"),它会来resources下的templates文件夹下去找它同名的一个html文件,然后把它渲染成一个网页.

```html
		<!DOCTYPE HTML>
		<html xmlns:th="http://www.thymeleaf.org">
		<head>
		    <title>Getting Started: Serving Web Content</title>
		    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		</head>
		<body>
		    <p th:text="'Hello, ' + ${name} + '!'" />
		</body>
		</html>
```
- 这里与普通的html区别有以下几个地方:
	- 第一个地方在于多了`<html xmlns:th="http://www.thymeleaf.org">`这个标签,意思是加入这段xmlns:th="http://www.thymeleaf.org"以后才能让spring知道我的模板引擎去要去解析它.
	- 这里的`<p th:text="'Hello, ' + ${name} + '!'" />`,th:text就是spring的一个动态语法,作用就是用刚才model中的key为name的部分把这个标签里的${name}替换掉.


- springboot有一个默认的方式,如果你所有的带有注解的文件只要在我XxxApplication的同一级或下一级就会自动的加载进来.
- 在comunity也就是XxxApplication所在的文件夹下,新建controller文件夹,在里面创建controller.java,给这个类加上@Controller注解,就会自动识别扫描当前的这个类,并且把它当成Spring的一个Bean去管理,同时识别它为一个Controller,Controller的意思是允许这个类去接收前端的一个请求.
- 当@RequsetParam注解写完不知道该写什么参数时,ctrl加p就会有提示.


### 使用Git托管项目到Github
- 打开个人Github首页,点击右上角New Repository会创建一个仓库,命名为community(命名随意),是否初始化项目的README?不需要,等下我们自己创建,因为我们现在要做的是本地有代码,然后创建仓库把它推到远端的一个空仓库中,之后点击创建.
- 然后会弹出两种方式
```
		…or create a new repository on the command line
		echo "# community" >> README.md
		git init
		git add README.md
		git commit -m "first commit"
		git remote add origin https://github.com/emptybamboo/community.git
		git push -u origin master
		…or push an existing repository from the command line
		git remote add origin https://github.com/emptybamboo/community.git
		git push -u origin master
```
- 这里选择第二种已经有仓库的方式.
- 进入项目,打开idea命令行,输入git init指令把项目目录编程git仓库
- 执行git add .命令就把所有项目中新变化的文件丢到了暂存中去
- 执行git commit "init repo"命令,就是初始化当前仓库
- 再git status

### 在这里我们会出现很大的问题,也就是在`3、03 使用 Github 托管代码`这个视频里,关于在Idea的命令行中使用git指令的问题.
- 视频8:39时,up主使用了git commit "init repo"指令,说是初始化当前仓库,但是如果你是windows用户,直接如此使用会报错:`error: pathspec init repo did not match any file(s) known to git`,也就谈不上他所说的再次git status发现我们这里(指的是命令行中显示)什么也没有了.
- 之后他说我们漏掉了一个东西,其中打了很多指令,我把真正对初学者有用的总结出来.
- 他是用的ls命令,这个倒不是很重要,但是我提一下这个在windows至少是无法直接使用的,至于有没有办法使用我也没有继续细找,因为不影响我们的学习.
- 他在视频中讲出,我们需要修改.git文件夹中的一些东西,ls只是查看其中的内容.这里面存的是git本地用来存储提交记录历史用的.
- 紧接着在9:46他使用了最关键的一个指令:vim指令.
	- 那么关于vim我去搜索了下,应该是linux系统下的指令,windows系统是不能直接使用的,花费时间查找之后,找到了解决办法.
	- 在windows系统下,vim命令可以通过安装gvim来使用.
		1. 进入下载网址`https://www.vim.org/download.php#pc` ,全英文可能有些眼花缭乱,这时只需要点击`PC: MS-DOS and MS-Windows`就会往页面下方跳转.
		2. 在跳转之后的页面部分,点击`For modern MS-Windows systems (starting with XP) you can simply use the executable installer:
    	gvim81.exe (ftp)`之中的gvim81.exe链接即可下载,不过这个是外网,下载会非常缓慢,如果有梯子就方便很多,如果实在没有我暂时也没找到方法,不过按理说去百度应该也找得到国内网站的下载.
		3. 安装就一直下一步即可,安装完之后,打开环境变量的设置,在系统变量的PATH中添加一个新的,注意,此处不是直接添加vim的安装目录到PATH,而是添加vim文件夹下的vim81文件夹的路径到PATH.之后在cmd命令行输入vim点击回车,如果出现新手引导之类的说明成功了
		4. 但是这样还不够,我发现了在IDEA中的terminal命令行里还是不能使用vim指令,所以还是要用cmd,然后cd指令进入项目目录,然后使用vim .git/config进入需要修改的这个文件
		5. 之后我懵逼了,按照视频拖动了下来,结果按回车无法进入下一行,也就是无法编辑,经过百度后我发现,vim的修改需要使用一些指令,我看到有人说是使用esc进入编辑,但是无论我怎么按都没反应,最后百度到是按下i就可以编辑了,果然这样就可以输入name和email了.如果这里右侧小键盘数字输入变成汉字乱码,就使用左上角横排键盘输入数字.
		6. 但是编辑完之后我又傻了,进入idea去提交,它报了这么一串给我

                    *** Please tell me who you are.
                    
                    Run
                    
                      git config --global user.email "you@example.com"
                      git config --global user.name "Your Name"
                    
                    to set your account's default identity.
                    Omit --global to set the identity only in this repository.
                    
                    fatal: unable to auto-detect email address (got 'xxx@DESKTOP-7U0DE49.(none)')

		7. 我虽然英语不怎么样,也看得出来他说让我用指令配置name和email,这也就意味着我刚才vim编辑的没生效,当然我cmd打开的使用vim编辑的命令行还没关,我就又去查了为什么这样
		8. 我看了视频中up主编辑完name和email之后,最后重起一行加了一个:x,跟着照做发现并没有卵用,然后经过百度,我发现了一段vim保存命令,所以照着做,编辑完之后按ESC,然后输入了:wq回车,就完成了保存文件退出vim的操作.
		
                保存命令
                按ESC键 跳到命令模式，然后：
                :w 保存文件但不退出vi
                :w file 将修改另外保存到file中，不退出vi
                :w! 强制保存，不推出vi
                :wq 保存文件并退出vi
                :wq! 强制保存文件，并退出vi
                q: 不保存文件，退出vi
                :q! 不保存文件，强制退出vi
                :e! 放弃所有修改，从上次保存文件开始再编辑
		
		9. 之后再次进入idea中使用`git commit -m "init repo"`指令,这次果然成功了.

                    [master (root-commit) b42aedf] init repo
                     12 files changed, 697 insertions(+)
                     create mode 100644 .gitignore
                     create mode 100644 .mvn/wrapper/MavenWrapperDownloader.java
                     create mode 100644 .mvn/wrapper/maven-wrapper.jar
                     create mode 100644 .mvn/wrapper/maven-wrapper.properties
                     create mode 100644 mvnw
                     create mode 100644 mvnw.cmd
                     create mode 100644 pom.xml
                     create mode 100644 src/main/java/life/majiang/community/CommunityApplication.java
                     create mode 100644 src/main/java/life/majiang/community/controller/HelloController.java
                     create mode 100644 src/main/resources/application.properties
                     create mode 100644 src/main/resources/templates/hello.html
                     create mode 100644 src/test/java/life/majiang/community/CommunityApplicationTests.java

		之后使用git status指令也成功,显示

                    On branch master
                    nothing to commit, working tree clean


- 修改完名字邮箱后,以便以后commit的时候不会用其他的名字,保证每个仓库名称都是隔离的.
- 接下来回到github,说你需要添加一个远程,也就是这个指令`git remote add origin https://github.com/emptybamboo/community.git`在idea命令行中输入回车即可,意思就是git的remote命令去添加一个名字为origin的一个远程地址.
- 最后一步,使用git的push命令把它直接推到名字为origin的远程地址的master分支.使用`git push -u origin master`命令,会让你登陆你的github,成功的话结果如下.

            Enumerating objects: 30, done.
            Counting objects: 100% (30/30), done.
            Delta compression using up to 4 threads
            Compressing objects: 100% (19/19), done.
            Writing objects: 100% (30/30), 50.24 KiB | 2.28 MiB/s, done.
            Total 30 (delta 0), reused 0 (delta 0)
            To https://github.com/xxx/community.git
             * [new branch]      master -> master
            Branch 'master' set up to track remote branch 'master' from 'origin'.
	
- 回到github构建仓库之后的那个页面,刷新就有了项目进来.但是这里面没有README,所以在项目根目录写一个README,当我要编辑README时候我又没法输入了,所以又需要尝试vim中的命令,点击i按键就可以输入,最后要点击ESC,输入:wq保存退出
- 保存之后输入git status可以看到README文件报了红色意思是还没保存,然后输入指令git add .意思是保存全部没保存的更新过的文件,之后输入git commit -m "add readme" m的意思是添加,后面引号是代表这次添加的备注.
- 之后输入git status会说当前的代码领先远端master分支,可以用git push把当前的代码push到远端,这样的话团队协作的时候远端就有我们这些代码了.
- 如果我们发现提交的代码里有点点瑕疵,当我刚刚要push,发现有代码其实是属于上一个commit的时候(意思就是commit完毕了,还没push之前又做了一点点小改动),用git管理项目代码的时候尽量保证一个commit是一个完整的链路,不要写一点编译没通过就push,这样对其他同事造成很大困扰.
- 所以如果commit之后差一点点,又微改了代码,需要重新打一个commit,这时用一个新命令`git commit --amend --no-edit`,amend意思是追加,把刚刚变化的文件追加上去,--no-edit的意思是我不需要改这些备注文案,直接追加.
> 但是注意如果要commit之前还是先要git add .,毕竟代码有变动,add是最起码的操作.

- 最后使用git push指令,再去刷新项目仓库,会默认把刚才的markdown,README文档放到里面显示.

::: danger
之前有关IDEA里不能编辑md文件的问题是我傻了,我不会用VIM的时候病急乱投医,安装了IDEA的一个插件叫IDEAVIM才导致的这个情况
:::


#### 总结
- 使用git进行项目备份存储,步骤应该是如下
    - 首先去Github中创建一个仓库,点击创建后这时候出现两种方式供我们选择,因为我们是自己建的项目,就选择第一种
        1. 首先使用git init指令初始化
        2. 执行git add .命令就把所有项目中新变化的文件丢到了暂存中去
        3. 执行git commit "init repo"命令,就是初始化当前仓库
            - 这里会报错,是因为没有使用vim命令修改隐藏的.git文件夹下的config文件
            - 去下载安装gvim,然后把vim文件夹下的vim81文件夹路径加到环境变量中的系统变量的PATH里
            - 使用cmd进入项目地址,然后使用vim .git/config命令进入这个配置文件
            - 按下键盘上的i键才能编辑这个文件,加上对应的[user]下的name和email,也就是Github名和自己的邮箱
            - 编辑完后点击ESC退出命令模式,然后输入:wq点击回车就完成了保存退出
            - 这时候再输上面的命令就不会失败了
        4. 再git status查看当前项目状态
        5. 接下来回到github,说你需要添加一个远程,也就是这个指令`git remote add origin https://github.com/emptybamboo/community.git`,在idea命令行中输入回车即可,意思就是git的remote命令去添加一个名字为origin的一个远程地址.
        6. 最后一步,使用git的push命令把它直接推到名字为origin的远程地址的master分支.使用git push -u origin master命令.
        7. 如果再一次commit后又修改了一小部分代码,刚好又没push,就别直接push再commit加push,用一个新命令git commit --amend --no-edit,amend意思是追加,把刚刚变化的文件追加上去,--no-edit的意思是我不需要改这些备注文案,直接追加.
        8. 但是注意如果要commit之前还是先要git add .,毕竟代码有变动,add是最起码的操作.
        9. 最后使用git push指令,再去刷新项目仓库,会默认把刚才的markdown,README文档放到里面显示.






