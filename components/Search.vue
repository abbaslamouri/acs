<script setup>
const emit = defineEmits(['searchKeywordSelected'])

const keyword = ref(null)
const inputRef = ref('')

const setKeyword = (event) => {
  if (event) {
    keyword.value = event.target.value
    inputRef.value.value = ''
  } else {
    keyword.value = ''
  }
  emit('searchKeywordSelected', keyword.value)
}
</script>

<template>
  <div class="p-2 border rounded">
    <form class="relative text-sm bg-white px-6" @keydown.enter.prevent="emitSearchField">
      <IconsSearch class="absolute left-1 fill-slate-400 top-50-per translate-y--50per" />
      <input
        class="border-transparent outline-transparent w-full h-full px-3 py-1"
        ref="inputRef"
        type="text"
        placeholder="Search"
        aria-label="Search"
        @keyup.enter="setKeyword"
      />
    </form>
    <div class="text-xs p-1 flex-row gap-1 items-center" v-if="keyword">
      <div class="uppercase text-slate-400 font-bold">Filter</div>
      <div class="bg-slate-50 p-05 br-3 bg-white shadow-md flex-row items-center gap-1">
        Text Search: {{ keyword }}
        <IconsClose class="w-12p h-12p bg-slate-600 fill-slate-50 br-50per cursor-pointer" @click="setKeyword('')" />
      </div>
      <button class="btn btn__primary py-02 px-1 text-xs cursor-pointer" @click="setKeyword('')">Clear</button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
