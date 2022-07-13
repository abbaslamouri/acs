<script setup>
defineProps({
  file: {
    type: Object,
    required: true,
  },
})
const config = useRuntimeConfig()
</script>

<template>
  <div
    class="card relative cursor-pointer flex flex-col items-center justify-center"
    @mouseenter="$event.target.classList.add('hovered')"
    @mouseleave="$event.target.classList.remove('hovered')"
  >
    <div
      class="w-[10rem] h-[10rem] border border-gray-400 rounded"
      v-if="file && file.mimetype && file.mimetype.includes('image')"
    >
      <img
        v-if="file.name === 'spinner.gif'"
        class="w-full h-full object-contain"
        :src="`${config.doSpaceEndpoint}/assets/spinner.gif`"
      />
      <img
        v-else-if="file.originalFilename"
        class="w-full h-full object-contain"
        :src="`${config.doSpaceEndpoint}/uploads/${file.originalFilename}`"
      />
      <img v-else class="w-full h-full object-contain" :src="`${config.doSpaceEndpoint}/assets/placeholder.png`" />
    </div>
    <div
      class="w-[10rem] h-[10rem] p-4 border border-gray-500"
      v-else-if="file && file.mimetype && file.mimetype.includes('pdf')"
    >
      <IconsPdf class="w-full h-full" />
    </div>
    <div
      class="w-[10rem] h-[10rem] p-4 border border-gray-500"
      v-else-if="file && file.mimetype && file.mimetype.includes('csv')"
    >
      <IconsSpreadsheet class="w-full h-full" />
    </div>
    <div
      class="tooltip absolute w-full p-1 rounded text-xs top-[5%] left-[50%] transform -translate-x-1/2 bg-gray-600 text-white px-1"
    >
      {{ file.originalFilename }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.card {
  .tooltip {
    opacity: 0;
    visibility: hidden;

    &::after {
      // content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: $slate-600 transparent transparent transparent;
    }
  }
  &.hovered {
    background-color: $slate-500;

    img {
      opacity: 0.5;
    }

    .tooltip {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
