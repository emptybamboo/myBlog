# Mysql安装

- 环境是在阿里云计算型c7,centos7.9版本服务器上

- 我选择使用docker安装

- [安装教程](https://blog.csdn.net/weixin_40461281/article/details/111246938)

- 简略说一下就是

- 首先创建好文件夹,在服务器上创建mysql文件夹,其中再创建data,conf两个文件夹

- 写好docker-compose配置文件

  ```yml
  mysql8.0:
      # 镜像名
      image: mysql:8.0.21
      # 容器名(以后的控制都通过这个)
      container_name: mysql8.0
      # 重启策略
      restart: always
      environment:
        # 时区上海
        TZ: Asia/Shanghai
        # root 密码
        MYSQL_ROOT_PASSWORD: shineray9527
        # 初始化用户(不能是root 会报错, 后续需要给新用户赋予权限)
        MYSQL_USER: shineray
        # 用户密码
        MYSQL_PASSWORD: shineray9527
        # 映射端口
      ports:
        - "3306:3306"
      volumes:
        # 数据挂载
        - /root/software/mysql/data/:/var/lib/mysql/
        # 配置挂载
        - /root/software/mysql/conf/:/etc/mysql/conf.d/
      command:
        # 将mysql8.0默认密码策略 修改为 原先 策略 (mysql8.0对其默认策略做了更改 会导致密码无法匹配)
        --default-authentication-plugin=mysql_native_password
        --character-set-server=utf8mb4
        --collation-server=utf8mb4_general_ci
        --explicit_defaults_for_timestamp=true
        --lower_case_table_names=1
  ```

- 然后服务器中cd到具体的docker-compose配置文件目录

- 运行`docker-compose --compatibility up`,如果文件重命名了就执行`docker-compose -f 配置文件名.yml --compatibility up`

- 启动之后 看到日志 Mysql Connumity Server - GPL 代表初始化成功

- 之后不要忘了去阿里云安全组里配置**开启对应的端口**

- 如果一旦第一次用docker-compose安装成功了,你又想再次修改yml配置文件,尤其是**修改里面的root用户密码**,这时会发现**不生效**,密码还是你第一次构建容器时设置的root用户密码

- 这是因为之前映射的目录里面的文件啊配置什么的都持久化了,存在本地了,如果映射目录不变,默认密码是按之前设置的来了,所以就把之前**映射目录里的所有配置和数据都删掉再次执行构建容器**就可以是新的密码了

- 如果想把mysql内部存在数据的文件夹映射到外部,是会失败的,因为外部为空,反倒会把外部的空映射到容器内部,使容器缺少该有的文件

- 解决方法就是,首先不在yml中写目录映射,直接启动,进入容器内部把你想映射的目录或文件通过命令复制到宿主机,然后删掉容器,这时候再在yml中把复制出来的文件/文件夹映射到容器内部就可以了

- 运行日志出现IP address '156.96.155.240' could not be resolved: Temporary failure in name resolution的时候,进入mysql容器,安装vim,修改/ect/mysql/my.cnf文件 在最后追加skip-host-cache和skip-name-resolve,也就是`echo -e "skip-host-cache skip-name-resolve" >> my.cnf`,然后重启容器即可