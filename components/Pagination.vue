<script setup>
const props = defineProps({
  pages: {
    type: Number,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['pageSet'])
const active = computed(() => props.page)

const setCurrentPage = async (p) => {
  if (p < 1) {
    p = 1
    return
  }
  if (p > props.pages) {
    p = props.pages
    return
  }
  emit('pageSet', p)
}
</script>

<template>
  <nav class="flex flex-row justify-center items-center gap-4">
    <div class="pagination flex bg-currentflex-row justify-center gap-1">
      <span class="page" @click="setCurrentPage(1)" :class="{ disabled: page == 1 }">
        <IconsChevronsLeft class="w-5 h-5" />
      </span>
      <span class="page" @click="setCurrentPage(page - 1)" :class="{ disabled: page == 1 }">
        <IconsChevronLeft class="w-4 h-4" />
      </span>
      <div class="pagination flex flex-row justify-center gap-1" v-if="pages <= 5">
        <span v-for="p in pages" class="page" @click="setCurrentPage(p)" :class="{ active: active == p }">
          {{ p }}
        </span>
      </div>
      <div class="pagination flex flex-row justify-center gap-1" v-else>
        <div class="pagination flex-row justify-center gap-1" v-if="page <= 3">
          <span v-for="p in 5" class="page" @click="setCurrentPage(p)" :class="{ active: active == p }">
            {{ p }}
          </span>
        </div>
        <div class="pagination flex flex-row justify-center gap-1" v-else-if="page > 3 && page < pages - 3">
          <span
            v-for="p in 5"
            class="page"
            @click="setCurrentPage(page - 3 + p)"
            :class="{ active: active == page - 3 + p }"
          >
            {{ page - 3 + p }}
          </span>
        </div>
        <div class="pagination flex flex-row justify-center gap-05" v-else>
          <span
            v-for="p in 5"
            class="page"
            @click="setCurrentPage(pages - 5 + p)"
            :class="{ active: active == pages - 5 + p }"
          >
            {{ pages - 5 + p }}
          </span>
        </div>
      </div>
      <span class="page" @click="setCurrentPage(page + 1)" :class="{ disabled: page >= pages }">
        <IconsChevronRight class="w-4 h-4" />
      </span>
      <span class="page" @click="setCurrentPage(pages)" :class="{ disabled: page >= pages }">
        <IconsChevronsRight class="w-5 h-5" />
      </span>
    </div>
    <div class="flex flex-row items-center gap-2 text-sm">
      <span class="">Go&nbsp;to&nbsp;page</span>
      <label class="base-select border-2 rounded px-2">
        <select class="min-h-8 min-w-20" v-model="page" @change="setCurrentPage(parseInt($event.target.value))">
          <option v-for="p in pages" :key="p" :value="p">{{ p }}</option>
        </select>
      </label>
      <span class="" v-if="pages > 1">of&nbsp;{{ pages }}&nbsp;pages</span>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.base-select {
  select {
    // min-height: 3.1rem;
    // padding: 0 1rem;
  }
  &::after {
    content: '';
    bottom: 0.75rem;
  }
}

.page {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $slate-400;
  width: 2rem;
  height: 2rem;
  border-radius: 2px;
  font-size: 1rem;
  cursor: pointer;

  svg {
    width: 2rem;
  }

  &.disabled {
    cursor: not-allowed;

    svg {
      fill: #ccc;
    }
  }

  &.active {
    background-color: $slate-400;
    color: $slate-50;
  }
}
</style>
