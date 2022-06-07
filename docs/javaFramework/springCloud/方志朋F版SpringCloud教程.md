# 方志朋F版SpringCloud教程

- 这个教程是他F版springcloud教程,因为这是我看到经纪云app使用的cloud版本是2.0.0,达到他说的F版本,所以为了配合公司技术栈我就来学习这个教程

## 第1篇：Eureka

- spring cloud 为开发人员提供了快速构建分布式系统的一些工具，包括配置管理、服务发现、断路器、路由、微代理、事件总线、全局锁、决策竞选、分布式会话等等。它运行环境简单，可以在开发人员的电脑上跑。另外说明spring cloud是基于springboot的，所以需要开发中对springboot有一定的了解

### 服务注册中心

- 我们需要用的的组件上**Spring Cloud Netflix**的**Eureka** ,eureka是一个**服务注册和发现模块**。

- 首先需要创建一个maven主项目,然后两个子工程,一个是服务注册中心，即**Eureka Server**,另一个作为**Eureka Client**.

- 主项目的依赖如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
  
      <groupId>org.example</groupId>
      <artifactId>f-version-cloud</artifactId>
      <version>1.0-SNAPSHOT</version>
      <packaging>pom</packaging>
  
      <parent>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-parent</artifactId>
          <version>2.0.3.RELEASE</version>
          <relativePath/>
      </parent>
  
      <properties>
          <maven.compiler.source>9</maven.compiler.source>
          <maven.compiler.target>9</maven.compiler.target>
          <java.version>1.9</java.version>
          <spring-cloud.version>Finchley.RELEASE</spring-cloud.version>
          <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
          <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
      </properties>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-test</artifactId>
              <scope>test</scope>
          </dependency>
      </dependencies>
  
      <dependencyManagement>
          <dependencies>
              <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-dependencies</artifactId>
                  <version>${spring-cloud.version}</version>
                  <type>pom</type>
                  <scope>import</scope>
              </dependency>
          </dependencies>
      </dependencyManagement>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  </project>
  ```

  

- 右键主项目,创建模块,选择`spring initialir`,选择`cloud discovery`->`eureka server`点击完成即可.

- 其pom.xml继承了父pom文件，并引入spring-cloud-starter-netflix-eureka-server的依赖,maven依赖基本如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>org.example</groupId>
          <artifactId>f-version-cloud</artifactId>
          <version>1.0-SNAPSHOT</version>
          <relativePath/> <!-- lookup parent from repository -->
      </parent>
  
      <artifactId>eureka-server</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <packaging>jar</packaging>
      <name>eureka-server</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- 如果要作为一个**服务注册中心**,就必须在启动类上添加`@EnableEurekaServer`注解

- 每一个实例注册后要想服务提供中心发送心跳,默认情况下erureka server也是一个eureka client,打个比方就相当于一个公司里的CEO也相当于一个员工,只不过是一个职责不同的员工,所以可以当做员工看,我们必须要指定一个 server,就好像从所有员工里挑选一个CEO.

- yml配置如下

  ```yml
  server:
    port: 8761
  
  eureka:
    instance:
      hostname: localhost
      ##registerWithEureka: false和fetchRegistry: false否定了自己是一个普通client,表明自己是一个eureka server
    client:
      registerWithEureka: false
      fetchRegistry: false
      serviceUrl:
        defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
  ```

- 全部搞定之后启动工程,然后eureka有自己的管理页面,地址为`http://localhost:8761`

#### 特别注意

- 需要特别注意的一点:之后注册的模块,包括注册中心在内,都要填到我们最大的父项目的pom.xml中去,使用yml中的应用名

  ```xml
      <modules>
          <module>eureka-server</module>
          <module>service-hi</module>
          <module>service-ribbon</module>
      </modules>
  
  ```

  

### 服务提供者

- 当client向server注册时，它会提供一些元数据，例如主机和端口，URL，主页等。Eureka server 从每个client实例接收心跳消息。 如果心跳超时，则通常将该实例从注册server中删除。

- 创建过程基本等同于注册中心的创建过程

- maven依赖项如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>org.example</groupId>
          <artifactId>f-version-cloud</artifactId>
          <version>1.0-SNAPSHOT</version>
      </parent>
  
      <artifactId>service-hi</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <packaging>jar</packaging>
      <name>service-hi</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
          </dependency>
  
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
      </dependencies>
  
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- 为了表明自己是普通client,需要在启动类上加`@EnableEurekaClient`注解

- 并且yml中需要配置

  ```yml
  eureka:
    client:
      serviceUrl:
        defaultZone: http://localhost:8761/eureka/
        ##这里是配置注册中心地址
  server:
    port: 8762
  spring:
    application:
      name: service-hi
      ##name很重要，这在以后的服务与服务之间相互调用一般都是根据这个name
  ```

- 这时启动模块,就可以在服务中心的管理页面看到我们的这个服务

- 通过接口也可以访问项目了

### 问题

- 在我想**重命名项目**的时候出现了一点问题,我因为太麻烦就直接**重新建了个模块**,然后呢就去**目录里**把之前的**模块给删了**
- 这就出问题了,我只要运行就会出现**识别不了`@Value("${server.port}")`注释**的情况
- 然后第二天过来打开项目还是如此,我发现pom.xml中java版本不对,是1.8,就修改到1.9再刷新maven,结果**提示我是否删除那个模块**,我手贱点了删除
- 突然发现项目里昨天删掉的模块又回来了,然后我新建的模块文件夹的**蓝色小方块还消失了,不被识别为模块**
- 我就在IDEA里手动删除了昨天的那个模块,然后搜索之后发现需要在maven中**先点击那个刷新文件夹图标**(为所有项目生成源和更新文件夹),**再点击+号**(添加maven项目)加载我们的模块文件夹**即可恢复**

---

- 一切正常的时候我启动注册中心,出现启动失败,报错`Exception starting filter [servletContainer]`
- 经过查询得到以下结论

> 发生此错误的原因是因为从Java 11中删除了J2EE模块。Java11删除了对java.xml.bind的支持，该支持定义了XML绑定（JAXB）API的Java体系结构。有关更多信息，请参见[本期](https://github.com/spring-cloud/spring-cloud-netflix/issues/3244)。按照[Spring文档](https://cloud.spring.io/spring-cloud-static/Greenwich.RELEASE/multi/multi_spring-cloud-eureka-server.html)，我们应该添加`jaxb-api`，`jaxb-core`和`jaxb-impl`依赖。
>
> 显然，我们还需要添加`javax.activation-api`依赖项。

- 所以就在父项目的pom.xml中添加以下依赖即可解决

  ```xml
  <dependency>
      <groupId>javax.xml.bind</groupId>
      <artifactId>jaxb-api</artifactId>
      <version>2.3.0</version>
  </dependency>
  <dependency>
      <groupId>com.sun.xml.bind</groupId>
      <artifactId>jaxb-impl</artifactId>
      <version>2.3.0</version>
  </dependency>
  <dependency>
      <groupId>org.glassfish.jaxb</groupId>
      <artifactId>jaxb-runtime</artifactId>
      <version>2.3.0</version>
  </dependency>
  <dependency>
      <groupId>javax.activation</groupId>
      <artifactId>activation</artifactId>
      <version>1.1.1</version>
  </dependency>
  ```

  

## 第2篇:Ribbon

- 讲了服务的注册和发现。在微服务架构中，业务都会被拆分成一个独立的服务，**服务与服务的通讯**是基于http restful的。Spring cloud有两种服务调用方式，一种是**ribbon+restTemplate**，另一种是**feign**。

### 服务消费者

- 这一篇文章基于上一篇文章的工程,首先启动注册中心,第一篇里ervice-hi工程的端口为8762,改为8763再启动,在管理页面就可以看到service-hi在eureka-server注册了2个实例，这就相当于一个小的集群。

- 要想**同时一个工程启动多个实例**,也就是一个模块启动两个port,比如8762和8763就需要我们去IDEA中找到**启动项目按钮左边的那个下拉**,点开其中的`编辑配置`,然后在具体模块中勾选**允许并行运行**,之后**先运行**8762配置的项目,**改为**8763,**再点击运行**,这时候就会运行第二份同一模块却不同port.

- 重新新建一个spring-boot工程，取名为：service-ribbon; 在它的pom.xml继承了父pom文件，并引入了以下依赖

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>org.example</groupId>
          <artifactId>f-version-cloud</artifactId>
          <version>1.0-SNAPSHOT</version>
      </parent>
      <artifactId>service-ribbon</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <packaging>jar</packaging>
      <name>service-ribbon</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- yml配置如下

  ```yml
  eureka:
    client:
      serviceUrl:
        defaultZone: http://localhost:8761/eureka/
  server:
    port: 8764
  spring:
    application:
      name: service-ribbon
  
  ```

- 在启动类上加`@EnableDiscoveryClient`注解向服务中心注册,同时加`@EnableEurekaClient`注解

- 在启动类中注入RestTemplate:`@Bean`,并且加上负载均衡注解:`@LoadBalanced`

- 写一个测试service,拿到之前注入的**RestTemplate**来**调用提供者的接口**,在**ribbon**中它会**根据服务名**来**选择具体的服务实例**，根据服务实例在请求的时候会用具体的url替换掉服务名

  ```java
  @Service
  public class HelloService {
  
      @Autowired
      RestTemplate restTemplate;
  
      public String hiService(String name) {
          return restTemplate.getForObject("http://SERVICE-HI/hi?name="+name,String.class);
      }
  
  
  }
  ```

- 写一个controller，在controller中用调用HelloService 的方法

  ```java
  @RestController
  public class HelloControler {
  
      @Autowired
      HelloService helloService;
  
      @GetMapping(value = "/hi")
      public String hi(@RequestParam String name) {
          return helloService.hiService( name );
      }
  }
  ```

- 这时去浏览器多次访问`http://localhost:8764/hi?name=123`,浏览器会交替显示

> hi 123,i am from port:8762
>
> hi 123,i am from port:8763

- 这说明当我们通过调用`restTemplate.getForObject(“http://SERVICE-HI/hi?name=”+name,String.class)`方法时，已经做了**负载均衡**，访问了不同的端口的服务实例。
- 此时的架构

> - 一个服务注册中心，eureka server,端口为8761
> - service-hi工程跑了两个实例，端口分别为8762,8763，分别向服务注册中心注册
> - sercvice-ribbon端口为8764,向服务注册中心注册
> - 当sercvice-ribbon通过restTemplate调用service-hi的hi接口时，因为用ribbon进行了负载均衡，会轮流的调用service-hi：8762和8763 两个端口的hi接口；

### 总结

- 使用ribbon+restTemplate来调用服务提供者的服务,首先就需要在启动类加上特定注解
- 之后在启动类或者配置类配置好restTemplate对象,加注解`@Bean`方便使用时依赖注入,加注解`@Banlance`使用负载均衡
- 之后先写好`service`,在`service`中注入再使用`restTemplate`,按url,并且把url中的ip地址改为应用名来调用消费者的接口服务:`restTemplate.getForObject("http://SERVICE-HI/hi?name="+name,String.class);`
- 最后创建`controller`,注入`service`,使用`service`中的方法即可

### 问题

- eureka和ribbon的依赖报红
- 研究之后发现必须boot和cloud的版本对应,并且cloud的版本也要和它附属的部分对应
- 我使用的是2020.0.2版本的cloud,教程是D版本的也就是1.5.x版本的
- 仔细斟酌之后我决定使用2020.0.2,这样的话`spring-cloud-starter-eureka-server`就得改成`spring-cloud-starter-netflix-eureka-server`,`spring-cloud-starter-ribbon`就得改成`spring-cloud-starter-netflix-ribbon`
- 但是这些都做好之后pom.xml依然还报错,只剩下一个错误,说是ribbon的版本不能为空,但是我eureka的版本也每填就好好的,只要ribbon有问题就很奇怪,手动添加版本2.0.0.RELEASE就没事了,但是这应该不是最佳解决

---

- 运行起来之后访问`http://localhost:8764/hi?name=123`,报错`java.lang.IllegalStateException: No instances available for SERVICE-HI`
- 但是我查看管理页面发现服务提供者也在注册中心注册了,ribbon也正常注册

## 第3篇：feign

- Feign是一个声明式的伪Http客户端，它使得写Http客户端变得更简单。使用Feign，只需要创建一个接口并注解。它具有可插拔的注解特性，可使用Feign 注解和JAX-RS注解。
- Feign支持可插拔的编码器和解码器。Feign默认集成了Ribbon，并和Eureka结合，默认实现了负载均衡的效果。
- 简而言之：
  - Feign 采用的是基于接口的注解
  - Feign 整合了ribbon，具有负载均衡的能力
  - 整合了Hystrix，具有熔断的能力
- 我来总结就是:`feign`是比`ribbon`+`restTemplate`更优秀更方便的调用服务提供者服务的工具

### 创建feign服务

- 首先继续用上一节的工程， 启动eureka-server，端口为8761; 启动service-hi 两次，端口分别为8762 、8773.

- 新建serice-feign模块,依赖如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?><project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">    <modelVersion>4.0.0</modelVersion>    <parent>        <groupId>org.example</groupId>        <artifactId>f-version-cloud</artifactId>        <version>1.0-SNAPSHOT</version>    </parent>    <artifactId>service-feign</artifactId>    <version>0.0.1-SNAPSHOT</version>    <packaging>jar</packaging>    <name>service-feign</name>    <description>Demo project for Spring Boot</description>    <dependencies>        <dependency>            <groupId>org.springframework.cloud</groupId>            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>        </dependency>        <dependency>            <groupId>org.springframework.boot</groupId>            <artifactId>spring-boot-starter-web</artifactId>        </dependency>        <dependency>            <groupId>org.springframework.cloud</groupId>            <artifactId>spring-cloud-starter-openfeign</artifactId>        </dependency>    </dependencies>    <build>        <plugins>            <plugin>                <groupId>org.springframework.boot</groupId>                <artifactId>spring-boot-maven-plugin</artifactId>            </plugin>        </plugins>    </build></project>
  ```

- yml配置如下

  ```yml
  eureka:  client:    serviceUrl:      defaultZone: http://localhost:8761/eureka/server:  port: 8765spring:  application:    name: service-feign
  ```

- 启动类上添加注解

> @EnableEurekaClient
> @EnableDiscoveryClient
> @EnableFeignClients

- 定义feign接口,在接口上加注释`@FeignClient`,这个注释很重要,其中的value填写我们要调用的提供者的服务名.然后接口里的方法上的接口名直接对应提供者服务的接口名即可.就完成了`应用名->服务名`的对应调用.

  ```java
  @FeignClient(value = "service-hi")public interface SchedualServiceHi {    @RequestMapping(value = "/hi",method = RequestMethod.GET)    String sayHiFromClientOne(@RequestParam(value = "name") String name);}
  ```

- 之后再写一个controller,注入service,调用service的方法,传入应该传入的参数就可以使用提供者的服务了.

  ```java
  @RestController
  public class HiController {
  
      //编译器报错，无视。 因为这个Bean是在程序启动的时候注入的，编译器感知不到，所以报错。
      @Autowired
      SchedualServiceHi schedualServiceHi;
  
      @GetMapping(value = "/hi")
      public String sayHi(@RequestParam String name) {
          return schedualServiceHi.sayHiFromClientOne( name );
      }
  }
  ```

- 这时访问`http://localhost:8765/hi?name=666`,浏览器交替显示：

  > hi 666,i am from port:8762
  >
  > hi 666,i am from port:8763

### 总结

  - 使用feign调用服务提供者服务,只需要在启动类加上具体注解.
  - 创建service接口,接口上加`@FeignClient(value = "服务名")`注解,接口方法加对应的`mapping`注解,接口地址填提供者对应服务接口的地址.
  - 然后创建controller调用service接口中的方法,启动项目,访问feign接口地址即可完成调用提供者服务.



## 第4篇：Hystrix

- 在微服务架构中，根据业务来拆分成一个个的服务，服务与服务之间可以相互调用（RPC），在Spring Cloud可以用RestTemplate+Ribbon和Feign来调用。为了保证其高可用，单个服务通常会集群部署。由于网络原因或者自身的原因，服务并不能保证100%可用，如果单个服务出现问题，调用这个服务就会出现线程阻塞，此时若有大量的请求涌入，Servlet容器的线程资源会被消耗完毕，导致服务瘫痪。服务与服务之间的依赖性，故障会传播，会对整个微服务系统造成灾难性的严重后果，这就是服务故障的“雪崩”效应。
- 为了解决这个问题，业界提出了断路器模型。
- Netflix开源了Hystrix组件，实现了断路器模式，SpringCloud对这一组件进行了整合。 在微服务架构中，一个请求需要调用多个服务是非常常见的
- 较底层的服务如果出现故障，会导致连锁故障。当对特定的服务的调用的不可用达到一个阀值（Hystric 是5秒20次） 断路器将会被打开。
- 断路打开后，可用避免连锁故障，fallback方法可以直接返回一个固定值。
- **说白了就是微服务中很多服务互相调用,其中一个如果崩了就会影响其他的很多服务造成雪崩,断路器就在其中的服务出错时起作用,返回一个报错的信息.**

### 在ribbon中使用断路器

- 首先启动上一篇文章的工程，启动eureka-server 工程；启动service-hi工程，它的端口为8762。

- 改造ribbon工程,首先加入断路器依赖

  ```xml
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
  </dependency>
  ```

- 启动类上加注释`@EnableHystrix`

- 改造service,在service中加一个断路方法,以保证模块服务出问题时会调用这个方法去提示错误.然后在调用服务的方法上加注释`@HystrixCommand`,fallbackMethod属性填断路方法名

  ```java
  @Servicepublic class HelloService {   
      @Autowired    RestTemplate restTemplate;    
      @HystrixCommand(fallbackMethod = "hiError")    
      public String hiService(String name) {        
          return restTemplate.getForObject("http://SERVICE-HI/hi?name="+name,String.class);    
      }    
      public String hiError(String name) {
          return "hi,"+name+",sorry,error!";    
      }
  }
  ```

- 启动：service-ribbon 工程，当我们访问http://localhost:8764/hi?name=123,浏览器显示：

> hi 123,i am from port:8762

- 此时关闭 service-hi 工程，当我们再访问http://localhost:8764/hi?name=123，浏览器会显示：

  > hi ,123,orry,error!

  这就说明当 service-hi 工程不可用的时候，service-ribbon调用 service-hi的API接口时，会执行快速失败，直接返回一组字符串，而不是等待响应超时，这很好的控制了容器的线程阻塞。

### Feign中使用断路器

- **Feign**是**自带断路器**的，在D版本的Spring Cloud之后，它**没有默认打开**。需要在**配置文件中配置**打开它

  ```yml
  feign:  
  	hystrix:    
  		enabled: true
  ```

- 创建service接口的扩展类,使用`@component`注解注册组件,然后重写service接口方法,方法中写断路时传达错误信息的内容.

- 然后在FeignClient的SchedualServiceHi接口的注解中加上fallback的指定类就行了

  ```java
  @Component
  public class SchedualServiceHiHystric implements SchedualServiceHi {    
      @Override    
      public String sayHiFromClientOne(String name) {
          return "sorry "+name;    
      }
  }
  ```

  ```java
  @FeignClient(value = "service-hi",fallback = SchedualServiceHiHystric.class)
  public interface SchedualServiceHi {    
      @RequestMapping(value = "/hi",method = RequestMethod.GET)    
      String sayHiFromClientOne(@RequestParam(value = "name") String name);
  }
  ```

- 启动四servcie-feign工程，浏览器打开http://localhost:8765/hi?name=123,注意此时service-hi工程没有启动，网页显示：

  > sorry 123

  打开service-hi工程，再次访问，浏览器显示：

  > hi 123,i am from port:8762

  这证明断路器起到作用了。

## 第5篇：Zuul

- Zuul的**主要功能**是**路由转发**和**过滤器**。路由功能是微服务的一部分，比如／api/user转发到到user服务，/api/shop转发到到shop服务。zuul默认和Ribbon结合实现了负载均衡的功能。

### 创建zuul工程

- pom.xml依赖如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>org.example</groupId>
          <artifactId>f-version-cloud</artifactId>
          <version>1.0-SNAPSHOT</version>
      </parent>
      <artifactId>service-zuul</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <packaging>jar</packaging>
      <name>service-zuul</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- 启动类添加注解

> @EnableZuulProxy
> @EnableEurekaClient
> @EnableDiscoveryClient

- yml配置

  ```yml
  eureka:
    client:
      serviceUrl:
        defaultZone: http://localhost:8761/eureka/
  server:
    port: 8769
  spring:
    application:
      name: service-zuul
  zuul:
    routes:
      api-a:
        path: /api-a/**
        serviceId: service-ribbon
      api-b:
        path: /api-b/**
        serviceId: service-feign 
  ##首先指定服务注册中心的地址为http://localhost:8761/eureka/，服务的端口为8769，服务名为service-zuul；以/api-a/ 开头的请求都转发给service-ribbon服务；以/api-b/开头的请求都转发给service-feign服务
  ```

- 依次运行这五个工程;打开浏览器访问：http://localhost:8769/api-a/hi?name=forezp ;

- 浏览器显示：

  > hi forezp,i am from port:8762

- 打开浏览器访问：http://localhost:8769/api-b/hi?name=forezp ;浏览器显示：

  > hi forezp,i am from port:8762

- 这说明zuul起到了路由的作用

### 服务过滤

- 过滤类

  ```java
  @Component
  public class MyFilter extends ZuulFilter {
  
      private static Logger log = LoggerFactory.getLogger(MyFilter.class);
      @Override
      public String filterType() {
          return "pre";
      }
  
      @Override
      public int filterOrder() {
          return 0;
      }
  
      @Override
      public boolean shouldFilter() {
          return true;
      }
  
      @Override
      public Object run() {
          RequestContext ctx = RequestContext.getCurrentContext();
          HttpServletRequest request = ctx.getRequest();
          log.info(String.format("%s >>> %s", request.getMethod(), request.getRequestURL().toString()));
          Object accessToken = request.getParameter("token");
          if(accessToken == null) {
              log.warn("token is empty");
              ctx.setSendZuulResponse(false);
              ctx.setResponseStatusCode(401);
              try {
                  ctx.getResponse().getWriter().write("token is empty");
              }catch (Exception e){}
  
              return null;
          }
          log.info("ok");
          return null;
      }
  }
  ```

- filterType：返回一个字符串代表过滤器的类型，在zuul中定义了四种不同生命周期的过滤器类型，具体如下：

  - pre：路由之前
  - routing：路由之时
  - post： 路由之后
  - error：发送错误调用

- filterOrder：过滤的顺序

- shouldFilter：这里可以写逻辑判断，是否要过滤，本文true,永远过滤。

- run：过滤器的具体逻辑。可用很复杂，包括查sql，nosql去判断该请求到底有没有权限访问。

这时访问：http://localhost:8769/api-a/hi?name=forezp ；网页显示：

> token is empty

访问 http://localhost:8769/api-a/hi?name=forezp&token=22 ； 网页显示：

> hi forezp,i am from port:8762

### 总结

- zuul可以做路由转发,可以做服务过滤
- 路由转发只需要在启动类加固定注解,然后去到yml中做每个服务的配置,配置好每个路由的名字,地址和ID,即可通过路由后的地址访问具体服务
- 服务过滤只需要创建过滤类,集成固定过滤类`ZuulFilter`,然后注释`@Component`注册,在固定方法中写好规则.运行即可生效

## 第6篇：config

### 构建Config Server

- 首先创建一个父项目,pom文件如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-parent</artifactId>
          <version>2.0.3.RELEASE</version>
          <relativePath/>
      </parent>
      <groupId>com.example</groupId>
      <artifactId>spring-cloud-config</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>spring-cloud-config</name>
      <description>Demo project for Spring Boot</description>
      <packaging>pom</packaging>
  <!--    <modules>-->
  <!--        <module>config-server</module>-->
  <!--        <module>config-client</module>-->
  <!--    </modules>-->
  
      <properties>
          <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
          <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
          <java.version>1.9</java.version>
          <spring-cloud.version>Finchley.RELEASE</spring-cloud.version>
      </properties>
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-test</artifactId>
              <scope>test</scope>
          </dependency>
      </dependencies>
  
      <dependencyManagement>
          <dependencies>
              <dependency>
                  <groupId>org.springframework.cloud</groupId>
                  <artifactId>spring-cloud-dependencies</artifactId>
                  <version>${spring-cloud.version}</version>
                  <type>pom</type>
                  <scope>import</scope>
              </dependency>
          </dependencies>
      </dependencyManagement>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- 创建一个子工程,命名为config-server,就是我们的配置管理中心项目

- pom文件如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>com.example</groupId>
          <artifactId>spring-cloud-config</artifactId>
          <version>0.0.1-SNAPSHOT</version>
      </parent>
  
      <artifactId>config-server</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>config-server</name>
      <description>Demo project for Spring Boot</description>
  
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
  
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-config-server</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- yml配置如下

  ```yml
  spring:
    application:
      name: config-server
    cloud:
      config:
        server:
          git:
            uri: https://github.com/forezp/SpringcloudConfig/  ##配置git仓库地址
            search-paths: respo ##配置仓库路径
            username: ##账号,公用仓库可以不填
            password: ##密码,公用仓库可以不填
        label: master ##配置仓库的分支
  server:
    port: 8888
  
  
  ```

  

- 在启动类加上注解`@EnableConfigServer`就完成了注册中心的注册

- 远程仓库https://github.com/forezp/SpringcloudConfig/ 中有个文件config-client-dev.properties文件中有一个属性：

  > foo = foo version 3

  启动程序：访问http://localhost:8888/foo/dev

- 得到`{"name":"foo","profiles":["dev"],"label":null,"version":"0fc8081c507d694b27967e9074127b373d196431","state":null,"propertySources":[]}`

- http请求地址和资源文件映射如下:

  - /{application}/{profile}[/{label}]
  - /{application}-{profile}.yml
  - /{label}/{application}-{profile}.yml
  - /{application}-{profile}.properties
  - /{label}/{application}-{profile}.properties


### 构建一个config client

- pom文件如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>com.example</groupId>
          <artifactId>spring-cloud-config</artifactId>
          <version>0.0.1-SNAPSHOT</version>
      </parent>
      <artifactId>config-client</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>config-client</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-config</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- yml配置如下

  ```yml
  spring:
    application:
      name: config-client
    cloud:
      config:
        label: master
        profile: dev
        uri: http://localhost:8888/
  server:
    port: 8881
  
  ```

- 在启动类写一个接口,直接返回从配置中心读取到的配置值

  ```java
  @SpringBootApplication
  @RestController
  public class ConfigClientApplication {
  
  	public static void main(String[] args) {
  		SpringApplication.run(ConfigClientApplication.class, args);
  	}
  
  	@Value("${foo}")
  	String foo;
  	@RequestMapping(value = "/hi")
  	public String hi(){
  		return foo;
  	}
  }
  ```

- 打开网址访问：http://localhost:8881/hi，网页显示：

  > foo version 3

  这就说明，config-client从config-server获取了foo的属性，而config-server是从git仓库读取的

### 总结

- config组件就是需要我们**注册一个配置中心**来管理那些重复在子项目中使用到的配置
- 注解`@EnableConfigServer`就完成了注册中心的注册
- 然后配套**各自不同的配置**就由子项目**自己配置**,然后也要配置好配置中心的仓库,分支方便我们**去取主配置**

## 第7篇：高可用的分布式配置中心

### 创建注册中心

- 这里教程出现了很大的错误,经过个人琢磨最后解决

- 首先创建一个eureka-server工程，用作服务注册中心。

- pom.xml文件配置如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>com.example</groupId>
          <artifactId>spring-cloud-config</artifactId>
          <version>0.0.1-SNAPSHOT</version>
      </parent>
      <artifactId>eureka-server</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>eureka-server</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <!--这里是spring-cloud-starter-netflix-eureka-server而不是spring-cloud-starter-netflix-eureka-client,教程里则是直接放成了config-server的配置,完全对不上号-->
              <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- yml配置如下

  ```yml
  server:
    port: 8889
  
  eureka:
    instance:
      hostname: localhost
    client:
      registerWithEureka: false
      fetchRegistry: false
      serviceUrl:
        defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
  
  ```

- 启动类上添加`@EnableEurekaServer`注释完成注册中心的注册

- 然后还要去最大的父工程注册`<module>`标签,当然这一步我不清楚是否必须.

### 改造config-server

- 在之前的基础上pom.xml依赖中添加`spring-cloud-starter-netflix-eureka-client`,如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>com.example</groupId>
          <artifactId>spring-cloud-config</artifactId>
          <version>0.0.1-SNAPSHOT</version>
      </parent>
  
      <artifactId>config-server</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>config-server</name>
      <description>Demo project for Spring Boot</description>
  
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
  
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-config-server</artifactId>
          </dependency>
  
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- yml配置在之前的基础上指定服务注册地址为http://localhost:8889/eureka/

  ```yml
  spring:
    application:
      name: config-server
    cloud:
      config:
        server:
          git:
            uri: https://github.com/forezp/SpringcloudConfig/
            search-paths: respo
            username:
            password:
        label: master
  server:
    port: 8888
  eureka:
    client:
      serviceUrl:
        defaultZone: http://localhost:8889/eureka/
  
  
  ```

- 在启动类上添加`@EnableEurekaClient`注解

### 改造config-client

- pom.xml在之前的基础上加上起步依赖`spring-cloud-starter-netflix-eureka-client`

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>com.example</groupId>
          <artifactId>spring-cloud-config</artifactId>
          <version>0.0.1-SNAPSHOT</version>
      </parent>
      <artifactId>config-client</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>config-client</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-config</artifactId>
          </dependency>
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
          </dependency>
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- yml配置加上服务注册地址为http://localhost:8889/eureka/

  ```yml
  spring:
    application:
      name: config-client
    cloud:
      config:
        label: master
        profile: dev
        ##uri: http://localhost:8888/
        discovery:
          ## 从配置中心读取文件
          enabled: true
          ## 配置中心的servieId，即服务名。
          service-id: config-server
  server:
    port: 8881
  eureka:
    client:
      serviceUrl:
        defaultZone: http://localhost:8889/eureka/
  
  ```

- 这时发现，在读取**配置文件不再写ip地址**，而是**服务名**，这时如果配置服务部署多份，通过负载均衡，从而高可用。

- 依次启动eureka-servr,config-server,config-client 访问网址：http://localhost:8889/

  ![Paste_Image.png](https://www.fangzhipeng.com/img/jianshu/2279594-1639fdb713faa405.png)

- 访问http://localhost:8881/hi，浏览器显示：

  > foo version 3

### 总结

- 想要构建一个高可用的分布式配置中心,就需要把配置中心**组成微服务**
- **首先创建一个微服务的注册中心**,然后把所有配置中心都注册进去,当然其他的配置项目也要注册
- 组成微服务后,yml配置文件中**原本需要ip地址指定**配置中心就改为了**服务名指定**,就可以**多个地址部署**配置中心**相同的服务名**,然后负载均衡达到高可用

## 第8篇：Spring Cloud Bus

- 使用Bus之前还需要一些准备工作,最开始肯定是需要下载rabbitmq

### 改造confg-client

- 这是接着之前的代码写,首先把之前的配置模块客户端子项目的依赖加上`spring-cloud-starter-bus-amqp`和`spring-boot-starter-actuator`

  ```xml
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-config</artifactId>
  </dependency>
  
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
  </dependency>
  
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-bus-amqp</artifactId>
  </dependency>
  
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```

- 配置的修改教程中是让添加这些,但是这个版本的配置每次**只能根据**你当前配置client项目的**port号**来**改变**你**对应port号**读到的**配置**

  ```yml
  spring:
    application:
      name: config-client
    cloud:
      bus:
        enabled: true
        trace:
          enabled: true
    rabbitmq:
      host: localhost
      port: 5672
      username: guest
      password: guest
  management:
    endpoints:
      web:
        exposure:
          include: bus-refresh
  ```

- 从网上搜到另一版本配置,只需要在8111一个port地址访问刷新配置就可以**改变所有port**号访问该项目**获取到的配置**,那自然我觉得**这个版本的配置更好用**

  ```yml
  spring:
    application:
      name: config-client
    cloud:
      bus:
        enabled: true
        trace:
          enabled: true
    rabbitmq:
      host: localhost
      port: 5672
      username: guest
      password: guest
  management:
    endpoints: # 暴露bus 接口 ，否则 更新 refresh 没用的
      web:
        exposure: # expose: "*" 已过期
          include: "*"
    endpoint:
      bus-refresh:
        enabled: true
  
  ```

- 在启动类添加`@RefreshScope`注释

- 依次启动eureka-server、confg-cserver,启动两个config-client，端口为：8881、8882。

  访问http://localhost:8881/hi 或者http://localhost:8882/hi 浏览器显示：

  > foo version 3  这里不一定是3,是在访问地址时,github上存储的配置文件的这一行的值

- 刚开始我访问这个hi接口会访问不到报错什么的,而且**作者的项目**我**无法修改**,我就去**作者的demo项目**里**点击编辑**然后github就会**自动把我编辑后的作者配置demo拉到我自己的github里**

- 之后我**修改**了**client-server** 的**git地址**为我自己的

  ```yml
  spring:
    application:
      name: config-server
    cloud:
      config:
        server:
          git:
            uri: https://github.com/emptybamboo/SpringcloudConfig
            search-paths: respo
            username:
            password:
        label: master
  ```

- 这下就可以正常启用config-client项目了

- 刚开始看的的起始值假设为foo version 3,我们去自己的github修改为foo version 666

- 这是再访问hi接口数据是不变的,我们访问http://localhost:8881/actuator/bus-refresh，你会发现config-client会重新读取配置文件

- 但是要特别注意,这里**必须是post请求**,**浏览器**直接访问**默认为get**,所以需要**用postman**发请求,这是个坑

- 此时的架构图：![Paste_Image.png](https://www.fangzhipeng.com/img/jianshu/2279594-9a119d83cf90069f.png)

- 当git文件更改的时候，通过pc端用post 向端口为8882的config-client发送请求/bus/refresh／；此时8882端口会发送一个消息，由消息总线向其他服务传递，从而使整个微服务集群都达到更新配置文件。

### 总结

- Bus归根结底的功能就是帮助配置中心刷新中心配置文件到所有配置子项目中去
- 在**不用重启项目**的情况下,即可**让github上**存储的**配置文件**更新**被本地的项目获取到**其中的**配置或属性**

## 第9篇：Sleuth

- Spring Cloud Sleuth 主要功能就是在分布式系统中提供**追踪**解决方案，并且**兼容**支持了 **zipkin**，你只需要在pom文件中引入相应的依赖即可。

- 微服务中随着业务不断扩张,服务之间的互相调用会越来越复杂,就像一团毛线错综复杂
- 所以我们就要对每个调用进行追踪,清晰地了解所有服务之间的调用详情

### 术语

- Span：基本工作单元，例如，在一个新建的span中发送一个RPC等同于发送一个回应请求给RPC，span通过一个64位ID唯一标识，trace以另一个64位ID表示，span还有其他数据信息，比如摘要、时间戳事件、关键值注释(tags)、span的ID、以及进度ID(通常是IP地址) span在不断的启动和停止，同时记录了时间信息，当你创建了一个span，你必须在未来的某个时刻停止它。
- Trace：一系列spans组成的一个树状结构，例如，如果你正在跑一个分布式大数据工程，你可能需要创建一个trace。
- Annotation：用来及时记录一个事件的存在，一些核心annotations用来定义一个请求的开始和结束
  - cs - Client Sent -客户端发起一个请求，这个annotion描述了这个span的开始
  - sr - Server Received -服务端获得请求并准备开始处理它，如果将其sr减去cs时间戳便可得到网络延迟
  - ss - Server Sent -注解表明请求处理的完成(当请求返回客户端)，如果ss减去sr时间戳便可得到服务端需要的处理请求时间
  - cr - Client Received -表明span的结束，客户端成功接收到服务端的回复，如果cr减去cs时间戳便可得到客户端从服务端获取回复的所有所需时间 将Span和Trace在一个系统中使用Zipkin注解的过程图形化

### 构建

- 案例主要有三个工程组成:一个server-zipkin,它的主要作用使用ZipkinServer 的功能，收集调用数据，并展示；一个service-hi,对外暴露hi接口；一个service-miya,对外暴露miya接口；这两个service可以相互调用；并且**只有调用**了，server-**zipkin才会收集数据**的，这就是为什么叫**服务追踪**了。

#### 创建server-zipkin

- 首先创建一个父项目,起名server-zipkin,一个普通的springboot项目即可,什么依赖都不需要勾选,但是注意springboot的版本要和使用的springcloud版本相兼容
- 下载`Zipkin Server`的jar包,我是直接从maven官网下载,三四十M大小那个
- 下载完成之后在放置jar包的文件夹运行`java -jar zipkin-server-2.10.1-exec.jar`即可启动,这时正常的话就可以打开`http://localhost:9411/`页面了,是zipkin的页面,可以查看对服务间调用的追踪

#### 创建service-hi

- 其pom.xml依赖如下

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>com.example</groupId>
          <artifactId>server-zipkin</artifactId>
          <version>0.0.1-SNAPSHOT</version>
      </parent>
  
      <artifactId>service-hi</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>service-hi</name>
      <description>Demo project for Spring Boot</description>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
  
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-zipkin</artifactId>
          </dependency>
  
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- 在yml文件中通过`spring.zipkin.base-url`配置`zipkin server`的地址

  ```yml
  server:
    port: 8988
  spring:
    zipkin:
      base-url: http://localhost:9411
    application:
      name: service-hi
  
  ```

- 对外暴露接口,做好调用`service-miya`服务的接口,以及被`service-miya`调用的接口

  ```java
  package com.example.servicehi;
  
  import brave.sampler.Sampler;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.context.annotation.Bean;
  import org.springframework.web.bind.annotation.RequestMapping;
  import org.springframework.web.bind.annotation.RestController;
  import org.springframework.web.client.RestTemplate;
  
  import java.util.logging.Level;
  import java.util.logging.Logger;
  
  @SpringBootApplication
  @RestController
  public class ServiceHiApplication {
  
      public static void main(String[] args) {
          SpringApplication.run(ServiceHiApplication.class, args);
      }
  
      private static final java.util.logging.Logger LOG = Logger.getLogger(ServiceHiApplication.class.getName());
  
      @Autowired
      private RestTemplate restTemplate;
  
      @Bean
      public RestTemplate getRestTemplate(){
          return new RestTemplate();
      }
  
      @RequestMapping("/hi")
      public String callHome(){
          LOG.log(Level.INFO,"calling trace service-hi ");
          return restTemplate.getForObject("http://localhost:8989/miya",String.class);//调用miya的服务接口
      }
  
      @RequestMapping("/info1")//据说这里如果写/info会出问题,就改为info1
      public String info(){//这个接口是被miya调用的
          LOG.log(Level.INFO, "calling trace service-hi ");
  
          return "i'm service-hi";
      }
  
      @Bean
      public Sampler defaultSampler() {
          return Sampler.ALWAYS_SAMPLE;
      }
  
  }
  
  ```

#### 创建service-miya

- 创建过程和service-hi完全相同

- pom.xml

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
      <parent>
          <groupId>com.example</groupId>
          <artifactId>server-zipkin</artifactId>
          <version>0.0.1-SNAPSHOT</version>
      </parent>
  
      <artifactId>service-miya</artifactId>
      <version>0.0.1-SNAPSHOT</version>
      <name>service-miya</name>
      <description>Demo project for Spring Boot</description>
      <properties>
          <java.version>1.8</java.version>
      </properties>
      <dependencies>
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-web</artifactId>
          </dependency>
  
          <dependency>
              <groupId>org.springframework.cloud</groupId>
              <artifactId>spring-cloud-starter-zipkin</artifactId>
          </dependency>
  
      </dependencies>
  
      <build>
          <plugins>
              <plugin>
                  <groupId>org.springframework.boot</groupId>
                  <artifactId>spring-boot-maven-plugin</artifactId>
              </plugin>
          </plugins>
      </build>
  
  </project>
  
  ```

- yml配置如下

  ```yml
  server:
    port: 8989
  spring:
    zipkin:
      base-url: http://localhost:9411
    application:
      name: service-miya
  
  ```

- 启动类如下

  ```java
  package com.example.servicemiya;
  
  import brave.sampler.Sampler;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.context.annotation.Bean;
  import org.springframework.web.bind.annotation.RequestMapping;
  import org.springframework.web.bind.annotation.RestController;
  import org.springframework.web.client.RestTemplate;
  
  import java.util.logging.Level;
  import java.util.logging.Logger;
  
  @SpringBootApplication
  @RestController
  public class ServiceMiyaApplication {
  
      public static void main(String[] args) {
          SpringApplication.run(ServiceMiyaApplication.class, args);
      }
  
      private static final Logger LOG = Logger.getLogger(ServiceMiyaApplication.class.getName());
  	
  
      @RequestMapping("/hi")//被hi服务调用的接口
      public String home(){
          LOG.log(Level.INFO, "hi is being called");
          return "hi i'm miya!";
      }
  
      @RequestMapping("/miya")
      public String info(){//调用hi中info1接口的接口
          LOG.log(Level.INFO, "info is being called");
          return restTemplate.getForObject("http://localhost:8988/info1",String.class);
      }
  
      @Autowired
      private RestTemplate restTemplate;
  
      @Bean
      public RestTemplate getRestTemplate(){
          return new RestTemplate();
      }
  
  
      @Bean
      public Sampler defaultSampler() {
          return Sampler.ALWAYS_SAMPLE;
      }
  }
  
  ```

---

- 依次启动上面的工程，打开浏览器访问：http://localhost:9411/

- 访问：http://localhost:8989/miya，浏览器出现：

  > i’m service-hi

- 再打开http://localhost:9411/的界面，点击Dependencies,可以发现服务的依赖关系

- ![img](https://www.fangzhipeng.com/img/jianshu/2279594-48cfbe426b23b7a5.png)

- 点击find traces,可以看到具体服务相互调用的数据：

- ![img](https://www.fangzhipeng.com/img/jianshu/2279594-3fe448b513ad867b.png)

### 总结

- **Sleuth就是使用zipkin去追踪微服务中服务之间互相调用的详情,让使用者更加了解服务之间调用的关系**

## 第10篇：高可用的服务注册中心

- Eureka通过运行多个实例，使其更具有高可用性。事实上，这是它默认的属性，你需要做的就是给对等的实例一个合法的关联serviceurl。

### 改造工程

- 在第一期注册中心的demo中修改

- 在eureka-server工程中resources文件夹下，创建配置文件application-peer1.yml

  ```yml
  server:
    port: 8761
  
  spring:
    profiles: peer1
  eureka:
    instance:
      hostname: peer1
    client:
      serviceUrl:
        defaultZone: http://peer2:8769/eureka/
  ```

- 并且创建另外一个配置文件application-peer2.yml：

  ```yml
  server:
    port: 8769
  
  spring:
    profiles: peer2
  eureka:
    instance:
      hostname: peer2
    client:
      serviceUrl:
        defaultZone: http://peer1:8761/eureka/
  ```

- eureka-server改造完毕。

- 按照官方文档的指示，需要改变etc/hosts，linux系统通过vim /etc/hosts ,加上：

> 127.0.0.1 peer1
> 127.0.0.1 peer2

- windows电脑，在`C:\Windows\System32\drivers\etc\hosts`修改。

- 改造下service-hi的yml配置

  ```yml
  eureka:
    client:
      serviceUrl:
        defaultZone: http://peer1:8761/eureka/
  server:
    port: 8762
  spring:
    application:
      name: service-hi
  ```

### 启动工程

- 按照教程这里应该是用**指令启动**工程,但是我启动的时候报错.并且我也不知道改到什么目录去运行指令,我自己尝试的是直接跑到项目target文件夹下

- 启动eureka-server：

> java -jar eureka-server-0.0.1-SNAPSHOT.jar - -spring.profiles.active=peer1
>
> java -jar eureka-server-0.0.1-SNAPSHOT.jar - -spring.profiles.active=peer2

> 

- 启动service-hi:

> java -jar service-hi-0.0.1-SNAPSHOT.jar

---

- 于是我去看了评论,可以直接**使用IDEA启动**

- 首先打开项目的编辑配置,在eureka-server的配置里先勾选**允许并行运行**

- 然后在**环境**配置中的**程序参数**配置`--spring.profiles.active=peer1`启动,再改为`--spring.profiles.active=peer2`再次启动,这下就启动完成了两个注册中心

- 然后直接启动service-hi

- 访问：localhost:8761,如图：

  ![Paste_Image.png](https://www.fangzhipeng.com/img/jianshu/2279594-659c68e405bd70bd.png)

- 你会发现注册了service-hi，并且有个peer2节点，同理访问localhost:8769你会发现有个peer1节点。

- peer1

  - # Instances currently registered with Eureka

    | Application    | AMIs        | Availability Zones | Status                                                       |
    | :------------- | :---------- | :----------------- | :----------------------------------------------------------- |
    | **SERVICE-HI** | **n/a** (1) | (1)                | **UP** (1) - [localhost:service-hi:8762](http://localhost:8762/actuator/info) |

    # General Info

    | Name                 | Value                      |
    | :------------------- | :------------------------- |
    | total-avail-memory   | 305mb                      |
    | environment          | test                       |
    | num-of-cpus          | 6                          |
    | current-memory-usage | 204mb (66%)                |
    | server-uptime        | 00:03                      |
    | registered-replicas  | http://peer1:8761/eureka/  |
    | unavailable-replicas | http://peer1:8761/eureka/, |
    | available-replicas   |                            |

- peer2

  - # Instances currently registered with Eureka

    | Application    | AMIs        | Availability Zones | Status                                                       |
    | :------------- | :---------- | :----------------- | :----------------------------------------------------------- |
    | **SERVICE-HI** | **n/a** (1) | (1)                | **UP** (1) - [localhost:service-hi:8762](http://localhost:8762/actuator/info) |

    # General Info

    

    | Name                 | Value                      |
    | :------------------- | :------------------------- |
    | total-avail-memory   | 305mb                      |
    | environment          | test                       |
    | num-of-cpus          | 6                          |
    | current-memory-usage | 51mb (16%)                 |
    | server-uptime        | 00:03                      |
    | registered-replicas  | http://peer2:8769/eureka/  |
    | unavailable-replicas | http://peer2:8769/eureka/, |
    | available-replicas   |                            |

- client只向8761注册，但是你打开8769，你也会发现，8769也有 client的注册信息。


### 总结

- 注册中心eureka的高可用就是去**修改host文件**,然后去到注册中心项目**添加**对应的**多个yml配置**,再把**注册的项目**中**serviceurl**配置**修改**
- 然后再**依次启动**不同port号的注册中心,这时启动项目就会在多个注册中心完成注册,实现高可用
- 不过确实修改host文件来完成注册中心的高可用显得有点low

## 第12篇：Hystrix Dashboard

- 在微服务架构中为例保证程序的可用性，防止程序出错导致网络阻塞，出现了断路器模型。断路器的状况反应了一个程序的可用性和健壮性，它是一个重要指标。**Hystrix Dashboard**是作为**断路器状态**的一个**组件**，提供了**数据监控**和友好的**图形化界面**。

### 改造service-hi

- 从第一章的demo改造项目

- 加入三个依赖

  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-hystrix</artifactId>
  </dependency>
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
  </dependency>
  ```

- yml配置添加

  ```yml
  management:
    endpoints:
      web:
        exposure:
          include: "*"
        cors:
          allowed-origins: "*"
          allowed-methods: "*"
  ```

- 在启动类添加`@EnableHystrix`注解开启断路器，这个是必须的，并且需要在程序中声明断路点HystrixCommand；加上`@EnableHystrixDashboard`注解，开启HystrixDashboard

- 改造启动类

  ```java
  @RequestMapping("/hi")
  @HystrixCommand(fallbackMethod = "hiError")
  public String home(@RequestParam(value = "name", defaultValue = "forezp") String name) {
      return "hi " + name + " ,i am from port:" + port;
  }
  
  public String hiError(String name) {
      return "hi,"+name+",sorry,error!";
  }
  ```

- 然后依次启动eureka-server 和service-hi.

- 启动应用，然后再浏览器中输入 `http://localhost:8762/hystrix` 可以看到如下界面
  [![img](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tNc79ly1fqea896gthj31kw0v9n3a.jpg)](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tNc79ly1fqea896gthj31kw0v9n3a.jpg)
  通过 Hystrix Dashboard 主页面的文字介绍，我们可以知道，Hystrix Dashboard 共支持三种不同的监控方式：

  - 默认的集群监控：通过 URL：`http://turbine-hostname:port/turbine.stream` 开启，实现对默认集群的监控。
  - 指定的集群监控：通过 URL：`http://turbine-hostname:port/turbine.stream?cluster=[clusterName]` 开启，实现对 clusterName 集群的监控。
  - 单体应用的监控： ~~通过 URL：`http://hystrix-app:port/hystrix.stream` 开启~~ ，实现对具体某个服务实例的监控。**（现在这里的 URL 应该为 `http://hystrix-app:port/actuator/hystrix.stream`，Actuator 2.x 以后 endpoints 全部在`/actuator`下，可以通过`management.endpoints.web.base-path`修改）**

  前两者都对集群的监控，需要整合 Turbine 才能实现。

  > 页面上的另外两个参数：
  >
  > - Delay：控制服务器上轮询监控信息的延迟时间，默认为 2000 毫秒，可以通过配置该属性来降低客户端的网络和 CPU 消耗。
  > - Title：该参数可以展示合适的标题。

- 在 Hystrix-Dashboard 的主界面上输入 eureka-consumer-feign-hystrix 对应的地址 http://localhost:8762/actuator/hystrix.stream ,2000,miya然后点击 Monitor Stream 按钮，进入页面。

- 如果没有请求会一直显示“Loading…”，这时访问 http://localhost:8762/actuator/hystrix.stream 也是不断的显示“ping”。

- 这时候访问一下 http://localhost:8762/hi?name=lzc，可以看到 Hystrix Dashboard 中出现了类似下面的效果
  [![img](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tKfTcly1fr2mou2nhfj30sg0brwgm.jpg)](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tKfTcly1fr2mou2nhfj30sg0brwgm.jpg)

> 如果在这个页面看到报错：`Unable to connect to Command Metric Stream.`，可以参考这个[Issue](https://github.com/Netflix/Hystrix/issues/1566)解决。

### 页面解读

[![img](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tNc79ly1fqefia3o64j30h90ae754.jpg)](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tNc79ly1fqefia3o64j30h90ae754.jpg)
以上图来说明其中各元素的具体含义：

- 实心圆：它有颜色和大小之分，分别代表实例的监控程度和流量大小。如上图所示，它的健康度从绿色、黄色、橙色、红色递减。通过该实心圆的展示，我们就可以在大量的实例中快速的发现故障实例和高压力实例。
- 曲线：用来记录 2 分钟内流量的相对变化，我们可以通过它来观察到流量的上升和下降趋势。
- 其他一些数量指标如下图所示
  [![img](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tNc79ly1fqeflypfdaj30o80cldhq.jpg)](https://cdn.jsdelivr.net/gh/zhaoyibo/resource@gh-pages/img/006tNc79ly1fqeflypfdaj30o80cldhq.jpg)

到此单个应用的熔断监控已经完成。

### 总结

- dashboard就是一个断路器的监控页面,可以监控断路器标识的一切服务和请求
