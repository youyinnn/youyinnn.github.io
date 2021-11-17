## Vue

### Vue技巧

1. [用了很多动效，介绍 4个很 Nice 的 Vue 路由过渡动效！](https://juejin.cn/post/6951540864787152927)

   t ransition得用这样的状态
   ``` html
   <transition name="slide-fade" mode="out-in">
     <keep-alive>
     	<router-view></router-view>
   	</keep-alive>
   </transition>
   ```

   css得用enter
   ``` css
   .fade-enter-active,
   .fade-leave-active {
     transition: opacity 0.3s;
   }
   
   .fade-enter,
   .fade-leave-to {
     opacity: 0;
   }
   
   .slide-fade-enter-active {
     transition: all 0.3s ease;
   }
   .slide-fade-leave-active {
     transition: all 0.3s ease;
   }
   .slide-fade-enter, .slide-fade-leave-to
   /* .slide-fade-leave-active for below version 2.1.8 */ {
     transform: translateX(10px);
     opacity: 0;
   }
   ```

   

#### Vue3 Troubleshoot

1. [where to find or how to set htmlWebpackPlugin.options.title in project created with vue cli 3?](https://stackoverflow.com/questions/62023604/where-to-find-or-how-to-set-htmlwebpackplugin-options-title-in-project-created-w)
2. 



