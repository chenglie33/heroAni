<template>
  <div class="rongqi"
       ref="imgs"
       style="width: 100%"
       @click="callbacks">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: ['imgs', 'tag', 'keeps', 'master', 'where'],
    data () {
      return {
        clickState: false
      };
    },
    deactivated () {
      this.destroyHero();
    },
    activated () {
      this.initHero();
    },
    mounted () {
      this.initHero();
    },
    beforeDestroy () {
      this.destroyHero();
    },
    destroyed () {
    },
    methods: {

      callbacks () {
        this.clickState = true
        setTimeout(() => {
          this.clickState = false
        }, 500)
        this.$emit('heroMethod');
      },
      initHero () {
        if (!Vue.hasHeroBack && this.AniPubArr.get('scorllUp') !== undefined) {
          return;
        }
        if (Vue.nowPlaceComeNum[this.where]) {
          Vue.nowPlaceComeNum[this.where] += 1
        } else {
          Vue.nowPlaceComeNum[this.where] = 1
        }

        // 第一次加载的页面滚动的scoller为0
        if (this.AniPubArr.get('scorllUp') !== undefined) {
          if (this.AniPubArr.get('nowtag') === this.tag || (Vue.hasHeroBack && this.where !== 'index')) {
            this.$refs.imgs.style.opacity = 0;
          }
          this.AniPub('context', this.$refs.imgs);
        }

        setTimeout(() => {
          if (!this.AniPubArr.get(this.tag) || this.where !== this.AniPubArr.get(this.tag).where) {
            console.log(this.$refs.imgs.getBoundingClientRect().height)
            let mapcoach = {
              width: this.$refs.imgs.getBoundingClientRect().width,
              height: this.$refs.imgs.getBoundingClientRect().height,
              top: this.$refs.imgs.offsetTop,
              left: this.$refs.imgs.offsetLeft,
              imgdom: this.tag,
              where: this.where
            };
            this.AniPub(this.tag, mapcoach)
          }
        }, 0);
      },
      destroyHero () {
        // 销毁的话意味着上层路由具备我们的需求
        Vue.hasHeroBack = true
        setTimeout(() => {
          Vue.hasHeroBack = false
        }, 1000)
        // TODO:若前往的页面中不存在hero元素则以下的操作都不进行处理
        let arr = window.location.href.split('/');
        if (Vue.MapUse.indexOf(arr[arr.length - 1]) === -1) {
          return
        }
        // this.AniPubArr.set('nowtag', '零时')

        // 判断是哪个hero需要加入动画
        let imgcopy = this.$refs.imgs;
        let topM = this.$refs.imgs.offsetTop
        // 此处出现动画层断裂的现象，此处判断点击事件是不是该组件(如果Map中已经存在该value则不需要点击事件)
        if (this.clickState === false) {
          if (this.AniPubArr.get('nowtag') === this.tag) {
            this.clickState = true;
          }
        }
        if (this.clickState) {
          // 固定当前元素必须在此位置不会发生变化（动画依据此方法）元素距离顶部的距离-滚动的距离
          let longs = topM - this.ScorllerDiv().scrollTop;
          // 处理方案添加fixed 创建fexed模态框
          var fixedmaster = document.createElement('div');
          fixedmaster.id = 'hero-fixed';
          fixedmaster.style.position = 'fixed';
          fixedmaster.style.zIndex = '1000';
          fixedmaster.style.width = '100%';
          fixedmaster.style.height = '100%';
          fixedmaster.style.top = '0px';
          fixedmaster.appendChild(imgcopy.cloneNode(true));
          fixedmaster.children[0].style.top = longs + 'px';
          fixedmaster.children[0].style.left =
            imgcopy.getBoundingClientRect().left + 'px';
          fixedmaster.children[0].style.position = 'absolute';
          fixedmaster.children[0].style.overflow = 'hidden';
          fixedmaster.children[0].id = 'hero-fixed-img';
          fixedmaster.children[0].style.width =
            imgcopy.getBoundingClientRect().width + 'px';
          fixedmaster.children[0].style.height =
            imgcopy.getBoundingClientRect().height + 'px';
          document.body.appendChild(fixedmaster);
          imgcopy.style.opacity = 0;
          // 动画的动作应该在此处推送（现在的初始化的方法向数组推送数据使用了0秒的延时，所以必须在延时以后 数组中的数据才会有效）
          setTimeout(_ => {
            this.AniPubArr.get('aniFunction')()
          }, 100)
        }
        this.AniPub(
          'scorllUp',
          this.master === 'true' ? this.ScorllerDiv().scrollTop : 0
        );
      }
    }
  };
</script>
<style>
  .rongqi {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
