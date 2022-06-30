<script setup></script>

<template>
  <div class="h-[60vh] flex items-center justify-center shadow-md">
    <div class="flex-col gap-2 bg-slate-50 p-4 br-5">
      <h3><slot name="header"></slot></h3>
      <slot />
    </div>
  </div>
</template>

<style lang="" scoped></style>
