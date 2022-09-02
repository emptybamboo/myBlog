# word转pdf

- 之前无可奈何不会自己编写代码把`docx`文件转为`pdf`,现在经过一些搜索与积累,实现了自己写代码完成这个功能,遂做一记录

## 思路

- 之前其实是对自己写代码转换`docx`为`pdf`很没有信心的,因为折腾过很久,也搜过很多,尝试过很多,都以失败告终

- 不是使用有水印,就是插件要付费,要么就是格式歪七扭八

- 其实也是自己有畏难情绪,其中的一种方法看到过但始终没有做过尝试,那就是在`linux`系统中**安装`libreoffice`/`openoffice`**使用对应的**命令行去转换文件**

- 首先是安装这玩意我很不熟悉,其次是还从来没使用Java代码去执行`linux`命令,所以对未知的恐惧让我一直没有做过尝试

- 直到上个版本迭代后百无聊赖想尝试再去做做这个功能,于是去`gitee`搜到了这个[开源项目](https://gitee.com/hcwdc/docpreview),让我觉得可以利用其完成我需要的功能

- 本来我是想按照项目作者推荐使用方式的第二种,`将此 Demo 打包成为一个 jar 引入到自己的项目中`,但是经过尝试发觉这样很不灵活,而且我把这个项目打为jar包后也拿不到里面的工具类(不知为何)

- 最后选择了作者推荐的第一种方式`直接复制源码里的文件搬家至你自己的代码中`

- 其实也不甚复杂,只需要引入一个`pdfbox`依赖,剩下的代码几乎没有多少行,复制过来变为自己的工具类即可

  ```xml
  <!--docx转换到pdf使用到的依赖-->
  <!-- pdfbox pdf2Img -->
  <dependency>
      <groupId>org.apache.pdfbox</groupId>
      <artifactId>pdfbox</artifactId>
      <version>${pdfbox.version}</version>
  </dependency>
  ```

- 接下来问题就出现了,我的`Java`项目都是放在`docker`中运行的,我还是使用的比较原始的方式,`Dockerfile`去使用`docker build`命令构建镜像,然后使用`docker run`命令去创建容器去跑项目

- 这样就有问题了,该如何在容器内安装`libreoffice`,本来应该是直接在`linux`服务器上安装,但是现在我的项目跑在`docker`容器内部,没办法调用外部的命令去转换文件

- 所以就得在容器内部安装,我想了一下如果还是按照最普通的方式安装,那要使用`exec`命令进入容器内,然后一步步执行很多命令,这样安装太麻烦了,于是我就想到了去找一个**自带`jdk11`+`libreoffice`的docker镜像**,这样就大大省去了我的安装时间

> 因为我项目的JDK版本是11,所以需要找这样的镜像

- 经过搜索还真找到了,不过也只找到这一个:[`esystemstech/libreoffice:6.1-openjdk-11-jdk-buster-slim`](https://hub.docker.com/layers/esystemstech/libreoffice/6.1-openjdk-11-jdk-buster-slim/images/sha256-dfb13e10a06a3ba6e71a0c45a0d0612bc2179f7a11541ca549d846329f1a9019?context=explore)
- 这个镜像最大的毛病就是,它的`linux`系统版别是`debian`,这是非常恶心的,算是docker容器里很冷门的了
- 这个系统带来的问题就是**不能使用yum**命令去下载一些软件,**只能使用apt/apt-get命令**
- 于是要对这个系统去添加中文字体的时候就出现了很多问题,需要各种更新操作,下载操作才可以正常下载我们需要的`ttf-mscorefonts-installer`与`fontconfig`
- 至于**中文字体从哪里来**,自然是从你使用的**windows电脑中的`C:\Windows\Fonts`目录**中来,把这个目录里的所有字体都**压缩成zip**文件复制到映射到`docker`容器内部的文件夹,使用unzip解压,再使用`mkfontscale,mkfontdir,fc-cache`三连命令即可,然后使用`fc-list`可以查看全部字体,`fc-list :lang=zh`可以查看全部中文字体
- 这些全部搞定之后,就可以去运行你的`Java`项目在这个容器中了,然后还有一点需要注意的,本身开源项目中调用`libreoffce`命令使用的是`command = "libreoffice7.0 --convert-to pdf:writer_pdf_Export " + srcPath + " --outdir "+ desPath;`,我们需要改为`command = "/usr/bin/libreoffice --headless --convert-to pdf:writer_pdf_Export " + filePath + " --outdir " + targetFolder;`
- 并且一定要注意,虽然`Java`代码都是按顺序执行,但是**执行`linux`命令**这个步骤可是**不在`Java`代码的顺序之中**的

> 假如第一句是Java代码,第二句是执行`linux`命令,第三句是需要用到第二句产生的一些结果的Java代码,那么当第一句执行完后,就去执行第二句,第二句只是发送了一个命令给`linux`系统,并不会等这个命令执行完毕才执行第三句代码
>
> 所以第三句如果要用到第二句代码的结果,**很有可能第二句`linux`命令还在执行,第三句Java代码就已经执行了**,这样的话第三句代码很可能因为第二句的结果还没出来**导致报错异常**

- 所以我会在执行`linux`命令之后使用while循环去等待完成才进行下一步Java代码

## 具体操作

### Java项目代码

- 关于从开源项目挪过来的代码其实就三个方法而已,其中还有一个我要进行改造

- 第一个是执行`libreoffice`命令转换文件方法

  - 这个方法本身是顺序执行的,但是我发现了一个问题
  - 就是这里去执行`linux`命令的时候是脱离了Java代码的控制的,所以很可能导致我去转换文件,文件还没转换好,Java代码已经去使用这个文件,就会报错
  - 所以我在执行命令后会去循环,然后看看是否已经取到理想中的文件,取到再往下一步进行Java代码

  ```java
      public static String toPdf(String filePath, String targetFolder, String fileName) {
          log.info("源文件：{}", filePath);
          log.info("目标文件夹：{}", targetFolder);
          String command = "";
          String osName = System.getProperty("os.name");
          log.info("系统名称：{}", osName);
  
          if (osName.contains("Windows")) {
              command = "soffice --headless --convert-to pdf " + filePath + " --outdir " + targetFolder;
              windowExec(command);
          } else {
              command = "/usr/bin/libreoffice --headless --convert-to pdf:writer_pdf_Export " + filePath + " --outdir " + targetFolder;
              LinuxExec(command);
          }
          //返回的pdf文件不为空就一直循环
          long waitStart = System.currentTimeMillis();
          while (FileUtil.isEmpty(new File(targetFolder + File.separator + fileName))) {
              log.info("----------等待libreoffice执行中----------");
          }
          log.info("等待libreoffice执行耗时：{}毫秒", System.currentTimeMillis() - waitStart);
          return targetFolder + File.separator + fileName;
      }
  ```

- 第二个是`windows`执行命令行方法

  ```java
  private static boolean windowExec(String command) {
      Process process;// Process可以控制该子进程的执行或获取该子进程的信息
      try {
          process = Runtime.getRuntime().exec(command);// exec()方法指示Java虚拟机创建一个子进程执行指定的可执行程序，并返回与该子进程对应的Process对象实例。
          // 下面两个可以获取输入输出流
          InputStream errorStream = process.getErrorStream();
          InputStream inputStream = process.getInputStream();
      } catch (IOException e) {
          return false;
      }
  
      int exitStatus = 0;
      try {
          exitStatus = process.waitFor();// 等待子进程完成再往下执行，返回值是子线程执行完毕的返回值,返回0表示正常结束
          // 第二种接受返回值的方法
          int i = process.exitValue(); // 接收执行完毕的返回值
      } catch (InterruptedException e) {
          return false;
      }
      process.destroy(); // 销毁子进程
      process = null;
      return true;
  }
  ```

  

- 第二个是`linux`执行命令行方法

  ```java
  private static void LinuxExec(String cmd) {
      System.out.println(cmd);
      try {
          Runtime.getRuntime().exec(cmd);
      } catch (IOException e) {
          System.err.println(e.getMessage());
      }
  }
  ```

  

### docker切换国内镜像

- 由于我是先使用自己`windows`电脑上的docker去实验的,所以导致我拉镜像的时候反复失败,甚至于我执行`docker search`都失败
- 经过各种查询网上的人也说公开的国内镜像一个个的都不靠谱
- 最后解决办法是,注册一个个人的阿里云账号,哪怕你没有消费一分钱,也可以在[镜像加速器](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)中复制自己独特的加速器地址配置到`docker`中

### docker容器安装libreoffice

- 我选择了直接找到一个安装好`jdk11`以及`libreoffice`的`docker`镜像
- 这样就不需要我自己一步步的去安装了
- [`esystemstech/libreoffice:6.1-openjdk-11-jdk-buster-slim`](https://hub.docker.com/layers/esystemstech/libreoffice/6.1-openjdk-11-jdk-buster-slim/images/sha256-dfb13e10a06a3ba6e71a0c45a0d0612bc2179f7a11541ca549d846329f1a9019?context=explore)

### 添加中文字体

- 这是最最复杂的一步了,因为这一步花费了我很多的时间,甚至周末都还在想这个问题

- 根据开源项目中的[linux安装字体教程](http://wiki.nooss.cn/archives/406.html),我需要进行如下步骤

  - 下载字体包

  - 放入/usr/share/fonts目录

  - ```shell
    cd /usr/share/fonts
    上传压缩包到上面目录
    yum install unzip
    unzip linux-usr-share-fonts.zip
    ```

  - 建立字体缓存

    ```shell
    yum install mkfontscale
    yum install fontconfig
    mkfontscale
    mkfontdir
    fc-cache
    ```

  - 查看字体

    ```shell
    fc-list # 查看字体
    fc-list :lang=zh # 查看中文字体
    ```

  

- 但是会遇到很多问题

#### 字体来源

- 如果不在`linux`安装中文字体包,转换出的`pdf`中的中文就全是乱码
- 中文字体包都该从哪里来,教程里说是下载,链接: `https://pan.baidu.com/s/11w0s-Jjfd45a6sLCJBZgPg 提取码: p76y`
- 但是我下载之后发现里面的**字体不太全**,至少我没看到宋体,就会导致转换出的`pdf`**行距特别大**,2页的`docx`变成了4页的`pdf`
- 于是我知道了字体的来源应该是使用的**windows电脑中的`C:\Windows\Fonts`目录**中
- 把这个目录里的所有字体都**压缩成zip**文件复制到映射到`docker`容器内部的文件夹,因为要使用unzip解压,rar格式不支持

#### 安装系统软件命令

- 执行`yum install unzip`时会出现的问题,**yum命令不可用**,因为这个镜像的系统是`debian`
- 自带的安装系统软件命令是apt/apt-get
- 但是即使使用apt/apt-get也不可以,会报`Unable to locate package mkfontscale`这样的错误
- 于是乎我一股脑的进行了更新命令,也就是`apt upgrade,apt update,apt-get update,apt-get upgrade`

> 经过测试发现,执行了`apt-get update`之后`unzip`和`fontconfig`都可以安装了,只有`ttf-mscorefonts-installer`还不行
>
> 报错为
>
> ```shell
> ttf-mscorefonts-installer Reading package lists... Done Building dependency tree
> Reading state information... Done
> Package ttf-mscorefonts-installer is not available, but is referred to by another package. This may mean that the package is missing, has been obsoleted, or is only available from another source
> E:Package'ttf-mscorefonts-installer’has no installation candidate
> ```
>
> 翻译为:
>
> - 阅读包列表…构建依赖树
> - 阅读状态信息…完成
> - 包ttf-mscorefonts-installer不可用，但被另一个包引用。这可能意味着包丢失了，已经过时了，或只能从另一个来源
> - E:包'ttf-mscorefonts-installer '没有安装候选
>
>  等到我执行完了apt-get upgrade,发现`ttf-mscorefonts-installer`还是安装失败,报错为
>
> ```shell
> Reading package lists... Done
> Building dependency tree
> Reading state information... Done
> Package ttf-mscorefonts-installer is not available, but is referred to by another package.
> This may mean that the package is missing, has been obsoleted, or
> is only available from another source
> 
> E: Package 'ttf-mscorefonts-installer' has no installation candidate
> ```
>
> 翻译为:
>
> - 阅读包列表…完成
> - 构建依赖关系树
> - 阅读状态信息…完成
> - 包ttf-mscorefonts-installer不可用，但被另一个包引用。
> - 这可能意味着包裹丢失了，被废弃了，或者
> - 只能从其他来源获得吗
> - E:包'ttf-mscorefonts-installer'没有安装候选

- `apt-get update`的时候我遇到一个问题,报错大概为

  ```shell
  [chris@server ~]$ sudo apt-get update
  Ign http://security.ubuntu.com trusty-security InRelease
  Get:1 http://security.ubuntu.com trusty-security Release.gpg [933 B]
  ...
  Fetched 21.9 MB in 14s (1,537 kB/s)
  Reading package lists... Done
  W: GPG error: http://security.ubuntu.com trusty-security Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 40976EAF437D05B5 NO_PUBKEY 3B4FE6ACC0B21F32
  W: GPG error: http://archive.canonical.com trusty Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 40976EAF437D05B5 NO_PUBKEY 3B4FE6ACC0B21F32
  W: GPG error: http://archive.ubuntu.com trusty Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 40976EAF437D05B5 NO_PUBKEY 3B4FE6ACC0B21F32
  W: GPG error: http://archive.ubuntu.com trusty-updates Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY 40976EAF437D05B5 NO_PUBKEY 3B4FE6ACC0B21F32
  ```

- 这里需要按照搜出来的教程去添加key

  ```shell
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 40976EAF437D05B5
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32
  ```

- 然后我继续去按照教程里去进行`apt install unzip`,这下倒是成功了

- 但是教程中让我去`apt install mkfontscale`与`apt install fontconfig`就无论如何都是失败,这样的软件名是在centos中安装时需要的

- 最后我发现,似乎debian系统中安装这两个是需要安装另外的名字的软件

  ```shell
  apt-get install ttf-mscorefonts-installer # 安装mkfontscale，mkfontdir
  apt-get install fontconfig  # 安装fc-cache
  ```

- 但是依然无法安装,我反复进行更新命令`apt-get update,apt-get upgrade`,报的错误中提示我让我运行`apt --fix-broken install`命令,我运行之后再去安装发现一切正常了

> ttf-mscorefonts-installer是最特殊的,他很有可能什么情况下都无法安装
>
> 那只能使用以下方法
>
> - 首先安装wget:`apt install wget`
>
> - 然后使用wget下载ttf-mscorefonts-installer:`wget http://httpredir.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.8_all.deb`
>
> - 之后操作:`dpkg -i ttf-mscorefonts-installer_3.8_all.deb`
>
> - 然后安装`apt-get install ttf-mscorefonts-installer`
>
> - 提示需要运行`apt --fix-broken install`
>
> - 运行完毕之后,再次安装`apt-get install ttf-mscorefonts-installer`,安装成功
>
> - ```shell
>   Reading package lists... Done
>   Building dependency tree
>   Reading state information... Done
>   ttf-mscorefonts-installer is already the newest version (3.8).
>   0 upgraded, 0 newly installed, 0 to remove and 1 not upgraded.
>   ```
>
>   

- ```shell
  apt-get install ttf-mscorefonts-installer
  apt-get install fontconfig
  mkfontscale
  mkfontdir
  fc-cache
  ```

- 这样只需要把放在容器内外映射文件夹的字体压缩包使用cp命令复制到`/usr/share/fonts`目录,使用unzip命令解压,再执行上面三个连续命令就可以正常解析中文字体了

- 但是一定要在进行上面的字体操作后去重启docker容器

- 特别提一句,**docker-compose的重启和docker不一样**,它的重启是重启service名,`docker-compose restart service名`

- 也就是配置文件中`services:`下的一级名称,比如web,这个名称也是我们自己自定义的,一个service下可以有多个容器配置

  ```yml
  services:
    web:
      image: esystemstech/libreoffice:6.1-openjdk-11-jdk-buster-slim
      container_name: financial-leasing-manage-pdf
  ```

#### linux命令下载速度过慢

- 之前提到的apt/apt-get命令速度巨慢
- 于是乎需要添加一条命令切换为国内镜像`sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list`
- 我把它加到了yml配置文件的`command`配置项中(**这是错误的**)
- 正确的做法是加到`Dockerfile`的RUN命令后边,**不要想一个`yml`文件解决一切问题**,必要的一些配置**还是需要`Dockerfile`**,然后把`Dockerfile`文件配置在`yml`中
- [知识来源](https://blog.csdn.net/qq_40016971/article/details/107887486)

---

- 突然发现了不光是之前的那一条就够用了,`security.debian.org`的镜像也需要替换才可以,不然相关的下载也会很慢
- 命令为`sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list`

---

```dockerfile
#apt切换为国内源,加快镜像内网速
#中科大
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
RUN sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list
#清华
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list
RUN sed -i 's|security.debian.org/debian-security|mirrors.tuna.tsinghua.edu.cn/debian-security|g' /etc/apt/sources.list
#上海交大
RUN sed -i 's/deb.debian.org/mirror.sjtu.edu.cn/g' /etc/apt/sources.list
RUN sed -i 's|security.debian.org/debian-security|mirror.sjtu.edu.cn/debian-security|g' /etc/apt/sources.list
```

### 最终方案

#### 使用esystemstech/libreoffice:6.1-openjdk-11-jdk-buster-slim镜像

- 这个镜像中已经自带jdk11和libreoffice了,可以省去在容器中安装这两个的步骤

- 我本来以为docker-compose的yml配置可以完全省略掉Dockerfile,事实证明我错了,构建镜像和容器的时候需要执行的linux命令就必须要用到Dockerfile,所以最后决定使用Dockerfile+docker-compose.yml完成word转PDF的docker容器生成

- 工序已经相当精简了,首先准备好一个Dockerfile,在其中配好初始化我们所需的libreoffice能正常运行并且字体库包含中文的环境所需的所有命令行

- 这里要特别注意,菜鸟教程中的Dockerfile教程开头就写到

  - **Dockerfile 的指令每执行一次都会在 docker 上新建一层**。所以过多无意义的层，会造成镜像膨胀过大。例如:

    ```dockerfile
    FROM centos
    RUN yum -y install wget
    RUN wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz"
    RUN tar -xvf redis.tar.gz
    ```

  - 以上执行会创建 3 层镜像。可简化为以下格式：

    ```dockerfile
    FROM centos
    RUN yum -y install wget \
        && wget -O redis.tar.gz "http://download.redis.io/releases/redis-5.0.3.tar.gz" \
        && tar -xvf redis.tar.gz
    ```

  - 如上，以 **&&** 符号连接命令，这样执行后，只会创建 1 层镜像。

  > **这里让我吃了一个大大的教训**,本身我是每个命令就开头写一行RUN的,但是本地搭建好的其他镜像都可以正常运行apt --fix-broken install,偏偏直接用Dockerfile中的命令构建就死活都会陷入死循环
  >
  > 类似这样:
  >
  > ```shell
  > => # ERROR: The certificate of 'ufpr.dl.sourceforge.net has expired. 
  > =>=># --2022-07-12 02:22:41-- https://internode.dl.sourceforge.net/sourceforge/corefonts/comic32.exe=>=># --2022-07-12 02:22:41-- https://internode.dl.sourceforge.net/sourceforge/corefonts/comic32.exe
  > =>=># Resolving internode.dl.sourceforge.net (internode.dl.sourceforge.net)... 150.101.135.12, 150.101.135.12
  > >=> # Connecting to internode.dl.sourceforge.net (internode.dl.sourceforge.net) 150.101.135.12 :443... failed: Conne
  > => # ction refused.
  > =># Connecting to internode.dl.sourceforge.net (internode.dl.sourceforge.net) 150.101.135.12|:443...
  > ```
  >
  > 最终当我找到菜鸟教程看到开头这段话的时候,修改完成直接通过了!!!!!

  ```dockerfile
  FROM esystemstech/libreoffice:6.1-openjdk-11-jdk-buster-slim
  # VOLUME 指定了临时文件目录为/tmp。其效果是在主机 /var/lib/docker 目录下创建了一个临时文件，并链接到容器的/tmp
  #VOLUME /tmp
  #COPY financial-leasing-manage-0.0.1-SNAPSHOT.jar app.jar
  #ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
  #以上三句本来是Dockerfile的普通用法,现在我要改为挂载目录替换jar包方法,所以注释掉加上下面这句
  #本来/data后面应该是真实jar包名,但是因为涉及到版本更新的问题,jar包名字可能会变,所以在这里写死名字,打包之后改名放入服务器就万无一失了
  #libreoffce相关命令
  #apt切换为国内源,加快镜像内网速
  RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list \
    && sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list \
    && apt-get upgrade -y \
    #这里如果不再次update会报:Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?
    && apt-get update \
    && apt-get install unzip \
    && apt-get install fontconfig \
    #这一步会问Do you want to continue? [Y/n] Abort.
    && apt-get install wget -y \
    #手动下载ttf-mscorefonts-installer安装程序,3.8会导致apt --fix-broken install无限循环,所以使用3.6
    && wget --no-check-certificate http://httpredir.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.6_all.deb \
    && dpkg -i ttf-mscorefonts-installer_3.6_all.deb || true \
    && apt --fix-broken install -y \
    && apt-get install ttf-mscorefonts-installer 
  #合二为一
  #RUN ["/bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime","echo 'Asia/Shanghai' > /etc/timezone"]
  ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/data/app.jar"]
  
  ```

- 然后要配置好对应的compose.yml文件,修改其中的端口号为自己想要的,然后把目录映射也做好,一定记得把时区目录也映射正确才能让容器内命令行显示的时间正确

  ```yml
  # yaml 配置实例
  version: '3.7'
  services:
    web:
      build: 
        context: .
        dockerfile: Dockerfile-libreoffice    
      container_name: financial-leasing-manage-pdf-test-3
      ports:
        - "8015:8082"
      restart: always
      volumes:
        - /D/software/develop/docker-dir/financial-leasing/manage/package:/data/package
        - /D/software/develop/docker-dir/financial-leasing/manage/cert:/data/cert
        - /D/software/develop/docker-dir/financial-leasing/manage/pdf:/data/pdf
        # 为了保证容器时区和系统时区相同，需要挂载docker的/etc/localtime到系统的/etc/localtime
        # - -v /etc/localtime:/etc/localtime:ro 
      entrypoint: 
        - "java"
        - "-Djava.security.egd=file:/dev/./urandom"
        - "-jar"
        - "/data/package/app.jar"
    #   depends_on:
    #     - redis
    # redis:
    #   image: redis:6.0.6
    #   container_name: redis-lzc-test-2
    #   ports:
    #     - "6380:6379"
    #   restart: always
    #   volumes:
    #     - /D/software/develop/docker-dir/financial-leasing/manage/redis/test/redis.conf:/etc/redis/redis.conf
    #     - /D/software/develop/docker-dir/financial-leasing/manage/redis/test/data:/data
    #   command:
    #     # 以配置文件的方式启动 redis.conf
    #     redis-server /usr/local/etc/redis/redis.conf --appendonly yes
  
  ```

- 这些都做好之后,在映射好的`/data/cert`目录下放好我们的安全证书,在`/data/pdf`目录下放好windows系统收集好的所有字体,在`/data/package`目录中放好我们项目的jar包

  ```shell
  #首先复制我们的字体压缩包到usr/share/fonts目录下
  cp data/pdf/windows-font.zip /usr/share/fonts
  #切换到usr/share/fonts目录,这里特别注意一定要切换文件夹之后再unzip解压,如果直接unzip /usr/share/fonts/windows-font.zip的话,解压是解压到你当前文件夹而不是usr/share/fonts
  #硬要一条命令搞定,那就是 unzip -d usr/share/fonts data/pdf/windows-font.zip
  cd usr/share/fonts
  #使用unzip命令解压
  unzip windows-font.zip
  #连续三步建立字体缓存
  mkfontscale
  mkfontdir
  fc-cache
  ```

- 执行完上面的命令就完事了,可以尝试`http://localhost:8015/manage/pdf`看看是否可以正常转换PDF了,参数为docx,值为docx文件的url

- 如果执行完上面的还有乱码,就去复制linux的字体zip压缩文件,然后解压,执行连续三步,然后再解压windows字体zip,执行连续三步就可以正常识别中文了

- ```shell
  #首先复制我们的字体压缩包到usr/share/fonts目录下
  #cp data/pdf/windows-font.zip /usr/share/fonts
  #切换到usr/share/fonts目录,这里特别注意一定要切换文件夹之后再unzip解压,如果直接unzip /usr/share/fonts/windows-font.zip的话,解压是解压到你当前文件夹而不是usr/share/fonts
  #硬要一条命令搞定,那就是 unzip -d usr/share/fonts data/pdf/windows-font.zip
  unzip -o -d /usr/share/fonts /data/pdf/windows-font.zip
  #cd usr/share/fonts
  #使用unzip命令解压
  #unzip windows-font.zip
  #连续三步建立字体缓存
  mkfontscale
  mkfontdir
  fc-cache
  #启动项目
  java -Djava.security.egd=file:/dev/./urandom -jar /data/package/app.jar
  ```

- 最后这几步镜像构建完成后的命令也可以自动化进行

- 第一种方法是,在`docker-compose.yml`里配置`entrypoint`,执行shell脚本

  - 但是要一定注意,windows如果使用记事本编辑的sh脚本,那里面会有windows自带的符号,导致执行脚本时`linux`会报错
  - 看出来的方法就是`cat -A 脚本文件`,只要看出脚本每句命令结尾都有`^M`就是格式有问题的,把^M都删掉即可

  > 结尾有$属于正常现象,sh脚本本来就该有$结尾

  - 要么就在容器中的`linux`环境里使用`vim -b sh脚本地址`去使用vim重新编辑脚本,要么就在`vscode`里面写sh脚本

  - 而且shell脚本是有自己的格式的,开头必须是

    ```shell
    #!/bin/bash
    source /etc/profile
    ```

- 第二种方法是,直接在`Dockerfile`中的RUN里拼起来

  - 亲测不可

  - 会报错

    ```shell
    unzip:  cannot find or open /data/pdf/windows-font.zip, /data/pdf/windows-font.zip.zip or /data/pdf/windows-font.zip.ZIP.
    ------
    executor failed running [/bin/sh -c sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list   && sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list   && apt-get upgrade -y   && apt-get update   && apt-get install unzip   && apt-get install fontconfig   && apt-get install wget -y   && wget --no-check-certificate http://httpredir.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.6_all.deb   && dpkg -i ttf-mscorefonts-installer_3.6_all.deb || true   && apt --fix-broken install -y   && apt-get install ttf-mscorefonts-installer   && unzip -o -d /usr/share/fonts /data/pdf/windows-font.zip   && mkfontscale   && mkfontdir   && fc-cache   && java -Djava.security.egd=file:/dev/./urandom -jar /data/package/app.jar]: exit code: 9
    ```

- 第三种方法,使用`docker-compose.yml`中的command配置

  - 亲测不可
  - [教程](https://nibes.cn/blog/9502)里的,各种格式都试了通通失败

#### 使用`openjdk:11-slim-buster`镜像

- 只使用`精简版的JDK11镜像`也可以,需要在构建镜像时增加一条安装`libreoffice`的命令

- 我本以为这样可以使镜像精简一些,小一些,但是事实证明我错了,反而还大了几十兆

- 不过精简版的`JDK11`镜像更主流更好拉取,该怎么抉择就见仁见智了

- 首先准备好`Dockerfile`

  ```dockerfile
  FROM openjdk:11-slim-buster
  #本来/data后面应该是真实jar包名,但是因为涉及到版本更新的问题,jar包名字可能会变,所以在这里写死名字,打包之后改名放入服务器就万无一失了
  #libreoffce相关命令
  #apt切换为国内源,加快镜像内网速
  RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list \
    && sed -i 's|security.debian.org/debian-security|mirrors.ustc.edu.cn/debian-security|g' /etc/apt/sources.list \
    && apt-get upgrade -y \
    #这里如果不再次update会报:Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?
    && apt-get update \
    && apt-get install libreoffice -y \ 
    && apt-get install unzip \
    && apt-get install fontconfig \
    #这一步会问Do you want to continue? [Y/n] Abort.
    && apt-get install wget -y \
    #手动下载ttf-mscorefonts-installer安装程序
    && wget --no-check-certificate http://httpredir.debian.org/debian/pool/contrib/m/msttcorefonts/ttf-mscorefonts-installer_3.6_all.deb \
    #||true可以做到真正的哪怕错误也往下执行,而;exit 0这个方式会让当前命令下方的命令不继续执行
    && dpkg -i ttf-mscorefonts-installer_3.6_all.deb || true \
    && apt --fix-broken install -y \
    && apt-get install ttf-mscorefonts-installer
  
  ```

- 然后准备好`docker-compose.yml`

  ```yml
  # yaml 配置实例
  version: '3.7'
  services:
    web:
      build: # 使用Dockerfile构建镜像
        context: . # Dockerfile相对当前docker-compose.yml目录位置
        dockerfile: Dockerfile # Dockerfile文件名
      image: libreoffice-from-jdk11:1.0.0 # 自定义镜像名:tag名
      container_name: financial-leasing-manage-from-jdk11 # 容器名
      ports:
        - "8012:8082"
      restart: always
      volumes:
        - /D/software/develop/docker-dir/financial-leasing/manage/package:/data/package
        - /D/software/develop/docker-dir/financial-leasing/manage/cert:/data/cert
        - /D/software/develop/docker-dir/financial-leasing/manage/pdf:/data/pdf
        # - /etc/localtime:/etc/localtime:ro  # 为了保证容器时区和系统时区相同，需要挂载docker的/etc/localtime到系统的/etc/localtime
      entrypoint:
        - "/data/pdf/pdf-font.sh" # 执行脚本,解压存好的windows字体zip压缩文件,添加字体缓存,并启动java项目,服务器中直接执行sh文件不可以运行,改为sh xxx.sh
  
  ```

- 准备好执行脚本`pdf-font.sh`

  ```shell
  #!/bin/bash
  source /etc/profile
  # -o是代表默认覆盖解压当前目录下同名的文件,-d是不解压在当前文件夹,解压到指定文件夹下
  unzip -o -d /usr/share/fonts /data/pdf/windows-font.zip
  mkfontscale
  mkfontdir
  fc-cache
  java -Djava.security.egd=file:/dev/./urandom -jar -Duser.timezone=GMT+8 /data/package/app.jar
  
  ```

- 准备好windows字体压缩zip文件,映射到容器内部,由脚本中的unzip命令解压

- 全都放到服务器中,在docker配置文件同级目录运行`docker-compose build`

- 再运行`docker-compose up -d`即可,一般来讲这时候就项目启动成功了

- 如果转出的pdf文件有问题,汉字是乱码,那就`docker-compose restart service名`重启一下即可

## 可能出现的问题

### 启动容器时

#### Error response from daemon: OCI runtime create failed: container_linux.go:380: starting container process caused: exec: "/data/pdf/pdf-font.sh": permission denied: unknown

- 启动容器出现这个错误,基本上就是因为执行脚本的权限不够,导致无法运行脚本,把脚本权限设置为777即可

#### no such file or directory

- 如果出现这个基本上是脚本的编码格式有问题,里面有windows系统的换行符
- `cat -A sh脚本地址`,就可以看出,如果脚本中有^M,就需要编辑删掉
- `vim -b sh脚本地址 `,按下i进入编辑模式删掉符号,`:wq`保存并退出即可

#### libreoffice版本较低,转换格式有问题

- 之前安装的libreoffice版本都是6.1,比较低,导致转换出的格式会有一些问题

- 经过查询,我找到了问题的解决方法

- 首先,apt-get install命令安装的libreoffice就是6.1版本的,没法安装更高的版本

- 官网告诉我的安装方法是,首先下载[linux64位安装包](https://www.libreoffice.org/donate/dl/deb-x86_64/7.2.7/zh-CN/LibreOffice_7.2.7_Linux_x86-64_deb.tar.gz),可以用tar命令在linux解压也可在windows上手动解压把解压出的文件夹拖进docker映射的某个文件夹

- cd命令进入解压后的文件夹所在目录

  ```shell
  # 切换到安装包所在的目录
  $ cd ~/下载/
  
  # 安装主安装程序的所有deb包
  $ sudo dpkg -i ./LibreOffice_X.Y.Z_Linux_x86_deb/DEBS/*.deb
  # 使用这个dpkg -i ./LibreOffice_7.2.7.2_Linux_x86-64_deb/DEBS/*.deb
  ```

- 然后其实上是安装到了容器里的linux系统的`/opt/libreoffice7.2`目录,如果要执行,必须`/opt/libreoffice7.2/program/soffice 命令`这样执行

- 比如`/opt/libreoffice7.2/program/soffice --headless --convert-to pdf /data/pdf/抵押合同.docx --outdir /data/pdf`

- 之前是在Dockerfile中用RUN的shell命令行安装了libreoffice的,现在既然我们使用wget下载了deb格式的libreoffice的安装包,那就应该不要再去使用`apt-get`安装了,这样等于是安装了一个6.1版本,又安装了一个7.2版本

- 但是当我去掉RUN后面的apt-get install libreoffice之后,构建镜像就出现了问题开始报错

- 最后经过研究,如果要去掉apt-get安装libreoffice,就不能同时安装`ttf-mscorefonts-installer`,不安装这个就没法执行mkfontscale
  和mkfontdir命令

- 不执行这两个命令,运行7.2版本的libreoffice时会报错,只需要安装`libxinerama-dev`和`ibus`就可以解决问题

- 这样一来,除了转换PDF速度稍慢,大概是4秒变为5秒,其他的转换PDF功能都可以正常进行了