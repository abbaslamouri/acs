<script setup>
const props = defineProps({
  galleries: {
    type: Array,
  },
  totalCount: {
    type: Number,
  },
})
const emit = defineEmits(['deleteGallery'])
const config = useRuntimeConfig()
const router = useRouter()

const showActionKeys = ref([])

// const showActionKeys = ref([])
const showActions = ref(true)
const editAction = ref(false)

const resetActions = () => {
  for (const prop in props.galleries) {
    showActionKeys.value[prop] = false
  }
}

const setActions = (payload) => {
  resetActions()
  showActionKeys.value[payload.index] = payload.action
}

const deleteGallery = (galleryId) => {
  emit('deleteGallery', galleryId)
  resetActions()
}
</script>

<template>
  <table class="text-xs shadow-md">
    <thead>
      <tr class="bg-slate-200">
        <th class="py-4 px-2">Order</th>
        <th class="py-4 px-2 text-left">Images</th>
        <th class="py-4 px-2 text-left">Name</th>
        <th class="text-right py-4 px-2">actions</th>
      </tr>
    </thead>
    <tbody class="bg-white">
      <AdminGalleriesCard
        v-for="(gallery, index) in galleries"
        :key="gallery._id"
        :gallery="gallery"
        :index="index"
        :showAction="showActionKeys[index]"
        @setActions="setActions"
        @deleteGallery="deleteGallery"
        @editGallery="router.push({ name: 'admin-galleries-slug', params: { slug: $event } })"
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

th {
  // border: 1px solid red
}
</style>
