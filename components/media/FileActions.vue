<script setup>
defineProps({
  selectedMedia: {
    type: Array,
  },
  sort: {
    type: Object,
  },
  sortOptions: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits([
  'fileUploadBtnClicked',
  'toggleSort',
  'deleteMedia',
  'searchKeywordSelected',
  'toggleSelectAll',
  'selectMediaType',
  'toggleSlideout',
])

const mediaToDisplay = ref('all')
</script>

<template>
  <div class="bg-white shadow-md">
    <div class="flex flex-row items-center justify-between gap-2 p-4 border border-gray-300 text-xs">
      <button class="btn btn-new-media gap-1 text-sky-600" @click="$emit('fileUploadBtnClicked')">
        <IconsUpload class="fill-sky-600" />
        <span>Upload Files</span>
      </button>
      <div class="flex flex-row gap-4">
        <Sort :sort="sort" :sortOptions="sortOptions" @toggleSort="$emit('toggleSort', $event)" />
        <div class="flex bg-light-200flex-row items-center gap-2 min-w-60">
          <button
            class="bg-slate-50 border border-transparent cursor-pointer"
            v-if="selectedMedia.length === 1"
            @click="$emit('toggleSlideout')"
          >
            <IconsEdit class="fill-green-800" />
          </button>
          <button
            class="bg-slate-50 border border-transparent cursor-pointer"
            v-if="selectedMedia.length"
            @click="$emit('deleteMedia')"
          >
            <IconsDelete class="fill-red-600" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex flex-row gap-6 items-center justify-between p-4">
      <div class="flex flex-row items-center gap-2">
        <div class="min-w-[10rem]">
          <FormsBaseSelect
            v-model="mediaToDisplay"
            @update:modelValue="$emit('selectMediaType', mediaToDisplay)"
            label="Media Type"
            :options="[
              { key: 'all', name: 'All Media Items' },
              { key: 'image', name: 'Images' },
              { key: 'pdf', name: 'PDF' },
            ]"
          />
        </div>
        <button class="btn btn-secondary text-xs px-4 py-2" @click="$emit('toggleSelectAll', true)">Select All</button>
        <button class="btn btn-secondary text-xs bg-slate-200 px-4 py-2" @click="$emit('toggleSelectAll', false)">
          Unselect All
        </button>
      </div>
      <div class="flex-1">
        <Search @searchKeywordSelected="$emit('searchKeywordSelected', $event)" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
