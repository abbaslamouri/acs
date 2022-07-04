<script setup>
const props = defineProps({
  fileTypes: {
    type: Array,
    default: ['image/*'],
  },
})
const emit = defineEmits(['uploadItemsSelected', 'cancelFileUpload'])

const fileRef = ref(null)
const dragged = ref(false)
const itemsToUpload = ref([])

const handleItemsDropped = (event) => {
  dragged.value = false
  itemsToUpload.value = Array.from(event.dataTransfer.files).map((item) => item)
  emit('uploadItemsSelected', itemsToUpload.value)
}

const handleItemsSelected = (event) => {
  itemsToUpload.value = Array.from(event.target.files).map((item) => item)
  emit('uploadItemsSelected', itemsToUpload.value)
}
</script>
<template>
  <div
    class="flex flex-col items-center justify-center gap-4 min-h-20 bg-stone-200 p-4"
    :class="{ 'dragged-over': dragged }"
    @dragover.prevent="dragged = true"
    @dragleave.prevent="dragged = false"
    @drop.prevent="handleItemsDropped"
  >
    Drop files to upload here
    <IconsUploadCloud />
    <a class=" text-yellow-700 text-lg font-bold" href="#" @click="fileRef.click()">Or click here to choose your files</a>
    <form enctype="multipart/form-data">
      <input
        class="hidden"
        id="upload"
        type="file"
        :accept="fileTypes.join(',')"
        :multiple="true"
        ref="fileRef"
        @change="handleItemsSelected"
      />
    </form>
    <button class="btn btn-secondary py-1 px-4 text-xs" @click="$emit('cancelFileUpload')">
      <span>Cancel</span>
    </button>
  </div>
</template>

<style lang="scss"></style>
