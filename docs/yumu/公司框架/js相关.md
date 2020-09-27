
## JSON

- 如果你想通过js拿到某个输入框中输入的内容然后赋给一个json格式的对象,就该使用jquery中通过id获取元素然后使用`val()`方法就可以拿到输入框中输入的值,然后直接`json.键 = 值 `就可以把你想塞进json的值塞进去了.

  ```js
  function getUser(type,json) {  //拖会员进房间弹窗之前的方法,把电话号码从input框中拿到赋给json,然后执行layer方法
  
      var phone = $(" #phone ").val();
      json.phone = phone;
  
      layer(type,json);
  }
  ```