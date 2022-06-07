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

- 去搜了一般gitlab直接装在linux服务器上的默认地址,找不到

- lsof -i :8082 命令没有反应,说明8082端口没有运行程序,也就是说明gitlab彻底挂了,非运行状态

- whereis gitlab命令也没有反应

- docker ps -a 和docker images 都没有直接叫gitlab的容器或镜像,如果是装在docker里那肯定是起了什么自定义的名字了认不出来哪个是gitlab了...