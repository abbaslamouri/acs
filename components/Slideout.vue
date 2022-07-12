<script setup>
defineEmits(['closeSlideout'])
</script>

<template>
  <section class="slideout fixed inset-0 w-screen h-screen border-5 border-red-500">
    <div class="overlay w-full h-full bg-slate-700 opacity-75" @click.self="$emit('closeSlideout')"></div>
    <div
      class="absolute top-0 right-0 h-full border-5 border-green-800 flex flex-col justify-between w-screen-lg bg-white"
    >
      <div class="flex bg-slate-200 flex flex-row items-center justify-between w-full bg-slate-200 px-4 py-2">
        <slot name="header"></slot>
        <button class="btn btn-close"><IconsClose @click="$emit('closeSlideout')" /></button>
      </div>
      <div class="slideout__main flex-1 overflow-auto">
        <slot></slot>
      </div>
      <div class="p-4 w-full bg-slate-200">
        <slot name="footer"> </slot>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
</style>
