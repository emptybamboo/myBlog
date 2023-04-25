# nginx部署

- 首先当然是服务器上安装docker和docker-compose

- 然后去[nginx官网](http://nginx.org/en/download.html)找到你想安装的版本,下载,找到它的配置文件

  ```ini
  
  #user  nobody;
  worker_processes  1;
  
  #error_log  logs/error.log;
  #error_log  logs/error.log  notice;
  #error_log  logs/error.log  info;
  
  #pid        logs/nginx.pid;
  
  
  events {
      worker_connections  1024;
  }
  
  
  http {
      include       mime.types;
      default_type  application/octet-stream;
  
  
      #access_log  logs/access.log  main;
  
      sendfile        on;
      #tcp_nopush     on;
  
      #keepalive_timeout  0;
      keepalive_timeout  300;
  
      #gzip  on;
  
      server {
          listen       80;
          server_name  localhost;
  
  
          location / {
              root   /usr/share/nginx/html;
              #匹配不到资源路径的时候，先去读取index.html，然后再路由
              try_files $uri $uri/ /index.html last;
              index  index.html index.htm;
          }
  
  
          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   html;
          }
  
      }
  
  
      # HTTPS server
      #
      #server {
      #    listen       443 ssl;
      #    server_name  localhost;
  
      #    ssl_certificate      cert.pem;
      #    ssl_certificate_key  cert.key;
  
      #    ssl_session_cache    shared:SSL:1m;
      #    ssl_session_timeout  5m;
  
      #    ssl_ciphers  HIGH:!aNULL:!MD5;
      #    ssl_prefer_server_ciphers  on;
  
      #    location / {
      #        root   html;
      #        index  index.html index.htm;
      #    }
      #}
  
  }
  
  ```

  

- 构件好docker-compose.yml配置文件,注意这里的版本和你下载的nginx配置文件版本要一致

  ```yml
  # yaml 配置实例
  version: '3.7'
  services:
    my-nginx-test:
      image: nginx:1.23.4 # 自定义镜像名:tag名
      container_name: my-nginx-test # 容器名
      ports:
        - "80:80"
      restart: always
      volumes: # 这里的./意味着映射的目录是当前yml配置文件的上级目录下的目录
        - ./html:/usr/share/nginx/html
        - ./conf/nginx.conf:/etc/nginx/nginx.conf
        - ./conf.d:/etc/nginx/conf.d
        - ./logs:/var/log/nginx
  
  ```

- 然后在服务器上建四个目录,其实还应该多建一个放SSL证书的映射目录

  - /docker-compose/nginx；并将自定义的docker-compose.yml复制到当前文件夹下
  - /docker-compose/nginx/conf；并将自定义的nginx.conf复制到当前文件夹下
  - /docker-compose/nginx/conf.d
  - /docker-compose/nginx/html

- 然后直接执行`docker-compose up -d`

- 如果修改了nginx的配置文件就执行`docker-compose up -d --force-recreate`

- 如果修改了docker-compose.yml就执行`docker-compose up --build -d`

## 部署多套前端项目到同一个docker中的nginx

- 大概看了下教程,其实很简单

- 要部署多套前端就需要多个存放dist文件的目录,这个目录可以分开创建然后分别映射到docker内部,也可以映射一个目录进去然后在这个目录里再建多个目录存放不同项目

- 比如我创建一个`/root/lzc/software/nginx/app1`和`/root/lzc/software/nginx/app2`目录,并且映射到docker内部

  ```yml
  volumes: # 这里的./意味着映射的目录是当前yml配置文件的上级目录下的目录
        - /root/lzc/software/nginx/app1:/usr/share/nginx/html/app1
        - /root/lzc/software/nginx/app2:/usr/share/nginx/html/app2
  ```

- 然后修改nginx的配置文件,nginx.conf

  ```ini
  #基础的单个前端项目时候,nginx的server配置块下,是这么写的
  location / {
  root   /usr/share/nginx/html;
  #匹配不到资源路径的时候，先去读取index.html，然后再路由
  try_files $uri $uri/ /index.html last;
  index  index.html index.htm;
  }
  
  #修改之后就在server下分多个写,不同之处就是location后面的目录由/变为了/不同前端项目静态文件存储目录比如/app1
  location /dist1 {
  # 网站根目录，此处使用容器内的路径
  root /usr/share/nginx/html;
  # 默认首页
  index index.html;
  # 尝试从磁盘找到请求的文件，如果不存在则跳转到 index.html
  try_files $uri $uri/ /dist1/index.html;
  }
  location /dist2 {
  # 网站根目录，此处使用容器内的路径
  root /usr/share/nginx/html;
  # 默认首页
  index index.html;
  # 尝试从磁盘找到请求的文件，如果不存在则跳转到 index.html
  try_files $uri $uri/ /dist2/index.html;
  }
  ```

- 如果是映射一个`/root/lzc/software/nginx/html`目录进去,然后在宿主机的这个目录下再建app1和app2两个目录也可以,修改配置文件基本是一样的操作,唯一的区别就是docker-compose.yml写的稍微有点区别

  ```yml
  volumes: # 这里的./意味着映射的目录是当前yml配置文件的上级目录下的目录
  	- /root/lzc/software/nginx/html:/usr/share/nginx/html
  ```

- 经过我实践之后,我发现应该改成下面这样

- root代表你定义的根目录,而你写的location指的是访问你服务器地址的后缀,本身访问你服务器地址就是`http:://+你的ip`,类似`http://127.0.0.1`,现在你配置了location,别人访问就得是`http:://+你的ip+/location定义的值`,类似`http://127.0.0.1/manage`

- 然后如果你写了try_files这行,你应该在这里添加你写好的/location,而不是加在你配置的location下面的root后面

- root就像是你公司大楼,location就是你的具体工位,如果你把root改成你的具体工位,那找你的人看到你的地址就会是工位重复两次

- 其他的都和预想的一样,先去之前映射进nginx容器的文件夹的html文件夹下创建不同前端项目的新目录,然后放文件进去,修改了nginx配置文件的话就docker重启一下即可,就可以正常访问前端页面,前提是前端项目配置不出问题

- ```ini
  #现在分为两个前端项目
  #后台
  location /manage {
  root   /usr/share/nginx/html;
  #匹配不到资源路径的时候，先去读取index.html，然后再路由
  try_files $uri $uri/ /manage/index.html last;
  index  index.html index.htm;
  }
  #客户端
  location /customer {
  root   /usr/share/nginx/html;
  #匹配不到资源路径的时候，先去读取index.html，然后再路由
  try_files $uri $uri/ /customer/index.html last;
  index  index.html index.htm;
  }
  ```

  

## 扩展为HTTPS项目

- 需要在宿主机的nginx目录下再创建一个certs文件夹(起名随意),然后映射到docker内部的`/etc/nginx/certs`目录

- 修改nginx.conf文件，将listen 80改为listen 443 ssl，并添加以下两行，指定证书文件的路径：

  ```ini
  ssl_certificate /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;
  ```

- [重新启动docker-compose](https://cloud.tencent.com/developer/article/1665969)

- ```bash
  docker-compose down
  docker-compose up -d
  ```

- 访问 https://localhost/dist1 或者 https://localhost/dist2 来访问部署的前端项目。

## 十万个为什么

- nginx的配置文件中,root写在server下和写在location下各自代表什么含义,有什么区别

  - 根据我从网络上搜索到的信息，nginx的root配置可以写在server或location下，它们的区别主要在于nginx如何解释location后面的uri，这会使两者分别以不同的方式将请求映射到服务器文件上

  - 一般来说，root写在server下表示为该server指定一个默认的根路径，所有的location都会继承这个路径，除非在location下重新定义root。而root写在location下表示为该location指定一个特定的根路径，这个路径会与location后面的uri拼接起来形成完整的文件路径

  - 举个例子，假设有如下配置：

    ```nginx
    server {
        root /data/www;
        location / {
            root /data/html;
        }
    }
    ```
  
  - 那么当访问`http://example.com/index.html`时，nginx会去寻找`/data/html/index.html`这个文件。而当访问`http://example.com/img/logo.png`时，nginx会去寻找`/data/www/img/logo.png`这个文件。可以看出，root写在location / 下会覆盖server下的root设置
  
- proxy_pass处做反向代理有什么意义

  - 你提到的proxy_pass处做反向代理有什么意义，我可以给你一些解释。反向代理的意义有以下几点：
    - 可以隐藏后端服务器的真实地址，提高安全性和可靠性。
    - 可以实现负载均衡，根据不同的策略将请求分发给不同的后端服务器，提高性能和可用性。
    - 可以实现缓存和压缩，将后端服务器返回的响应缓存到本地文件或内存中，或者对响应进行压缩，减少网络传输量和延迟。
    - 可以实现动静分离，将静态资源和动态资源分别交给不同的服务器处理，提高效率和稳定性。
  
- nginx中的proxy_pass反向代理的配置规则具体是如何的

  - nginx中的proxy_pass反向代理的配置规则具体是如何的，我可以给你一些例子说明。proxy_pass指令用于设置后端代理服务器的地址和协议，还可以附加可选的URI映射。proxy_pass的配置规则主要取决于location和URL是否以/结尾：

    - 如果location和URL都不以/结尾，那么nginx会将location匹配的部分保留在代理URI中。例如：

    ```nginx
    location /api {
      proxy_pass http://127.0.0.1:8080;
    }
    ```

    如果访问`/api/user`，那么后端的URI为`http://127.0.0.1:8080/api/user`。

    - 如果location不以/结尾，但URL以/结尾，那么nginx会将location匹配的部分替换为URL中的/。例如：

    ```nginx
    location /api {
      proxy_pass http://127.0.0.1:8080/;
    }
    ```

    如果访问`/api/user`，那么后端的URI为`http://127.0.0.1:8080/user`。

    - 如果location以/结尾，但URL不以/结尾，那么nginx会将location匹配的部分加上URL中的路径作为代理URI。例如：

    ```nginx
    location /api/ {
      proxy_pass http://127.0.0.1:8080/v1;
    }
    ```

    如果访问`/api/user`，那么后端的URI为`http://127.0.0.1:8080/v1/user`。

    - 如果location和URL都以/结尾，那么nginx会将location匹配的部分加上URL中的路径作为代理URI。例如：

    ```nginx
    location /api/ {
      proxy_pass http://127.0.0.1:8080/v1/;
    }
    ```

    如果访问`/api/user`，那么后端的URI为`http://127.0.0.1:8080/v1/user`。

- 后端springboot模块开发,前端vue2开发,在配置nginx上,前端和后端需要怎样配合
  - 后端springboot模块开发，前端vue2开发，在配置nginx上，前端和后端需要怎样配合，我可以给你一些建议。一般来说，前端和后端需要遵循以下原则：
    - 前端需要将vue项目打包成静态资源文件，放在nginx的html目录下，或者其他指定的目录下。
    - 后端需要将springboot项目打包成jar文件，放在服务器上，并运行在指定的端口上。
    - nginx需要配置反向代理，将不同的请求路径代理到不同的后端服务器上，或者同一个后端服务器的不同端口上。
    - nginx还需要配置跨域访问，允许前端请求后端的接口，或者使用CORS机制在后端设置响应头。
    - nginx还可以配置负载均衡，缓存，压缩等功能，提高性能和可用性。
  
  - 具体分别举一些实例
  
    - 具体分别举一些实例，我可以给你一些参考。反向代理和跨域访问的实例有以下几种：
  
      - 反向代理的实例：假设有一个前端项目运行在nginx的80端口，需要访问后端的8080端口，可以在nginx的配置文件中添加如下的location块：
  
      ```nginx
      location /api/ {
        proxy_pass http://127.0.0.1:8080/;
      }
      ```
  
      这样，当前端请求`/api/user`时，nginx会将请求代理到`http://127.0.0.1:8080/user`，从而实现反向代理。
  
      - 跨域访问的实例：假设有一个前端项目运行在nginx的80端口，需要访问另一个域名的后端接口，可以在nginx的配置文件中添加如下的location块：
  
      ```nginx
      location /api/ {
        proxy_pass http://other.com/api/;
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
        add_header Access-Control-Allow-Headers Content-Type;
      }
      ```
  
      这样，当前端请求`/api/user`时，nginx会将请求代理到`http://other.com/api/user`，并在响应头中添加跨域访问的相关信息，从而实现跨域访问。