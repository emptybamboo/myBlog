# **RabbitMQ入门**

## 核心概念

- `RabbitMQ` 整体上是一个**生产者**与**消费者模型**，主要负责接收、存储和转发消息。可以把消息传递的过程想象成：当你将一个包裹送到邮局，邮局会暂存并最终将邮件通过邮递员送到收件人的手上，`RabbitMQ`就好比由**邮局**、**邮箱**和**邮递员**组成的一个系统。从计算机术语层面来说，`RabbitMQ `模型**更像**是一种**交换机模型**。

### Producer(生产者) 和 Consumer(消费者)

  - **Producer(生产者)** :生产消息的一方（邮件投递者）
  - **Consumer(消费者)** :消费消息的一方（邮件收件人）
- 消息一般由 2 部分组成：**消息头**（或者说是标签 Label）和 **消息体**。
  - **消息体**也可以称为 `payLoad` ,消息体是不透明的.
  - 而**消息头**则由一系列的可选属性组成，这些属性包括 `routing-key（路由键`）、`priority（相对于其他消息的优先权）`、`delivery-mode（指出该消息可能需要持久性存储）`等。生产者把消息交由` RabbitMQ` 后，`RabbitMQ `会根据消息头把消息发送给感兴趣的 Consumer(消费者)。

### Exchange(交换器)

- 在 `RabbitMQ` 中，消息并不是直接被投递到 **Queue(消息队列)** 中的，中间还必须经过 **Exchange(交换器)**

- 交换器接收生产者发送的消息,然后路由到服务器的队列中,如果路由不到就返回给生产者或丢弃

#### Exchange Types(交换器类型)

- RabbitMQ 常用的 Exchange Type 有 **fanout**、**direct**、**topic**、**headers** 这四种（AMQP规范里还提到两种 Exchange Type，分别为 system 与 自定义，这里不予以描述）。

  ##### ① fanout

  **fanout** 类型的Exchange路由规则非常简单，它会把所有发送到该Exchange的消息路由到所有与它绑定的Queue中，**不需要做任何判断操作**，所以 fanout 类型是所有的交换机类型里面**速度最快**的。fanout 类型常用来**广播消息**。

  ##### ② direct

  **direct** 类型的Exchange路由规则也很简单，它会把消息路由到那些 `Bindingkey` 与 `outingKey` **完全匹配**的 Queue 中。

  [![direct 类型交换器](https://camo.githubusercontent.com/74a37d60211f66e4831fc101de1480d56ca0e0e66757f030c228103bb28a903b/687474703a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f31382d31322d31362f33373030383032312e6a7067)](https://camo.githubusercontent.com/74a37d60211f66e4831fc101de1480d56ca0e0e66757f030c228103bb28a903b/687474703a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f31382d31322d31362f33373030383032312e6a7067)

  以上图为例，如果发送消息的时候设置路由键为“warning”,那么消息会路由到 Queue1 和 Queue2。如果在发送消息的时候设置路由键为"Info”或者"debug”，消息只会路由到Queue2。如果以其他的路由键发送消息，则消息不会路由到这两个队列中。

  direct 类型常用在**处理有优先级的任务**，根据任务的优先级把消息发送到对应的队列，这样可以指派更多的资源去处理高优先级的队列。

  ##### ③ topic

  前面讲到direct类型的交换器路由规则是完全匹配 `BindingKey `和 `RoutingKey` ，但是这种严格的匹配方式在很多情况下不能满足实际业务的需求。**topic**类型的交换器在匹配规则上进行了扩展，它与 direct 类型的交换器相似，也是将消息路由到 `BindingKey `和 `RoutingKey `相匹配的队列中，但这里的匹配规则有些不同,等于是以**特定规则模糊匹配**，它约定：

  - RoutingKey 为一个点号“．”分隔的字符串（被点号“．”分隔开的每一段独立的字符串称为一个单词），如 “com.rabbitmq.client”、“java.util.concurrent”、“com.hidden.client”;
  - BindingKey 和 RoutingKey 一样也是点号“．”分隔的字符串；
  - BindingKey 中可以存在两种特殊字符串“*”和“#”，用于做模糊匹配，其中“*”用于匹配一个单词，“#”用于匹配多个单词(可以是零个)。

  [![topic 类型交换器](https://camo.githubusercontent.com/c678fb21b871686d9c1ae5c196c81877c0e014ac9d354c3f01a3ee716dca3fc5/687474703a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f31382d31322d31362f37333834332e6a7067)](https://camo.githubusercontent.com/c678fb21b871686d9c1ae5c196c81877c0e014ac9d354c3f01a3ee716dca3fc5/687474703a2f2f6d792d626c6f672d746f2d7573652e6f73732d636e2d6265696a696e672e616c6979756e63732e636f6d2f31382d31322d31362f37333834332e6a7067)

  以上图为例：

  - 路由键为 “com.rabbitmq.client” 的消息会同时路由到 Queuel 和 Queue2;
  - 路由键为 “com.hidden.client” 的消息只会路由到 Queue2 中；
  - 路由键为 “com.hidden.demo” 的消息只会路由到 Queue2 中；
  - 路由键为 “java.rabbitmq.demo” 的消息只会路由到Queuel中；
  - 路由键为 “java.util.concurrent” 的消息将会被丢弃或者返回给生产者（需要设置 mandatory 参数），因为它没有匹配任何路由键。

  ##### ④ headers(不推荐)

  headers 类型的交换器不依赖于路由键的匹配规则来路由消息，而是根据发送的消息内容中的 headers 属性进行匹配。在绑定队列和交换器时制定一组键值对，当发送消息到交换器时，RabbitMQ会获取到该消息的 headers（也是一个键值对的形式)'对比其中的键值对是否完全匹配队列和交换器绑定时指定的键值对，如果完全匹配则消息会路由到该队列，否则不会路由到该队列。headers 类型的交换器性能会很差，而且也不实用，基本上不会看到它的存在。

- 生产者把消息发给交换器的时候会指定一个**RoutingKey(路由键)**来指定该消息的路由规则,这个路由键必须和交换器类型以及**绑定键(BindingKey)**联合使用才能最终生效
- **可以这样理解:交换器就是个中间人,他拥有自己的类型,由自己的类型去决定该不该将拥有某些路由键的消息接纳进来,然后再根据绑定键(可多个)确定和交换器自己会产生关联的队列,再根据交换器类型决定要怎么分配这些消息到队列中.交换器和队列是多对多的关系**
- **绑定键确定交换器和队列之间的关联关系,是交换器和队列的一个通道桥梁,这个桥梁可以是完整的一个字符串,也可以是一个模糊匹配的规则型字符串,根据交换器的类型不同而决定如何匹配路由键.而路由键则一定是一个完整的字符串,也是根据交换器的类型不同而决定如何匹配绑定键.**
- **一个消息需要先指定交换器,在java中是`convertAndSend(exchange, routingKey, message)`这个方法指定Exchange、Routing Key以及消息本身。如果找不到对应交换器就会报错,路由键匹配不到也会报错**
- **教程中说到如果路由键匹配不到队列除了报错还可以返回给生产者,这个就需要在Java代码中自己开启了.**

### Broker（消息中间件的服务节点）

- 据观察broker就是交换器+队列

## 安装

- windows系统的安装首先需要去`erlang`官网下载`erlang`
- 但是要注意`erlang`版本和`rabbitmq`版本是要严格对应的,不对应会出问题.
- 其实可以先下载`rabbitmq`的安装程序,安装的时候会告诉你,还没安装`erlang`是否跳转到`erlang`官网,你点击是跳进去下载更方便
- 安装好`erlang`去配置环境变量,配置好之后就可以安装`rabbitmq`
- 安装完成之后这时你打开`RabbitService MQ - start`,进入它自带的后台管理地址`http://localhost:15672`.发现进不去
- 需要打开cmd运行`rabbitmq-plugins enable rabbitmq_management`之后才可以正常打开

## 使用

- 队列的创建是在管理后台手动创建的,交换器也是,然后在交换器的部分,有一个binding也就是路由规则也需要在后台手动编辑

- 首先需要再pom.xml引入依赖

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-amqp</artifactId>
  </dependency>
  ```

- 然后在yml文件中配置

  ```yml
  spring:
    rabbitmq:
      host: localhost
      port: 5672
      username: guest
      password: guest
  ```

- 启动类中我们需要配置注入`MessageConverter`对象

- `MessageConverter`用于将Java对象转换为RabbitMQ的消息。默认情况下，Spring Boot使用`SimpleMessageConverter`，只能发送`String`和`byte[]`类型的消息，不太方便。使用`Jackson2JsonMessageConverter`，我们就可以发送JavaBean对象，由Spring Boot自动序列化为JSON并以文本消息传递。

- 引入starter之后所有rabbitmq的bean自动装配,我们就可以拿到rabbitTemplate.这个对象是使用在生产者模块的.

- 发送消息时，使用`convertAndSend(exchange, routingKey, message)`可以指定Exchange、Routing Key以及消息本身。这里传入JavaBean后会自动序列化为JSON文本。上述代码将`RegistrationMessage`发送到`registration`，将`LoginMessage`发送到`login`，并根据登录是否成功来指定Routing Key。

  ```java
  @Component
  public class MessagingService {
      @Autowired
      RabbitTemplate rabbitTemplate;
  
      public void sendRegistrationMessage(RegistrationMessage msg) {
          //这个方法就是把消息发送到rabbitmq中,也就是找个交换器往里塞
          //第一个参数是交换器的名字,第二个是路由键,第三个是我们要传递的消息对象
          //路由键可以不指定,消息就会被塞到指定交换器的不需要对应路由键的队列中去
          rabbitTemplate.convertAndSend("registration", "", msg);
      }
  
      public void sendLoginMessage(LoginMessage msg) {
          String routingKey = msg.success ? "" : "login_failed";
          rabbitTemplate.convertAndSend("login", routingKey, msg);
      }
  }
  ```

- 接收消息时在对应的接收方法上使用`@RabbitListener`注解,属性`queues = QUEUE_MAIL`等于号后面是队列的名字,然后在方法里写这个队列接收到消息时的处理业务

- 直接指定一个Queue并投递消息也是可以的，此时指定Routing Key为Queue的名称即可，因为RabbitMQ提供了一个`default exchange`用于根据Routing Key查找Queue并直接投递消息到指定的Queue。但是要实现一对多的投递就必须自己配置Exchange。