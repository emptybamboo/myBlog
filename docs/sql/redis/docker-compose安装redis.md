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
  protected-mode no
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
  requirepass 123456
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