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
</script>

<template>
  <div class="modal">
    <div class="overlay"></div>
    <div
      class="wrapper fixed inset-0 z-9 flex-row justify-center items-center"
      @click.self="$emit('closeModal')"
    >
      <div
        class="content flex-col bg-slate-50 br-3"
        :style="{ width: `${outerBoxWidth}%`, height: `${outerBoxHeight}%` }"
      >
        <header class="flex-row justify-between items-center border-b-stone-300 p-1 bg-slate-200">
          <slot name="header"></slot>
          <button class="btn btn__close p-1" @click="$emit('closeModal')">
            <IconsClose />
          </button>
        </header>
        <main class="flex-1 p-2 overflow-auto"><slot></slot></main>
        <footer class="bg-slate-200 p-1"><slot name="footer"></slot></footer>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
