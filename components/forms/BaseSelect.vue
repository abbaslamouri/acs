<script setup>
defineProps({
  value: {
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

const errorMsg = ref('')
const uuid = useUniqueId().getId()
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label class="relative" :class="`base-select base-select-${uuid}`" v-if="label" :for="`base-select-${uuid}`">
    <select
      class="appearance-none w-full bg-gray cursor-pointer border-2 border-gray-300 py-2 px-4 text-xs rounded"
      ref="selectRef"
      :value="value"
      :class="`base-select-${uuid}`"
      :aria-describedby="errorMsg ? `base-input-error-${uuid}` : null"
      :aria-invalid="errorMsg ? true : null"
      :aria-readonly="typeof $attrs.readonly != undefined ? true : null"
      :aria-required="typeof $attrs.required != undefined ? true : null"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option value="">{{ nullOption }}</option>
      <option
        v-for="option in options"
        :key="option.key"
        :value="option.key"
        :selected="value === option.key"
        :disabled="option.disabled || option.disabledIf"
      >
        {{ option.name }}
      </option>
    </select>
    <div class="label absolute left-5 top-0 transform -translate-y-4 text-xs bg-[#ffffff] px-2">{{ label }}</div>
    <IconsChevronDown class="absolute right-2 -top-1" />
  </label>
</template>

<style lang="scss" scoped>
.base-selects {
  position: relative;
  // --size: 0.5em;
  border-radius: 0.25rem;
  height: 4.5rem;
  // border: 1px solid $slate-200;
  background-color: white;
  overflow: hidden;

  width: 100%;

  box-shadow: 0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06);

  label {
    position: absolute;
    top: 0.2rem;
    left: 2rem;
    font-size: 80%;
    // color: lighten($color: $slate-800, $amount: 50);
  }

  select {
    padding: 2rem 0.75rem 1rem 2rem;
    border: 5px solid red;

    // appearance: none;
    // width: 100%;
    // height: 100%;
    background-color: transparent;
    cursor: pointer;
    border: none;

    &.centered {
      padding: 1rem 0.75rem 1rem 2rem;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background-color: transparent;
    width: 4em;
  }
  &::after {
    position: absolute;
    content: '';
    width: 0.5rem;
    height: 0;
    height: 0;
    pointer-events: none;
    box-sizing: border-box;
    right: 2rem;
    top: 50%;
    transform: translate(-50%, -30%);
    border: 0.5rem solid transparent;
    // border-top: 0.5rem solid $slate-400;
    pointer-events: none;
  }
}
</style>
