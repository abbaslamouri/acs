<script setup>
defineEmits(['closeSlideout'])
</script>

<template>
  <section class="slideout">
    <div class="overlay"></div>
    <div class="slideout__wrapper" @click.self="$emit('closeSlideout')">
      <div class="slideout__content flex-col">
        <div class="slideout__header flex-row items-center justify-between p-2 w-full bg-slate-200">
          <slot name="header"></slot>
          <button class="btn btn__close"><IconsClose @click="$emit('closeSlideout')" /></button>
        </div>
        <div class="slideout__main flex-1 overflow-auto">
          <slot></slot>
        </div>
        <div class="slideout__footer p-2 w-full bg-slate-200">
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.slideout {
  // z-index: 9;

  .slideout__wrapper {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
  }
  &__content {
    background-color: $slate-50;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    max-width: 1024px;

    .slideout__main {
      // flex: 1;
      // height: 100%;
      // width: 100%;
      // overflow-y: auto;
      // border: 1px solid red;
    }
  }

  &.attributes,
  &.variants {
    .slideout__header {
      text-transform: uppercase;
      letter-spacing: 0.15rem;
      background-color: $slate-300;
      padding: 2rem;
    }

    .slideout__content {
      // width: 415px;
    }

    .slideout__footer {
      background-color: $slate-300;
      padding: 2rem;
    }
  }

  &.cart {
    .slideout__header {
      text-transform: uppercase;
      letter-spacing: 0.25rem;
      background-color: $stone-200;
      padding: 1rem;
    }

    .slideout__content {
      width: 415px;
    }

    .slideout__footer {
      background-color: $stone-200;
      padding: 1rem;
    }
  }
}
</style>
