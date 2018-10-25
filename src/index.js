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
    },
    unbind(el, binding, vnode, oldVnode) {
    }
  });
  Vue.mixin({
    beforeCreate() {
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    beforeRouteUpdate(to, from, next) {
      next();
    },
    beforeRouteLeave(to, from, next) {
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
      var oldplace = {
        top: this.nowHero.top, // 不在老的位置上减去滚动距离
        left: this.nowHero.left,
        width: this.nowHero.width,
        height: this.nowHero.height
      }
      var eleimg = document.getElementById('hero-fixed-img');
      eleimg.style.overflow = 'hidden'
      new TWEEN.Tween(oldplace).to(newplace, options.time).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function (obj) {
        eleimg.style.top = this.top + 'px';
        eleimg.style.left = this.left + 'px';
        eleimg.style.width = this.width + 'px';
        eleimg.style.height = this.height + 'px';
      }).start().onComplete(function () {
        vm.AniPubArr.get('context').style.opacity = 1;
        document.body.removeChild(ele);
        vm.AniPubArr.set(key, value);
      });
      ani()
    }
  };
  Vue.prototype.AniPubArr = new Map();
}

export  {HeroAni,HeroUi};

