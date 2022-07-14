<script setup>
defineProps({
  outerBoxWidth: {
    type: Number,
    default: 50,
  },
  outerBoxHeight: {
    type: Number,
    default: 40,
  },
})
defineEmits(['closeModal'])

console.log(top)
</script>

<template>
  <div class="fixed inset-0 w-screen h-screen">
    <div class="w-screen h-screen bg-slate-700 opacity-75" @click.self="$emit('closeModal')"></div>
    <!-- <div class="h-screen fixed inset-0 overflow-auto border-5 border-red-900" > -->
    <div
      class="h-full fixed bg-white rounded border-5 border-red-900 flex flex-col"
      :style="{
        width: `${outerBoxWidth}%`,
        height: `${outerBoxHeight}%`,
        top: `${(100 - outerBoxHeight) / 2}%`,
        left: `${(100 - outerBoxWidth) / 2}%`,
      }"
    >
      <header class="flex justify-between items-center p-2 bg-slate-200">
        <slot name="header"></slot>
        <button class="btn btn-close p-1" @click="$emit('closeModal')">
          <IconsClose />
        </button>
      </header>
      <main class="flex-1 p-2 overflow-auto"><slot></slot></main>
      <footer class="bg-slate-200 p-1"><slot name="footer"></slot></footer>
    </div>
  </div>
  <!-- </div> -->
</template>

<style lang="scss" scoped></style>
