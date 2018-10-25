<template>
  <div class="rongqi" ref="imgs" style="width: 100%" @click="callbacks">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: ['imgs', 'tag', 'keeps', 'master'],
    data() {
      return {};
    },
    deactivated() {
      this.destroyHero();
    },
    activated() {
      this.initHero()
    },
    mounted() {
      this.initHero()
    },
    beforeDestroy() {
      this.destroyHero();
    },
    destroyed() {
    },
    methods: {
      callbacks() {
        this.$emit('heroMethod')
      },
      initHero() {
        if (this.AniPubArr.get('scorllUp') !== undefined) {
          this.$refs.imgs.style.opacity = 0;
          this.AniPub('context', this.$refs.imgs);
        }
        let mapcoach = {
          width: this.$refs.imgs.getBoundingClientRect().width,
          height: this.$refs.imgs.getBoundingClientRect().height,
          top: this.$refs.imgs.offsetTop,
          left: this.$refs.imgs.offsetLeft
        }
        setTimeout(() => this.AniPub(this.tag, mapcoach), 0);
      },
      destroyHero() {
        let imgcopy = this.$refs.imgs;
        // console.log(document.getElementsByClassName('page')[0].scrollTop)
        this.AniPub('scorllUp', this.master === 'true' ? document.getElementsByClassName('page')[0].scrollTop : 0);
        // 固定当前元素必须在此位置不会发生变化（动画依据此方法）元素距离顶部的距离-滚动的距离
        // console.log(document.documentElement.scrollTop);
        let longs = this.$refs.imgs.offsetTop - document.getElementsByClassName('page')[0].scrollTop;
        // 处理方案添加fixed 创建fexed模态框
        var fixedmaster = document.createElement('div');
        fixedmaster.id = 'hero-fixed';
        fixedmaster.style.position = 'fixed';
        fixedmaster.style.width = '100%';
        fixedmaster.style.height = '100%';
        fixedmaster.style.top = '0px';
        // console.log(imgcopy.cloneNode(true))
        fixedmaster.appendChild(imgcopy.cloneNode(true));
        fixedmaster.children[0].style.top = longs + 'px';
        fixedmaster.children[0].style.left = this.$refs.imgs.getBoundingClientRect().left + 'px';
        fixedmaster.children[0].style.position = 'absolute';
        fixedmaster.children[0].style.overflow = 'hidden'
        fixedmaster.children[0].id = 'hero-fixed-img';
        fixedmaster.children[0].style.width = this.$refs.imgs.getBoundingClientRect().width + 'px';
        fixedmaster.children[0].style.height = this.$refs.imgs.getBoundingClientRect().height + 'px';
        // this.$refs.imgs.style.top = this.$refs.imgs.getBoundingClientRect().top + 'px';
        document.body.appendChild(fixedmaster);
        this.$refs.imgs.style.opacity = 0;
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
