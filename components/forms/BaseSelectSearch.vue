<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  nullOption: {
    type: String,
    defualt: 'Select Option',
  },
})
const emit = defineEmits(['update:modelValue'])

const active = ref(false)
const keyword = ref('')

// console.log("MV", props.modelValue)
// console.log("optiond", props.options)

const filteredOptions = computed(() => {
  if (!keyword.value) return props.options
  const regex = new RegExp(keyword.value, 'gi')
  return props.options.filter((o) => o.name.match(regex))
})

const setSelected = (event) => {
  // console.log(event)
  emit('update:modelValue', event)
  active.value = !active.value
}
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="base-select-search text-sm">
    <h2>{{ label }}</h2>
    <div class="select-box flex-col gap-05">
      <div
        class="selected flex-row justify-between items-center br-3 cursor-pointer uppercase bg-slate-400 py-075 px-2"
        @click="active = !active"
      >
        <div v-if="!modelValue">{{ nullOption }}</div>
        <div v-else>{{ options.find((o) => o.key == modelValue).name }}</div>
        <IconsChevronDown v-if="!active" />
        <IconsChevronUp v-else />
      </div>
      <div class="options-container border border-slate-400 br-3 p-1" :class="{ active }">
        <div>
          <input class="px-2 py-075 br-3 w-full mb-1" type="text" placeholder="Quick search ..." v-model="keyword" />
        </div>
        <div class="option flex-col">
          <label class="py-075 cursor-pointer">
            <input class="hidden" type="checkbox" :checked="!modelValue" v-bind="$attrs" @change="setSelected('')" />
            Clear Filter
          </label>
        </div>
        <div class="option flex-col" v-for="option in filteredOptions">
          <label class="py-075 cursor-pointer">
            <input
              class="hidden"
              type="checkbox"
              :checked="option.key === modelValue"
              v-bind="$attrs"
              @change="setSelected(option.key)"
            />

            {{ option.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="" scoped>
/* @import '@/assets/scss/variables';

.options-container {
  max-height: 0;
  opacity: 0;
  display: none;
  transition: all 0.4s;
  overflow: auto;
  background-color: $slate-400;

  &.active {
    max-height: 30rem;
    opacity: 1;
    display: block;
  }

  &::-webkit-scrollbar {
    width: 10px;
    border-radius: 3px;

    &-track {
      background: $slate-50;
    }

    &-thumb {
      background: $slate-400;
      border-radius: 3px;

      &:hover {
        background: $slate-500;
      }
    }
  }

  .option {
    &:hover {
      background-color: $slate-50;
    }
  }
} */
</style>
