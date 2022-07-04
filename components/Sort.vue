<script setup>
const props = defineProps({
  sort: {
    type: Object,
  },
  sortOptions: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggleSort'])

const currentSort = reactive({
  field: props.sort.field,
  order: props.sort.order,
})

watch(
  () => currentSort,
  (sortVal) => {
    emit('toggleSort', sortVal)
  },
  { deep: true }
)
</script>

<template>
  <div class="flex flex-row gap-4 items-center text-xs">
    <div class="min-w-[10rem]">
      <FormsBaseSelect :options="sortOptions" v-model="currentSort.field" label="Sort by" />
    </div>
    <div class="flex flex-row items-center gap-1">
      <span>Sort Order</span>
      <button
        class="bg-slate-50 border border-transparent cursor-pointer"
        @click="currentSort.order == '-' ? (currentSort.order = ``) : (currentSort.order = `-`)"
      >
        <IconsArrowSouth class=" fill-sky-600" v-if="currentSort.order == '-'" />
        <IconsArrowNorth class=" fill-sky-600" v-else />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
