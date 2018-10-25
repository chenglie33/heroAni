# heroani

> 共享元素动画Shared element animation  ---目前只支持vue<br/>
支持在组件的切换中进行穿梭，可以在非vue-router的环境下运行，支持keepalive<br/>
`注意事项`  
App项目的目录结构中必须包含class元素"page" 它的大小将是你的浏览器可视窗口的高度，非移动端项目可以不需要这个元素   
###移动端的div结构
``` bash
    |--html   
      |--body   
        |--transition   
          |--keep-alive(可选)   
            |--component || router-view
              |--page(page的情况主要是考虑到移动端界面跳转，每个页面的滚动距离是不相同的)
```
##效果演示

## example
``` bash
# step 1
npm install HeroAni --save

# step 2
import {HeroAni} from 'heroani';
Vue.use(HeroAni, {time: 500});

# step 3 注册组件
import {HeroUi} from 'heroani';

components: {
      HeroUi
    }
    
# step 4 使用
<div style="width: 100px;overflow: hidden;height: 100px">
      <hero-ui  master="true" key="as"  tag="484e98349b1db8a3f1cf0113ba493f651">
          <div class="imglovery">
          </div>
      </hero-ui>
    </div>
```

## Prop
  |master |tag  |   
  |------ |:-----:|
  |true or false  |唯一标识 |
  
  master:true证明是父路由 第一次加载heroUI的页面；false为子路由  
  tag:标识和目的页面（子路由页面）的tag相同 从而依此完成动画的过度    
Vue.use(HeroAni, {time: 500});time:动画的运行时长 transition的时长一般匹配此处
