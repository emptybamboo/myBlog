# springboot接入websocket

- 由于项目中有一个消息提示功能,就在系统的右上角假如有人回复你,显示的红色提示回复数就+1,这种因为后端数据变化前端实时变动显示的一般都是用websocket来做
- 经过我的研究,springboot如果要使用websocket有两种方式,一种是javax自带的websocket,一种是springboot内置的websocket
- 前者历史悠久,但也有缺点,使用繁琐,要定义一堆东西重写一堆方法,并且后端接收前端消息只有一个统一入口,需要根据前端传的某些参数来区分这次消息是发来做什么用的,得使用if else在一个方法里做好多个判断才可以,很恶心,不符合我的习惯
- 而后者就好的多,可以像springboot写的http接口一样,定义@MessageMapping注解,其中写好地址,按地址接收不同的消息,方便简洁,易于维护,springboot内置的websocket也叫做STOMP方式的websocket,我个人是比较满意的

## 引入

- websocket的配置可以在各自的业务模块,也可以单开一个公共模块,我选择了后者

- 在单独的模块中引入websocket,需要加入以下maven配置

  ```xml
      <dependencies>
          <!-- 引入 websocket 依赖类-->
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-websocket</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
          <dependency>
              <groupId>cn.hutool</groupId>
              <artifactId>hutool-all</artifactId>
          </dependency>
      </dependencies>
  ```

- 为了避免公共模块被打包还要配置

  ```xml
  <!--由于这只是一个公共模块,所以没有主启动类,编译时会报错:Unable to find main class,所以配置这个插件跳过-->
  <build>
      <plugins>
          <plugin>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-maven-plugin</artifactId>
              <configuration>
                  <skip>true</skip>
              </configuration>
          </plugin>
      </plugins>
  </build>
  ```

## 配置

- 在单独的模块中仅需要一个配置类

- 首先把配置类用`@Configuration`标记为配置类,然后使用注解`@EnableWebSocketMessageBroker`启用websocket

  ```java
  @Configuration
  @EnableWebSocketMessageBroker
  public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  
      @Override
      public void configureMessageBroker(MessageBrokerRegistry config) {
          config.enableSimpleBroker("/topic", "/queue"); // 启用一个简单的消息代理，用于将消息发送到以/topic或/queue为前缀的目的地
          config.setApplicationDestinationPrefixes("/app"); // 设置应用程序的目的地前缀，用于过滤带有@MessageMapping注解的方法
          config.setUserDestinationPrefix("/user"); // 设置用户目的地的前缀，用于向指定用户发送消息
      }
  
      @Override
      public void registerStompEndpoints(StompEndpointRegistry registry) {
          //这里要注意使用setAllowedOriginPatterns而不是setAllowedOrigins,不然可能会出现websocket跨域
          registry.addEndpoint("/ws").setAllowedOriginPatterns("*"); // 注册一个STOMP端点，用于建立WebSocket连接
          registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS(); // 启用SockJS支持，用于在WebSocket不可用时提供备选方案
      }
  
      /**
       * 拦截到用户请求头中的信息X-Auth-Username,塞入Principal,方便我们点对点发信息给某客户
       *
       * @param registration 不知道是啥
       */
      @Override
      public void configureClientInboundChannel(ChannelRegistration registration) {
          // 添加一个ChannelInterceptor，用来从头信息中获取用户名，并设置到SimpMessageHeaderAccessor中
          registration.interceptors(new ChannelInterceptor() {
              @Override
              public Message<?> preSend(Message<?> message, MessageChannel channel) {
                  StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                  if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                      // 从头信息中获取用户名
                      String username = accessor.getFirstNativeHeader("X-Auth-Username");
                      Console.log("拦截到的X-Auth-Username为:{}", username);
                      //                    if (username == null) {
                      //                        // 没有ID，抛出一个通用的异常
                      //                        throw new IllegalArgumentException("X-Auth-Username is required");
                      //                    }
                      if (username != null) {
                          // 设置到SimpMessageHeaderAccessor中
                          accessor.setUser(new Principal() {
                              @Override
                              public String getName() {
                                  return username;
                              }
                          });
                      }
                  }
                  return message;
              }
          });
      }
  }
  ```

- 重写**configureMessageBroker**方法

  - 其中`enableSimpleBroker`方法代表了**规定后端发送websocket消息给前端的地址前缀**,也就是前端需要订阅的地址,前端订阅这个地址之后,相当于和springboot写好了一个http接口一样,可以随时接收后端发来的信息,根据不同的订阅路径就相当于不同的http接口地址

  - 要注意这个方法定义的前缀是要相对于`setUserDestinationPrefix`方法定义的前缀靠后的

    ```js
    // 发起 websocket 连接
    this.stompClient.connect({}, (frame) => {
        // 订阅 topic
        this.stompClient.subscribe('/user/queue/receive', (res) => {
            console.log("收到客户端返回的消息")
            console.log(JSON.stringify(res.body))
            this.messageList.push(JSON.parse(res.body))
        })
    })
    ```

  - 其中`setApplicationDestinationPrefixes`方法代表了设置了**前端发送websocket消息到后端的地址前缀**,只有以这个为前缀的websocket消息后端才会接收,比如这里后端定义@MessageMapping注解的接收消息地址为send,前端如果发送websocket消息只写send地址是不可以的,必须加/app前缀

    ```java
    @MessageMapping("/send") // 定义一个@MessageMapping注解的方法，用于接收前端发送的消息
    @SendToUser("/queue/receive") // 定义一个@SendToUser注解的方法，用于返回给指定用户的消息
    public String receiveMessage(String message) {
        Console.log("后端接收到的消息: " + message); // 打印接收到的消息
        return message; // 返回接收到的消息内容
    }
    ```

    ```js
    sendMessage() {
        let data = {
            content: this.form.message
        }
        let dataStr = JSON.stringify(data)
        this.stompClient.send('/app/send', {}, dataStr)
    }
    ```

  - `setUserDestinationPrefix`方法规定了**前端给某个用户发送信息的前缀**,也就是点对点通信,这个**前缀是在最前方的**

  - 这里可以看出,`setUserDestinationPrefix`方法定义的user前缀是前段订阅后端消息的最前缀,之后紧跟着`enableSimpleBroker`方法定义的前缀

    ```js
    // 发起 websocket 连接
    this.stompClient.connect({}, (frame) => {
        // 订阅 topic
        this.stompClient.subscribe('/user/queue/receive', (res) => {
            console.log("收到客户端返回的消息")
            console.log(JSON.stringify(res.body))
            this.messageList.push(JSON.parse(res.body))
        })
    })
    ```

- **重写registerStompEndpoints方法**

  - 作用相当于定义了前端与后端websocket连接时请求的地址

  - 但是要注意,如果后端针对所有接口配置了统一请求前缀,比如`context-path: /manage`,那前端连接后端websocket服务时还需要在这里定义的前缀前加context-path定义的前缀

    ```yml
    server:
      port: 8082 # 配置的测试服开发环境的端口
      servlet:
        context-path: /manage #接口统一路由前缀
    ```

  - 打个比方,这里的例子里registerStompEndpoints定义的连接前缀为`/ws`,而项目配置的请求前缀为`/manage`,这样的话,最终前端连接后端websocket服务的地址就是`http://IP:端口号/manage/ws`

    ```js
    let socket = new SockJS('http://192.168.23.215:8082/manage/ws')
    ```
    
  - 同时还要在这里设置websocket的跨域,这里要注意使用setAllowedOriginPatterns而不是setAllowedOrigins,不然可能会出现websocket跨域

- **重写configureClientInboundChannel方法**

  - 主要的作用就是为了完成前端到后端的点对点通信,前端由于不同的客户登录系统就相当于不同的几个点,后端本身只有一个,但是可以根据前端不同的身份进行不同的处理
  - 我选择的处理方法就是让前端把客户ID字段放在每次websocket通信时请求头header的X-Auth-Username字段中,然后后端拦截到这个字段,将其塞入Principal,然后在需要后端主动发送websocket消息到前端某用户的时候,就可以在接口参数上加上Principal,由于前后端连接websocket的时候已经把用户ID传过来并且塞入了后端的Principal对象,后端就可以用这个对象中的ID调用simpMessagingTemplate.convertAndSendToUser方法点对点发消息给前端客户

## 使用

- 这样为止,前端就可以发起连接后端websocket服务了
- 剩下的就是后端去编写接收前端消息的方法以及在业务代码过程中主动给前端发送消息

### 后端接收前端消息

- 需要像http接口那样去写接口接收消息

- 首先写好@RestController或@Controller注解,然后通过@MessageMapping定义自己接收websocket消息的地址,配合之前config.setApplicationDestinationPrefixes("/app")方法设置的前缀,前端使用`this.stompClient.send('/app/send', {}, dataStr)`发送

- 由于项目中我还没有实际后端接收websocket消息的场景,不过我预估也是所有都用字符串接收,一个字符串是JSON包含所有参数,可能后续可以自定义参数类型去接收这个JSON字符串,不过用String接收再转化也是一样

  ```java
  /**
   * @ignore
   */
  @RestController
  @Slf4j
  public class WebsocketTestController {
      @Autowired
      private SimpMessagingTemplate simpMessagingTemplate; // 注入SimpMessagingTemplate类，用于向客户端发送消息
  
      @MessageMapping("/send") // 定义一个@MessageMapping注解的方法，用于接收前端发送的消息
      @SendToUser("/queue/receive") // 定义一个@SendToUser注解的方法，用于返回给指定用户的消息
      public String receiveMessage(String message) {
          Console.log("后端接收到的消息: " + message); // 打印接收到的消息
          return message; // 返回接收到的消息内容
      }
  }
  ```

### 后端主动发消息给前端

- 这个也十分简单,在业务代码的serviceimpl处注入SimpMessagingTemplate,调用即可发消息给前端

- 如果要点对点,那就调用`simpMessagingTemplate.convertAndSendToUser(username, "/queue/receive", message);`方法,第一个参数就是前端每次websocket通信时请求头header的X-Auth-Username字段中的用户ID的值,第二个参数就是前端需要订阅的地址,第三个参数就是JSON字符串

  ```java
      public void addNotificationData(Integer customerId, Integer dataId, Integer notificationType) {
          Notification notification = new Notification()
                  .setDataId(dataId)
                  .setNotificationType(notificationType)
                  .setCustomerId(customerId);
          notificationMapper.insert(notification);
          NotificationRedisEntity notificationRedisEntity = new NotificationRedisEntity();
          BeanUtil.copyProperties(notification, notificationRedisEntity);
          //这里需要检查一下redis的key是否过期,如果过期需要取数据库的数据到缓存中
          redisUtil.hPut(StrUtil.format(RedisKeyEnum.NOTIFICATION.getKey(), customerId), notification.getNotificationId().toString(), JSONUtil.toJsonStr(notificationRedisEntity));
          //设置过期时间为一天
          redisUtil.expire(StrUtil.format(RedisKeyEnum.NOTIFICATION.getKey(), customerId), 1, TimeUnit.DAYS);
          //获取全部通知缓存发给前端
          NotificationForCustomerResp notificationForCustomerResp = notificationUtil.getNewestNotificationFromUser(customerId);
          //使用websocket发送给前端新增的通知
          simpMessagingTemplate.convertAndSendToUser(customerId.toString(), WebsocketSubscribeEnum.NEW_NOTIFICATION.getAddress(), JSONUtil.toJsonStr(notificationForCustomerResp));
      }
  ```

- 为了好记录,我也会把前段需要订阅的地址写在枚举里,方便使用和修改

  ```java
  /**
   * websocket前端订阅地址枚举,相当于前端写的@RequestMapping接口地址
   */
  public enum WebsocketSubscribeEnum {
      /**
       * 新通知
       **/
      NEW_NOTIFICATION("/queue/notification/new"),
      ;
  
  
      /**
       * 前端订阅地址
       **/
      private final String address;
  
      WebsocketSubscribeEnum(String address) {
          this.address = address;
      }
  
  
      public String getAddress() {
          return address;
      }
  }
  ```

## 前端样例

- 当初为了测试我还写了个html文件,只要一个单文件就可以实现对后端stomp方式websocket的调试和测试

- 不过要使用火狐浏览器解禁一些东西才可以,不然会跨域

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Websocket Test</title>
      <style>
        li {
          list-style: none;
        }
  
        .websocket-test-container {
          padding: 20px;
        }
  
        .message-list {
          padding-top: 10px;
        }
  
        .form-wrapper {
          padding-bottom: 10px;
        }
  
        input {
          width: 80%;
          height: 30px;
          border: 1px solid #ccc;
          border-radius: 5px;
          padding: 5px;
          font-size: 16px;
        }
  
        button {
          width: 15%;
          height: 40px;
          margin: 5px;
          border: none;
          border-radius: 5px;
          color: white;
          font-size: 16px;
        }
  
        .primary {
          background-color: #007bff;
        }
  
        .info {
          background-color: #17a2b8;
        }
  
        .error {
          background-color: #dc3545;
        }
      </style>
      <script src="https://unpkg.com/vue@next"></script>
      <script src="https://cdn.jsdelivr.net/npm/sockjs-client/dist/sockjs.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/stompjs/lib/stomp.min.js"></script>
    </head>
    <body>
      <div id="app">
        <div class="websocket-test-container whui-router-view-container">
          <div class="form-wrapper">
            <input type="text" :value="form.message" @input="form.message=$event.target.value" placeholder="消息内容" />
          </div>
          <div class="action">
            <button class="primary" @click="connectSocket">连接</button>
            <button class="info" @click="disconnectSocket">关闭连接</button>
            <button class="error" @click="sendMessage">发送</button>
          </div>
          <div class="message-content">
            <div class="message-list">
              <ul>
                <li v-for="item in messageList" :key="item.content"> {{item.content}} </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <script>
        const app = Vue.createApp({
          data() {
            return {
              form: {
                message: "",
              },
              stompClient: null,
              messageList: [],
            };
          },
          methods: {
            connectSocket() {
              console.log("开始连接后端websocket")
              // 连接
              let socket = new SockJS('http://192.168.23.215:8082/manage/ws')
              // 获取 STOMP 子协议的客户端对象
              this.stompClient = Stomp.over(socket)
              // 发起 websocket 连接
              this.stompClient.connect({}, (frame) => {
                // 订阅 topic
                this.stompClient.subscribe('/user/queue/receive', (res) => {
                  console.log("收到客户端返回的消息")
                  console.log(JSON.stringify(res.body))
                  this.messageList.push(JSON.parse(res.body))
                })
              })
            },
            disconnectSocket() {
              if (this.stompClient != null) {
                  console.log("关闭连接后端websocket")
                this.stompClient.disconnect()
              }
            },
            sendMessage() {
              let data = {
                content: this.form.message
              }
              let dataStr = JSON.stringify(data)
              this.stompClient.send('/app/send', {}, dataStr)
            }
          },
        });
        app.mount("#app");
      </script> 复制
    </body>
  </html>
  ```

  