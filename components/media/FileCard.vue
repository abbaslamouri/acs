<script setup>
defineProps({
  file: {
    type: Object,
    required: true,
  },
})
const config = useRuntimeConfig()
// const router = useRouter()
// console.log(config)
</script>

<template>
  <div
    class="card relative cursor-pointer flex flex-col items-center justify-center"
    @mouseenter="$event.target.classList.add('hovered')"
    @mouseleave="$event.target.classList.remove('hovered')"
  >
    <div class="w-[10rem] h-[10rem] border border-gray-400 rounded" v-if="file.mimetype.includes('image')">
      <img
        v-if="file.name === 'spinner.gif'"
        class="w-full h-full object-contain"
        :src="`${config.siteUrl}/spinner.gif`"
      />
      <img v-else-if="file.filePath" class="w-full h-full object-contain" :src="`${config.siteUrl}${file.filePath}`" />
      <img v-else class="w-full h-full object-contain" :src="`${config.siteUrl}/placeholder.png`" />
    </div>
    <div class="w-[10rem] h-[10rem] p-4 border border-gray-500" v-else>
      <IconsPdf v-if="file.mimetype && file.mimetype.includes('pdf')" class="w-full h-full" />
    </div>
    <div class="tooltip absolute -top-2 left-[50%] p-1 rounded text-xs">{{ file.originalFilename }}</div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.card {
  .tooltip {
    transform: translate(-50%, -100%);
    background-color: $slate-600;
    display: grid;
    grid-template-columns: minmax(max-content, 40rem);
    color: white;
    opacity: 0;
    visibility: hidden;

    &::after {
      content: '';
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
