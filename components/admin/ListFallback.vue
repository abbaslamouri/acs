<script setup></script>

<template>
  <div class="h-lg flex flex-col justify-center items-center">
    <div class="flex flex-col gap-2">
      <slot name="header"></slot>
      <slot />
      <div class="self-end">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="" scoped></style>
