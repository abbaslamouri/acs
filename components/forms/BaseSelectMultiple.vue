<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    default: [],
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'itemsSelected'])

const uuid = useUniqueId().getId()
const items = ref([])
const inputRefs = ref([])
const showListBox = ref(false)

items.value = [...props.modelValue]

const addItem = (event) => {
  const index = items.value.findIndex((item) => item == event.target.value)
  if (index === -1) items.value.push(event.target.value)
  else items.value.splice(index, 1)
  emit('update:modelValue', items.value)
}

onMounted(() => {
  document.addEventListener('click', (evt) => {
    const flyoutElement = document.querySelector('.listbox-area')
    let targetElement = evt.target // clicked element
    do {
      if (targetElement == flyoutElement) {
        return
      }
      targetElement = targetElement.parentNode
    } while (targetElement)

    showListBox.value = false
  })
})
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <div class="listbox-area">
    <button class="select p-1 bg-transparent w-full cursor-pointer" @click="showListBox = !showListBox">
      <div class="label" v-if="!items.length" role="label">Select Categories</div>
      <div class="selected-options flex-row wrap gap-05" v-else>
        <span class="bg-slate-700 text-slate-50 px-05 py-02 br-3" v-for="item in items" :key="item">
          {{ options.find((c) => c.key == item).name }}</span
        >
      </div>
      <IconsChevronUp class="icon" v-show="showListBox" />
      <IconsChevronDown class="icon" v-show="!showListBox" />
    </button>
    <div
      class="dropdown-options shadow-md border border-slate-400 mt-1"
      role="listbox"
      tabindex="-1"
      v-show="showListBox"
    >
      <div
        v-for="(option, index) in options"
        class="list-item p1 border-b-slate-300"
        :id="`list-item-${uuid}-${option.key}`"
        role="option"
        :key="option.key"
        tabindex="0"
        :aria-selected="items.includes(option.key)"
      >
        <label
          class="options flex-row items-center gap-1 cursor-pointer"
          :class="{ disabled: inputRefs[index] && inputRefs[index].disabled }"
        >
          <input
            :ref="(el) => (inputRefs[index] = el)"
            readonly
            type="checkbox"
            :value="option.key"
            @click="addItem"
            :checked="modelValue.includes(option.key)"
          />
          <div class="label">{{ option.name }}</div>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped lang="">
/* @import '@/assets/scss/variables';

.listbox-area {
  .select {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 2rem;
    gap: 1rem;
    border-radius: 5px 5px 0 0;

    .label {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    .selected-options {
      grid-row: 1 / 2;
      grid-column: 1 / 2;
    }

    .icon {
      grid-row: 1 / 2;
      grid-column: 2 / 3;
    }
  }

  .dropdown-options {
    .list-item {
      &:hover {
        background-color: $slate-200;
      }

      .options {
        &.disabled {
          color: $slate-400;
          cursor: not-allowed;
        }

        input[type='checkbox'] {
          display: grid;
          place-content: center;
          appearance: none;
          width: 1.75rem;
          height: 1.75rem;
          border: 0.1rem solid currentColor;
          border-radius: 0.15rem;
          cursor: pointer;

          &:checked::before {
            transform: scale(1);
            background-color: CanvasText;
            transform-origin: bottom left;
            clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
          }

          &::before {
            content: '';
            width: 1.25rem;
            height: 1.25rem;
            transform: scale(0);
            transition: 120ms transform ease-in-out;
            box-shadow: inset 1em 1em $slate-700;
          }

          &:disabled {
            color: $slate-300;
            cursor: not-allowed;
          }
        }
      }
    }
  }
} */
</style>
