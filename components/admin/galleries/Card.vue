<script setup>
const props = defineProps({
  gallery: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  showAction: {
    type: Boolean,
  },
})
const emit = defineEmits(['setActions', 'editGallery', 'deleteGallery'])

const config = useRuntimeConfig()
</script>

<template lang="">
  <tr class="">
    <td class="w-4 text-center">{{ gallery.sortOrder }}</td>
    <td class="flex flex-row gap-1 wrap items-center p-1">
      <div class="w-12" v-for="image in gallery.media">
        <!-- <div class="w-12"> -->
        <img
          class="w-full h-full contain"
          v-if="image && image.mimetype && image.mimetype.includes('image')"
          :src="`${config.doSpaceEndpoint}/uploads/${image.originalFilename}`"
        />
        <img v-else class="w-full h-full contain" :src="`/placeholder.png`" />
        <!-- </div> -->
      </div>
    </td>
    <td class="w-[10rem]">
      <div class="">{{ gallery.name }}</div>
    </td>
    <td class="w-[7rem]">
      <AdminRowActions
        :showAction="showAction"
        showEdit
        @moreHoriz="$emit('setActions', { index: index, action: !showAction })"
        @editAction="$emit('editGallery', gallery.slug)"
        @deleteAction="$emit('deleteGallery', gallery.id)"
        @cancel="$emit('setActions', { index: index, action: false })"
      />
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
td {
  // border: 1px solid red;
}
</style>
