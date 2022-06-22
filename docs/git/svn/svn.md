# svn

## 搭建

- 首先需要在服务器上安装docker,以及docker-compose

- 然后从[教程](https://blog.51cto.com/u_1472521/3797613)中学习如何使用docker-compose去安装svn远程服务

- 首先创建docker-compose配置文件

  ```yml
  version: '3.7'
  services:
    svn-server:
      image: elleflorio/svn-server:latest
      container_name: svn-server
      restart: always
      volumes:
        - ./svn:/home/svn
      environment:
        TZ: Asia/Shanghai
      ports:
        - 3690:3690
        - 13690:80
  ```

- 在服务器上进入配置文件放置的目录,执行`docker-compose up -d`

- 创建管理员账户

  ```shell
  docker exec -t svn-server htpasswd -b /etc/subversion/passwd 用户名 密码
  ```

- 浏览器打开地址`http://ip:端口号/svn/ `会提示输入账号密码，这里输入命令实验设定的账号密码验证是否正确。

> 所有的端口号都是上面的配置文件中映射容器内80端口的端口号,这里是13690,因为这是http的访问端口

- 给映射到linux上的文件夹添加读写权限:`chmod -R 777 映射到linux上的文件夹地址,类似/opt/soft/svn`
- 浏览器打开：` http://ip:端口号/svnadmin `，第一次进入会进行后台的配置管理，具体配置截图如下
- ![](https://s8.51cto.com/images/blog/202109/07/ccda17147821166b23035c7514dc9337.png?x-oss-process=image/watermark,size_16,text_QDUxQ1RP5Y2a5a6i,color_FFFFFF,t_30,g_se,x_10,y_10,shadow_20,type_ZmFuZ3poZW5naGVpdGk=)
- 以后你都可以直接访问 `http://ip:端口号/svnadmin/`进行操作了（仓库创建、用户创建、用户权限分配等）。

## 访问

- 创建好的仓库记得去分配权限
- 但是除了分配权限外更重要的是仓库地址格式为:`http://IP:端口号/svn/仓库名`,例子为`http://192.168.7.131:13690/svn/remote-link-test/`,在IDEA的SVN插件中或者在`TortoiseSVN`软件中与外部仓库相连时就填这个格式的仓库地址才可以