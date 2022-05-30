### 米斯特吴JQuery

#### 初识JQuery

- 核心:操作DOM

#### 场景搭建

#### 语法格式

```javascript
$(document).ready(function(){
			//coding...
		})
```

- 当你的结构已经完全准备好(html标签样式加载完毕之后),再执行这里面的代码
- JQuery中一定会去使用$符号,这个符号能做什么呢?
  - 帮助我们获取document元素对象,使用这个$符号,就可以拿到某个标签(比如某个按钮),

```javascript
$(document).ready(function(){
			$('#panel1').hide(300).show(1000);
		})

```

- 这段jquery代码的作用是,拿到id为panel1的标签,先给一个隐藏方法,ready之后0.3s后隐藏,再给一个show方法,1s后展示.

------

- 如何通过jquery添加样式

  - css方法,括号里是键值对.

  ```javascript
  $('#panel1').css({
  				color:'red',
  				fontWeight:'bold',
  				display:'none'
  			});
  ```

#### addEvent

- 首先,之前的方法代码可以简化

```javascript
$(function(){
			// coding
		})
```

```javascript
$(function(){
			//先获取id,然后.on,意思是要给这个按钮添加某个事件
			//括号左边是字符串格式的事件名,右边是回调函数,就是你具体点击这个事件要执行的操作
			//函数里确定对另外一个标签进行的操作
			$('#btn1').on('click',function(){
				$('#panel1').toggle();
			})
		})
```

- 改变当前元素内容

  - 之前js中想改变元素内容就是`元素.innerHTML`然后给它具体赋值.
  - jquery中是如何实现呢?
  - 先获取id,js中是.innerHTML,jquery中是.html,方法里可以写你具体想改变的内容(可以带标签)

  ```html
  <div class="col-xs-3">
  				<div id="panel1" style="display: none" class="panel panel-primary">
  					<div class="panel-heading">#panel1</div>
  					<div class="panel-body">content</div>
  				</div>
  			</div>
  ```

  

  ```javascript
  $('#panel1').html("what's going on <strong>Baby!</strong>");
  ```

  - 如果想改panel1中具体panel-body的内容

  ```javascript
  $('#panel1 .panel-body').html('new content');
  ```

  - **如果只有几个按钮,那么按钮的绑定方法还可以一个个写,如果有上百个呢?那就应该抽离出来创建一套东西,改变的是你绑定的是哪个按钮以及你要改变哪个元素.**
  - **动态获取当前点击是哪个按钮,js中应该使用this关键字.**

#### DRY(write less do more)

- id在html中是唯一的,要添加点击事件如果以id形式,是不能统一添加的.
- 给几个按钮添加相同类名,获取到这个类名就是获取到所有有这个类名的button
- 第一步是给class panel-button添加点击事件,添加完之后这四个按钮就都有点击事件,同样可以通过某种方法获取到data-panelId,再使用获取元素对象的方式进行拼接,用#拼接一个panel1.

```html
<button data-panelId="panel1"  class="panel-button btn btn-primary">按钮1</button>
			<button data-panelId="panel2" class="panel-button btn btn-success">按钮2</button>
			<button data-panelId="panel3" class="panel-button btn btn-info">按钮3</button>
			<button data-panelId="panel4" class="panel-button btn btn-waring">按钮4</button>
```

```javascript
$(function(){
			//为每个button添加点击事件
			$('.panel-button').on('click',function(){
				//需要一个动态的东西知道你点击的按钮是哪个
				//jquery中使用js中的this也要通过$()来使用,这样的意思就是你点击谁,拿到的就是谁
				//想要获取自定义属性,js中是getattribute,jquery中是attr

				//动态获取被顶级butoon的自定义属性值
				var panelId = $(this).attr('data-panelId');
				//进行操作,因为要动态获取,所以用#拼接panelId
				$('#'+panelId).toggle();
			})
		})
```

#### 节点关系

- 使用`$('li')`就可以获取到**代码中所有li标签**(**括号中的单引号中放的是标签名**,比如div)
- 使用`$('li').first()`就可以获取到代码中的**第一个**li标签
- `$('li').eq(0)`可以做到**通过标签下标来对标签进行操作**,配合循环使用应该不错(eq的括号中填的就是标签下标)
- 还有一种方法也可以按顺序获取标签,`$('li:first')`.
- `$('li').parent()`就可以获取到li标签的**父节点**,`$('li').eq(0).sublings()`就可以获取到下标为0的li标签的**兄弟节点**.

**DOM操作**

- 现在想实现**点击某个按钮,按钮的兄弟元素都被删除**的效果,就需要写以下代码

- ```javascript
  $(function(){
  			
  
  			$('li').on('click',function(e){
  				//删除被点按钮的兄弟元素
  				$(this).siblings().remove();
  			})
  
  		})
  
  ```

- 但是这段代码会出现一定的问题,你点击某个元素,它**不但会删掉自己的兄弟元素,还会删掉父元素**,我们称为**冒泡事件**

- 如何**解决冒泡事件**呢?

- ```javascript
  $(function(){
  			
  
  			$('li').on('click',function(e){
  				//阻止冒泡事件,事件对象e传过来,使用事件对象调用stopPropagation()方法即可
  				e.stopPropagation();
  				//删除被点按钮的兄弟元素
  				$(this).siblings().remove();
  			})
  
  		})
  ```

- 现在我们需要删除某个类的样式,使用removeClass,方法中填写类名即可.

- ```javascript
  <script>
  
  	
  		$(function(){
  			
  
  			$('li').on('click',function(e){
  				//阻止冒泡事件,事件对象e传过来,使用事件对象调用stopPropagation()方法即可
  				e.stopPropagation();
  				//删除某个类样式
  				$(this).removeClass('special');
  			})
  
  		})
  ```

- 如果我们想**操作元素的下一个元素**,就需要使用`$(this).next().hide();`,这样的代码,不过这样的代码假设你有三个相邻的元素,你点击第一个,会隐藏第二个,现在就剩一三,你点击第一个.第三个并不会有反应,因为第三个不是第一个的下一个.**操作元素的上一个元素**同理使用`$(this).prev()`.

- 想**给操作元素的兄弟元素添加样式**的话,就需要使用`$(this).siblings().addClass('special');`这种代码,先获取兄弟元素,然后addClass方法给它添加类,样式就添加上了.

- 如果想**快速找到某些元素**,就可以使用`find()`方法,比如我现在想要点击某些同一个父元素下的元素,使这些元素中带某个类样式的元素的样式消失,就可以使用`$('ul').find('.special').removeClass();`这样的话可以完成,这里面ul就是父元素,类样式的类就是special类.

- 如果想**屏蔽某些元素**,使用`filter()`方法,和find同理,只需要`$('ul').find('li').filter('.special').hide()`,不过这句代码和`$('ul').find('.special').hide()`效果完全一样.

**DOM操作(isNot)**

- jquery中也有js中没有的方法,就是is,和not,判断你这个元素中有没有某些属性.

- ```javascript
  $(function(){
  
  			$('li').on('click',function(e){
  				//阻止冒泡事件,事件对象e传过来,使用事件对象调用stopPropagation()方法即可
  				e.stopPropagation();
  				
  				// 点击某个li,判断当前li是否拥有某种样式
                  //如果当前点击元素有这个类样式就弹窗"有这个类样式"
  				if($(this).is('.special')){  
  					alert("有这个类样式");
                      //如果当前点击元素没有这个类样式就弹窗"没有这个类样式"
  				}else if($(this).not('.special')){ 
  					alert("没有这个类样式");
  				}
  			})
  
  		})
  ```

- ```javascript
  $(function(){
  			
  
  			$('li').on('click',function(e){
  				//阻止冒泡事件,事件对象e传过来,使用事件对象调用stopPropagation()方法即可
  				e.stopPropagation();
  				//判断你的父元素的类是不是sublist,如果是,就隐藏你点击的元素
  				if($(this).parent().is('.sublist')){
  					$(this).hide();
  				}
  			})
  
  		})
  ```

