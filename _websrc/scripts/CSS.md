## CSS

### CSS media设备适配样式设置


``` css
/* 
  针对iphone5 等320px的宽做出调整
*/
@media screen and (max-width: 320px){
  .friendcard {
    margin: 0 auto;
    width: 15rem;
  }
}
```


### CSS 动画库animate.css


介绍博客 : https://www.cnblogs.com/2050/p/3409129.html


### CSS 去除按钮选中蓝色边框


``` css
.className {
  border: none;
}

.className:focus{
  outline: none;
}
```

[参考](https://blog.csdn.net/qq_26222859/article/details/51516011)


### CSS 元素失焦/虚化滤镜


``` css
#idname{
   filter : blur(2px);
}
```



### CSS 文字换行


强制不换行
``` css
div{
    white-space:nowrap;
}
```

自动换行

``` css
div{ 
    word-wrap: break-word; 
    word-break: normal; 
}
```

强制英文单词断开换行

``` css
div{
    word-break:break-all;
}
```

英文单词不断开换行

``` css
div {
    word-break: keep-all;
    word-wrap: break-word;
    white-space: pre-wrap;
}
```

### CSS placeholder居位设置


``` css
/* placeholder居中 */
#postsearchtext:-moz-placeholder
{
  text-align: center;
}
#postsearchtext::-moz-placeholder
{
  text-align: center;
}
#postsearchtext:-ms-input-placeholder
{
  text-align: center;
}
#postsearchtext::-webkit-input-placeholder
{
    text-align: center;
}
```


### CSS 文字超过元素长度显示省略号



``` css
div{
  width: 75%;
  overflow:hidden; 
  white-space:nowrap; 
  text-overflow:ellipsis;
}
```


### CSS 变量设置和获取


#### :small_blue_diamond:设置
``` css 
:root{
  --main-color: #4d4e53;
  --main-bg: rgb(255, 255, 255);
  --logo-border-color: rebeccapurple;

  --header-height: 68px;
  --content-padding: 10px 20px;

  --base-line-height: 1.428571429;
  --transition-duration: .35s;
  --external-link: "external link";
  --margin-top: calc(2vh + 20px);
}
```

#### :small_blue_diamond:引用
``` css
a {
  color: var(--foo);
  text-decoration-color: var(--bar);
}
```

参考 : http://www.ruanyifeng.com/blog/2017/05/css-variables.html


### CSS 元素垂直/水平居中的骚操作


> 垂直居中就上下是0, 水平居中就左右是0,关键是margin:auto;

``` css
#sidetoccontainer {
  position: (不知道);
  margin: auto;
  bottom: 0;
  top: 0;
}
```

如果元素定位的fixed, 且如果这个骚操作用不了, 那么就给父元素加上

``` css
#father {
   transform:translate(0,0)
}
```

参考自知乎 : https://www.zhihu.com/question/24822927


### CSS3 瀑布布局


三列瀑布

``` css
.con {
  column-count: 3;
}

.todo-card {
  float: left;
  width: 100%;
}
```


### CSS 将DIV画成直角三角形


教程: https://www.cnblogs.com/v-weiwang/p/5057588.html


### CSS自定义滚动条样式


https://segmentfault.com/a/1190000012800450

特效是不会无故无效的，检查一下是不是开了inline

下面这个是coding的滚动条样式：
``` css
*::-webkit-scrollbar {
    width: 8px;
    height: 8px; 
}
*::-webkit-scrollbar-track {
    background-color: rgba(216, 221, 228, 0.3);
    border-radius: 10px; 
}
*::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #76808e; 
}
*::-webkit-scrollbar-thumb:window-inactive {
    background: #d8dde4; 
}
```


### CSS inline-block 垂直居中


https://www.cnblogs.com/olafff/p/5103775.html

https://www.cnblogs.com/hutuzhu/p/4450850.html

