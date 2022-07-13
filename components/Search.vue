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
    <div class="text-xs p-1 flex flex-row gap-2 items-center" v-if="keyword">
      <div class="uppercase text-slate-400 font-bold">Filter</div>
      <div class="bg-slate-50 pl-2py-1 rounded bg-slate-200 shadow-md flex flex-row items-center gap-1">
        Text Search: {{ keyword }}
        <IconsClose class="w-5 h-5 bg-slate-600 fill-slate-50 cursor-pointer" @click="setKeyword('')" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
