<script setup>
definePageMeta({
  layout: 'admin',
})
const title = ref('Media | YRL')
</script>

<template>
  <div class="overflow-auto w-full h-full">
    <MediaUploader />
  </div>
</template>

<style lang="scss" scoped></style>
