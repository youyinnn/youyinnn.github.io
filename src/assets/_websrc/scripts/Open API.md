## Open API

### 一些开放的 API

[github repo public-apis](https://github.com/public-apis/public-apis)

### 用来查询 IP 的 API

- 国内：

  - 搜狐

    - [http://pv.sohu.com/cityjson](https://link.jianshu.com?t=http://pv.sohu.com/cityjson)
    - [http://pv.sohu.com/cityjson?ie=utf-8](https://link.jianshu.com?t=http://pv.sohu.com/cityjson?ie=utf-8)
    - [http://txt.go.sohu.com/ip/soip](https://link.jianshu.com?t=http://txt.go.sohu.com/ip/soip)

    其中有一个支持 https，但是有跨域问题，如果使用`<script>`标签解决跨域的话，它的代码是直接注入的，而不是返回的 callback，而且因为没有正式的开放信息，只是搜出来的，不知道什么时候就下线了

  - 某大佬个人维护的免费开放接口平台：https://github.com/MZCretin/RollToolsApi，有https，有跨域，但是因为是个人维护，还是怕不稳定，虽然有小程序监控；也是第一版跳转ipcheck

  - 百度地图开放 API：http://lbs.baidu.com/index.php?title=webapi/ip-api

    虽然跨域，但是好在有 callback，不用怕注入，而且平台是正式开放的；虽然文档里没有 callback 的说明，我还是搜出来了，确实接口支持 callback，这也是我现在使用的跳转 ipcheck

- 国外：
  - [ip-api](https://ip-api.com/) https 要会员
  - [freegeoip](https://freegeoip.app/) 还行 免费 https 每小时 1 万 5 的请求 比下面的快
  - [ipinfo](https://ipinfo.io/developers#https-ssl) https 免费 速度慢点

### 英语相关 API

#### 语法检查

- [Ginger](https://www.gingersoftware.com/ginger-api/documentations?utm_medium=email&utm_source=link&utm_campaign=api_documentation)
- [Grammarly](https://www.grammarly.com/)

### 经纬度行政区域查询 API

[home](http://jwd.funnyapi.com/#/index)
