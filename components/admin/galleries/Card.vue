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
  <tr class="border border-b-stone-300 py-05">
    <td class="w-4">{{ gallery.sortOrder }}</td>
    <td class="flex-row justify-center wrap">
      <div v-for="image in gallery.gallery">
        <div class="w-4 h-4">
          <img
            class="w-full h-full contain"
            v-if="image && image.mimetype.includes('image')"
            :src="`${config.backendUrl}/${image.path}`"
          />
          <!-- <img v-else class="w-full h-full contain" :src="`/placeholder.png`" /> -->
        </div>
      </div>
    </td>
    <td>
      <div class="w-10">{{ gallery.name }}</div>
    </td>
    <td class="w-14">
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
  padding: 2rem;
  text-align: center;
}
</style>
