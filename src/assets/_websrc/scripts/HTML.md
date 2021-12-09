## HTML

### textarea的字数限制


``` html
<textarea 
  rows="5"  
  maxlength="200" 
  onchange="this.value=this.value.substring(0, 200)" 
  onkeydown="this.value=this.value.substring(0, 200)" 
  onkeyup="this.value=this.value.substring(0, 200)">
</textarea>
```

事实上，有了maxLength属性，textarea的输入就已经会有限制了


### input只允许输入数字


``` html
<input type="text" oninput="value=value.replace(/[^\d]/g,'')">
```

### 图片禁止拖拽

在对应标签中添加如下属性即可。

```javascript
oncontextmenu = "return false;" //禁止鼠标右键
ondragstart = "return false;" //禁止鼠标拖动
onselectstart = "return false;" //文字禁止鼠标选中
onselect = "document.selection.empty();" //禁止复制文本
```

例如：

```html
<img src="img/logo.jpg" ondragstart="return false;" />
```

> 作者：祁月笑
> 链接：https://www.imooc.com/article/20121?block_id=tuijian_wz
> 来源：慕课网
