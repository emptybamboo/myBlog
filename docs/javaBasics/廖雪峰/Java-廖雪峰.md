## IO

### 路径

- 你在当前类中的默认目录是哪里呢?

- 刚开始我以为是Class文件的文件夹,结果发现不是

- 最后使用了`String path = System.getProperty("user.dir");`

- 发现了当前目录判定为项目最顶级目录`ideaworkspace`

- 所以具体`ideaworkspace/test/file`下的文件就需要这样写地址`test/file/copy.txt`

  ```java
  import java.io.*;
  
  public class copyAndPaste {
  
      public static void main(String[] args) throws IOException {
          String path = "test/file/";
          File f = new File(path+"copy.txt");
          System.out.println(f.isFile());
          copy(path+"copy.txt",path+"paste.txt");
      }
      static void copy(String start,String end) throws IOException {
          int n;
          StringBuffer sb = new StringBuffer();
          try(InputStream is = new FileInputStream(start)) {
              while ((n = is.read()) != -1){
                  sb.append((char)n);
              }
          }
          try(OutputStream os = new FileOutputStream(end)){
              os.write(sb.toString().getBytes("UTF-8"));
          }
  
      }
  }
  
  
  ```

### 复制粘贴文件

#### 字节流

##### 文本

- 第一种:提前创建一个有内容的一个无内容的文件

  ```java
  import java.io.*;
  
  public class copyAndPaste {
  
      public static void main(String[] args) throws IOException {
          //String path = System.getProperty("user.dir"); 得到地址为ideaworkspace
          String path = "test/file/";
          File f = new File(path);
          System.out.println(f.isFile());
          copy(path+"copy.txt",path+"paste.txt");
      }
      static void copy(String start,String end) throws IOException {
          int n;
          StringBuffer sb = new StringBuffer();
          try(InputStream is = new FileInputStream(start)) {
              while ((n = is.read()) != -1){
                  sb.append((char)n);
              }
          }
          try(OutputStream os = new FileOutputStream(end)){
              os.write(sb.toString().getBytes("UTF-8"));
          }
  
      }
  }
  
  
  ```

  

- 第二种:创建一个有内容的文件,用file对象创建新文件再把内容复制进去

  ```java
  import java.io.*;
  
  public class copyAndPaste {
  
      public static void main(String[] args) throws IOException {
          //String path = System.getProperty("user.dir"); 得到地址为ideaworkspace
          String path = "test/file/";
          File f = new File(path+"new.txt");
          System.out.println(f.isFile());
          if(f.createNewFile()){
              copy(path+"copy.txt", path+"new.txt");
          }else{
              System.out.println("文件创建失败");
          }
  
      }
      static void copy(String start,String end) throws IOException {
          int n;
          StringBuffer sb = new StringBuffer();
          try(InputStream is = new FileInputStream(start)) {
              while ((n = is.read()) != -1){
                  sb.append((char)n);
              }
          }
          try(OutputStream os = new FileOutputStream(end)){
              os.write(sb.toString().getBytes("UTF-8"));
          }
  
      }
  }
  
  
  ```

- 第三种:使用Paths创建路径

  ```java
  import java.io.*;
  import java.nio.file.Path;
  import java.nio.file.Paths;
  
  public class copyAndPaste {
  
      public static void main(String[] args) throws IOException {
          Path createdPath =  Paths.get("test","file");//创建出的路径没有后面的/,所以下面的copy方法里在文件前需要加/
          Path path = createdPath.toAbsolutePath();
  
          copy(path.toString()+"/copy.txt",path.toString()+"/paste.txt");
      }
      static void copy(String start,String end) throws IOException {
          int n;
          StringBuffer sb = new StringBuffer();
          try(InputStream is = new FileInputStream(start)) {
              while ((n = is.read()) != -1){
                  sb.append((char)n);
              }
          }
          try(OutputStream os = new FileOutputStream(end)){
              os.write(sb.toString().getBytes("UTF-8"));
          }
  
      }
  }
  
  
  ```

- 还有一种分支是不用`StringBuffer`,而是用byte[]填充

> 在读取流的时候，一次读取一个字节并不是最高效的方法。很多流支持一次性读取多个字节到缓冲区，对于文件和网络流来说，利用缓冲区一次性读取多个字节效率往往要高很多。`InputStream`提供了两个重载方法来支持读取多个字节：
>
> `int read(byte[] b)`：**读取若干字节并填充**到byte[]数组，返回读取的字节数
> `int read(byte[] b, int off, int len)`：指定byte[]数组的偏移量和最大填充数
> 利用上述方法一次读取多个字节时，需要先定义一个byte[]数组作为缓冲区，read()方法会尽可能多地读取字节到缓冲区， 但不会超过缓冲区的大小。read()方法的返回值不再是字节的int值，而是返回实际读取了多少个字节。如果返回-1，表示没有更多的数据了。



  ```java
  import java.io.*;
  
  public class copyAndPaste {
  
      public static void main(String[] args) throws IOException {
          String path = "test/file/";
          File f = new File(path);
          System.out.println(f.isFile());
          copy(path+"copy.txt",path+"paste.txt");
  
      }
      static void copy(String start,String end) throws IOException {
          try(InputStream is = new FileInputStream(start)) {
              int n;
              byte[] bt = new byte[1024];
              while ((n = is.read(bt)) != -1){
                  try(OutputStream os = new FileOutputStream(end)){
                      os.write(bt);
                  }
              }
          }
  
      }
  }
  
   
  ```

##### 图片

- 但是当我去尝试**复制图片**,结果图片确实复制出来,但是文件打不开
- 这里的原因经过我核查应该是嵌套了两个`try(resource)`导致的内部的那个output被close了.

> 你用字符流复制非纯文本的文件，都是不行的，因为用字符流复制的时候，他会按照你系统的字符码表进行查找和替换，把二进制数据全部按照码表替换了，你再打开肯定不是图片了，老师说的很清楚，非纯文本不要用字符流。

  ```java
  import java.io.*;
  
  public class copyAndPaste {
  
      public static void main(String[] args) throws IOException {
  
          String path = "test/img/";
          File f = new File(path+"2.jpg");
          System.out.println(f.isFile());
          if(f.createNewFile()){
              copy(path+"1.jpg",path+"2.jpg");
          }else{
              System.out.println("创建图片失败");
          }
  
      }
      static void copy(String start,String end) throws IOException {
          int n;
          StringBuffer sb = new StringBuffer();
          try(InputStream is = new FileInputStream(start)) {
              while ((n = is.read()) != -1){
                  sb.append((char)n);
              }
          }
          try(OutputStream os = new FileOutputStream(end)){
              os.write(sb.toString().getBytes("UTF-8"));
          }
  
      }
  }
  
   
  ```

- 最后被我这样解决了

  ```java
  import java.io.*;
  
  public class copyAndPaste {
  
      public static void main(String[] args) throws IOException {
          //图片
          String path = "test/img/";
          File f = new File(path+"2.jpg");
          System.out.println(f.isFile());
          if(f.createNewFile()){
              copy(path+"1.jpg",path+"2.jpg");
          }else{
              System.out.println("创建图片失败");
          }
  
      }
      static void copy(String start,String end) throws IOException {
          //不把outputstream嵌套,直接提出来
          OutputStream os = new FileOutputStream(end);
          try(InputStream is = new FileInputStream(start)) {
              int n;
              byte[] bt = new byte[1024];
              while ((n = is.read(bt)) != -1){
                  os.write(bt,0,n);
              }
              //写完数据之后close
              os.close();
          }
      }
  }
  
  
  ```

  

  ### 读取文件

#### ZIP文件读取

```java
import java.io.FileInputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class zipTest {
    public static void main(String[] args) throws IOException {
        //try(resource) 放入ZipInputStream,套娃FileInputStream
        try (ZipInputStream zi = new ZipInputStream(new FileInputStream("test/file/123.zip"))){
            //提前创建压缩文件内的文件常量ZipEntry
            ZipEntry ze = null;
            //循环取出文件,只要文件常量还不为null就一直取
            while ((ze = zi.getNextEntry())!= null){
                //每个压缩文件内文件的名字
                String zipName = ze.getName();
                //只要确定它是文件而不是中途的目录文件夹
                if(!ze.isDirectory()){
                    System.out.println("压缩文件名字是:"+zipName);
                    int n;
                    //就可以读取这个文件里的每个字符,操作和FileInputStream完全一样
                    while((n = zi.read())!=-1){
                        System.out.println((char)n);
                    }
                }
            }
        }
    }
}

```

#### ZIP文件写入

- 最初版本,很可能只读取到了zip压缩文件,没把其他文本文件放进ZIP压缩文件里
- **最终证明猜测是错误的.**

```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class zipTest {
    public static void main(String[] args) throws IOException {
        //把文件压缩进新文件
        //这个版本的代码只往压缩文件里加了一个123.zip文件,没有把目录下的所有文件压缩进去
        //目前我猜测是因为我使用的是ZipInputStream,所以只会读取zip压缩文件的内容
        File file = new File("test/file");
        File[] files = file.listFiles();//拿到test/file目录下的所有文件组成File[]数组
        for (File file1 : files) {//遍历文件数组
            //拿到每个文件放进输入流,读取文件内容
            try(ZipInputStream zipInputStream = new ZipInputStream(new FileInputStream(file1))){
                //zip就是压缩文件，zip条目就是之建立一个以name为名的zip文件。
                ZipEntry z = null;
                //从压缩文件中取数据只要不为null就继续
                while((z = zipInputStream.getNextEntry())!=null){
                    final String name = z.getName();
                    if(!z.isDirectory()){
                        int n;
                        byte[] bt = new byte[10240];
                        while ((n = zipInputStream.read(bt)) != -1){
                            File f = new File("test/file/01.zip");
                            if(f.createNewFile()){
                                try (ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(f))){
                                    //out.putNextEntry(new zipEntry("/"));
                                    // 创建压缩的子目录,我这里放的是文件名,如果放/dir之类的就会是给压缩文件内部分层
                                    zipOutputStream.putNextEntry(new ZipEntry(file1.getName()));
                                    zipOutputStream.write(bt);
                                    zipOutputStream.closeEntry();
                                }
                            }else{
                                System.out.println("创建压缩文件失败");
                            }

                        }
                    }
                }
            }
        }
    }
}

```

- 第二个版本,使用普通的`FileInputStream`,试图读取到目录下所有的文件,但是一样只写进去了一个ZIP压缩文件

- 因为判断是否有那个新的压缩文件时,后几次循环都判断已经有了就没有读写文件

  ```java
  import java.io.*;
  import java.util.zip.ZipEntry;
  import java.util.zip.ZipInputStream;
  import java.util.zip.ZipOutputStream;
  
  public class zipTest {
      public static void main(String[] args) throws IOException {
  
          File file = new File("test/file");
          File[] files = file.listFiles();
          for (File file1 : files) {
              try(InputStream inputStream = new FileInputStream(file1)){
                      if(!file1.isDirectory()){
                          int n;
                          byte[] bt = new byte[10240];
                          while ((n = inputStream.read(bt)) != -1){
                              File f = new File("test/file/01.zip");
                              //createNewFile方法主要是如果该文件已经存在，则不创建，返回一个false，如果没有，则返回true
                              if(f.createNewFile()){
                                  try (ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(f))){
                                      zipOutputStream.putNextEntry(new ZipEntry(file1.getName()));
                                      zipOutputStream.write(bt);
                                      zipOutputStream.closeEntry();
                                  }
                              }else{
                                  //第二次开始读写文件就开始进到这里了,所以只写入一个文件
                                  System.out.println("创建压缩文件失败");
                              }
  
                          }
                      }
  
              }
          }
      }
  }
  
  ```

- 我稍加改进,不去做那个`createNewFile`判断

- 结果还是不行,还是只压缩进去了一个文件,是`paste.txt`

  ```java
  import java.io.*;
  import java.util.zip.ZipEntry;
  import java.util.zip.ZipInputStream;
  import java.util.zip.ZipOutputStream;
  
  public class zipTest {
      public static void main(String[] args) throws IOException {
          File file = new File("test/file");
          File[] files = file.listFiles();
          for (File file1 : files) {
              try(InputStream inputStream = new FileInputStream(file1)){
                      if(!file1.isDirectory()){
                          int n;
                          byte[] bt = new byte[10240];
                          while ((n = inputStream.read(bt)) != -1){
                              File f = new File("test/file/01.zip");
                              //createNewFile方法主要是如果该文件已经存在，则不创建，返回一个false，如zhi果没有，则返回true
                              f.createNewFile();
                              try (ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(f))){
                                   zipOutputStream.putNextEntry(new ZipEntry(file1.getName()));
                                   zipOutputStream.write(bt);
                                   zipOutputStream.closeEntry();
                              }
  
  
                          }
                      }
  
              }
          }
      }
  }
  
  ```

- 于是我用打印看了下这个循环,正常的循环所有文件没有问题

- 上面说了只压缩进去了一个文件,是`paste.txt`,通过打印看出来,它刚好排在最后的位置,那说明前面压缩的文件都被顶掉了

  ```java
  import java.io.*;
  import java.util.zip.ZipEntry;
  import java.util.zip.ZipInputStream;
  import java.util.zip.ZipOutputStream;
  
  public class zipTest {
      public static void main(String[] args) throws IOException {
          File file = new File("test/file");
          File[] files = file.listFiles();
          int totalNum = 0;
          int inputNum = 0;
          int outputNum = 0;
          for (File file1 : files) {
              System.out.println("文件名字为"+file1.getName());
              //文件名字为123.zip
              //文件名字为copy.md
              //文件名字为copy.txt
              //文件名字为new.txt
              //文件名字为paste.md
              //文件名字为paste.txt
              try(InputStream inputStream = new FileInputStream(file1)){
                  if(!file1.isDirectory()){
                      inputNum++;
                      int n;
                      byte[] bt = new byte[10240];
                      while ((n = inputStream.read(bt)) != -1){
                          outputNum++;
                          File f = new File("test/file/01.zip");
                          //createNewFile方法主要是如果该文件已经存在，则不创建，返回一个false，如果没有，则返回true
                          f.createNewFile();
                          try (ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(f))){
                              zipOutputStream.putNextEntry(new ZipEntry(file1.getName()));
                              zipOutputStream.write(bt);
                              zipOutputStream.closeEntry();//我怀疑是这里有问题
                          }
  
  
                      }
                  }
  
              }
              totalNum++;
          }
          System.out.println("总次数为->"+totalNum);//总次数为->6
          System.out.println("input次数为->"+inputNum);//input次数为->6
          System.out.println("output次数为->"+outputNum);//output次数为->6
  
      }
  }
  
  ```

- 最终,这样子我完成了压缩一个文件夹下多个文件到同一个zip文件中

- try(resource){}就意味着会自动调用close,那每一次循环等于自动调用`close()`关闭并重新创建了stream

  ```java
  import java.io.*;
  import java.util.zip.ZipEntry;
  import java.util.zip.ZipInputStream;
  import java.util.zip.ZipOutputStream;
  
  public class zipTest {
      public static void main(String[] args) throws IOException {
          File file = new File("test/file");
          File[] files = file.listFiles();
          int totalNum = 0;
          int inputNum = 0;
          int outputNum = 0;
          File f = new File("test/file/01.zip");
          //我把这句从下方的try(resource){}中拿上来,因为如果try(resource){}就意味着会自动调用close,那每一次循环等于重新创建了stream
          ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(f));
          for (File file1 : files) {
              //createNewFile方法主要是如果该文件已经存在，则不创建，返回一个false，如果没有，则返回true
              if(!f.exists()){
                  f.createNewFile();
              }
              try(InputStream inputStream = new FileInputStream(file1)){
                      if(!file1.isDirectory()){
                          inputNum++;
                          int n;
                          byte[] bt = new byte[10240];
                          while ((n = inputStream.read(bt)) != -1){
                              outputNum++;
                              //之后在这里使用最普通的try,finally,就可以在输出流数字和文件个数一样的情况下再手动关闭流
                              try {
                                   zipOutputStream.putNextEntry(new ZipEntry(file1.getName()));
                                   zipOutputStream.write(bt,0,n);
                                   zipOutputStream.closeEntry();
                              }finally {
                                  if(outputNum==files.length){
                                      zipOutputStream.close();
                                  }
                              }
                          }
                      }
  
              }
              totalNum++;
          }
  
          System.out.println("总次数为->"+totalNum);
          System.out.println("input次数为->"+inputNum);
          System.out.println("output次数为->"+outputNum);
      }
  }
  
  ```

#### 字符流

##### Reader

- 字符流只能读取纯文本文件.

- 如果我们读取一个纯ASCII编码的文本文件，上述代码工作是没有问题的。但如果文件中包含中文，就会出现乱码，因为`FileReader`默认的编码与系统相关，例如，Windows系统的默认编码可能是`GBK`，打开一个`UTF-8`编码的文本文件就会出现乱码。

  要避免乱码问题，我们需要在创建`FileReader`时指定编码

- 但是我自己试了一下,无论是否在FileReader的构造方法里指定编码,输出的字符都可以输出英文,可能是编辑器帮我解决了吧.

- ```java
  try(FileReader fr = new FileReader("test/file/chinese.txt",StandardCharsets.UTF_8)){
      int n = 0;
      while((n = fr.read())!=-1){
          System.out.print((char)n);
      }
  }
  ```

- `Reader`和`InputStream`有什么关系？

- 除了特殊的`CharArrayReader`和`StringReader`，普通的`Reader`实际上是基于`InputStream`构造的，因为`Reader`需要从`InputStream`中读入字节流（`byte`），然后，根据编码设置，再转换为`char`就可以实现字符流。如果我们查看`FileReader`的源码，它在内部实际上持有一个`FileInputStream`。

- 既然`Reader`本质上是一个基于`InputStream`的`byte`到`char`的转换器，那么，如果我们已经有一个`InputStream`，想把它转换为`Reader`，是完全可行的。`InputStreamReader`就是这样一个转换器，它可以把任何`InputStream`转换为`Reader`。示例代码如下：

  ```java
  // 持有InputStream:
  InputStream input = new FileInputStream("src/readme.txt");
  // 变换为Reader:
  Reader reader = new InputStreamReader(input, "UTF-8");
  ```

  构造`InputStreamReader`时，我们需要传入`InputStream`，还需要指定编码，就可以得到一个`Reader`对象。上述代码可以通过`try (resource)`更简洁地改写如下：

  ```java
  try (Reader reader = new InputStreamReader(new FileInputStream("src/readme.txt"), "UTF-8")) {
      // TODO:
  }
  ```

  上述代码实际上就是`FileReader`的一种实现方式。

  使用`try (resource)`结构时，当我们关闭`Reader`时，它会在内部自动调用`InputStream`的`close()`方法，所以，只需要关闭最外层的`Reader`对象即可。

### 疑问

- 通过学习IO我感到有点疑问,按道理现在应该是`try(resource)`更加先进更加被推荐使用,但是我一旦写非文本文件,写多个文件,就好像不太方便用嵌套`try(resource)`,究竟是我太菜没找到嵌套使用它的最佳方法,还是说其实就没法嵌套来用,最优解就是只在读的时候使用,写的时候单独提出来用,然后用一些数量判断来控制何时关闭流?

## 日期

- 如今DATE类的`getYear,getMonth,getDay`方法都已经不推荐了,那该用什么来代替呢?

- 答案是**Calendar**

  ```java
  import java.text.SimpleDateFormat;
  import java.util.Calendar;
  import java.util.Date;
  
  public class DateUse {
  
  
      public static void main(String[] args) {
          Date date = new Date();
          Calendar cd = Calendar.getInstance();
          System.out.println(cd.get(Calendar.YEAR));
          System.out.println(cd.get(Calendar.MONTH));//但是这里得到的月份还是从0-11,所以还是要+1才是对的日期
          System.out.println(cd.get(Calendar.DAY_OF_MONTH));
  
          var ok = new SimpleDateFormat("yyyy-MM-dd");
          System.out.println(ok.format(date));
      }
  }
  
  ```


## classpath

- `classpath`的设定方法有两种：

  在系统环境变量中设置`classpath`环境变量，不推荐；

  在启动JVM时设置`classpath`变量，推荐。

- 我们强烈*不推荐*在系统环境变量中设置`classpath`，那样会污染整个系统环境。在启动JVM时设置`classpath`才是推荐的做法。实际上就是给`java`命令传入`-classpath`或`-cp`参数：

  ```shell
  java -classpath .;C:\work\project1\bin;C:\shared abc.xyz.Hello
  ```

  或者使用`-cp`的简写：

  ```shell
  java -cp .;C:\work\project1\bin;C:\shared abc.xyz.Hello
  ```

  没有设置系统环境变量，也没有传入`-cp`参数，那么JVM默认的`classpath`为`.`，即**当前目录**：

  ```shell
  java abc.xyz.Hello
  ```

## Stream

- Stream API提供了一套新的流式处理的抽象序列；
- Stream API支持函数式编程和链式操作；
- Stream可以表示无限序列，并且大多数情况下是惰性求值的。

> 惰性求值:如果进行一长串对stream的操作,其实只有最后一步才真正进行计算.

### 创建stream

##### 数组或集合

- 把数组变成`Stream`使用`Arrays.stream()`方法。对于`Collection`（`List`、`Set`、`Queue`等），直接调用`stream()`方法就可以获得`Stream`。
- 上述创建`Stream`的方法都是把一个现有的序列变为`Stream`，它的元素是固定的。

##### 基于Supplier

- 创建`Stream`还可以通过`Stream.generate()`方法，它需要传入一个`Supplier`对象：

```java
Stream<String> s = Stream.generate(Supplier<String> sp);
```

- 基于`Supplier`创建的`Stream`会不断调用`Supplier.get()`方法来不断产生下一个元素，这种`Stream`保存的不是元素，而是算法，它可以用来表示无限序列。

- 例如，我们编写一个能不断生成自然数的`Supplier`，它的代码非常简单，每次调用`get()`方法，就生成下一个自然数：

- **意思就是,当你最后给无限的stream限定个数`X`之后,他这个supplier会在类中重复你限定个数的次数(`X`)次,一直在类中循环执行`get()`,执行完将每一次执行的都存进stream.**

- **`Supplier`具体的规则是需要你自己去创建类来决定的.**

  ```java
  Stream<Integer> stream = Stream.generate(new NaturalSupplier());
  stream.limit(20).forEach(System.out::print);//输出1-20
  
  class NaturalSupplier implements Supplier<Integer>{
      int n = 0;
      @Override
      public Integer get() {
          n++;
          return n;
      }
  }
  ```

  

- 对于无限序列，如果直接调用`forEach()`或者`count()`这些最终求值操作，会进入死循环，因为永远无法计算完这个序列，所以**正确的方法是先把无限序列变成有限序列**，例如，用`limit()`方法可以截取前面若干个元素，这样就变成了一个有限序列，对这个有限序列调用`forEach()`或者`count()`操作就没有问题。

##### 其他方法

创建`Stream`的第三种方法是通过一些API提供的接口，直接获得`Stream`。

例如，`Files`类的`lines()`方法可以把一个文件变成一个`Stream`，每个元素代表文件的一行内容：

```java
try (Stream<String> lines = Files.lines(Paths.get("/path/to/file.txt"))) {
    ...
}
```

此方法对于按行遍历文本文件十分有用。

另外，正则表达式的`Pattern`对象有一个`splitAsStream()`方法，可以直接把一个长字符串分割成`Stream`序列而不是数组：

```java
Pattern p = Pattern.compile("\\s+");
Stream<String> s = p.splitAsStream("The quick brown fox jumps over the lazy dog");
s.forEach(System.out::println);
```

##### 基本类型

因为Java的范型不支持基本类型，所以我们无法用`Stream<int>`这样的类型，会发生编译错误。为了保存`int`，只能使用`Stream<Integer>`，但这样会产生频繁的装箱、拆箱操作。为了提高效率，Java标准库提供了`IntStream`、`LongStream`和`DoubleStream`这三种使用基本类型的`Stream`，它们的使用方法和范型`Stream`没有大的区别，设计这三个`Stream`的目的是提高运行效率：

```java
// 将int[]数组变为IntStream:
IntStream is = Arrays.stream(new int[] { 1, 2, 3 });
// 将Stream<String>转换为LongStream:
LongStream ls = List.of("1", "2", "3").stream().mapToLong(Long::parseLong);
```

### map

`map()`方法用于将一个`Stream`的每个元素映射成另一个元素并转换成一个新的`Stream`；

可以将一种元素类型转换成另一种元素类型。

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

public class mapUse {
    public static void main(String[] args) {
        //基本map操作
        Stream<Integer> stream = Stream.of(1, 2, 3);
        Stream<Integer> stream1 = stream.map(n -> n * n);
        stream1.forEach(System.out::println);

        //花式调用map处理
        List.of("A ","B"," C").
            stream().
            map(String::trim).//去空格
            map(String::toLowerCase).//转为小写
            forEach(System.out::println);

        //一组string转换为localdate
        Stream<String> stream = Stream.of("2020-6-15", "2020-1-15", "2020-8-23");
        stream.map(n -> n.replaceAll("//s+",""))
            .map(n->LocalDate.parse(n, DateTimeFormatter.ofPattern("yyyy-M-d")))
            .forEach(System.out::println);

    }
}

```

### filter

`Stream.filter()`是`Stream`的另一个常用转换方法。

所谓`filter()`操作，就是对一个`Stream`的所有元素一一进行测试，**不满足条件**的就被“滤掉”了，剩下的满足条件的元素就构成了一个新的`Stream`。

```java
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;
import java.util.stream.Stream;

public class filterUse {
    public static void main(String[] args) {
        //filter基础用法,排除偶数
        Stream.of(1,2,3,4,5,6,7,8,9,10).
            filter(n -> n%2!=0)
            .forEach(System.out::println);

        //得到休息日
        Stream.generate(new workDaySupplier())
            .limit(31)
            .filter(n -> n.getDayOfWeek() == DayOfWeek.SATURDAY||n.getDayOfWeek() == DayOfWeek.SUNDAY)
            .forEach(System.out::println);

        //过滤出及格的同学并打印出名字
        List.of(new Student("小明",90),new Student("小红",70),new Student("小白",40))
            .stream()
            .filter(n -> n.getScore()>=60)
            .forEach(n -> System.out.println("及格的同学有"+n.getName()+"分数是:"+n.getScore()));

    }
}
class workDaySupplier implements Supplier<LocalDate>{
    LocalDate start = LocalDate.of(2020,1,1);
    int n = -1;
    @Override
    public LocalDate get() {
        n++;
        return start.plusDays(n);
    }
}
class Student{
    private String name;
    private Integer score;

    public Student(String name, Integer score) {
        this.name = name;
        this.score = score;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "Student{" +
            "name='" + name + '\'' +
            ", score=" + score +
            '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return name.equals(student.name) &&
            score.equals(student.score);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, score);
    }
}
```

### reduce

`map()`和`filter()`都是`Stream`的转换方法，而`Stream.reduce()`则是`Stream`的一个聚合方法，它可以**把一个`Stream`的所有元素按照聚合函数聚合成一个结果**。

```java
int sum = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9).reduce(0, (acc, n) -> acc + n);
System.out.println(sum); // 45
```

上述代码看上去不好理解，但我们用`for`循环改写一下，就容易理解了：

```java
Stream<Integer> stream = ...
int sum = 0;
for (n : stream) {
    sum = (sum, n) -> sum + n;
}
```

可见，`reduce()`操作首先初始化结果为指定值（这里是0），紧接着，`reduce()`对每个元素依次调用`(acc, n) -> acc + n`，其中，`acc`是上次计算的结果.

**可以这样理解,`reduce(0, (acc, n) -> acc + n);`实际上0就是你设定的一个变量,也可以是new出来的对象,而`acc`就是你这个变量/对象,而n就是你stream中的每个元素,而每次计算后的值就赋给`acc`.**

```java
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

public class reduceUse {
    public static void main(String[] args) {
        //求和
        int reduce = Stream.of(1, 2, 3, 4, 5, 6, 7, 8, 9)
            .reduce(0, (x, y) -> x + y);
        System.out.println("和为"+reduce);//和为45

        //求积
        int reduce = Stream.of(1, 2, 3, 4, 5)
            .reduce(1, (x, y) -> x * y);
        System.out.println("积为"+reduce);//积为120

        //操作对象,把配置文件转换为Map<String,String>
        List<String> list = List.of("name=小明", "gender=男", "like=女");

        list.stream()
            .map(kv -> {
                String[] split = kv.split("\\=",2);
                return Map.of(split[0],split[1]);
            })
            .reduce(new HashMap<String, String>(),(n, kv)->{
                n.putAll(kv);
                return n;
            })
            .forEach((k,v)->
                     System.out.println(k+"="+v));
        //name=小明
        //gender=男
        //like=女
    }
}

```

### 输出集合

- 输出为LIst:`.collect(Collectors.toList())`

- 输出为数组:`.toArray(String[]::new)`

- 输出为Map:`.collect(
      Collectors.toMap(
          n -> n.substring(0,n.indexOf(":")),
          n -> n.substring((n.indexOf(":") + 1))
      )
  )`

- 分组输出,归类,类似于Mysql的GroupBy:`.collect(
      Collectors.groupingBy(
          n -> n.substring(0, 1),
          Collectors.toList()
      )
  )`

  ```java
  import java.util.List;
  import java.util.Map;
  import java.util.Objects;
  import java.util.stream.Collector;
  import java.util.stream.Collectors;
  import java.util.stream.Stream;
  
  
  public class streamOutput {
      public static void main(String[] args) {
          //输出List
          List<String> collect = Stream.of("work", "name", "", " ", "wonder", "", "give")
              .filter(n -> !n.isBlank() && n != null)
              .collect(Collectors.toList());
          System.out.println(collect);
          //[work, name, wonder, give]
  
  
          //输出为数组
          String[] array = List.of("good", "bad", "nice")
              .stream()
              .toArray(String[]::new);//调用构造方法
          for (String s : array) {
              System.out.println(s);
          }
          //good
          //bad
          //nice
  
          //输出为Map
          Map<String, String> map = Stream.of("bad:wall", "greet:net", "one:world")
              .collect(
              Collectors.toMap(
                  n -> n.substring(0,n.indexOf(":")),//Map的Key
                  n -> n.substring((n.indexOf(":") + 1))//Map的Value
              )
          );
          System.out.println(map);
          //{bad=wall, one=world, greet=net}
  
          //分组输出
          Map<String, List<String>> map = List.of("Apple", "Bad", "Cat", "Agree", "Boot", "Create", "Boss")
              .stream()
              .collect(
              Collectors.groupingBy(
                  n -> n.substring(0, 1),
                  Collectors.toList()
              )
          );
          System.out.println(map);
          //{A=[Apple, Agree], B=[Bad, Boot, Boss], C=[Cat, Create]}
  
  
          //将学生分组
          Map<Integer, List<children>> collect = Stream.of(
              new children(3, 2, "龙卷", 80),
              new children(3, 1, "埼玉", 60),
              new children(4, 1, "吹雪", 80),
              new children(5, 3, "King", 99),
              new children(4, 4, "黄精", 90),
              new children(5, 3, "西奇", 60)
          )
              .collect(
              Collectors.groupingBy(
                  n -> n.getGradeId(),
                  Collectors.toList()
              )
          );
          collect.forEach(
              (k,v)->
              System.out.println(k+"年级的学生:"+v)
          );
          //3年级的学生:[children{gradeId=3, classId=2, name='龙卷', score=80}, children{gradeId=3, classId=1, name='埼玉', score=60}]
          //4年级的学生:[children{gradeId=4, classId=1, name='吹雪', score=80}, children{gradeId=4, classId=4, name='黄精', score=90}]
          //5年级的学生:[children{gradeId=5, classId=3, name='King', score=99}, children{gradeId=5, classId=3, name='西奇', score=60}]
      }
  }
  
  class children{
      private  Integer gradeId; // 年级
      private Integer classId; // 班级
      private String name; // 名字
      private Integer score; // 分数
  
      public children(Integer gradeId, Integer classId, String name, Integer score) {
          this.gradeId = gradeId;
          this.classId = classId;
          this.name = name;
          this.score = score;
      }
  
      public Integer getGradeId() {
          return gradeId;
      }
  
      public void setGradeId(Integer gradeId) {
          this.gradeId = gradeId;
      }
  
      public Integer getClassId() {
          return classId;
      }
  
      public void setClassId(Integer classId) {
          this.classId = classId;
      }
  
      public String getName() {
          return name;
      }
  
      public void setName(String name) {
          this.name = name;
      }
  
      public Integer getScore() {
          return score;
      }
  
      public void setScore(Integer score) {
          this.score = score;
      }
  
      @Override
      public boolean equals(Object o) {
          if (this == o) return true;
          if (o == null || getClass() != o.getClass()) return false;
          children children = (children) o;
          return gradeId.equals(children.gradeId) &&
              classId.equals(children.classId) &&
              name.equals(children.name) &&
              score.equals(children.score);
      }
  
      @Override
      public int hashCode() {
          return Objects.hash(gradeId, classId, name, score);
      }
  
      @Override
      public String toString() {
          return "children{" +
              "gradeId=" + gradeId +
              ", classId=" + classId +
              ", name='" + name + '\'' +
              ", score=" + score +
              '}';
      }
  }
  ```

  

### 其他操作

#### 排序

- 一般来说字符或数字的排序调用sorted方法即可.

- 此方法要求`Stream`的每个元素必须实现`Comparable`接口。如果要自定义排序，传入指定的`Comparator`即可

  ```java
  //排序
  List<String> list = List.of("assert", "cat", "body")
      .stream()
      .sorted()
      .collect(Collectors.toList());
  
  System.out.println(list);
  //[assert, body, cat]
  
  List<String> list = List.of("assert", "Cat", "body")
      .stream()
      .sorted(String::compareToIgnoreCase)
      .collect(Collectors.toList());
  
  System.out.println(list);
  //[assert, body, Cat]
  ```

#### 去重

- 对一个`Stream`的元素进行去重，没必要先转换为`Set`，可以直接用`distinct()`

  ```java
  //去重
  List<String> list = List.of("A", "B", "C", "A", "D", "B")
      .stream()
      .distinct()
      .collect(Collectors.toList());
  
  System.out.println(list);
  //[A, B, C, D]
  ```

#### 截取

- 截取操作常用于把一个无限的`Stream`转换成有限的`Stream`，`skip()`用于跳过当前`Stream`的前N个元素，`limit()`用于截取当前`Stream`最多前N个元素

- 截取操作也是一个转换操作，将返回新的`Stream`

  ```java
  //截取
  List<String> list = List.of("A", "B", "C", "D", "E", "F", "G")
      .stream()
      .skip(2)
      .limit(3)
      .collect(Collectors.toList());
  System.out.println(list);
  //[C, D, E]
  ```

#### 合并

- 将两个`Stream`合并为一个`Stream`可以使用`Stream`的静态方法`concat()`

  ```java
  Stream<String> one = List.of("A", "B").stream();
  Stream<String> two = List.of("C", "D", "E").stream();
  
  Stream<String> three = Stream.concat(one, two);
  
  System.out.println(three.collect(Collectors.toList()));
  //[A, B, C, D, E]
  ```

#### flatMap

- 所谓`flatMap()`，是指把`Stream`的每个元素（这里是`List`）映射为`Stream`，然后合并成一个新的`Stream`

- ```ascii
  ┌─────────────┬─────────────┬─────────────┐
  │┌───┬───┬───┐│┌───┬───┬───┐│┌───┬───┬───┐│
  ││ 1 │ 2 │ 3 │││ 4 │ 5 │ 6 │││ 7 │ 8 │ 9 ││
  │└───┴───┴───┘│└───┴───┴───┘│└───┴───┴───┘│
  └─────────────┴─────────────┴─────────────┘
                       │
                       │flatMap(List -> Stream)
                       │
                       │
                       ▼
     ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐
     │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │
     └───┴───┴───┴───┴───┴───┴───┴───┴───┘
  ```

  ```java
  //flatMap
  Stream<List<Integer>> stream = Stream.of(
      Arrays.asList(1, 2, 3),
      Arrays.asList(4, 5, 6),
      Arrays.asList(7, 8, 9)
  );
  Stream<Integer> stream1 = stream.flatMap(list -> list.stream());
  System.out.println(stream1.collect(Collectors.toList()));
  //[1, 2, 3, 4, 5, 6, 7, 8, 9]
  ```

#### 并行

- 通常情况下，对`Stream`的元素进行处理是单线程的，即一个一个元素进行处理。但是很多时候，我们希望可以并行处理`Stream`的元素，因为在元素数量非常大的情况，并行处理可以大大加快处理速度。

- 把一个普通`Stream`转换为可以并行处理的`Stream`非常简单，只需要用`parallel()`进行转换

- 经过`parallel()`转换后的`Stream`只要可能，就会对后续操作进行并行处理。我们不需要编写任何多线程代码就可以享受到并行处理带来的执行效率的提升。

  ```java
  //并行
  String[] array = Stream.of("award", "control", "fast", "good")
      .parallel()
      .sorted()
      .toArray(String[]::new);
  
  for (String s : array) {
      System.out.println(s);
  }
  //award
  //control
  //fast
  //good
  ```

#### 其他聚合方法

- 除了`reduce()`和`collect()`外，`Stream`还有一些常用的聚合方法：

  - `count()`：用于返回元素个数；
  - `max(Comparator<? super T> cp)`：找出最大元素；
  - `min(Comparator<? super T> cp)`：找出最小元素。

  针对`IntStream`、`LongStream`和`DoubleStream`，还额外提供了以下聚合方法：

  - `sum()`：对所有元素求和；
  - `average()`：对所有元素求平均数。

  还有一些方法，用来测试`Stream`的元素是否满足以下条件：

  - `boolean allMatch(Predicate<? super T>)`：测试是否所有元素均满足测试条件；
  - `boolean anyMatch(Predicate<? super T>)`：测试是否至少有一个元素满足测试条件。

  最后一个常用的方法是`forEach()`，它可以循环处理`Stream`的每个元素，我们经常传入`System.out::println`来打印`Stream`的元素

```java
//count,max,min
IntStream is = Arrays.stream(new int[]{1, 20, 3, 98, 46, 33});
System.out.println("元素个数"+is.count());//元素个数6
System.out.println("元素最大值"+is.max());//元素最大值OptionalInt[98]
System.out.println("元素最小值"+is.min());//元素最小值OptionalInt[1]

//sum,average
System.out.println("总和"+is.sum());//总和201
System.out.println("平均值"+is.average().getAsDouble());//平均值33.5

//allMatch,anyMatch
System.out.println("是否全部大于0"+is.allMatch(x->x>0));//是否全部大于0true
System.out.println("是否至少有一个大于100"+is.anyMatch(x->x>100));//是否至少有一个大于100false
```

## Java基本类

### StringBuilder

- 虽然可以直接拼接字符串，但是，在循环中，每次循环都会创建新的字符串对象，然后扔掉旧的字符串。这样，绝大部分字符串都是临时对象，不但浪费内存，还会影响GC效率。

  为了能高效拼接字符串，Java标准库提供了`StringBuilder`，它是一个可变对象，可以预分配缓冲区，这样，往`StringBuilder`中新增字符时，不会创建新的临时对象

- 方法:

  - `append`:拼接字符串到原来的字符串后面
  - `insert`:往字符串指定位置插入字符串,第一个参数是从哪个索引开始,第二个参数是插入的字符串
  - `delete`:删除字符串从第x开始到第y个字符

  ```java
  public class string {
      public static void main(String[] args) {
          String[] fields = { "name", "position", "salary" };
          String table = "employee";
          String insert = buildInsertSql(table, fields);
          System.out.println(insert);
          String s = "INSERT INTO employee (name, position, salary) VALUES (?, ?, ?)";
          System.out.println(s.equals(insert) ? "测试成功" : "测试失败");
      }
      static String buildInsertSql(String table, String[] fields) {
          // TODO:
          StringBuilder builder = new StringBuilder(1024);
          builder.append(table);
          for (int i = 0; i < fields.length; i++) {
              if(i==0){
                  builder.append(" (");
                  builder.append(fields[i]);
                  builder.append(", ");
              }else if(i==fields.length-1){
                  builder.append(fields[i]);
                  builder.append(")");
              }else{
                  builder.append(fields[i]);
                  builder.append(", ");
              }
          }
          builder.append(" VALUES");
          builder.append(" (");
          for (int i = 0; i < fields.length; i++) {
              if(i==fields.length-1){
                  builder.append("?");
              }else{
                  builder.append("?, ");
              }
          }
          builder.append(")");
          builder.insert(0,"INSERT INTO ");
          return builder.toString();
      }
  }
  
  ```

### StringJoiner

- 类似用分隔符拼接数组的需求很常见，所以Java标准库还提供了一个`StringJoiner`来干这个事

- 常规使用只需要在创建实例的时候传入分割字符即可.`StringJoiner joiner = new StringJoiner(",")`

- 如果需要在字符串前后加内容,那么构造函数的第二个参数就是开头拼接,第三个参数就是结尾拼接.`StringJoiner joiner = new StringJoiner(",","Hello ","!")`

- `String`还提供了一个静态方法`join()`，这个方法在内部使用了`StringJoiner`来拼接字符串，在不需要指定“开头”和“结尾”的时候，用`String.join()`更方便

  ```java
  import java.util.StringJoiner;
  
  public class string {
      public static void main(String[] args) {
  
          //StringJoiner
          String[] word = {"have","join","left"};
          StringJoiner joiner = new StringJoiner(",");
          for (String s : word) {
              joiner.add(s);
          }
          System.out.println(joiner.toString());
          //have,join,left
  
          //指定开头和结尾
          String[] word = {"have","join","left"};
          StringJoiner joiner = new StringJoiner(",","Hello ","!");
          for (String s : word) {
              joiner.add(s);
          }
          System.out.println(joiner.toString());
          //Hello have,join,left!
  
  
          //String的静态方法join
          String[] word = {"fuck","you","self"};
          String join = String.join(",", word);
          System.out.println(join);
          //fuck,you,self
  
  
          //测试拼接Select
          String[] fields = { "name", "position", "salary" };
          String table = "employee";
          String select = buildSelectSql(table, fields);
          System.out.println(select);
          System.out.println("SELECT name, position, salary FROM employee".equals(select) ? "测试成功" : "测试失败");
          //SELECT name, position, salary FROM employee
          //测试成功
      }
  
      static String buildSelectSql(String table, String[] fields) {
          // TODO:
          StringJoiner joiner = new StringJoiner(", ", "SELECT ", " FROM " + table);
          for (String field : fields) {
              joiner.add(field);
          }
          return joiner.toString();
      }
  }
  
  ```

### 常用工具类

#### Math

顾名思义，`Math`类就是用来进行数学计算的，它提供了大量的静态方法来便于我们实现数学计算：

求绝对值：

```java
Math.abs(-100); // 100
Math.abs(-7.8); // 7.8
```

取最大或最小值：

```java
Math.max(100, 99); // 100
Math.min(1.2, 2.3); // 1.2
```

生成一个随机数x，x的范围是`0 <= x < 1`：

```java
Math.random(); // 0.53907... 每次都不一样
```

#### Random

`Random`用来创建伪随机数。所谓伪随机数，是指只要给定一个初始的种子，产生的随机数序列是完全一样的。

要生成一个随机数，可以使用`nextInt()`、`nextLong()`、`nextFloat()`、`nextDouble()`：

```java
Random r = new Random();
r.nextInt(); // 2071575453,每次都不一样
r.nextInt(10); // 5,生成一个[0,10)之间的int
r.nextLong(); // 8811649292570369305,每次都不一样
r.nextFloat(); // 0.54335...生成一个[0,1)之间的float
r.nextDouble(); // 0.3716...生成一个[0,1)之间的double
```

有童鞋问，每次运行程序，生成的随机数都是不同的，没看出*伪随机数*的特性来。

这是因为我们创建`Random`实例时，如果不给定种子，就使用系统当前时间戳作为种子，因此每次运行时，种子不同，得到的伪随机数序列就不同。

如果我们在创建`Random`实例时指定一个种子，就会得到完全确定的随机数序列,比如`Random r = new Random(12345);`就是给定了种子了.

## Maven

### 安装

- 首先去官网下载zip文件
- 解压即可,放在应该放在的目录
- 打开`windows`环境变量设置,新建变量名`M2_HOME`,变量值填你`maven`文件夹的地址比如`D:\develop\apache-maven-3.6.3`.然后去编辑`Path`变量,加上`%M2_HOME%\bin`在其中即可.
- 同时注意,也要在环境变量里如此配置好JDK的目录,不然无法生效
- 全部搞定之后,打开`cmd`,输入`mvn -version`,正常看到版本号就安装成功了

## Spring

### IOC

- 如果一个系统有大量的组件，其生命周期和相互之间的依赖关系如果由组件自身来维护，不但大大增加了系统的复杂度，而且会导致组件之间极为紧密的耦合，继而给测试和维护带来了极大的困难。

- 因此，核心问题是：

  1. 谁负责创建组件？
  2. 谁负责根据依赖关系组装组件？
  3. 销毁时，如何按依赖顺序正确销毁？

  解决这一问题的核心方案就是`IoC`。

  传统的应用程序中，控制权在程序本身，程序的控制流程完全由开发者控制

- 在`IoC`模式下，控制权发生了反转，即从应用程序转移到了`IoC`容器，所有组件不再由应用程序自己创建和配置，而是由`IoC`容器负责，这样，应用程序只需要直接使用已经创建好并且配置好的组件。为了能让组件在`IoC`容器中被“装配”出来，需要某种“注入”机制

- 例如，`BookService`自己并不会创建`DataSource`，而是等待外部通过`setDataSource()`方法来注入一个`DataSource`

  ```java
  public class BookService {
      private DataSource dataSource;
  
      public void setDataSource(DataSource dataSource) {
          this.dataSource = dataSource;
      }
  }
  ```

- 因此，IoC又称为依赖注入（DI：Dependency Injection），它解决了一个最主要的问题：将组件的创建+配置与组件的使用相分离，并且，由IoC容器负责管理组件的生命周期。

  因为IoC容器要负责实例化所有的组件，因此，有必要告诉容器如何创建组件，以及各组件的依赖关系。一种最简单的配置是通过XML文件来实现，例如：

  

  ```xml
  <beans>
      <bean id="dataSource" class="HikariDataSource" />
      <bean id="bookService" class="BookService">
          <property name="dataSource" ref="dataSource" />
      </bean>
      <bean id="userService" class="UserService">
          <property name="dataSource" ref="dataSource" />
      </bean>
  </beans>
  ```

  上述XML配置文件指示`IoC`容器创建3个JavaBean组件，并把id为`dataSource`的组件通过属性`dataSource`（即调用`setDataSource()`方法）注入到另外两个组件中。

  在Spring的`IoC`容器中，我们把所有组件统称为JavaBean，即配置一个组件就是配置一个Bean。

- 我们从上面的代码可以看到，依赖注入可以通过`set()`方法实现。但依赖注入也可以通过构造方法实现。

  很多Java类都具有带参数的构造方法，如果我们把`BookService`改造为通过构造方法注入，那么实现代码如下：

  ```java
  public class BookService {
      private DataSource dataSource;
  
      public BookService(DataSource dataSource) {
          this.dataSource = dataSource;
      }
  }
  ```

  Spring的`IoC`容器同时支持属性注入和构造方法注入，并允许混合使用。

### 装配Bean

- 一个具体的用户注册登录的例子。整个工程的结构如下：

```ascii
spring-ioc-appcontext
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── itranswarp
        │           └── learnjava
        │               ├── Main.java
        │               └── service
        │                   ├── MailService.java
        │                   ├── User.java
        │                   └── UserService.java
        └── resources
            └── application.xml
```

- 首先,`maven`引入依赖,现在的maven很有意思,`IDEA`中,点击刷新才会下载你添加的依赖.

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <project xmlns="http://maven.apache.org/POM/4.0.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
      <modelVersion>4.0.0</modelVersion>
  
      <groupId>org.example</groupId>
      <artifactId>springUse</artifactId>
      <version>1.0-SNAPSHOT</version>
  
      <properties>
          <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
          <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
          <maven.compiler.source>14</maven.compiler.source>
          <maven.compiler.target>14</maven.compiler.target>
          <java.version>14</java.version>
  
          <spring.version>5.2.3.RELEASE</spring.version>
      </properties>
  
      <dependencies>
          <dependency>
              <groupId>org.springframework</groupId>
              <artifactId>spring-context</artifactId>
              <version>${spring.version}</version>
          </dependency>
          <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
          <dependency>
              <groupId>org.projectlombok</groupId>
              <artifactId>lombok</artifactId>
              <version>1.18.12</version>
              <scope>provided</scope>
          </dependency>
      </dependencies>
  </project>
  ```

- 然后创建一个User实体类

  ```java
  package learn;
  
  import lombok.AllArgsConstructor;
  import lombok.Data;
  import lombok.NoArgsConstructor;
  
  @Data
  @NoArgsConstructor                 //无参构造
  @AllArgsConstructor                //有参构造
  public class User {
      private Long id;
      private String email;
      private String password;
      private String name;
  }
  
  ```

- 然后创建一个提示登录注册信息的类

  ```java
  package learn;
  
  import java.time.ZoneId;
  import java.time.ZonedDateTime;
  import java.time.format.DateTimeFormatter;
  
  public class MailService {
      private ZoneId zoneId = ZoneId.systemDefault();
  
      public void setZoneId(ZoneId zoneId){
          this.zoneId = zoneId;
      }
  
      public String getTime() {
          return ZonedDateTime.now(this.zoneId).format(DateTimeFormatter.ISO_ZONED_DATE_TIME);
      }
  
      public void sentLoginMail(User user){
          System.out.println(String.format("你好, %s!你在 %s 登录了",user.getName(),getTime()));
      }
  
      public void sentRegisterMail(User user){
          System.out.println(String.format("%s,恭喜您注册成功",user.getName()));
      }
  }
  
  ```

- 再创建一个注册,登录用户的类

  ```java
  package learn;
  
  import java.util.ArrayList;
  import java.util.List;
  
  public class UserService {
      private MailService mailService;
  
      public void setMailService(MailService mailService){
          this.mailService = mailService;
      }
  
      private List<User> users = new ArrayList<>(List.of( // users:
          new User((long) 1, "bob@example.com", "password", "Bob"), // bob
          new User((long)2, "alice@example.com", "password", "Alice"), // alice
          new User((long)3, "tom@example.com", "password", "Tom"))); // tom
  
      //登录
      public User login(String email,String password){
          for (User user : users) {
              if(email.equalsIgnoreCase(user.getEmail())&&password.equals(user.getPassword())){
                  mailService.sentLoginMail(user);
                  return user;
              }
          }
          throw new RuntimeException("登录失败");
      }
  
      //获取用户
      public User getUser(long id){
          return users.stream().filter(user -> user.getId()==id).findFirst().orElseThrow();
      }
      //注册
      public User register(String email,String name,String password){
          users.forEach((user)
                        ->
                        {
                            if(user.getEmail().equalsIgnoreCase(email)){
                                throw new RuntimeException("邮箱已被使用");
                            }
                        }
                       );
          User newUser = new User(users.stream().mapToLong(user -> user.getId()).max().getAsLong(), email, password, name);
          users.add(newUser);
          mailService.sentRegisterMail(newUser);
          return newUser;
      }
  }
  
  ```

- 创建配置文件,在里面创建对应的bean实体类

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
                             https://www.springframework.org/schema/beans/spring-beans.xsd">
  
      <bean id="userService" class="learn.UserService">
          <property name="mailService" ref="mailService" />
      </bean>
  
      <bean id="mailService" class="learn.MailService" />
  </beans>
  ```

  

- 最后创建主类,使用主方法测试一下注册

  ```java
  package learn;
  
  import org.springframework.context.support.ClassPathXmlApplicationContext;
  
  public class Main {
      public static void main(String[] args) {
          ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("application.xml");
          UserService userService = context.getBean(UserService.class);
          User user = userService.login("alice@example.com", "password");
          System.out.println(user.getName());
          //你好, Alice!你在 2020-06-24T10:15:17.4721767+08:00[Asia/Shanghai] 登录了
          //Alice
      }
  }
  
  ```

### 使用Annotation配置

- 可以使用Annotation配置，可以完全不需要XML，让Spring自动扫描Bean并组装它们。

- 上一节的示例改造一下，先删除XML配置文件，然后，给`UserService`和`MailService`添加几个注解。

- 首先，我们给`MailService`添加一个`@Component`注解：

  ```java
  @Component
  public class MailService {
      ...
  }
  ```

  **这个`@Component`注解就相当于定义了一个Bean，它有一个可选的名称，默认是`mailService`，即小写开头的类名。**

  然后，我们给`UserService`添加一个`@Component`注解和一个`@Autowired`注解：

  ```java
  @Component
  public class UserService {
      @Autowired
      MailService mailService;
  
      ...
  }
  ```

  **使用`@Autowired`就相当于把指定类型的Bean注入到指定的字段中**。和XML配置相比，`@Autowired`大幅简化了注入，因为它不但可以写在`set()`方法上，还可以直接写在字段上，甚至可以写在构造方法中：

  ```java
  @Component
  public class UserService {
      MailService mailService;
  
      public UserService(@Autowired MailService mailService) {
          this.mailService = mailService;
      }
      ...
  }
  ```

  我们一般把`@Autowired`写在字段上，通常使用package权限的字段，便于测试。

  最后，编写一个`AppConfig`类启动容器：

  ```java
  @Configuration
  @ComponentScan
  public class AppConfig {
      public static void main(String[] args) {
          ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
          UserService userService = context.getBean(UserService.class);
          User user = userService.login("bob@example.com", "password");
          System.out.println(user.getName());
      }
  }
  ```

  除了`main()`方法外，`AppConfig`标注了`@Configuration`，表示它是一个配置类，因为我们创建`ApplicationContext`时：

  ```java
  ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
  ```

  使用的实现类是`AnnotationConfigApplicationContext`，必须传入一个标注了`@Configuration`的类名。

  此外，`AppConfig`还标注了`@ComponentScan`，它告诉容器，自动搜索当前类所在的包以及子包，把所有标注为`@Component`的Bean自动创建出来，并根据`@Autowired`进行装配。

  整个工程结构如下：

  ```ascii
  spring-ioc-annoconfig
  ├── pom.xml
  └── src
      └── main
          └── java
              └── com
                  └── itranswarp
                      └── learnjava
                          ├── AppConfig.java
                          └── service
                              ├── MailService.java
                              ├── User.java
                              └── UserService.java
  ```

  使用Annotation配合自动扫描能大幅简化Spring的配置，我们只需要保证：

  - 每个Bean被标注为`@Component`并正确使用`@Autowired`注入；
  - 配置类被标注为`@Configuration`和`@ComponentScan`；
  - 所有Bean均在指定包以及子包内。

  使用`@ComponentScan`非常方便，但是，我们也要特别注意包的层次结构。通常来说，启动配置`AppConfig`位于自定义的顶层包（例如`com.itranswarp.learnjava`），其他Bean按类别放入子包。

### 使用Resource

- 在Java程序中，我们经常会读取配置文件、资源文件等。使用Spring容器时，我们也可以把“文件”注入进来，方便程序读取。

  例如，AppService需要读取`logo.txt`这个文件，通常情况下，我们需要写很多繁琐的代码，主要是为了定位文件，打开InputStream。

  Spring提供了一个`org.springframework.core.io.Resource`（注意不是`javax.annotation.Resource`），它可以像`String`、`int`一样使用`@Value`注入

  ```java
  @Component
  public class AppService {
      @Value("classpath:/logo.txt")
      private Resource resource;
  
      private String logo;
  
      @PostConstruct
      public void init() throws IOException {
          try (var reader = new BufferedReader(
                  new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
              this.logo = reader.lines().collect(Collectors.joining("\n"));
          }
      }
  }
  ```

  

- 使用classpath是最简单的方式。上述工程结构如下：

  ```ascii
  spring-ioc-resource
  ├── pom.xml
  └── src
      └── main
          ├── java
          │   └── com
          │       └── itranswarp
          │           └── learnjava
          │               ├── AppConfig.java
          │               └── AppService.java
          └── resources
              └── logo.txt
  ```

  使用Maven的标准目录结构，所有资源文件放入`src/main/resources`即可。

### 注入配置

有两种方式

1. 从配置文件读取配置

   `@PropertySource("app.properties")`,`@Value("${app.zone:Z}")`

2. 从对象中提取数据

   `@Value("${smtp.port:25}")`,`@Value("#{smtpConfig.host}")`

Spring容器还提供了一个更简单的`@PropertySource`来自动读取配置文件。我们只需要在`@Configuration`配置类上再添加一个注解：

```java
@Configuration
@ComponentScan
@PropertySource("app.properties") // 表示读取classpath的app.properties
public class AppConfig {
    @Value("${app.zone:Z}")
    String zoneId;

    @Bean
    ZoneId createZoneId() {
        return ZoneId.of(zoneId);
    }
}
```

**Spring容器看到`@PropertySource("app.properties")`注解后，自动读取这个配置文件**，然后，我们使用`@Value`正常注入：

```java
@Value("${app.zone:Z}")
String zoneId;
```

注意注入的字符串语法，它的格式如下：

- `"${app.zone}"`表示读取key为`app.zone`的value，如果key不存在，启动将报错；
- `"${app.zone:Z}"`表示读取key为`app.zone`的value，但如果key不存在，就使用默认值`Z`。

这样一来，我们就可以根据`app.zone`的配置来创建`ZoneId`。

**还可以把注入的注解写到方法参数中：**

```java
@Bean
ZoneId createZoneId(@Value("${app.zone:Z}") String zoneId) {
    return ZoneId.of(zoneId);
}
```

可见，先使用`@PropertySource`读取配置文件，然后通过`@Value`以`${key:defaultValue}`的形式注入，可以极大地简化读取配置的麻烦。

另一种注入配置的方式是先通过一个简单的JavaBean持有所有的配置，例如，一个`SmtpConfig`：

```java
@Component
public class SmtpConfig {
    @Value("${smtp.host}")
    private String host;

    @Value("${smtp.port:25}")
    private int port;

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }
}
```

然后，在需要读取的地方，使用`#{smtpConfig.host}`注入：

```java
@Component
public class MailService {
    @Value("#{smtpConfig.host}")
    private String smtpHost;

    @Value("#{smtpConfig.port}")
    private int smtpPort;
}
```

注意观察`#{}`这种注入语法，它和`${key}`不同的是，`#{}`表示从JavaBean读取属性。`"#{smtpConfig.host}"`的意思是，从名称为`smtpConfig`的Bean读取`host`属性，即调用`getHost()`方法。一个Class名为`SmtpConfig`的Bean，它在Spring容器中的默认名称就是`smtpConfig`，除非用`@Qualifier`指定了名称。

使用一个独立的JavaBean持有所有属性，然后在其他Bean中以`#{bean.property}`注入的好处是，多个Bean都可以引用同一个Bean的某个属性。例如，如果`SmtpConfig`决定从数据库中读取相关配置项，那么`MailService`注入的`@Value("#{smtpConfig.host}")`仍然可以不修改正常运行。

### 使用条件装配

- Spring为应用程序准备了Profile这一概念，用来表示不同的环境。例如，我们分别定义开发、测试和生产这3个环境：

  - native
  - test
  - production

  创建某个Bean时，Spring容器可以根据注解`@Profile`来决定是否创建。例如，以下配置

  ```java
  @Bean
  @Profile("!test")
  ZoneId createZoneId() {
      return ZoneId.systemDefault();
  }
  
  @Bean
  @Profile("test")
  ZoneId createZoneIdForTest() {
      return ZoneId.of("America/New_York");
  }
  ```

- 如果当前的Profile设置为`test`，则Spring容器会调用`createZoneIdForTest()`创建`ZoneId`，否则，调用`createZoneId()`创建`ZoneId`。注意到`@Profile("!test")`表示非test环境。

  在运行程序时，加上JVM参数`-Dspring.profiles.active=test`就可以指定以`test`环境启动。

  实际上，**Spring允许指定多个Profile**

- 要满足多个Profile条件，可以这样写：

  ```java
  @Bean
  @Profile({ "test", "master" }) // 同时满足test和master
  ZoneId createZoneId() {
      ...
  }
  ```

#### 使用Conditional

- 除了根据`@Profile`条件来决定是否创建某个Bean外，Spring还可以根据`@Conditional`决定是否创建某个Bean。

  例如，我们对`SmtpMailService`添加如下注解：

  ```java
  @Component
  @Conditional(OnSmtpEnvCondition.class)
  public class SmtpMailService implements MailService {
      ...
  }
  ```

  它的意思是，如果满足`OnSmtpEnvCondition`的条件，才会创建`SmtpMailService`这个Bean。`OnSmtpEnvCondition`的条件是什么呢？我们看一下代码：

  ```java
  public class OnSmtpEnvCondition implements Condition {
      public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
          return "true".equalsIgnoreCase(System.getenv("smtp"));
      }
  }
  ```

  因此，`OnSmtpEnvCondition`的条件是存在环境变量`smtp`，值为`true`。这样，我们就可以通过环境变量来控制是否创建`SmtpMailService`。

  Spring只提供了`@Conditional`注解，**具体判断逻辑还需要我们自己实现**。Spring Boot提供了更多使用起来更简单的条件注解，例如，如果配置文件中存在`app.smtp=true`，则创建`MailService`：

  ```java
  @Component
  @ConditionalOnProperty(name="app.smtp", havingValue="true")
  public class MailService {
      ...
  }
  ```

  如果当前classpath中存在类`javax.mail.Transport`，则创建`MailService`：

  ```
  @Component
  @ConditionalOnClass(name = "javax.mail.Transport")
  public class MailService {
      ...
  }
  ```

  后续我们会介绍Spring Boot的条件装配。我们以文件存储为例，假设我们需要保存用户上传的头像，并返回存储路径，在本地开发运行时，我们总是存储到文件：

  ```java
  @Component
  @ConditionalOnProperty(name = "app.storage", havingValue = "file", matchIfMissing = true)
  public class FileUploader implements Uploader {
      ...
  }
  ```

  在生产环境运行时，我们会把文件存储到类似AWS S3上：

  ```java
  @Component
  @ConditionalOnProperty(name = "app.storage", havingValue = "s3")
  public class S3Uploader implements Uploader {
      ...
  }
  ```

  其他需要存储的服务则注入`Uploader`：

  ```java
  @Component
  public class UserImageService {
      @Autowired
      Uploader uploader;
  }
  ```

  **当应用程序检测到配置文件存在`app.storage=s3`时，自动使用`S3Uploader`，如果存在配置`app.storage=file`，或者配置`app.storage`不存在，则使用`FileUploader`。**

  可见，使用条件注解，能更灵活地装配Bean。

### AOP

- 那什么是AOP？

  我们先回顾一下OOP：Object Oriented Programming，OOP作为面向对象编程的模式，获得了巨大的成功，OOP的主要功能是数据封装、继承和多态。

  而AOP是一种新的编程方式，它和OOP不同，OOP把系统看作多个对象的交互，AOP把系统分解为不同的关注点，或者称之为切面（Aspect）。

- 在Java平台上，对于AOP的织入，有3种方式：

  1. 编译期：在编译时，由编译器把切面调用编译进字节码，这种方式需要定义新的关键字并扩展编译器，AspectJ就扩展了Java编译器，使用关键字aspect来实现织入；
  2. 类加载器：在目标类被装载到JVM时，通过一个特殊的类加载器，对目标类的字节码重新“增强”；
  3. 运行期：目标对象和切面都是普通Java类，通过JVM的动态代理功能或者第三方库实现运行期动态织入。

  **最简单的方式是第三种，Spring的AOP实现就是基于JVM的动态代理。**由于JVM的动态代理要求必须实现接口，如果一个普通类没有业务接口，就需要通过[CGLIB](https://github.com/cglib/cglib)或者[Javassist](https://www.javassist.org/)这些第三方库实现。

  AOP技术看上去比较神秘，但实际上，它本质就是一个动态代理，让我们把一些常用功能如权限检查、日志、事务等，从每个业务方法中剥离出来。

  需要特别指出的是，**AOP**对于**解决特定问题**，例如事务管理非常有用，这是因为分散在各处的**事务代码几乎是完全相同的**，并且它们需要的**参数**（JDBC的Connection）也是**固定**的。另一些特定问题，如日志，就不那么容易实现，因为日志虽然简单，但打印日志的时候，经常需要捕获局部变量，如果使用AOP实现日志，我们只能输出固定格式的日志，因此，**使用AOP时，必须适合特定的场景。**

#### 装配AOP

- 可见，虽然Spring容器内部实现AOP的逻辑比较复杂（需要使用AspectJ解析注解，并通过CGLIB实现代理类），但我们使用AOP非常简单，一共需要三步：

  > 先写一个类,然后把AOP的方法都放在这个类中,下面的1,2步都是对这个类和类中方法的操作

  1. 定义执行方法，并在方法上通过AspectJ的注解告诉Spring应该在何处调用此方法；
  2. 标记`@Component`和`@Aspect`；
  3. 在`@Configuration`类上标注`@EnableAspectJAutoProxy`。

  至于AspectJ的注入语法则比较复杂，请参考[Spring文档](https://docs.spring.io/spring/docs/current/spring-framework-reference/core.html#aop-pointcuts-examples)。

  Spring也提供其他方法来装配AOP，但都没有使用AspectJ注解的方式来得简洁明了，所以我们不再作介绍。

  ```java
  package learn;
  
  import org.aspectj.lang.ProceedingJoinPoint;
  import org.aspectj.lang.annotation.Around;
  import org.aspectj.lang.annotation.Aspect;
  import org.aspectj.lang.annotation.Before;
  import org.springframework.stereotype.Component;
  
  @Aspect
  @Component
  public class LoggingAspect {
      //执行UserService的所有方法前执行
      @Before("execution(public * learn.service.UserService.*(..))")
      public void doAccessCheck(){
          System.err.println("[之前] 进行进入前检查");
      }
  
      @Around("execution(public * learn.service.MailService.*(..))")
      //执行MailService的所有方法前后执行
      public Object doLogging(ProceedingJoinPoint pj) throws Throwable{
          System.err.println("[前后] 开始 "+pj.getSignature());
          Object proceed = pj.proceed();
          System.err.println("[前后] 结束 "+pj.getSignature());
          return proceed;
      }
  }
  
  ```

  ```java
  package learn;
  
  import learn.service.UserService;
  import org.springframework.context.ApplicationContext;
  import org.springframework.context.annotation.AnnotationConfigApplicationContext;
  import org.springframework.context.annotation.ComponentScan;
  import org.springframework.context.annotation.Configuration;
  import org.springframework.context.annotation.EnableAspectJAutoProxy;
  
  
  @Configuration
  @ComponentScan
  @EnableAspectJAutoProxy
  public class AppConfig {
      @SuppressWarnings("resource")
      public static void main(String[] args) {
          ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
          UserService userService = context.getBean(UserService.class);
          userService.register("test@example.com", "password", "test");
          userService.login("bob@example.com", "password");
          System.out.println(userService.getClass().getName());
          //[之前] 进行进入前检查
          //[前后] 开始 void learn.service.MailService.sentRegisterMail(User)
          //password,恭喜您注册成功
          //你好, Bob!你在 2020-06-29T15:59:12.4316192+08:00[Asia/Shanghai] 登录了
          //learn.service.UserService$$EnhancerBySpringCGLIB$$c63d2ecc
          //[前后] 结束 void learn.service.MailService.sentRegisterMail(User)
          //[之前] 进行进入前检查
          //[前后] 开始 void learn.service.MailService.sentLoginMail(User)
          //[前后] 结束 void learn.service.MailService.sentLoginMail(User)
      }
  }
  
  ```

  

  ### 拦截器类型

  顾名思义，拦截器有以下类型：

  - @Before：这种拦截器先执行拦截代码，再执行目标代码。如果拦截器抛异常，那么目标代码就不执行了；
  - @After：这种拦截器先执行目标代码，再执行拦截器代码。无论目标代码是否抛异常，拦截器代码都会执行；
  - @AfterReturning：和@After不同的是，只有当目标代码正常返回时，才执行拦截器代码；
  - @AfterThrowing：和@After不同的是，只有当目标代码抛出了异常时，才执行拦截器代码；
  - @Around：能完全控制目标代码是否执行，并可以在执行前后、抛异常后执行任意拦截代码，可以说是包含了上面所有功能。

#### 使用注解装配AOP(推荐)

- 之前的AOP装配,匹配规则比较复杂,其实很少用

- 使用AOP时，被装配的Bean最好自己能清清楚楚地知道自己被安排了。

- 应该使用更简单的方式

- 使用注解实现AOP需要先定义注解，然后使用`@Around("@annotation(name)")`实现装配；

  使用注解既简单，又能明确标识AOP装配，是使用AOP推荐的方式。

---

- 比如我们写一个检查运行用时(监控性能)的注解

  ```java
  package learn.service;
  
  import java.lang.annotation.Retention;
  import java.lang.annotation.Target;
  
  import static java.lang.annotation.ElementType.METHOD;
  import static java.lang.annotation.RetentionPolicy.RUNTIME;
  
  @Target(METHOD)
  @Retention(RUNTIME)
  public @interface CheckTime {
      String value();
  }
  
  ```

- 然后编写AOP

  ```java
  package learn;
  
  import learn.service.CheckTime;
  import org.aspectj.lang.ProceedingJoinPoint;
  import org.aspectj.lang.annotation.Around;
  import org.aspectj.lang.annotation.Aspect;
  import org.springframework.stereotype.Component;
  
  @Aspect
  @Component
  public class CheckAspect {
      @Around("@annotation(checkTime)")
      public Object check(ProceedingJoinPoint pj, CheckTime checkTime) throws Throwable{
          String name = checkTime.value();
          long start = System.currentTimeMillis();
          try {
              return pj.proceed();
          }finally {
              long end = System.currentTimeMillis()-start;
              System.out.println("[check]"+name+":"+end);
              //[check]register:47
          }
      }
  }
  
  ```

- 注意`check()`方法标注了`@Around("@annotation(checkTime)")`，它的意思是，符合条件的目标方法是带有`@CheckTime`注解的方法，因为`check()`方法参数类型是`CheckTime`（注意参数名是`checkTime`不是`CheckTime`），我们通过它获取性能监控的名称。

  有了`@CheckTime`注解，再配合`CheckAspect`，任何Bean，只要方法标注了`@CheckTime`注解，就可以自动实现性能监控。运行代码，输出结果如下：

  ```java
  password,恭喜您注册成功
  [check]register:47
  ```

#### 避坑指南

-  Spring通过CGLIB创建的代理类，不会初始化代理类自身继承的任何成员变量，包括final类型的成员变量！

- 因此，正确使用AOP，我们需要一个避坑指南：

  1. 访问被注入的Bean时，总是调用方法而非直接访问字段；

     > 意思是不能`userService.name`这样子,应该`userService.getName()`

  2. 编写Bean时，如果可能会被代理，就不要编写`public final`方法。

  这样才能保证有没有AOP，代码都能正常工作。

  

### 访问数据库

#### 使用声明式事务

- Spring为了同时支持JDBC和JTA两种事务模型，就抽象出`PlatformTransactionManager`。因为我们的代码只需要JDBC事务，因此，在`AppConfig`中，需要再定义一个`PlatformTransactionManager`对应的Bean，它的实际类型是`DataSourceTransactionManager`：

  ```java
  @Configuration
  @ComponentScan
  @PropertySource("jdbc.properties")
  public class AppConfig {
      ...
      @Bean
      PlatformTransactionManager createTxManager(@Autowired DataSource dataSource) {
          return new DataSourceTransactionManager(dataSource);
      }
  }
  ```

  使用编程的方式使用Spring事务仍然比较繁琐，更好的方式是通过声明式事务来实现。使用声明式事务非常简单，除了在`AppConfig`中追加一个上述定义的`PlatformTransactionManager`外，再加一个`@EnableTransactionManagement`就可以启用声明式事务：

  ```java
  @Configuration
  @ComponentScan
  @EnableTransactionManagement // 启用声明式
  @PropertySource("jdbc.properties")
  public class AppConfig {
      ...
  }
  ```

  然后，对需要事务支持的方法，加一个`@Transactional`注解：

  ```java
  @Component
  public class UserService {
      // 此public方法自动具有事务支持:
      @Transactional
      public User register(String email, String password, String name) {
         ...
      }
  }
  ```

  或者更简单一点，直接在Bean的`class`处加上，表示所有`public`方法都具有事务支持：

  ```java
  @Component
  @Transactional
  public class UserService {
      ...
  }
  ```

- **注意：**声明了`@EnableTransactionManagement`后，不必额外添加`@EnableAspectJAutoProxy`。

##### 回滚事务

- 默认情况下，如果发生了`RuntimeException`，Spring的声明式事务将自动回滚。在一个事务方法中，如果程序判断需要回滚事务，只需抛出`RuntimeException`，例如：

  ```java
  @Transactional
  public buyProducts(long productId, int num) {
      ...
      if (store < num) {
          // 库存不够，购买失败:
          throw new IllegalArgumentException("No enough products");
      }
      ...
  }
  ```

  如果要针对Checked Exception回滚事务，需要在`@Transactional`注解中写出来：

  ```java
  @Transactional(rollbackFor = {RuntimeException.class, IOException.class})
  public buyProducts(long productId, int num) throws IOException {
      ...
  }
  ```

  上述代码表示在抛出`RuntimeException`或`IOException`时，事务将回滚。

  为了简化代码，我们强烈建议业务异常体系从`RuntimeException`派生，这样就不必声明任何特殊异常即可让Spring的声明式事务正常工作：

  ```java
  public class BusinessException extends RuntimeException {
      ...
  }
  
  public class LoginException extends BusinessException {
      ...
  }
  
  public class PaymentException extends BusinessException {
      ...
  }
  ```

##### 事务传播

- 事务只能在**当前线程**传播，**无法跨线程**传播。

#### 集成MyBatis

- 可见，ORM的设计套路都是类似的。使用MyBatis的核心就是创建`SqlSessionFactory`，这里我们需要创建的是`SqlSessionFactoryBean`：

  ```java
  @Bean
  SqlSessionFactoryBean createSqlSessionFactoryBean(@Autowired DataSource dataSource) {
      var sqlSessionFactoryBean = new SqlSessionFactoryBean();
      sqlSessionFactoryBean.setDataSource(dataSource);
      return sqlSessionFactoryBean;
  }
  ```

  因为MyBatis可以直接使用Spring管理的声明式事务，因此，创建事务管理器和使用JDBC是一样的：

  ```java
  @Bean
  PlatformTransactionManager createTxManager(@Autowired DataSource dataSource) {
      return new DataSourceTransactionManager(dataSource);
  }
  ```

  和Hibernate不同的是，MyBatis使用Mapper来实现映射，而且Mapper必须是接口。我们以User类为例，在User类和users表之间映射的UserMapper编写如下：

  ```java
  public interface UserMapper {
  	@Select("SELECT * FROM users WHERE id = #{id}")
  	User getById(@Param("id") long id);
  }
  ```

  注意：这里的Mapper不是JdbcTemplate的RowMapper的概念，它是定义访问users表的接口方法。比如我们定义了一个`User getById(long)`的主键查询方法，不仅要定义接口方法本身，还要明确写出查询的SQL，这里用注解`@Select`标记。SQL语句的任何参数，都与方法参数按名称对应。例如，方法参数id的名字通过注解`@Param()`标记为`id`，则SQL语句里将来替换的占位符就是`#{id}`。

  如果有多个参数，那么每个参数命名后直接在SQL中写出对应的占位符即可：

  ```java
  @Select("SELECT * FROM users LIMIT #{offset}, #{maxResults}")
  List<User> getAll(@Param("offset") int offset, @Param("maxResults") int maxResults);
  ```

  注意：MyBatis执行查询后，将根据方法的返回类型自动把ResultSet的每一行转换为User实例，转换规则当然是按列名和属性名对应。如果列名和属性名不同，最简单的方式是编写SELECT语句的别名：

  ```sql
  -- 列名是created_time，属性名是createdAt:
  SELECT id, name, email, created_time AS createdAt FROM users
  ```

  执行INSERT语句就稍微麻烦点，因为我们希望传入User实例，因此，定义的方法接口与`@Insert`注解如下：

  ```java
  @Insert("INSERT INTO users (email, password, name, createdAt) VALUES (#{user.email}, #{user.password}, #{user.name}, #{user.createdAt})")
  void insert(@Param("user") User user);
  ```

  上述方法传入的参数名称是`user`，参数类型是User类，在SQL中引用的时候，以`#{obj.property}`的方式写占位符。和Hibernate这样的全自动化ORM相比，MyBatis必须写出完整的INSERT语句。

  如果`users`表的id是自增主键，那么，我们在SQL中不传入id，但希望获取插入后的主键，需要再加一个`@Options`注解：

  ```java
  @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
  @Insert("INSERT INTO users (email, password, name, createdAt) VALUES (#{user.email}, #{user.password}, #{user.name}, #{user.createdAt})")
  void insert(@Param("user") User user);
  ```

  `keyProperty`和`keyColumn`分别指出JavaBean的属性和数据库的主键列名。

  执行UPDATE和DELETE语句相对比较简单，我们定义方法如下：

  ```java
  @Update("UPDATE users SET name = #{user.name}, createdAt = #{user.createdAt} WHERE id = #{user.id}")
  void update(@Param("user") User user);
  
  @Delete("DELETE FROM users WHERE id = #{id}")
  void deleteById(@Param("id") long id);
  ```

  有了`UserMapper`接口，还需要对应的实现类才能真正执行这些数据库操作的方法。虽然可以自己写实现类，但我们除了编写`UserMapper`接口外，还有`BookMapper`、`BonusMapper`……一个一个写太麻烦，因此，MyBatis提供了一个`MapperFactoryBean`来自动创建所有Mapper的实现类。可以用一个简单的注解来启用它：

  ```java
  @MapperScan("com.itranswarp.learnjava.mapper")
  ...其他注解...
  public class AppConfig {
      ...
  }
  ```

  有了`@MapperScan`，就可以让MyBatis自动扫描指定包的所有Mapper并创建实现类。在真正的业务逻辑中，我们可以直接注入：

  ```java
  @Component
  @Transactional
  public class UserService {
      // 注入UserMapper:
      @Autowired
      UserMapper userMapper;
  
      public User getUserById(long id) {
          // 调用Mapper方法:
          User user = userMapper.getById(id);
          if (user == null) {
              throw new RuntimeException("User not found by id.");
          }
          return user;
      }
  }
  ```

  可见，业务逻辑主要就是通过`XxxMapper`定义的数据库方法来访问数据库。

  ### XML配置

  上述在Spring中集成MyBatis的方式，我们只需要用到注解，并没有任何XML配置文件。MyBatis也允许使用XML配置映射关系和SQL语句，例如，更新`User`时根据属性值构造动态SQL：

  ```xml
  <update id="updateUser">
    UPDATE users SET
    <set>
      <if test="user.name != null"> name = #{user.name} </if>
      <if test="user.hobby != null"> hobby = #{user.hobby} </if>
      <if test="user.summary != null"> summary = #{user.summary} </if>
    </set>
    WHERE id = #{user.id}
  </update>
  ```

  编写XML配置的优点是可以组装出动态SQL，并且把所有SQL操作集中在一起。缺点是配置起来太繁琐，调用方法时如果想查看SQL还需要定位到XML配置中。这里我们不介绍XML的配置方式，需要了解的童鞋请自行阅读[官方文档](https://mybatis.org/mybatis-3/zh/configuration.html)。

### 开发WEB应用

#### Spring MVC

## Springboot

### 第一个springboot应用

- 新建一个`springboot-hello`的工程，创建标准的Maven目录结构如下：

  ```ascii
  springboot-hello
  ├── pom.xml
  ├── src
  │   └── main
  │       ├── java
  │       └── resources
  │           ├── application.yml
  │           ├── logback-spring.xml
  │           ├── static
  │           └── templates
  └── target
  ```

#### application.yml

- 使用YAML格式：

  ```yaml
  # application.yml
  
  spring:
    application:
      name: ${APP_NAME:unnamed}
    datasource:
      url: jdbc:hsqldb:file:testdb
      username: sa
      password:
      dirver-class-name: org.hsqldb.jdbc.JDBCDriver
      hikari:
        auto-commit: false
        connection-timeout: 3000
        validation-timeout: 3000
        max-lifetime: 60000
        maximum-pool-size: 20
        minimum-idle: 1
  ```

  可见，YAML是一种层级格式，它和`.properties`很容易互相转换，它的优点是去掉了大量重复的前缀，并且更加易读。

- `static`是静态文件目录，`templates`是模板文件目录，注意它们不再存放在`src/main/webapp`下，而是直接放到`src/main/resources`这个classpath目录，因为在Spring Boot中已经不需要专门的webapp目录了。

  以上就是Spring Boot的标准目录结构，它完全是一个基于Java应用的普通Maven项目。

- 源码目录结构：

  ```ascii
  src/main/java
  └── com
      └── itranswarp
          └── learnjava
              ├── Application.java
              ├── entity
              │   └── User.java
              ├── service
              │   └── UserService.java
              └── web
                  └── UserController.java
  ```

  在存放源码的`src/main/java`目录中，Spring Boot对Java包的层级结构有一个要求。注意到我们的根package是`com.itranswarp.learnjava`，下面还有`entity`、`service`、`web`等子package。Spring Boot要求`main()`方法所在的启动类必须放到根package下，命名不做要求，这里我们以`Application.java`命名，它的内容如下：

  ```
  @SpringBootApplication
  public class Application {
      public static void main(String[] args) throws Exception {
          SpringApplication.run(Application.class, args);
      }
  }
  ```

  启动Spring Boot应用程序只需要一行代码加上一个注解`@SpringBootApplication`，该注解实际上又包含了：

  - @SpringBootConfiguration
    - @Configuration
  - @EnableAutoConfiguration
    - @AutoConfigurationPackage
  - @ComponentScan

  这样一个注解就相当于启动了自动配置和自动扫描。

#### 使用开发者工具(springboot自动重启,类似热部署)

- 在开发阶段，我们经常要修改代码，然后重启Spring Boot应用。经常手动停止再启动，比较麻烦。

- Spring Boot提供了一个开发者工具，可以监控classpath路径上的文件。只要源码或配置文件发生修改，Spring Boot应用可以自动重启。在开发阶段，这个功能比较有用。

- 要使用这一开发者功能，我们只需添加如下依赖到`pom.xml`：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

- 然后，没有然后了。直接启动应用程序，然后试着修改源码，保存，观察日志输出，Spring Boot会自动重新加载。

- 默认配置下，针对`/static`、`/public`和`/templates`目录中的文件修改，不会自动重启，因为禁用缓存后，这些文件的修改可以实时更新。

#### 打包springboot

- **打包插件**

- 我们在Maven的[使用插件](https://www.liaoxuefeng.com/wiki/1252599548343744/1309301217951777)一节中介绍了如何使用`maven-shade-plugin`打包一个可执行的jar包。在Spring Boot应用中，打包更加简单，因为Spring Boot自带一个更简单的`spring-boot-maven-plugin`插件用来打包，我们只需要在`pom.xml`中加入以下配置：

  ```xml
  <project ...>
      ...
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

  **如果插件不能使用(`无法解析插件 org.springframework.boot:spring-boot-maven-plugin`)就是IDEA设置的maven和maven仓库地址不是我们下载的而是默认的**

  - 我们只需要`setting`->`构建,执行,部署`->`构建工具`->`maven`.选择覆盖用户设置文件`maven的setting.xml文件`,以及本地存储库`自己创建文件夹,名字不限,配置到setting.xml即可`.

    `<localRepository>D:\develop\mavenRepository</localRepository>`

  ---

  **打包命令,输入在项目根目录即可,也就是IDEA打开的终端的默认地址**

  无需任何配置，Spring Boot的这款插件会自动定位应用程序的入口Class，我们执行以下Maven命令即可打包：

  ```shell
  $ mvn clean package
  ```

  以`springboot-exec-jar`项目为例，打包后我们在`target`目录下可以看到两个jar文件：

  ```shell
  $ ls
  classes
  generated-sources
  maven-archiver
  maven-status
  springboot-exec-jar-1.0-SNAPSHOT.jar
  springboot-exec-jar-1.0-SNAPSHOT.jar.original
  ```

  其中，`springboot-exec-jar-1.0-SNAPSHOT.jar.original`是Maven标准打包插件打的jar包，它只包含我们自己的Class，不包含依赖，而`springboot-exec-jar-1.0-SNAPSHOT.jar`是Spring Boot打包插件创建的包含依赖的jar，可以直接运行：

  ```shell
  $ java -jar springboot-exec-jar-1.0-SNAPSHOT.jar
  ```

  这样，部署一个Spring Boot应用就非常简单，无需预装任何服务器，只需要上传jar包即可。

  在打包的时候，因为打包后的Spring Boot应用不会被修改，因此，默认情况下，`spring-boot-devtools`这个依赖不会被打包进去。但是要注意，使用**早期的Spring Boot**版本时，需要**配置一下才能排除**`spring-boot-devtools`这个依赖：

  ```xml
  <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <configuration>
          <excludeDevtools>true</excludeDevtools>
      </configuration>
  </plugin>
  ```

  如果不喜欢默认的项目名+版本号作为文件名，可以加一个**配置指定文件名**：

  ```xml
  <project ...>
      ...
      <build>
          <finalName>awesome-app</finalName>
          ...
      </build>
  </project>
  ```

  这样打包后的文件名就是`awesome-app.jar`。