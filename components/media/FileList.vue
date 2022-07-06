<script setup>
defineProps({
  media: {
    type: Array,
  },
  selectedMedia: {
    type: Array,
  },
})

defineEmits(['addToSelectedMedia', 'removeFromSelectedMedia'])

const fileRefs = ref([])
</script>

<template>
  <div class="media-list flex flex-row flex-wrap items-center justify-evenly gap-2 px-1 py-6">
    <div v-for="(file, index) in media" class="item shadow-md relative">
      <MediaFileCard
        :file="file"
        :key="file._id"
        @click="$emit('addToSelectedMedia', file)"
        :class="{ selected: selectedMedia.find((m) => m._id == file._id) }"
      />
      <div
        class="actions absolute top-0 right-0 w-6 h-6"
        @mouseenter="fileRefs[index].classList.remove('hidden')"
        @mouseleave="fileRefs[index].classList.add('hidden')"
        v-show="selectedMedia.find((m) => m._id == file._id)"
      >
        <IconsCheck
          class="action absolute fill-slate-50 cursor-pointer"
          v-show="selectedMedia.find((m) => m._id == file._id) && fileRefs[index].classList.contains('hidden')"
        />
        <div
          class="action hidden absolute flex-row items-center justify-center cursor-pointer"
          :ref="
            (el) => {
              fileRefs[index] = el
            }
          "
          @click.exact="$emit('removeFromSelectedMedia', file)"
        >
          <IconsMinus class="action absolute fill-slate-50 cursor-pointer" />
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/styles/variables';

.item {
  .selected {
    outline: 3px solid $sky-600;
  }

  .actions {
    border: 1px solid $sky-400;
    transform: translate(25%, -25%);

    .action {
      width: 100%;
      height: 100%;
      color: $sky-50;
      background-color: $sky-600;
      border: 2px solid $sky-50;
      outline: 2px solid $sky-600;
    }
  }
}
</style>
