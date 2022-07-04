<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  toogleHeight: {
    type: Number,
    default: 18,
  },
  direction: {
    type: String,
    default: 'horizontal',
    validator: (value) => {
      return !value || ['horizontal', 'vertical'].includes(value)
    },
  },
  rounded: {
    type: Boolean,
    default: true,
  },
})
defineEmits(['update:modelValue'])
const attrs = useAttrs()

const sliderBeforeWidth = `${0.75 * props.toogleHeight}px`
const sliderBeforeLeft = `${0.15 * props.toogleHeight}px`
const sliderBorderRadius = `${0.5 * props.toogleHeight}px`
const sliderWidth = `${2 * props.toogleHeight}px`
const sliderHeight = `${props.toogleHeight}px`
</script>

<script>
export default {
  inheritAttrs: false,
}
</script>

<template>
  <label class="toggle relative flex items-center justify-center gap-2" :class="{ vertical: direction === 'vertical' }">
    <span> {{ label }}</span>
    <input
      class="absolute opacity-0 w-0 h-0"
      type="checkbox"
      :checked="modelValue"
      v-bind="$attrs"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span
      class="slider relative block cursor-pointer bg-gray-400 transition duration-300 before:(absolute bg-white top-1/2 transform -translate-y-1/2 )"
      :class="{ rounded }"
    ></span>
  </label>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';

.toggle {
  &.vertical {
    flex-direction: column;
  }

  input {
    &:checked + .slider {
      background-color: $slate-800;

      &:before {
        left: 53.125%;
      }
    }
  }

  .slider {
    width: v-bind(sliderWidth);
    height: v-bind(sliderHeight);

    &:before {
      content: '';
      width: v-bind(sliderBeforeWidth);
      height: v-bind(sliderBeforeWidth);
      left: v-bind(sliderBeforeLeft);
    }

    &.rounded {
      border-radius: v-bind(sliderBorderRadius);

      &::before {
        border-radius: 50%;
      }
    }
  }
}
</style>
