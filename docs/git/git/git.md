# Git笔记

## 准备工作

### 连接远程仓库

#### SSH方法

- 因为Github慢慢的要放弃账号密码方法,所以我们必须学着ssh方法连接远程仓库

- 首先随便打开git bash,不用在乎目录

- 输入ssh命令,回车查看是否已安装ssh

- 如果已经安装就输入`ssh-keygen -t rsa`命令,连续回车直到完成

- 这时候就生成了两个文件，分别为秘钥 id_rsa 和公钥 id_rsa.pub

- 命令行会告诉你文件生成在了哪里

  ```shell
  $ ssh-keygen -t rsa
  Generating public/private rsa key pair.
  Enter file in which to save the key (/c/Users/Administrator/.ssh/id_rsa):
  /c/Users/Administrator/.ssh/id_rsa already exists.
  Overwrite (y/n)?
  
  ```

- 使用笔记本打开id_rsa.pub文件,复制里面所有内容,打开github的setting->SSH and GPG keys->New SSH key

- 名字自己想,value填复制的内容

- 完成之后在git bash中输入`ssh -T git@github.com`校验

- 如果是第一次会提出询问,填写yes回车即可,成功会提示你you've successful....

- 提交文件到远程服务器有两种办法,我只使用了第二种

  - 建立一个本地仓库进入，init 初始化；
  - 关联远程仓库；
  - 同步远程仓库和本地仓库；
  - 将文件添加提交到本地仓库；
  - 将本地仓库的内容 push 到远程仓库。

- 首先进入项目根目录,初始化你的项目仓库,也就是输入`git init`

- 之后就是提交`git add.`,`git commit -m "xxx"`

- 然后去复制git仓库上的地址,选择SSH而不是HTTPS

- 在bash中输入`git remote add origin git@github.com:emptybamboo/Algorithm-Diagram-Code.git`

- 然后`git push origin master`即可把本地项目推到远程

- 如果要把远程拉到本地使用`git pull origin master`

##### 检查是否已经生成本地ssh秘钥

- 一般来讲本地秘钥都是在C盘的固定位置
- 在桌面右键打开gitbash,然后输入`cd ~/.ssh`
- 如果看到秘钥文件那就说明是已经生成过ssh秘钥的

### 将远程项目拉到本地

#### SSH方法

- 首先检查又没有生成过ssh秘钥,如果没有就自己去生成
- 然后到github里面的setting中的SSH and GPG keys中去粘贴秘钥内容即可
- 进入到想放置远程git项目的目录,在这个目录打开命令行,输入`git clone "github中的code按钮下的ssh地址"`
- 克隆完成就拉取好项目并且和远程仓库关联了

## 使用

### gitattributes

- git的这个功能可以做到,不同的分支切换覆盖时,可以忽略某些文件不把这些文件覆盖给对应的分支

- 这么说可能有点绕,解释得详细点,某项目有两个分支,A分支和B分支,然后这个项目对接了第三方API,这个API是需要根据当前环境是测试环境还是正式环境进行代码中的一些配置的修改,比如请求的url的前半部分,一些变量

- A分支代表测试环境分支,B分支代表正式环境分支,那在这两个分支中,我们自然会希望代码中的配置不会被我们覆盖修改代码时改变,这种配置代码的文件类一般也很少改动

- 那么我们就需要去新建一个gitattributes文件,在其中根据规则写好我们需要在覆盖分支代码时忽略的文件,然后就不会出现这个问题了,本身我去查询相关知识时,有人说这个功能有一个文件修改时间先后的要求,搞得很麻烦很不方便,但我实际使用时发现不用考虑这个就可以达成效果

- 我使用的gitattributes文件内容如下

  ```
  
  ```

  
