# `Nginx`笔记

## 使用

### 更新

- 更新了nginx的配置之后,需要运行`/usr/local/nginx/sbin/nginx -t`命令检查,前面的目录是具体nginx的安装目录
- 最后运行`/usr/local/nginx/sbin/nginx -s reload`命令重启,前面的目录是具体nginx的安装目录
- 如果执行过程报错就需要去检查nginx的配置文件内容对应哪里有问题

## 前后端分离

### 项目部署

- 真正在正式服务器中部署项目时,使用nginx

- 同时要配置项目对应域名,而不是使用ip+端口号访问

- 同时启用https,SSL证书加密

  ```nginx
  server {
      listen 80;
      server_name 购买的具体域名; #需要将yourdomain.com替换成证书绑定的域名。
      rewrite ^(.*)$ https://$host$1; #将所有HTTP请求通过rewrite指令重定向到HTTPS。
      location / {
          index index.html index.htm;
      }
      location @router{
          rewrite ^.*$ /index.html last;
      }
  }
  
  server {
      listen       443 ssl;
      server_name  购买的具体域名;
      root html;
      index index.html index.htm;
      ssl_certificate SSL证书pem文件在服务器上的绝对路径;#比如/root/nginx-cert/financial-leasing-manage-prod/suxiang/7766933_e-sign.suxiangkj.com.pem
      ssl_certificate_key SSL证书key文件在服务器上的绝对路径;#比如/root/nginx-cert/financial-leasing-manage-prod/suxiang/7766933_e-sign.suxiangkj.com.key
      ssl_session_timeout 5m;
      ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
      #表示使用的加密套件的类型。
      ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3; #表示使用的TLS协议的类型。
      ssl_prefer_server_ciphers on;
  
      proxy_buffering on;
      proxy_buffer_size 1024k;
      proxy_buffers 16 1024k;
      proxy_busy_buffers_size 2048k;
      proxy_temp_file_write_size 2048k;
      location / {
          root /usr/local/nginx/html/rzzl-prod/manage/;  #站点目录。
          index index.html index.htm;
          try_files $uri $uri/ @router;
          rewrite ^/(datasta)/(.+)$ /$1/ last;
      }
      location /manage/ {
          proxy_pass http://47.108.xxx.xxx:xxxx; #一套接口对应的服务器IP+端口号
      }
      location /xyzl/ {
          alias /usr/local/nginx/html/rzzl-prod/manage/;#前端打包文件存放的位置
          index index.html;
      }
      location @router{
          rewrite ^.*$ /index.html last;
      }
  }
  ```

### 测试服务器无域名部署多项目

- 由于是测试服,自然是不太会使用域名来配置nginx的,所以访问前端项目直接就使用nginx配置在服务器IP上

- 由于是多个项目,所以nginx的html文件夹下就要有多个文件夹来存放不同的前端项目的静态文件,比如`/root/software/nginx/html/manage`存放管理后台的前端文件,`/root/software/nginx/html/customer`存放客户端的前端文件

- nginx配置好的访问路径默认就是http+服务器ip地址,比如`http://192.168.24.128/`,由于一个服务器要部署多个项目,就使用IP+不同的尾缀来访问不同项目,比如`http://192.168.24.128/manage`就是访问管理后台,`http://192.168.24.128/customer`就是访问客户端

  ```ini
  server {
          listen       80;
          server_name  localhost;
  
          #charset koi8-r;
  
          #access_log  logs/host.access.log  main;
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
  
          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   html;
          }
      }
  ```

  

### 正式云服务器各自有域名部署多项目

#### 同一个配置文件,html下不同文件夹存放前端项目

- 这里和测试服没有域名还使用http访问网页就有很大区别了

- 首先就是配置,之前没有域名只能通过http/ip/xxx来区分不同的项目在同一个测试服务器上的前端静态文件,比如最后是/manage就是后台管理的主页,最后是/customer就是客户端主页

- 这样的话nginx的配置也不同,不能再配置location /根目录的访问,必须根据域名最后的尾缀来配置比如location /manage

- 同时如果使用云服务器,基本上一定是要使用https配合域名的,前端请求后端接口就不能是简单的http+ip+端口号+接口名,因为https配置好的域名,是不可以发http的请求的,并且直接请求云服务器的ip+端口,在浏览器控制台可以看到,就暴露出去了,安全性也存在问题

- 所以就需要前端配置访问接口地址为一个自定义路由地址,然后在nginx中配置方向代理,把前端请求接口的地址代理转发到后端的接口,这时就可以是http+ip+端口号了

  ```ini
  server {
                          listen 80;
                          server_name shineray-glo-dashboard-pre.suxiangkj.com; #需要将yourdomain.com替换成证书绑定的域名。
                          rewrite ^(.*)$ https://$host$1; #将所有HTTP请求通过rewrite指令重定向到HTTPS。
                          location / {
                              index index.html index.htm;
                          }
                          location @router{
                             rewrite ^.*$ /index.html last;
                          }
                          error_page   500 502 503 504  /50x.html;
                          location = /50x.html {
                              root   html;
                          }
                      }
                      server {
                          listen       443 ssl;
                          server_name  shineray-glo-dashboard-pre.suxiangkj.com;
                  		root /usr/share/nginx/html/manage-preview;
                  		index index.html index.htm;
                          ssl_certificate /etc/nginx/cert/overseas-preview/9915277_shineray-glo-dashboard-pre.suxiangkj.com.pem;
                          ssl_certificate_key /etc/nginx/cert/overseas-preview/9915277_shineray-glo-dashboard-pre.suxiangkj.com.key;
                          ssl_session_timeout 5m;
                          ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
                          #表示使用的加密套件的类型。
                          ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3; #表示使用的TLS协议的类型。
                          ssl_prefer_server_ciphers on;
  
                          proxy_buffering on;
                          proxy_buffer_size 1024k;
                          proxy_buffers 16 1024k;
                          proxy_busy_buffers_size 2048k;
                          proxy_temp_file_write_size 2048k;
                          #由于不是通过原始的IP+不同尾缀区分前端项目,而是使用域名,所以这里配置的是/
                  		location / {
                  		    #而这里为了能访问到争取的静态文件地址,就必须写到html文件夹下的具体目录为止
                  		    root /usr/share/nginx/html/manage-preview;
                  		    index index.html index.htm;
                              try_files $uri $uri/ /index.html last;
                              #这一句会导致每次请求资源都需要重新请求服务器,酌情添加
                              add_header Cache-Control no-cache;
                  		}
                  		#一旦配置了https,就不能从前段直接调用http的接口了,所以让前端去访问一个虚拟接口地址,通过这里配置虚拟接口地址的统一前缀,拦截之后转发到我们后端的接口,这就可以使用http了
                          location /manage {
                              proxy_pass http://43.157.63.49:8186;
                          }
                      }
  ```

  