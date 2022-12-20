# docker-compose

- 方便统一管理docker镜像与容器,一个配置文件可以配置一组docker容器
- 并且可以把Dockerfile以及docker run命令跟着的一些容器配置/镜像配置统统写进配置文件中,一目了然又便于管理

## Dockerfile对应yml配置文件的配置

### RUN

- Dockerfile中的RUN配置,对应yml中的**command**配置

  ```dockerfile
  #为了保证容器时区和系统时区相同，需要挂载docker的/etc/localtime到系统的/etc/localtime。
  RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
  #JVM是通过/etc/timezone文件获取时区的，需要在容器中映射或者写入时区文件。
  RUN echo "Asia/Shanghai" > /etc/timezone
  ```

  ```yml
  command: 
        - /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
        - echo "Asia/Shanghai" > /etc/timezone
  ```

### ENTRYPOINT

- Dockerfile中的ENTRYPOINT配置,对应yml中的**entrypoint**配置

  ```dockerfile
  ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/data/app.jar"]
  ```

  ```yml
  entrypoint: 
        - "java"
        - "-Djava.security.egd=file:/dev/./urandom"
        - "-jar"
        - "/data/package/app.jar"
  ```

### FROM

- Dockerfile中的FROM配置,对应yml中的**image**配置

- 表示使用的镜像,要么是远程dockerhub中的,要么是本地的

  ```dockerfile
  FROM openjdk:11-jre-slim-buster
  ```

  ```yml
  image: esystemstech/libreoffice:6.1-openjdk-11-jdk-buster-slim
  ```

## docker run 命令后跟的配置对应yml配置文件的配置

### -p

- docker run命令行中的-p命令,对应yml中的**ports**配置

- 功能为映射容器内外端口号,**前方为容器外端口,后方为容器内端口**

  ```shell
  -p 8012:8082
  ```

  ```yml
  ports:
        - "8012:8082"
  ```

### -v

- docker run命令行中的-v命令,对应yml中的**volumes**配置

- 功能为映射容器内外目录,**前方为容器外目录,后方为容器内目录**,可以用这种方法把容器内的**日志/配置文件**同步到容器外目录中便于访问,也可以把容器外**jar包/配置文件**同步到容器内使用哦

  ```shell
  -v /root/shineray/financial-leasing/manage/package:/data
  ```

  ```yml
  volumes:
  	- /D/software/develop/docker-dir/financial-leasing/manage/package:/data/package
  	- /D/software/develop/docker-dir/financial-leasing/manage/cert:/data/cert
  	- /D/software/develop/docker-dir/financial-leasing/manage/pdf:/data/pdf
  ```

### --name

- docker run命令行中的--name命令,对应yml中的**container_name**配置

  ```shell
  --name financial-leasing-manage
  ```

  ```yml
  container_name: financial-leasing-manage-pdf
  ```

## 命令

### 重启

- **docker-compose的重启和docker不一样**,它的重启是重启service名,`docker-compose restart service名`

- 也就是配置文件中`services:`下的一级名称,比如web,这个名称也是我们自己自定义的,一个service下可以有多个容器配置

  ```yml
  services:
    web:
      image: esystemstech/libreoffice:6.1-openjdk-11-jdk-buster-slim
      container_name: financial-leasing-manage-pdf
  ```

## 安装

### docker-compose

- windows系统安装docker桌面版是直接自带docker-compose的,但是linux必须自己去安装

- 一般服务器都是centos,我们的服务器是centos8版本

- 网上搜到的教程是先去`https://github.com/docker/compose/releases/latest`查看最新版本的版本号

- 然后执行命令安装,如果访问github下载太慢就把链接中的`https://github.com`更换为`https://get.daocloud.io`

  ```shell
  # 下载最新版本的 docker-compose 到 /usr/bin 目录下,自行修改1.23.2为最新版本号,注意如果版本有v前缀要加上
  curl -L https://github.com/docker/compose/releases/download/1.23.2/docker-compose-`uname -s`-`uname -m` -o /usr/bin/docker-compose
  
  # 给 docker-compose 授权
  chmod +x /usr/bin/docker-compose
  ```

- 但是这样我失败了,使用对应命令行会报`/usr/bin/docker-compose: line 1: Not: command not found`

- 于是经过询问群内大佬得知,需要放到`/usr/bin`目录下而不是`/usr/local/bin`

  ```shell
  [root@server01 docker]# sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.1/docker-compose-linux-x86_64" -o /usr/bin/docker-compose
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
  Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
  100 24.5M  100 24.5M    0     0  4191k      0  0:00:05  0:00:05 --:--:-- 5418k
  [root@server01 docker]# sudo chmod +x /usr/bin/docker-compose
  [root@server01 docker]# docker-compose version
  Docker Compose version v2.6.1
  ```

### docker

- 服务器是买的阿里云计算型c7,centos7.9版本

- [使用官方脚本自动安装](https://www.runoob.com/docker/centos-docker-install.html)

  ```shell
  curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
  ```

- 然后安装一切正常,但是如果运行`docker --version`会报错`Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`

- 这是因为[安装完没在系统中启动](https://blog.csdn.net/weixin_45496075/article/details/109123709),只需要运行`systemctl start docker`即可

## 命令

```shell
# 默认使用docker-compose.yml构建镜像
$ docker-compose build
$ docker-compose build --no-cache # 不带缓存的构建

# 指定不同yml文件模板用于构建镜像
$ docker-compose build -f docker-compose1.yml

# 列出Compose文件构建的镜像
$ docker-compose images            	              

# 启动所有编排容器服务
$ docker-compose up -d

# 查看正在运行中的容器
$ docker-compose ps 

# 查看所有编排容器，包括已停止的容器
$ docker-compose ps -a

# 进入指定容器执行命令
$ docker-compose exec nginx bash 
$ docker-compose exec web python manage.py migrate --noinput

# 查看web容器的实时日志
$ docker-compose logs -f web

# 停止所有up命令启动的容器
$ docker-compose down 

# 停止所有up命令启动的容器,并移除数据卷
$ docker-compose down -v

# 重新启动停止服务的容器
$ docker-compose restart web

# 暂停web容器
$ docker-compose pause web

# 恢复web容器
$ docker-compose unpause web

# 删除web容器，删除前必需停止stop web容器服务
$ docker-compose rm web  

# 查看各个服务容器内运行的进程 
$ docker-compose top                            
```