# maven

## 标签

### `<packaging>`

- 选择如何被打包,父模块一般是pom,子模块因为我使用的是docker替换jar包更新项目,所以配置为jar

### `<module>`

- springboot多模块开发时需要的标签,IDEA是会自动添加的,只会出现在父模块的`pom.xml`中,被`modules`标签包裹,其中每个标签中间的值是每个子模块的名字

  ```xml
  <!--模块化管理-->
  <modules>
      <module>financial-leasing-common</module>
      <module>financial-leasing-manage</module>
      <module>financial-leasing-h5</module>
  </modules>
  ```

### `<parent>`

- 用来配置父模块信息,项目父模块一般这里放的是springboot信息,而子模块一般放的都是父模块信息

- 父模块中:

  ```xml
  <!--项目最基础的父项目为springboot-->
  <parent>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>2.6.4</version>
      <relativePath/> <!-- lookup parent from repository -->
  </parent>
  ```

- 子模块中:

  ```xml
  <parent>
      <artifactId>financial-leasing</artifactId>
      <groupId>com.shineray</groupId>
      <version>0.0.1-SNAPSHOT</version>
  </parent>
  ```


### `<properties>`

- 用于存放一些maven配置文件`pom.xml`中需要多次使用的属性变量

- 比如有好几个依赖的版本是一致的,就提出来到这个标签中存储,再以`${}`语法引用版本号变量

  ```xml
  <!--项目依赖版本配置-->
  <properties>
      <java.version>11</java.version>
      <commons-pool2.version>2.11.1</commons-pool2.version>
      <org.springframework.boot.version>2.6.4</org.springframework.boot.version>
      <sa-token-spring-boot-starter.version>1.29.0</sa-token-spring-boot-starter.version>
      <smart-doc-maven-plugin.version>2.4.0</smart-doc-maven-plugin.version>
      <aliyun-sdk-oss.version>3.8.0</aliyun-sdk-oss.version>
  </properties>
  ```



### `<dependencies>`

- 这个标签就是一般用来放置依赖包的标签,在这个标签中的依赖会自动加载到子模块中,所以可能会导致一些重复引入或者子模块明明不使用某个依赖却被父模块注入依赖的问题

- **子模块**如果要**引入另外的公共模块**也是引入到这里的

  ```xml
  <!--dependencies中的依赖会被所有子模块直接引入-->
  <dependencies>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-web</artifactId>
          <version>${org.springframework.boot.version}</version>
      </dependency>
  
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-devtools</artifactId>
          <version>${org.springframework.boot.version}</version>
          <scope>runtime</scope>
          <optional>true</optional>
      </dependency>
      <dependency>
          <groupId>mysql</groupId>
          <artifactId>mysql-connector-java</artifactId>
          <scope>runtime</scope>
      </dependency>
      <dependency>
          <groupId>org.projectlombok</groupId>
          <artifactId>lombok</artifactId>
          <optional>true</optional>
      </dependency>
      <dependency>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-starter-test</artifactId>
          <version>${org.springframework.boot.version}</version>
          <scope>test</scope>
      </dependency>
  </dependencies>
  ```
### `<dependencyManagement>`

- 在这个标签中的依赖包引入了当前模块,**但不会自动引入子模块**,如果想引入子模块,需要在子模块中使用`<dependency>`标签引入,可以不用写version标签,自动继承父模块的这个依赖,包括版本

  ```xml
  <!--不会自动注入子模块的依赖,需要在子模块中手动添加,当然,就不用子模块添加version标签了-->
  <!--dependencyManagement中的dependency中必须指明version标签,不然选择性子模块继承的时候会报错-->
  <dependencyManagement>
      <dependencies>
          <!--redis依赖包-->
          <!--Spring Boot 2.x以后底层不再使用 Jedis，而是换成了 Lettuce-->
          <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-data-redis</artifactId>
              <version>${org.springframework.boot.version}</version>
          </dependency>
          <!--redis连接池-->
          <dependency>
              <groupId>org.apache.commons</groupId>
              <artifactId>commons-pool2</artifactId>
              <version>${commons-pool2.version}</version>
          </dependency>
          <!-- Sa-Token 权限认证, 在线文档：http://sa-token.dev33.cn/ -->
          <dependency>
              <groupId>cn.dev33</groupId>
              <artifactId>sa-token-spring-boot-starter</artifactId>
              <version>${sa-token-spring-boot-starter.version}</version>
          </dependency>
          <!-- Sa-Token 整合 Redis （使用jdk默认序列化方式） -->
          <dependency>
              <groupId>cn.dev33</groupId>
              <artifactId>sa-token-dao-redis</artifactId>
              <version>${sa-token-spring-boot-starter.version}</version>
          </dependency>
          <!--阿里云上传文件-->
          <dependency>
              <groupId>com.aliyun.oss</groupId>
              <artifactId>aliyun-sdk-oss</artifactId>
              <version>${aliyun-sdk-oss.version}</version>
          </dependency>
      </dependencies>
  </dependencyManagement>
  ```
### `<plugins>`

- 类似`dependencies`标签,该标签用来配置插件,插件会自动被加载到子模块,外层需要被build标签包裹

  ```xml
  <plugins>
      <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
          <configuration>
              <excludes>
                  <exclude>
                      <groupId>org.projectlombok</groupId>
                      <artifactId>lombok</artifactId>
                  </exclude>
              </excludes>
          </configuration>
      </plugin>
  </plugins>
  ```

### `<pluginManagement>`

- 和`dependencyManagement`标签类似,加载插件,但是**不会自动把插件加载到子模块**中,需要子模块中手动加载

- 父模块

  ```xml
  <pluginManagement>
      <plugins>
          <plugin>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-maven-plugin</artifactId>
          </plugin>
          <!--编译插件-->
          <plugin>
              <groupId>org.apache.maven.plugins</groupId>
              <artifactId>maven-compiler-plugin</artifactId>
              <configuration>
                  <source>${java.version}</source>
                  <target>${java.version}</target>
                  <encoding>utf-8</encoding>
              </configuration>
          </plugin>
      </plugins>
  </pluginManagement>
  ```

- 子模块

  ```xml
  <plugins>
      <!--编译插件,这俩注释了也是一样可以打包..-->
      <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-compiler-plugin</artifactId>
      </plugin>
      <plugin>
          <groupId>org.springframework.boot</groupId>
          <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
      <!--smart-doc文档生成插件-->
      <plugin>
          <groupId>com.github.shalousun</groupId>
          <artifactId>smart-doc-maven-plugin</artifactId>
          <version>${smart-doc-maven-plugin.version}</version>
          <configuration>
              <!--指定生成文档的使用的配置文件,配置文件放在自己的项目中-->
              <configFile>./src/main/resources/smart-doc.json</configFile>
              <!--指定项目名称-->
              <projectName>鑫源融资租赁系统-后台管理</projectName>
              <!--smart-doc实现自动分析依赖树加载第三方依赖的源码，如果一些框架依赖库加载不到导致报错，这时请使用excludes排除掉-->
              <!--					<excludes>-->
              <!--格式为：groupId:artifactId;参考如下-->
              <!--也可以支持正则式如：com.alibaba:.* -->
              <!--						<exclude>com.alibaba:fastjson</exclude>-->
              <!--					</excludes>-->
              <!--includes配置用于配置加载外部依赖源码,配置后插件会按照配置项加载外部源代码而不是自动加载所有，因此使用时需要注意-->
              <!--smart-doc能自动分析依赖树加载所有依赖源码，原则上会影响文档构建效率，因此你可以使用includes来让插件加载你配置的组件-->
              <includes>
                  <!--格式为：groupId:artifactId;参考如下-->
                  <!--也可以支持正则式如：com.alibaba:.* -->
                  <!--目前还没有,但是我感觉用到mybatisplus可能性比较大-->
                  <!--                            <include>com.alibaba:fastjson</include>-->
                  <include>com.shineray:financial-leasing-common</include>
                  <include>com.baomidou:mybatis-plus-generator</include>
              </includes>
          </configuration>
          <executions>
              <execution>
                  <!--如果不需要在执行编译时启动smart-doc，则将phase注释掉-->
                  <phase>compile</phase>
                  <goals>
                      <!--smart-doc提供了html、openapi、markdown等goal，可按需配置-->
                      <goal>html</goal>
                      <goal>markdown</goal>
                      <!--                            <goal>openapi</goal>-->
                  </goals>
              </execution>
          </executions>
      </plugin>
  </plugins>
  ```

## 插件

### spring-boot-maven-plugin

- 要注意像common这种**不跑具体业务的`工具/通用模块`**是**没有启动类**的,也很可能没有配置文件,那一般来说打包的时候会出问题**Unable to find main class**,一个办法可以解决,在你的common这种模块的**pom中添加spring-boot-maven-plugin插件配置跳过**即可

- ```xml
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

  

## 疑难

### 引入第三方jar包

- 有时候去对接第三方API他们会需要你引入一些他们写好的第三方jar包,这些jar包maven仓库是没有的直接以文件形式给到我们

- 在本地maven仓库安装所有第三方jar包,然后用普通方式引入子项目模块,不然子项目模块加载不到第三方包中的类

  ```shell
  mvn install:install-file -Dfile=D:\software\develop\xinyuan-project\financial-leasing\financial-leasing-common\lib\anxinsign\common-3.7.3.2-tsvo.jar -DgroupId=common -DartifactId=common -Dversion=3.7.3.2 -Dpackaging=jar
  mvn install:install-file -Dfile=D:\software\develop\xinyuan-project\financial-leasing\financial-leasing-common\lib\anxinsign\jackson-annotations-2.11.1.jar -DgroupId=jackson-annotations -DartifactId=jackson-annotations -Dversion=2.11.1 -Dpackaging=jar
  ```

- 然后以正常方式在manage模块的pom.xml中引入依赖

  ```xml
  <!--引入第三方jar包-->
  <dependency>
      <groupId>jackson-annotations</groupId>
      <artifactId>jackson-annotations</artifactId>
      <version>2.11.1</version>
  </dependency>
  <dependency>
      <groupId>jackson-core</groupId>
      <artifactId>jackson-core</artifactId>
      <version>2.11.1</version>
  </dependency>
  <dependency>
      <groupId>jackson-databind</groupId>
      <artifactId>jackson-databind</artifactId>
      <version>2.11.1</version>
  </dependency>
  ```

  