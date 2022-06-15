# mybatis-plus笔记

- mybatis是国内主流的orm框架,用来使项目和数据库交互
- mybatis-plus是加强版,在单表操作方面大大方便,只需要调用内置方法即可进行单表的简单查询,还内置分页插件,简单完成分页数据

## 构建

### 引入项目

- 引入项目中,毫无疑问第一步就是在`pom.xml`中添加依赖

- 然后在yml文件中配置好数据库相关

  ```yml
  spring:
    config:
      activate:
        on-profile: test-linux # 开发环境配置的名称
    datasource: # 数据库以及数据库连接池设置
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://ip:port/数据库名?characterEncoding=utf-8&useSSL=true&serverTimezone=Asia/Shanghai
      username: root
      password: 123456
      #springboot自带线程池hikari相关配置
      hikari:
        auto-commit: true
        connection-test-query: SELECT 1
        connection-timeout: 30000
        idle-timeout: 30000
        max-lifetime: 1800000
        maximum-pool-size: 15
        minimum-idle: 5
        pool-name: HikariCP
      type: com.zaxxer.hikari.HikariDataSource #这里居然还在没引入MybatisPlus的前提下会报错
  ```

- 之后在应用模块的启动类上使用注解标注Mapper文件夹:`@MapperScan("com.shineray.financial.*.mapper")`

- 如果想使用自带的分页插件(一般是都会使用),那就需要去添加配置类

  ```java
  /**
   * MyBatisPlus配置类
   */
  @Configuration
  @EnableTransactionManagement//配置之后防止出现JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@196918e2] will not be managed by Spring
  public class MyBatisPlusConfig {
  
      /**
       * MyBatisPlus拦截器（用于分页）
       */
      @Bean
      public MybatisPlusInterceptor paginationInterceptor() {
          MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
          //添加MySQL的分页拦截器
          interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
          return interceptor;
      }
  }
  ```

  

### 分页

- 只需要添加一个配置类就可以使用内置的分页插件了

  ```java
  /**
   * MyBatisPlus配置类
   */
  @Configuration
  @EnableTransactionManagement//配置之后防止出现JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@196918e2] will not be managed by Spring
  public class MyBatisPlusConfig {
  
      /**
       * MyBatisPlus拦截器（用于分页）
       */
      @Bean
      public MybatisPlusInterceptor paginationInterceptor() {
          MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
          //添加MySQL的分页拦截器
          interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
          return interceptor;
      }
  }
  ```

- **使用**起来是这样的

- 首先创建**Page对象**,传入每页数据条数pageSize,以及当前页数pageNum作为构造函数的参数

- 如果是自定义查询方法就将**Page对象**作为参数传进去,**设定返回数据为Page格式**,设置好泛型就会自动查询出分页后的数据

  ```java
  Page<ManageContractPendingListVO> listVOPage = new Page<>(page.getPageNum(), page.getPageSize());
  QueryWrapper<ManageContractPendingListVO> queryWrapper = new QueryWrapper<>();
  queryWrapper
      .eq("contract.status", ManageContractStatusEnum.SAVE.getCode())
      .eq("element_relevance.del_flag", DelStatusEnum.DELETE_NO.getCode())
      .eq("contract.del_flag", DelStatusEnum.DELETE_NO.getCode())
      .eq("supplier.del_flag", DelStatusEnum.DELETE_NO.getCode())
      .eq("contract_group.del_flag", DelStatusEnum.DELETE_NO.getCode())
      .orderByDesc("createTime")
      .groupBy("supplier.id,contract_group.id,contract.manage_user_id");
  if (StrUtil.isNotEmpty(dto.getCompanyName())) {
      queryWrapper.like("supplier.company_name", dto.getCompanyName());
  }
  Page<ManageContractPendingListVO> contractList = manageContractMapperCustom.getPendingContractList(listVOPage, queryWrapper);
  ```

  

### 自动生成代码

- 使用mybatis-plus自带的代码生成插件首先是需要引入依赖

  ```xml
  <dependency>
      <groupId>com.baomidou</groupId>
      <artifactId>mybatis-plus-generator</artifactId>
      <version>最新版本</version>
  </dependency>
  ```

  

- 需要创建一个测试类,然后在其中的某个方法使用框架提供的代码案例即可

- 设置好一些基本数据比如日期格式之类的,父包名,然后就要关注那些每次都需要更改的地方了

- 首先是`strategyConfig`下的`addInclude`,这就是你**要生成的对应数据库表的表名**,根据这个表名可以生成实体类,service,im[l,controller,mapper文件

- 然后就是`templateConfig`下的`mapperXml,controller,service,serviceImpl`,这几个**方法只要放开**就是设置**不生成**这类文件,**只要注释**就表示**需要生成**,比如,**`数据库实体类`是默认必须生成**的

  > 举个例子mapperXml方法注释掉了,其他的都放开就表示只生成mapper文件,其他的都不生成
  >
  > 假如全不注释就表示只生成数据库表实体类,全部注释就表示全都生成

  ```java
  @Test
  public void generate() {
      FastAutoGenerator.create(url, username, password)
          .globalConfig(builder -> {
              builder.author("lvzhichao") // 设置作者
                  //                            .enableSwagger() // 开启 swagger 模式
                  .commentDate("yyyy-MM-dd")   //注释日期,设置带上时分秒会有时区问题,比真实时间早了十二个小时
                  .dateType(DateType.TIME_PACK) //定义生成的实体类中日期的类型 TIME_PACK=LocalDateTime;ONLY_DATE=Date;
                  .fileOverride() // 覆盖已生成文件
                  .disableOpenDir()   //禁止打开输出目录，默认打开
                  .outputDir(dir); // 指定输出目录
          })
          .packageConfig(builder -> {
              builder.parent("com.shineray.financial") // 设置父包名
                  .moduleName("manage") // 设置父包模块名
                  .pathInfo(Collections.singletonMap(OutputFile.mapperXml, dir)); // 设置mapperXml生成路径
          })
          .strategyConfig(builder -> {
              builder.addInclude("fl_company_transactor") // 设置需要生成的表名
                  .addTablePrefix("fl_"); // 设置过滤表前缀
              builder.entityBuilder()//Entity 策略配置
                  .enableLombok()//开启 lombok 模型
                  .enableRemoveIsPrefix()//开启 Boolean 类型字段移除 is 前缀
                  .enableTableFieldAnnotation()
                  .build();//	开启生成实体时生成字段注解
              builder.serviceBuilder()//Service 策略配置
                  .formatServiceFileName("%sService")//设置service文件名
                  .formatServiceImplFileName("%sServiceImpl")//设置实现类文件名
                  .build();
              builder.controllerBuilder()//Controller 策略配置
                  .enableRestStyle()//开启生成@RestController 控制器
                  .formatFileName("%sController")//格式化文件名称
                  .build();
          })
          .templateConfig(builder -> {//模板配置(TemplateConfig)
              builder.mapperXml("")//设置不生成xml
                  .controller("")//设置不生成controller
                  .service("")//设置不生成service
                  .serviceImpl("")//设置不生成serviceImpl
                  .build();
          })
          .templateEngine(new FreemarkerTemplateEngine()) // 使用Freemarker引擎模板，默认的是Velocity引擎模板
          .execute();
  }
  ```

  

### 日志

- 需要打印SQL语句的话,需要去yml文件中配置

  ```yml
  mybatis-plus:
    configuration:
      log-impl: org.apache.ibatis.logging.slf4j.Slf4jImpl #开启sl4j的sql日志
  ```

- 需要对日志打印细化的话就需要进一步配置

  ```yml
  logging:
    # 指定配置文件的路径
    config: classpath:config/logback-spring.xml
    level:
      ROOT: INFO
      com.baomidou.mybatisplus: DEBUG #设置mybatisplus包下的日志级别
      com.shineray.financial.manage.mapper: DEBUG #项目mapper目录
    file:
      path: /data/logs #logback持久化文件存储目录,配置了它就可以在logback的配置文件中使用${LOG_PATH}取出日志持久化目录地址
  ```

## 项目中使用

### 增

#### 批量新增

- 批量新增有两种处理方式

- 第一种是直接在impl文件中注入service,然后mp的service中自带了批量方法可以使用

- 第二种是自定义,使用注解方式

  ```java
  @Insert("<script>" +
          "        INSERT INTO fl_manage_contract_contract_element_relevance \n" +
          "           (manage_contract_id, manage_contract_element_id, content) \n" +
          "        VALUES\n" +
          "        <foreach collection =\"relevanceList\" item=\"relevance\" separator =\",\"> \n" +
          "            (#{relevance.manageContractId}, #{relevance.manageContractElementId}, #{relevance.content}) \n" +
          "        </foreach>" +
          "</script>")
  Integer saveBatch(@Param("relevanceList") List<ManageContractContractElementRelevance> relevanceList);
  ```

  

### 查

#### 复合查询

- 有的时候有一些复杂情况,不只是简单查询,而是需要**一条查询语句**,**返回的结果中**的**某个字段**是**多条记录组成**的

- 就类似我现在要查一条合同信息,但是我查询的其实是以合同分组为唯一条件筛选,其实查出的这一条数据下有多个合同文件

- 就像是这样的一条数据,可以查出供应商的信息,合同分组的的信息,同时字段contractUrlList代表的是合同分组下的每个合同文件链接组成的List

- 我想要一次查询出这样的数据就需要专门处理

  | records                   | array  | No comments found.                         | -    |
  | ------------------------- | ------ | ------------------------------------------ | ---- |
  | └─manageSupplierId        | int32  | 供应商ID                                   | -    |
  | └─companyName             | string | 企业名称                                   | -    |
  | └─uniformSocialCreditCode | string | 统一社会信用代码                           | -    |
  | └─legalPersonName         | string | 企业法人姓名                               | -    |
  | └─legalPersonIdNum        | string | 法人身份证号                               | -    |
  | └─legalPersonContact      | string | 法人联系方式,为手机号                      | -    |
  | └─manageContractGroupId   | int32  | 合同分组id                                 | -    |
  | └─contractGroupName       | string | 合同分组名                                 | -    |
  | └─manageUserId            | int32  | 合同创建人ID,也就是管理后台账户ID          | -    |
  | └─manageUserName          | string | 合同创建人名                               | -    |
  | └─contractUrlList         | array  | 所有合同url组成的List,这里的合同是docx文件 | -    |
  | └─createTime              | string | 创建时间                                   | -    |

- 首先需要创建一个interface文件,在其中**自定义**我们的**查询方法**,使用**注解方式**写出完整的查询SQL

- 然后其中一个字段需要查出多条数据的时候,就需要使用更详细的注解

- 首先使用@Results注解在查询方法上,`id`属性其实没有特殊含义,就是给这个查询语句起个名字,起个唯一标识

- 然后再@Results注解之中的`value`值下,使用@Result注解把这条SQL要查出的所有字段都定义出来,`property`属性是字段别名,也就是**数据接收实体类的字段名**,`column`属性是其对应的**数据库字段原名**,id都填true就行

- 其中最特别的那个字段,也就是需要一个字段包含多条数据的字段,需要我们另外查询再塞入这个字段,因为其他字段都是可以统一进一条数据的,但是这个字段会导致这条数据的唯一性被破坏,只能另外查询再带进来

- 这个特别的字段中多出了几个属性,分别是

  - `many`属性后边跟的是`@Many`注解,这个注解的select属性需要填写这个字段的单独查询方法的方法名

  - `javaType`属性填的是这个特别字段的返回数据类型,一般都是`List.class`,因为大多数情况下,单字段返回多条信息的情况才需要这样写

  - `column`属性填的内容就不太一样了,因为另外查询的语句很可能需要一些参数携带,就是从这里传递

    - 如果是传递单个参数就类似:`column = "contractId"`

    - 如果是传递多个参数就类似:`column = "{manageSupplierId=manageSupplierId,manageContractGroupId=manage_contract_group_id}")}`

    - 参数在单独查询方法中使用是这样

      ```java
      @Select({"SELECT contract.url " +
          "FROM fl_manage_contract contract",
               "LEFT JOIN fl_manage_supplier supplier ON supplier.id = contract.manage_supplier_id\n" +
                   "LEFT JOIN fl_manage_contract_group contract_group ON contract_group.id = supplier.manage_contract_group_id\n" +
                   "WHERE contract.manage_supplier_id=#{manageSupplierId}\n" +
                   "AND supplier.manage_contract_group_id=#{manageContractGroupId}\n" +
                   "AND contract.del_flag=0\n" +
                   "AND supplier.del_flag=0\n" +
                   "AND contract_group.del_flag=0 "
              })
      List<String> getPendingContractUrlList(@Param("manageSupplierId") String manageSupplierId, @Param("manageContractGroupId") String manageContractGroupId);
      ```

#### and和or(方法调用)

- mp方法调用单表查询有时需要用到and和or,处理方法也很简单

  ```java
  QueryWrapper<SignOpenAccountRecord> wrapperRecord = new QueryWrapper<>();
  wrapperRecord.eq("relevance_id", supplier.getId())
      .eq("del_flag", DelStatusEnum.DELETE_NO.getCode())
      .and(wrapper -> wrapper.eq("role_type", SignOpenAccountRoleTypeEnum.COMPANY.getCode()).or().eq("role_type", SignOpenAccountRoleTypeEnum.LEGAL_PERSON.getCode()))
      ;
  List<SignOpenAccountRecord> recordsCompanyAndLegal = signOpenAccountRecordMapper.selectList(wrapperRecord);
  ```

  

### 删

### 改

#### 批量更新

- 批量新增有两种处理方式
- 第一种是直接在impl文件中注入service,然后mp的service中自带了批量方法可以使用
- 第二种是自定义,使用注解方式,类似批量新增