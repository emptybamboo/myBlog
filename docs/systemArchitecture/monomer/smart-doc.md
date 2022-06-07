# smart-doc

- smart-doc是一个生成文档的插件,类似swagger,但是使用起来要简单的多,只需要简单的写好注释就可以生成对应的文档,用以和前端对接接口以及记录自己觉得重要的信息
- 最终如果把项目打成jar包后,访问文档的地址为`http://ip:端口号/doc/index.html`,最后的index.html不固定,由配置文件中的`allInOneDocFileName`而变

## 使用

### 配置文件

- 需要在项目中创建一个**json配置文件**,以供maven/gradle插件使用

> 比如我就放在了`src/main/resources/smart-doc.json`

- 如果项目是**多模块项目**,请把配置文件**放在需要生成文档的模块**下

- 我用到的配置如下

  ```json
  {
    "outPath": "./src/main/resources/static/doc",//指定文档的输出路径,如果你想把html文档也打包到应用中一起访问，则建议你配置路径为：src/main/resources/static/doc
    "serverUrl": "http://localhost:8082",//服务器地址,非必须。导出postman建议设置成http://{{server}}方便直接在postman直接设置环境变量
    "allInOne": true,//是否将文档合并到一个文件中，一般推荐为true
    "allInOneDocFileName": "index.html"//自定义设置输出文档名称, @since 1.9.0
  }
  ```

### maven插件

- 对于多模块的`Maven`，把`smart-doc`插件相关配置放到启动模块的`pom.xml`中。

- 配置好之后刷新maven插件,IDEA的maven中,打开具体配置的模块,点开插件选项就可以看到有一个smart-doc选项,**可以手动编译**文档,不过我一般都是**配置自动在打jar包的时候生成文档**

- 我的项目中使用的插件配置如下

  ```xml
      <build>
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
                          <projectName>项目名称</projectName>
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
                              <!--我感觉这个还是挺实用的,因为可以在打包的时候进行文档编译,最后打包好替换docker中的jar包时,项目代码也更新了,文档也更新好了-->
                              <phase>compile</phase>
                              <goals>
                                  <!--smart-doc提供了html、openapi、markdown等goal，可按需配置-->
                                  <goal>html</goal>
                                  <goal>markdown</goal>
                              </goals>
                          </execution>
                      </executions>
                  </plugin>
              </plugins>
      </build>
  ```

### 注释

- 注释是smart-doc的核心部分,文档就是由注释生成而来

- 而注释之中用以区分功能性的就是注释中的标签(tag)

- `smart-doc`的实现初衷是通过使用`javadoc`文档注释来去除注解式的侵入， 因此`smart-doc`每增加一个功能首先都是去考虑`javadoc`原生的`tag`

- 目前我最常使用的tag如下

  - @param:

    - 代表目前注释方法的**形参**,也就是`method(String param1,Integer param2)`这种参数

    - 特殊用法:

      - mock

        ```java
        /**
         * Test @RequestParam
         *
         * @param author 作者|村上春树
         * @param type   type
         */
        @GetMapping("testRequestParam")
        public void testRequestParam(@RequestParam String author, @RequestParam String type) {
        
        }
        ```

        - 上面通过|符号后面添加了作者的`mock`值为`村上春树`

      - 参数对象替换

        - 例如一些对象在框架底层做了特殊处理，`smart-doc`根据原始参数对象依赖过于强大的分析处理后的文档可能并不符合要求，这时你可以定义一个参数对象来 替换，然后`smart-doc`按照你指定的对象来输出文档。

          ```java
          /**
           * 参数对象替换测试
           * @param pageable com.power.doc.model.PageRequestDto
           * @return
           */
          @PostMapping(value = "/enum/resp")
          public SimpleEnum resp(@RequestBody Pageable pageable){
              return null;
          }
          //上面的写法中smart-doc就会使用com.power.doc.model.PageRequestDto代替JPA的Pageable做文档渲染，注意类名必须是全类名。
          ```

        > 尽量少采用这种参数替换的形式，代码书写很不方便，建议直接自己定义对象作为入参

    - @tag

      - `@tag`用于将`Controller`方法分类, 可以将不同`Contoller`下的方法指定到多个分类下, 同时也可以直接指定`Controller`为一个分类或多个分类

      - 使用了这个标签,会在最后生成的文档网页中将@tag的值相同的controller方法**归类到同一级菜单**下

        ```java
            /**
             * 新建业务(合同)
             *
             * @param req 请求参数
             * @tag 业务办理
             */
            @PostMapping("/add")
            @Transactional(rollbackFor = Exception.class)
            public void addContract(@Validated(value = ValidGroup.Crud.Create.class) @RequestBody ManageRequest<ManageContractAddReq> req) throws Exception {
                manageContractService.addContract(req.getData(), req.getUserInfo());
            }
        ```

    - @apiNote

      - 这个标签就是代表了**对整个接口的描述**,可以写一长段,用以详细解释接口的功能或者注意事项

    - @return

      - 代表了方法的**返回参数**

    - @download

      - 标记了这个方法最终会下载一个文件