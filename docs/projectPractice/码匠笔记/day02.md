### 第二天的笔记,2019年7月2日,p4-p10

- 首先确定我们要做的项目的成果是什么样的
- 我们需要做一个讨论式的论坛,那么需要做的功能有如下几个
	1. 搜索栏
	2. 登录按钮
	3. 帖子展示
	4. 热门话题按回复数倒序排列
	5. 热心用户按回复数量倒序排列
	6. 分页栏

- 那么最主要的第一个要做的部分,就是登录页面.

#### 样式通过Bootstrap来做

- 首先下载Bootstrap,将其中的三个文件夹css/js/font复制到项目中的resources文件夹下的static文件夹下.
- 在index.html也就是我们设定的首页中引入必须引入的三个文件,从左侧菜单直接拖入右侧IDEA编辑区域即可.
`
    <link rel="stylesheet" href="css/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/bootstrap-theme.min.css" />
    <script src="js/bootstrap.min.js" type="application/javascript"></script>
`
- 将hello.html改为index.html用做我们的首页,然后去bootstrap里找到导航菜单直接复制进body中修改为我们想要的效果.
- 因为我们重新改写了原先的hello这个实验页面为index.html这个首页页面,所以把controller也需要改写为IndexController,@GetMapping注解后面为/的意思是这个就是根目录,任何东西都不输入默认访问这个路径(index这个模板).
`
@GetMapping("/")
    public String index(){
        return "index";
    }
`

- 为了方便,我们使用接入Github的登陆功能.
- 进入Github网站底部的API,创建其中的OAuth App
::: tip
- 别忘了用git指令提交
	1. 可以先试用git status查看项目文件状态
	2. 然后使用git add .添加所有文件到本地仓库
	3. 然后git commit -m "add index and bootstrap" 最后的双引号里写的是备注
	4. 最后git push,就push到了我们git仓库
:::

- 有个IDEA小技巧,如果一次想对相邻的多行做同样的修改操作,就按住alt然后从第一个想修改的行最左侧往下拉,会出现一条竖线,然后开始从第一行修改,每行就都会一样变化
- 根据视频[7、07 注册 Github App](https://www.bilibili.com/video/av50200264/?p=7)去进行OAuth APP的注册.
- 把登陆按钮绑定一个地址,点击登陆可以跳转到`http://github.com/login/oauth/authorize`,同时携带必传参数.

```html
<li><a href="http://github.com/login/oauth/authorize">登录</a></li>
```

- 第一个必传参数是client_id,在我们注册号OAuth APP的页面就有专属我们自己的这个id,在上一个登陆标签地址末尾加上?client_id=xxx.

```html
 <li><a href="http://github.com/login/oauth/authorize?client_id=ba4xxbe61">登录</a></li>
```

::: tip
url中多个参数的时候,第一个参数用?区分,以后的参数都用&区分
:::

- 第二个是redirect_uri,是Github会自动跳转回来的地址,因为我们没有服务器去部署,所以尝试用一下本机(`http://localhost:8887/callback`)看它是不是工作.

```html
<li><a href="http://github.com/login/oauth/authorize?client_id=ba4xxxbe61&redirect_uri=http://localhost:8887/callback">登录</a></li>
```
- 第三个是login,这里先不填,不知道去写什么,并且它不是必填
- 第四个是scope,必填,这样就决定你当前授权的一个列表.获取到user即可.
```html
<li><a href="http://github.com/login/oauth/authorize?client_id=ba4xxxbe61&redirect_uri=http://localhost:8887/callback&scope=user">登录</a></li>
```
- 第五个是state,是一个随机的字符串,只是为了跨站时使用,所以就随机写一个就好.

```html
<li><a href="http://github.com/login/oauth/authorize?client_id=ba4xxxbe61&redirect_uri=http://localhost:8887/callback&scope=user&state=1">登录</a></li>
```
- 第六个allow_signup也不是必填,所以现在这样应该就ok了.
- 现在可以启动项目
	1. 点击页面里的登录按钮
	2. 点击同意授权
	3. 输入密码登录Github
	4. 弹出404，但是我们是成功的，因为我们没有编写这个地址，但是可以通过浏览器看到它访问的是我的`http://localhost:8887/callback?code=1e1efda0531e9419f624&state=1`地址.文档中约定了它会给我们传回一个code,我们通过这个code去获取accesstoken,下一步就是我们去接收这个code.

- okhttp几行代码就完成了我们的get/post请求,比使用httpclient简单的多.
