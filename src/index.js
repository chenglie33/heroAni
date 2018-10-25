/**
 * @Description: 实现英雄组件动画；动画在路由之间过度跳转
 * 仿照app图片简述到图片详情的路由功能
 * @author cl
 * @date 2018/10/18
 */
import TWEEN from 'tween.js'
import HeroUi from './HeroAni'

var HeroAni = {};
HeroAni.install = function (Vue, options) {
  window.onload = function () {
    var h = document.body.clientHeight; // window.screen.height;
    // console.log(document.body.clientHeight)
    var style = document.createElement('style');
    style.type = 'text/css';
    try {
      style.appendChild(document.createTextNode('.page{height:' + h + 'px}'));
    } catch (ex) {
      style.styleSheet.cssText = '.page{height:' + h + 'px}'; // 针对IE
    }
    var head = document.getElementsByTagName('head')[0];

    head.appendChild(style);
  }
  Vue.directive('hero-ani', {
    bind(el, binding, vnode, oldVnode) {
      this.els = el;
      //  setTimeout(() => console.log(this.els.getBoundingClientRect().top), 0)
    },
    unbind(el, binding, vnode, oldVnode) {
    }
  });
  Vue.mixin({
    beforeCreate() {
    },
    beforeRouteEnter(to, from, next) {
      // 在渲染该组件的对应路由被 confirm 前调用
      // 不！能！获取组件实例 `this`
      // 因为当守卫执行前，组件实例还没被创建
      next();
    },
    beforeRouteUpdate(to, from, next) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
      // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 可以访问组件实例 `this`
      next();
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      next();
    }
  });
  /**
   * 向数组中添加数据 所有的预动画dom的长宽，距离顶部的位置
   * @param key
   * @param value
   * @constructor
   */
  Vue.prototype.AniPub = function (key, value) {
    if (key === 'scorllUp') {
      if (this.AniPubArr.get(key) === undefined) {
        this.AniPubArr.set(key, value);
      } else {
        // console.log(this.AniPubArr.get(key))
        this.AniPubArr.set('oldscorllup', this.AniPubArr.get(key));
        this.AniPubArr.set(key, value);
      }

      return;
    }
    if (key === 'context') {
      this.AniPubArr.set(key, value);
      return;
    }

    function ani() {
      if (TWEEN.update()) {
        requestAnimationFrame(ani)
      }
    }

    // 创建目标动画的缓存区域
    this.coache = value;
    this.nowHero; // 现在动画区域
    let vm = this;
    // 在添加数据之前判断这里是否已经存在改tag；如果存在动画将会出现重复的dom；
    if (!this.AniPubArr.get(key)) {
      this.AniPubArr.set(key, value);
    } else { // 存在相同的key 意味着此处产生了路由
      this.nowHero = this.AniPubArr.get(key); // old place;
      let ele = document.getElementById('hero-fixed');
      let olds = this.AniPubArr.get('oldscorllup') || 0;
      var newplace = {
        top: value.top - olds, // 除了当前leave页面滚动的距离需要算 返回是原来滚动的距离也要算在其中
        left: value.left,
        width: value.width,
        height: value.height
      }
      // console.log(this.nowHero.top);
      // console.log(this.AniPubArr.get('scorllUp'));
      var oldplace = {
        top: this.nowHero.top - this.AniPubArr.get('scorllUp'), // 不在老的位置上减去滚动距离
        left: this.nowHero.left,
        width: this.nowHero.width,
        height: this.nowHero.height
      }
      var eleimg = document.getElementById('hero-fixed-img');
      eleimg.style.overflow = 'hidden'
      // console.log(oldplace)
      // console.log(newplace)
      new TWEEN.Tween(oldplace).to(newplace, options.time).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function (obj) {
        eleimg.style.top = this.top + 'px';
        eleimg.style.left = this.left + 'px';
        eleimg.style.width = this.width + 'px';
        eleimg.style.height = this.height + 'px';
      }).start().onComplete(function () {
        vm.AniPubArr.get('context').style.opacity = 1;
        // opt = 1;
        // console.log(opt)
        document.body.removeChild(ele);
        vm.AniPubArr.set(key, value);
      });
      ani()
    }
  };
  Vue.prototype.AniPubArr = new Map();
}

export  {HeroAni,HeroUi};

