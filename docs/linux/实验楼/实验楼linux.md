# 实验楼学习linux笔记

## shell

- 创建文件: touch file
- 进入目录: cd /etc/

> [![cd.png](https://i.postimg.cc/fyqTGHjR/cd.png)](https://postimg.cc/vx9s9tNJ)

- 查看当前所在目录: pwd

> [![pwd.png](https://i.postimg.cc/DfxZ4Zk3/pwd.png)](https://postimg.cc/vD6MpGZ0)

- 命令补全 tab

> ![](https://doc.shiyanlou.com/document-uid735639labid2timestamp1531472459081.png/wm)

- 强行终止运行 ctrl+c
- 其他一些常用快捷键

> | 按键            | 作用                                         |
> | --------------- | -------------------------------------------- |
> | `Ctrl+d`        | 键盘输入结束或退出终端                       |
> | `Ctrl+s`        | 暂停当前程序，暂停后按下任意键恢复运行       |
> | `Ctrl+z`        | 将当前程序放到后台运行，恢复到前台为命令`fg` |
> | `Ctrl+a`        | 将光标移至输入行头，相当于`Home`键           |
> | `Ctrl+e`        | 将光标移至输入行末，相当于`End`键            |
> | `Ctrl+k`        | 删除从光标所在位置到行末                     |
> | `Alt+Backspace` | 向前删除一个单词                             |
> | `Shift+PgUp`    | 将终端显示向上滚动                           |
> | `Shift+PgDn`    | 将终端显示向下滚动                           |

- Shell 常用通配符： 

> | 字符                    | 含义                                        |
> | ----------------------- | ------------------------------------------- |
> | `*`                     | 匹配 0 或多个字符                           |
> | `?`                     | 匹配任意一个字符                            |
> | `[list]`                | 匹配 list 中的任意单一字符                  |
> | `[^list]`               | 匹配 除list 中的任意单一字符以外的字符      |
> | `[c1-c2]`               | 匹配 c1-c2 中的任意单一字符 如：[0-9] [a-z] |
> | `{string1,string2,...}` | 匹配 string1 或 string2 (或更多)其一字符串  |
> | `{c1..c2}`              | 匹配 c1-c2 中全部字符 如{1..10}             |

## 账户管理 

- Linux 是一个可以实现多用户登录的操作系统，比如“李雷”和“韩梅梅”都可以同时登录同一台主机，他们共享一些主机的资源，但他们也分别有自己的用户空间，用于存放各自的文件。但实际上他们的文件都是放在同一个物理磁盘上的甚至同一个逻辑分区或者目录里，但是由于 Linux 的 **用户管理** 和 **权限机制**，不同用户不可以轻易地查看、修改彼此的文件。 
- 输入`who am i`或`who mom like`

> [![who-am-i.png](https://i.postimg.cc/nzRGWJ5j/who-am-i.png)](https://postimg.cc/ZBNN91J4)

- 输出的第一列表示打开当前伪终端的用户的用户名（要查看当前登录用户的用户名，去掉空格直接使用 `whoami` 即可），第二列的 `pts/0` 中 `pts` 表示伪终端(**你打开几个黑窗口,就是几个伪终端**)，所谓伪是相对于 `/dev/tty` 设备而言的，还记得上一节讲终端时的那七个使用 `[Ctrl]`+`[Alt]`+`[F1]～[F7]` 进行切换的 `/dev/tty` 设备么,这是“真终端”，伪终端就是当你在图形用户界面使用 `/dev/tty7` 时每打开一个终端就会产生一个伪终端， `pts/0` 后面那个数字就表示打开的伪终端序号，你可以尝试再打开一个终端，然后在里面输入 `who am i` ，看第二列是不是就变成 `pts/1` 了，第三列则表示当前伪终端的启动时间。 
- `who` 命令其它常用参数 

> | 参数 | 说明                       |
> | ---- | -------------------------- |
> | `-a` | 打印能打印的全部           |
> | `-d` | 打印死掉的进程             |
> | `-m` | 同`am i`,`mom likes`       |
> | `-q` | 打印当前登录用户数及用户名 |
> | `-u` | 打印当前登录用户登录信息   |
> | `-r` | 打印运行等级               |

### 创建用户

- 在 Linux 系统里， `root` 账户拥有整个系统至高无上的权利，比如 新建/添加 用户。 

> 安卓手机的安卓系统就是基于linux,所以安卓手机的root就是这里linux的root权限.

- 我们一般登录系统时都是以普通账户的身份登录的，要创建用户需要 root 权限，这里就要用到 `sudo` 这个命令了。不过使用这个命令有两个大前提，一是你要知道当前登录用户的密码，二是当前用户必须在 `sudo` 用户组。 
- linux环境下**输入密码**是**不显示**的.
- `su ` 可以切换到用户 user，执行时需要输入目标用户的密码，`sudo ` 可以以特权级别运行 cmd 命令，需要当前用户属于 sudo 组，且需要输入当前用户的密码。`su - ` 命令也是切换用户，同时环境变量也会跟着改变成目标用户的环境变量。 
- 创建新用户: ` sudo adduser lilei `
- 用户密码设置: ` sudo passwd shiyanlou `
- 切换登录用户: ` su -l lilei `
- 退出当前用户跟退出终端一样可以使用 `exit` 命令或者使用快捷键 `Ctrl+d`。 

### 用户组

- 如何知道自己属于哪些用户组 

- #### 方法一：使用 groups 命令

> ```shell
> $ groups shiyanlou
> ```
>
> ![](https://doc.shiyanlou.com/document-uid13labid3timestamp1454035714557.png/wm)

- 其中冒号之前表示用户，后面表示该用户所属的用户组。这里可以看到 shiyanlou 用户属于 shiyanlou 用户组，每次新建用户如果不指定用户组的话，默认会自动创建一个与用户名相同的用户组（差不多就相当于家长的意思，或者说是老总）。默认情况下在 sudo 用户组里的可以使用 sudo 命令获得 root 权限。shiyanlou 用户也可以使用 sudo 命令，为什么这里没有显示在 sudo 用户组里呢？可以查看下 `/etc/sudoers.d/shiyanlou` 文件，我们在 `/etc/sudoers.d` 目录下创建了这个文件，从而给 shiyanlou 用户赋予了 sudo 权限： 

> ![](https://doc.shiyanlou.com/document-uid13labid3timestamp1454035855554.png/wm)

- #### 方法二：查看 `/etc/group` 文件

> ```shell
> cat /etc/group | sort 
> ```
>
> 这里 `cat` 命令用于读取指定文件的内容并打印到终端输出 , `| sort` 表示将读取的文本进行一个字典排序再输出，然后你将看到如下一堆输出 
>
> ![](https://doc.shiyanlou.com/document-uid735639labid3timestamp1531731335264.png/wm)
>
> 如果信息太多半天翻不到自己想要的结果, 你可以使用命令过滤掉一些你不想看到的结果 
>
> ```shell
> cat /etc/group | grep -E "shiyanlou"
> ```
>
> ![](https://doc.shiyanlou.com/document-uid13labid3timestamp1454035698068.png/wm)
>
> /etc/group 的内容包括用户组（Group）、用户组口令、GID 及该用户组所包含的用户（User），每个用户组一条记录。格式如下：
>
> > group_name:password:GID:user_list
>
> 你看到上面的 password 字段为一个 `x` 并不是说密码就是它，只是表示密码不可见而已。
>
> 这里需要注意，如果用户的 GID 等于用户组的 GID，那么最后一个字段 `user_list` 就是空的，比如 shiyanlou 用户，在 `/etc/group` 中的 shiyanlou 用户组后面是不会显示的。lilei 用户，在 `/etc/group` 中的 lilei 用户组后面是不会显示的。

- **将其它用户加入 sudo 用户组**
- 默认情况下新创建的用户是不具有 root 权限的，也不在 sudo 用户组，可以让其加入 sudo 用户组从而获取 root 权限： 

> ```shell
> # 注意 Linux 上输入密码是不会显示的
> $ su -l lilei
> $ sudo ls
> ```

- 会提示 lilei 不在 sudoers 文件中，意思就是 lilei 不在 sudo 用户组中，至于 sudoers 文件（/etc/sudoers）你现在最好不要动它，操作不慎会导致比较麻烦的后果。

  使用 `usermod` 命令可以为用户添加用户组，同样使用该命令你必需有 root 权限，你可以直接使用 root 用户为其它用户添加用户组，或者用其它已经在 sudo 用户组的用户使用 sudo 命令获取权限来执行该命令。

  这里我用 shiyanlou 用户执行 sudo 命令将 lilei 添加到 sudo 用户组，让它也可以使用 sudo 命令获得 root 权限：

> ```shell
> $ su shiyanlou # 此处需要输入 shiyanlou 用户密码，shiyanlou 的密码可以通过 `sudo passwd shiyanlou` 进行设置。
> $ groups lilei
> $ sudo usermod -G sudo lilei
> $ groups lilei
> ```

- 然后你再切换回 lilei 用户，现在就可以使用 sudo 获取 root 权限了。 
- **删除用户**

> ```shell
> $ sudo deluser lilei --remove-home
> ```
>
> ![](https://doc.shiyanlou.com/document-uid735639labid3timestamp1531731417990.png/wm)

## 文件权限

- 我们之前已经很多次用到 `ls` 命令了，如你所见，我们用它来列出并显示当前目录下的文件，当然这是在不带任何参数的情况下，它能做的当然不止这么多，现在我们就要用它来查看文件权限。

  使用较长格式列出文件：

> ![](https://doc.shiyanlou.com/document-uid735639labid3timestamp1531731455816.png/wm)

- 你可能除了知道最后面那一项是文件名之外，其它项就不太清楚了，那么到底是什么意思呢： 

> ![](https://doc.shiyanlou.com/linux_base/3-9.png/wm)

- 可能你还是不太明白，比如第一项文件类型和权限那一堆东西具体指什么，链接又是什么，何为最后修改时间，下面一一道来：

> ![](https://doc.shiyanlou.com/linux_base/3-10.png/wm)

- 补充一下关于 `ls` 命令的一些其它常用的用法： 

  - 显示除了 `.`（当前目录）和 `..`（上一级目录）之外的所有文件，包括隐藏文件（Linux 下以 `.` 开头的文件为隐藏文件）。 

  > ```shell
  > $ ls -A
  > ```
  >
  > ![](https://doc.shiyanlou.com/document-uid735639labid3timestamp1531731522478.png/wm)
  >
  > 当然，你可以同时使用 `-A` 和 `-l` 参数：
  >
  > ```shell
  > $ ls -Al
  > ```
  >
  > 查看某一个目录的完整属性，而不是显示目录里面的文件属性：
  >
  > ```shell
  > $ ls -dl <目录名>
  > 
  > ```
  >
  > - 显示所有文件大小，并以普通人类能看懂的方式呈现：
  >
  > ```shell
  > $ ls -AsSh
  > 
  > ```
  >
  > 其中小 s 为显示文件大小，大 S 为按文件大小排序，若需要知道如何按其它方式排序，请使用“man”命令查询。

### 变更文件所有者

- 假设目前是 lilei 用户登录，新建一个文件，命名为 “ iphone6 ”： 

> ```shell
> # 注意当前的用户必须是 lilei
> # 如果是 shiyanlou 用户需要切换到 lilei（如果之前已经删除需要重新创建下）
> $ su lilei
> $ cd /home/lilei
> $ touch iphone6
> 
> ```

- 可见文件所有者是 lilei ： 

> ![](https://doc.shiyanlou.com/document-uid600404labid3timestamp1532311534658.png/wm)

- 现在，换回到 shiyanlou 用户身份，使用以下命令变更文件所有者为 shiyanlou ： 

> ```shell
> # 需要切换到 shiyanlou 用户执行以下操作
> $ cd /home/lilei
> $ ls iphone6
> $ sudo chown shiyanlou iphone6
> 
> ```

- 现在查看，发现 文件所有者成功修改为 shiyanlou ： 

> ![](https://doc.shiyanlou.com/document-uid735639labid3timestamp1531731650844.png/wm)

### 修改文件权限

- 如果你有一个自己的文件不想被其他用户读、写、执行，那么就需要对文件的权限做修改，这里有两种方式：

  - 方式一：二进制数字表示

  > ![](https://doc.shiyanlou.com/linux_base/3-14.png/wm)

  - 每个文件的三组权限（拥有者，所属用户组，其他用户，**记住这个顺序是一定的**）对应一个 " rwx "，也就是一个 “ 7 ” ，所以如果我要将文件“ iphone6 ”的权限改为只有我自己可以用那么就这样：

    为了演示，我先在文件里加点内容：

  ```shell
  $ echo "echo \"hello shiyanlou\"" > iphone6
  
  ```

  然后修改权限：

  ```shell
  $ chmod 600 iphone6
  
  ```

  现在，其他用户已经不能读这个“ iphone6 ”文件了：

  > ![](https://doc.shiyanlou.com/document-uid735639labid3timestamp1531731724644.png/wm)

  - 方式二：加减赋值操作
  - 完成上述相同的效果，你可以：

  ```shell
  $ chmod go-rw iphone6
  
  ```

  ![](https://doc.shiyanlou.com/document-uid735639labid3timestamp1531731758217.png/wm)

  - `g`、`o` 还有 `u` 分别表示 group、others 和 user，`+` 和 `-` 分别表示增加和去掉相应的权限。 

- #### `adduser` 和 `useradd` 的区别是什么？

  - useradd 只创建用户，创建完了用 passwd lilei 去设置新用户的密码。adduser 会创建用户，创建目录，创建密码（提示你设置），做这一系列的操作。其实 useradd、userdel 这类操作更像是一种命令，执行完了就返回。而 adduser 更像是一种程序，需要你输入、确定等一系列操作。 

## 目录结构及文件基本操作 

- windows的目录重要性不高,因为主要的是磁盘,也就是C盘,D盘,但是linux就不同,对linux来说目录是最重要的.
- 其中大部分目录结构是规定好了的（FHS 标准），是死的，当你掌握后，你在里面的一切操作都会变得井然有序。 

### FHS标准

- FHS 定义了两层规范，第一层是， `/` 下面的各个目录应该要放什么文件数据，例如 `/etc` 应该放置设置文件，`/bin` 与 `/sbin` 则应该放置可执行文件等等。

  第二层则是针对 `/usr` 及 `/var` 这两个目录的子目录来定义。例如 `/var/log` 放置系统日志文件，`/usr/share` 放置共享数据等等。

> ![](https://doc.shiyanlou.com/linux_base/4-1.png/wm)

- 关于上面提到的 FHS，这里还有个很重要的内容你一定要明白，FHS 是根据以往无数 Linux 用户和开发者的经验总结出来的，并且会维持更新，FHS 依据文件系统使用的频繁与否以及是否允许用户随意改动（注意，不是不能，学习过程中，不要怕这些），将目录定义为**四种交互作用的形态**，如下表所示： 

> ![](https://doc.shiyanlou.com/document-uid18510labid59timestamp1482919171956.png/wm)

### 目录路径

- 使用 `cd` 命令可以切换目录，在 Linux 里面使用 `.` 表示当前目录，`..` 表示上一级目录（**注意，我们上一节介绍过的，以 `.` 开头的文件都是隐藏文件，所以这两个目录必然也是隐藏的，你可以使用 `ls -a` 命令查看隐藏文件**）, `-` 表示上一次所在目录，`～` 通常表示当前用户的 `home` 目录。使用 `pwd` 命令可以获取当前所在路径（绝对路径）。 
- 进入上一级目录

> ```shell
> $ cd ..
> 
> ```

- 进入你的home目录

> ```shell
> $ cd ~ 
> # 或者 cd /home/<你的用户名> 
> 
> ```

- 使用 `pwd` 获取当前路径： 

> ![](https://doc.shiyanlou.com/document-uid735639labid59timestamp1531733883613.png/wm)

- **绝对路径**

  - 关于绝对路径，简单地说就是以根" / "目录为起点的完整路径，以你所要到的目录为终点，表现形式如： `/usr/local/bin`，表示根目录下的 `usr` 目录中的 `local` 目录中的 `bin` 目录。 

- **相对路径**

  - 相对路径，也就是相对于你当前的目录的路径，相对路径是以当前目录 `.` 为起点，以你所要到的目录为终点，表现形式如： `usr/local/bin` （这里假设你当前目录为根目录）。你可能注意到，我们表示相对路径实际并没有加上表示当前目录的那个 `.` ，而是直接以目录名开头，因为这个 `usr` 目录为 `/` 目录下的子目录，是可以省略这个 `.` 的（以后会讲到一个类似不能省略的情况）；如果是当前目录的上一级目录，则需要使用 `..` ，比如你当前目录为 `/home/shiyanlou` 目录下，根目录就应该表示为 `../../` ，表示上一级目录（ `home` 目录）的上一级目录（ `/` 目录）。 

  > 意思就是,如果你要输入的目录,是当前你黑窗口所在目录的直接子目录,就可以直接以`usr/local/bin`的形式表达,但是如果你要输入的目录不是当前目录的子目录,那表达相对路径时就需要在前面添加../一直到最顶部的目录,相对目录就是省略了一部分,那这里就是把具体的目录名省略为抽象的../

- 下面我们以你的 `home`目录为起点，分别以绝对路径和相对路径的方式进入 `/usr/local/bin` 目录： 

> ```shell
> # 绝对路径
> $ cd /usr/local/bin
> # 相对路径
> $ cd ../../usr/local/bin
> 
> ```
>
> ![](https://doc.shiyanlou.com/document-uid735639labid59timestamp1531733900438.png/wm)

- 具体使用绝对路径还是相对路径,根据直觉判断哪个方便就用哪个.

### 新建

- 新建空白文件

  - 使用 `touch` 命令创建空白文件，关于 `touch` 命令，其**主要作用是来更改已有文件的时间戳**的（比如，最近访问时间，最近修改时间），但其在**不加任何参数**的情况下，**只指定一个文件名**，则**可以创建一个指定文件名的空白文件**（**不会覆盖已有同名文件**），当然你也可以同时指定该文件的时间戳 

- 新建目录

  - 使用 `mkdir`（make directories）命令可以创建一个空目录，也可同时指定创建目录的权限属性。 

  > ```shell
  > $ mkdir mydir
  > 
  > ```

  - 使用 `-p` 参数，同时创建父目录（如果不存在该父目录），如下我们同时创建一个多级目录（这在安装软件、配置安装路径时非常有用）： 

  > ```shell
  > $ mkdir -p father/son/grandson
  > 
  > ```
  >
  > ![](https://doc.shiyanlou.com/document-uid735639labid59timestamp1531733939312.png/wm)
  >
  > 后面的目录路径，以绝对路径的方式表示也是可以的。 

### 复制

- **复制文件**

  - 使用 `cp`（copy）命令复制一个文件到指定目录。
  - 将之前创建的“ test ”文件复制到“ /home/shiyanlou/father/son/grandson ”目录中：

  ```shell
  $ cp test father/son/grandson
  
  ```

  - 当然这样**只能复制当前目录下文件到指定文件夹**下.

- **复制目录**

  - 如果直接使用 `cp` 命令复制一个目录的话，会出现如下错误： 

  > ![](https://doc.shiyanlou.com/document-uid735639labid59timestamp1531733966731.png/wm)

  - 要成功复制目录需要加上 `-r` 或者 `-R` 参数，表示递归复制，就是说有点“株连九族”的意思： 

  > ```shell
  > $ cd /home/shiyanlou
  > $ mkdir family
  > $ cp -r father family
  > 
  > ```

### 删除

**删除文件**

- 使用 `rm`（remove files or directories）命令删除一个文件： 

> ```shell
> $ rm test
> 
> ```

- 有时候你会遇到想要删除一些为只读权限的文件，直接使用 `rm` 删除会显示一个提示，如下： 

> ![](https://doc.shiyanlou.com/document-uid735639labid59timestamp1531733991692.png/wm)

- 你如果想忽略这提示，直接删除文件，可以使用 `-f` 参数强制删除： 

> ```shell
> $ rm -f test
> 
> ```

**删除目录**

- 跟复制目录一样，要删除一个目录，也需要加上 `-r` 或 `-R` 参数： 

> ```shell
> $ rm -r family
> 
> ```

- 如果想**批量删除**可以使用**正则表达式**.

### 移动文件与文件重命名 

- **移动文件**

  - 使用 `mv`（move or rename files）命令移动文件（剪切）。将文件“ file1 ”移动到 `Documents` 目录：

    `mv 源目录文件 目的目录`：

    ```shell
    $ mkdir Documents
    $ touch file1
    $ mv file1 Documents
    
    ```

    ![](https://doc.shiyanlou.com/document-uid735639labid59timestamp1531734147663.png/wm)

- **重命名文件**

  - `mv 旧的文件名 新的文件名`：

    ```shell
    $ mv file1 myfile
    
    ```

- **批量重命名**

  - 要实现批量重命名，`mv` 命令就有点力不从心了，我们可以使用一个看起来更专业的命令 `rename` 来实现。不过它要用 perl 正则表达式来作为参数，关于正则表达式我们要在后面才会介绍到，这里只做演示，你只要记得这个 `rename` 命令可以批量重命名就好了，以后再重新学习也不会有任何问题，毕竟你已经掌握了一个更常用的 `mv` 命令。

  > ```shell
  > $ cd /home/shiyanlou/
  > 
  > # 使用通配符批量创建 5 个文件:
  > $ touch file{1..5}.txt
  > 
  > # 批量将这 5 个后缀为 .txt 的文本文件重命名为以 .c 为后缀的文件:
  > $ rename 's/\.txt/\.c/' *.txt
  > 
  > # 批量将这 5 个文件，文件名和后缀改为大写:
  > $ rename 'y/a-z/A-Z/' *.c
  > 
  > ```

### 查看文件

- 使用 cat，tac 和 nl 命令查看文件
- 前两个命令都是用来打印文件内容到标准输出（终端），其中 cat 为正序显示，tac 为倒序显示。
- 比如我们要查看之前从 `/etc` 目录下拷贝来的 `passwd` 文件： 

> ```shell
> $ cd /home/shiyanlou
> $ cp /etc/passwd passwd
> $ cat passwd
> 
> ```

- 可以加上 `-n` 参数显示行号： 

> ```shell
> $ cat -n passwd
> 
> ```

- `nl` 命令，添加行号并打印，这是个比 `cat -n` 更专业的行号打印命令。

  这里简单列举它的常用的几个参数：

> ```shell
> -b : 指定添加行号的方式，主要有两种：
>  -b a:表示无论是否为空行，同样列出行号("cat -n"就是这种方式)
>  -b t:只列出非空行的编号并列出（默认为这种方式）
> -n : 设置行号的样式，主要有三种：
>  -n ln:在行号字段最左端显示
>  -n rn:在行号字段最右边显示，且不加 0
>  -n rz:在行号字段最右边显示，且加 0
> -w : 行号字段占用的位数(默认为 6 位)
> 
> ```

- 你会发现使用这几个命令，默认的终端窗口大小，一屏显示不完文本的内容，得用鼠标拖动滚动条或者滑动滚轮才能继续往下翻页，要是可以直接使用键盘操作翻页就好了，那么你就可以使用下面要介绍的命令。 

- **使用 `more` 和 `less` 命令分页查看文件**

  - 如果说上面的 `cat` 是用来快速查看一个文件的内容的，那么这个 `more` 和 `less` 就是天生用来"阅读"一个文件的内容的，比如说 man 手册内部就是使用的 `less` 来显示内容。其中 `more` 命令比较简单，只能向一个方向滚动，而 `less` 为基于 `more` 和 `vi` （一个强大的编辑器，我们有单独的课程来让你学习）开发，功能更强大。`less` 的使用基本和 `more` 一致，具体使用请查看 man 手册，这里只介绍 `more` 命令的使用。

    使用 `more` 命令打开 `passwd` 文件：

  > ```shell
  > $ more passwd
  > 
  > ```
  >
  > 打开后默认只显示一屏内容，终端底部显示当前阅读的进度。可以使用 `Enter` 键向下滚动一行，使用 `Space` 键向下滚动一屏，按下 `h` 显示帮助，`q` 退出。 

- **使用 head 和 tail 命令查看文件**

  - 只查看文件的头几行（默认为 10 行，不足 10 行则显示全部）和尾几行。 

  > ```shell
  > $ tail /etc/passwd
  > 
  > ```
  >
  > 甚至更直接的只看一行， 加上 `-n` 参数，后面紧跟行数： 
  >
  > ```shell
  > $ tail -n 1 /etc/passwd
  > 
  > ```

### 查看文件类型

- 在 Linux 中文件的类型不是根据文件后缀来判断的，我们通常使用 `file` 命令查看文件的类型：

  ```shell
  $ file /bin/ls
  
  ```

> ![](https://doc.shiyanlou.com/document-uid735639labid59timestamp1531734243413.png/wm)

- 说明这是一个可执行文件，运行在 64 位平台，并使用了动态链接文件（共享库）。 