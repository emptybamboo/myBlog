# Maven笔记

- 我的一个springboot多模块项目,有一个公共模块common,还有一个存放数据相关文件的data模块,现在有个业务模块manage,引入里common和data模块,但是现在IDEA侧边栏里报错,报错信息

  ```
  [INFO] Validation error:
  
  [ERROR] org.eclipse.aether.resolution.ArtifactDescriptorException: Failed to read artifact descriptor for com.google.protobuf:protobuf-java:jar:3.21.9
  
  [ERROR] Maven server structure problem
  
  [ERROR] org.eclipse.aether.resolution.ArtifactDescriptorException: Failed to read artifact descriptor for com.google.protobuf:protobuf-java:jar:3.21.9
  
  无法解析 io.netty:netty-transport:4.1.89.Final
  
  无法解析 jakarta.annotation:jakarta.annotation-api:1.3.5
  
  无法解析 org.codehaus.jettison:jettison:1.5.2
  
  无法解析 com.fasterxml.jackson.core:jackson-core:2.13.5
  
  无法解析 com.aliyun:aliyun-java-sdk-ram:3.1.0
  
  无法解析 org.springframework.boot:spring-boot-starter-web:2.7.9
  
  无法解析 commons-codec:commons-codec:1.15
  
  无法解析 commons-logging:commons-logging:1.2
  
  无法解析 org.springframework:spring-aop:5.3.25
  
  无法解析 com.baomidou:mybatis-plus:3.5.3.1
  
  无法解析 org.springframework:spring-web:5.3.25
  
  无法解析 org.reactivestreams:reactive-streams:1.0.4
  
  无法解析 com.fasterxml.jackson.core:jackson-databind:2.13.5
  
  无法解析 org.springframework.boot:spring-boot-starter-aop:2.7.9
  
  无法解析 org.springframework.boot:spring-boot-starter-json:2.7.9
  
  无法解析 com.aliyun.oss:aliyun-sdk-oss:3.16.1
  
  无法解析 org.apache.tomcat.embed:tomcat-embed-el:9.0.71
  
  无法解析 com.baomidou:mybatis-plus-boot-starter:3.5.3.1
  
  无法解析 org.springframework.boot:spring-boot-starter-logging:2.7.9
  
  无法解析 org.springframework.boot:spring-boot-starter-tomcat:2.7.9
  
  无法解析 org.springframework:spring-jdbc:5.3.25
  
  无法解析 org.springframework.data:spring-data-commons:2.7.8
  
  无法解析 org.springframework:spring-webmvc:5.3.25
  
  无法解析 com.baomidou:mybatis-plus-core:3.5.3.1
  
  无法解析 org.jdom:jdom2:2.0.6.1
  
  无法解析 org.apache.tomcat.embed:tomcat-embed-core:9.0.71
  
  无法解析 org.springframework:spring-core:5.3.25
  
  无法解析 com.aliyun:aliyun-java-sdk-core:4.5.10
  
  无法解析 io.opentracing:opentracing-util:0.33.0
  
  无法解析 io.netty:netty-buffer:4.1.89.Final
  
  无法解析 org.springframework.boot:spring-boot-starter-jdbc:2.7.9
  
  无法解析 org.slf4j:jul-to-slf4j:1.7.36
  
  无法解析 org.springframework.boot:spring-boot:2.7.9
  
  无法解析 javax.xml.bind:jaxb-api:2.3.1
  
  无法解析 ch.qos.logback:logback-classic:1.2.11
  
  无法解析 org.springframework:spring-context-support:5.3.25
  
  无法解析 org.ini4j:ini4j:0.5.4
  
  无法解析 com.google.protobuf:protobuf-java:3.21.9
  
  无法解析 org.springframework.boot:spring-boot-starter:2.7.9
  
  无法解析 org.springframework.boot:spring-boot-autoconfigure:2.7.9
  
  无法解析 org.springframework.data:spring-data-keyvalue:2.7.8
  
  无法解析 org.springframework:spring-beans:5.3.25
  
  无法解析 org.jacoco:org.jacoco.agent:0.8.5
  
  无法解析 org.springframework:spring-jcl:5.3.25
  
  无法解析 org.springframework:spring-expression:5.3.25
  
  无法解析 com.baomidou:mybatis-plus-annotation:3.5.3.1
  
  无法解析 com.google.code.gson:gson:2.9.1
  
  无法解析 com.fasterxml.jackson.core:jackson-annotations:2.13.5
  
  无法解析 org.springframework:spring-tx:5.3.25
  
  无法解析 org.mybatis:mybatis-spring:2.0.7
  
  无法解析 org.apache.logging.log4j:log4j-to-slf4j:2.17.2
  
  无法解析 ch.qos.logback:logback-core:1.2.11
  
  无法解析 io.opentracing:opentracing-api:0.33.0
  
  无法解析 org.apache.httpcomponents:httpclient:4.5.14
  
  无法解析 org.springframework:spring-context:5.3.25
  
  无法解析 org.apache.httpcomponents:httpcore:4.4.16
  
  无法解析 com.fasterxml.jackson.datatype:jackson-datatype-jdk8:2.13.5
  
  无法解析 com.mysql:mysql-connector-j:8.0.32
  
  无法解析 io.lettuce:lettuce-core:6.1.10.RELEASE
  
  无法解析 io.netty:netty-resolver:4.1.89.Final
  
  无法解析 cn.hutool:hutool-all:5.8.15
  
  无法解析 com.aliyun:aliyun-java-sdk-kms:2.11.0
  
  无法解析 com.shineray:data:1.0.0
  
  无法解析 io.projectreactor:reactor-core:3.4.27
  
  无法解析 com.github.jsqlparser:jsqlparser:4.4
  
  无法解析 org.yaml:snakeyaml:1.30
  
  无法解析 io.opentracing:opentracing-noop:0.33.0
  
  无法解析 com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.13.5
  
  无法解析 org.apache.tomcat.embed:tomcat-embed-websocket:9.0.71
  
  无法解析 com.baomidou:mybatis-plus-extension:3.5.3.1
  
  无法解析 org.slf4j:slf4j-api:1.7.36
  
  无法解析 org.aspectj:aspectjweaver:1.9.7
  
  无法解析 org.springframework:spring-oxm:5.3.25
  
  无法解析 io.netty:netty-handler:4.1.89.Final
  
  无法解析 com.fasterxml.jackson.module:jackson-module-parameter-names:2.13.5
  
  无法解析 com.zaxxer:HikariCP:4.0.3
  
  无法解析 javax.activation:javax.activation-api:1.2.0
  
  无法解析 com.baomidou:mybatis-plus-generator:3.5.3.1
  
  无法解析 org.springframework.data:spring-data-redis:2.7.8
  
  无法解析 com.shineray:common:1.0.0
  
  无法解析 org.springframework.boot:spring-boot-starter-data-redis:2.7.9
  
  无法解析 io.netty:netty-codec:4.1.89.Final
  
  无法解析 org.mybatis:mybatis:3.5.10
  
  无法解析 io.netty:netty-common:4.1.89.Final
  
  无法解析 org.apache.logging.log4j:log4j-api:2.17.2
  
  无法解析 io.netty:netty-transport-native-unix-common:4.1.89.Final
  ```

- 这是因为什么,该如何解决

- 父工程的pom文件没有执行install到本地仓库去，导致子工程没有东西去继承

---

- 如果是在项目根pom中,想要去写依赖,切记不能直接写在dependencyManagement标签里面,如果写在里面配合properties标签中的版本号,会导致依赖拉不下来,解决办法就是在dependencyManagement标签外面再写一个dependencies标签,把依赖先放在这个标签里刷新拉取,拉取完毕再放回dependencyManagement标签即可
- 在`<dependencyManagement>`标签中声明的依赖只是提供了一些元数据，并不会真正引入到项目中，除非在`<dependencies>`标签中再次声明。这样做的好处是可以避免重复或冲突的依赖声明，也可以让子模块继承父模块的依赖管理。

---

- 我现在要做一个多模块的springboot项目,有一个共用模块common模块,处理很多模块都要使用的功能,然后剩余的好几个业务模块可能会有一些maven依赖会重复,我应该把重复用到的依赖写在总项目的pom.xml中还是写在通用模块的pom.xml中更好呢??
- 你好，这是Bing。
- 根据搜索结果，你可以把重复用到的依赖写在总项目的pom.xml中，然后在子模块中引用父模块的依赖管理。这样可以避免重复定义依赖版本，也可以方便修改和维护。
- 你还有其他问题吗？
- 那我把重复用到的依赖放在common共用模块可以吗
- 你可以把重复用到的依赖放在common共用模块，但是这样的话，你需要在其他业务模块中引用common模块，否则无法使用依赖。如果你的业务模块之间没有依赖关系，那么这样做可能会增加不必要的耦合。

