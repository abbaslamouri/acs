<script setup>
defineEmits(['saveGallery'])
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="p-2 rounded shadow-lg">
      <button class="btn btn-checkout w-full py-1 flex flex-row justify-center" @click.prevent="$emit('saveGallery')">
        Save Changes
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
