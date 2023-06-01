# Redis笔记

## 安装

- 环境是在阿里云计算型c7,centos7.9版本服务器上

- 我选择使用docker安装

- [安装教程](https://blog.csdn.net/weixin_40461281/article/details/111291847)

- 简略说一下就是

- 首先创建好文件夹,在服务器上创建redis文件夹,其中再创建data,conf两个文件夹

- 写好配置文件直接上传到conf文件夹里

  ```shell
  # 修改连接为所有ip
  bind 0.0.0.0
  # 允许外网访问
  protected-mode yes
  port 6379
  timeout 0
  # RDB存储配置
  save 900 1
  save 300 10
  save 60 10000
  rdbcompression yes
  dbfilename dump.rdb
  # 数据存放位置
  dir /data
  # 开启aof配置
  appendonly yes
  appendfsync everysec
  appendfilename "appendonly.aof"
  # 设置密码
  requirepass shineray9527
  ```

- 写好docker-compose配置文件

  ```yml
    redis6.0-test:
      # 镜像名
      image: redis:6.2.6
      # 容器名
      container_name: redis6.0-test
      # 重启策略
      restart: always
      # 权限
      privileged: true
      # 端口映射
      ports:
        - "6379:6379"
      environment:
        # 设置环境变量 时区上海 编码UTF-8
        TZ: Asia/Shanghai
        LANG: en_US.UTF-8
      command: ["redis-server","/redis.conf"]
      volumes:
        # 配置文件
        - /root/software/redis6.0-test/conf/redis.conf:/redis.conf:rw
        # 数据文件
        - /root/software/redis6.0-test/data:/data:rw
  ```

- 然后服务器中cd到具体的docker-compose配置文件目录

- 运行`docker-compose --compatibility up`,如果文件重命名了就执行`docker-compose -f 配置文件名.yml --compatibility up`

- 之后不要忘了去阿里云安全组里配置**开启对应的端口**

- 要记得在服务器上创建的文件夹,以及配置文件的权限都要设置到最大,不然会出现一些无法存储的错误(不一定)

- 一定要添加`command: ["redis-server","/redis.conf"]`这一行,才会让redis认定我们自己设置的配置文件,不然你**配置文件里设置的一切包括密码都不起作用**

- 一定不要把服务器的6379作为redis的端口号还不设置密码,这样会导致别人黑进来

- 一旦报错` WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect`,则修改yml配置为`command: sh -c "apt-get update && apt-get install -y procps && sysctl vm.overcommit_memory=1 && redis-server /redis.conf"`

> 这个日志的意思是，你的Linux系统的内存分配策略是overcommit_memory=0，这表示系统会检查是否有足够的可用内存供应用进程使用，如果没有，就会拒绝分配内存，可能导致进程异常。Redis在后台保存数据时，需要创建一个子进程来执行fork操作，这时候如果系统内存不足，就会出现失败的情况
>
> 你可以通过以下方法来解决这个问题：
>
> - 修改/etc/sysctl.conf文件，添加一行vm.overcommit_memory = 1，然后重启系统或者执行命令sysctl vm.overcommit_memory=1来使设置生效。这样可以让系统内存分配策略变为overcommit_memory=1，表示系统不检查内存是否足够，永远允许分配内存，不管当前的内存状态如何。这样可以避免Redis后台保存失败的问题，但是也会增加OOM killer出现的可能，当系统内存真的不足时，可能会杀死一些进程来释放内存。
> - 另一种方法是修改/etc/sysctl.conf文件，添加一行vm.overcommit_ratio = 80（可以根据你的系统内存使用情况适当调整），然后重启系统或者执行命令sysctl vm.overcommit_ratio=80来使设置生效。这样可以让系统内存分配策略变为overcommit_memory=2，表示系统允许分配的内存超过物理内存和swap的总和的百分比由overcommit_ratio决定。这样可以让系统更合理地分配内存，避免过度分配也避免无法分配。
>
> - 对于overcommit_memory的警告，你可以在docker-compose文件中添加privileged选项，来让容器拥有更多的权限。然后，你可以在容器启动时执行命令sysctl vm.overcommit_memory=1来设置内存分配策略。比如：
>
> ```yml
> redis:
>   image: redis:alpine
>   privileged: true
>   command: sh -c "sysctl vm.overcommit_memory=1 && redis-server"
> ```
>
> 但是我这样做重启之后再看redis日志,还是一样的报错,可能的原因是，你使用docker-compose restart命令重启了redis，但是这个命令并不会重新加载docker-compose.yml配置文件，所以你的sysctl命令没有生效。你可以尝试使用**docker-compose down**和**docker-compose up -d**命令来停止并重新启动你的容器，这样就可以应用你的配置文件的变化
>
> 结果我这样做了,确实重启了,但是会报错:sysctl: not found sh
>
> - 可能的原因是，你的redis容器中没有sysctl命令，或者sysctl命令无法正常执行。你可以尝试以下方法来解决这个问题：
>
> - 检查你的redis容器中是否有sysctl命令，你可以使用docker exec -it redis sh命令进入容器的shell，然后使用which sysctl或者type sysctl来查看sysctl命令的位置和类型。如果没有找到sysctl命令，你可能需要安装procps包来提供sysctl命令。你可以使用apt-get update && apt-get install -y procps命令来安装procps包，或者在你的Dockerfile中添加这个命令。
>
> 我进入到容器中,结果:# which sysctl # type sysctl sysctl: not found 我想在docker-compose.yml中通过配置解决这个问题
>
> - 如果你想在docker-compose.yml中通过配置解决这个问题，你可以尝试以下方法：
>   - 在你的Dockerfile中添加一行RUN apt-get update && apt-get install -y procps，来安装procps包，然后重新构建你的redis镜像。这样就可以在容器中提供sysctl命令。
>   - 在你的docker-compose.yml文件中添加一行command: sh -c “apt-get update && apt-get install -y procps && sysctl vm.overcommit_memory=1 && redis-server”，来在容器启动时安装procps包并执行sysctl命令。这样就可以避免修改Dockerfile和重新构建镜像。
>
> 经过尝试这样确实可以了,但是要小心踩坑,因为new bing给出的答案里,引号不是英文符号,需要修改,并且我们需要指定配置文件,所以需要加上 `/redis.conf`,所以最终的配置是这样的**`command: sh -c "apt-get update && apt-get install -y procps && sysctl vm.overcommit_memory=1 && redis-server /redis.conf"`**



